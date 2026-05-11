from transformers import pipeline, AutoTokenizer
import pandas as pd
import textwrap
import random
import time
import torch
print(torch.cuda.is_available())
#model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
model_name = "Qwen/Qwen2-1.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)

tokenizer.padding_side = "left"
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

journal_generator = pipeline('text-generation', model=model_name,tokenizer=tokenizer, device=0, dtype=torch.float16)

filepath = "../Dataset/upgraded_wfh_dataset.csv"
data = pd.read_csv(filepath)
data = data.dropna()

scenarios = []

#Converting scores in a row into moods
def convert_to_mood(row):
    mood = {}

    if row["stress_score"] < -0.3:
        mood["stress"] = "felt overwhelmed"
    elif row["stress_score"] > 0.3:
        mood["stress"] = "felt calm and in control"
    else:
        mood["stress"] = "managed okay"

    if row["nutrition_score"] < -0.3:
        mood["nutrition"] = "barely ate, skipped meals or mostly junk"
    elif row["nutrition_score"] > 0.3:
        mood["nutrition"] = "ate balanced meals, mostly healthy food"
    else:
        mood["nutrition"] = "ate inconsistently, decent food choices some good some bad"

    if row["activity_score"] < -0.3:
        mood["activity"] = "sitting down all day, no exercise"
    elif row["activity_score"] > 0.3:
        mood["activity"] = "got up regularly, maybe went for a walk or to the gym for exercise"
    else:
        mood["activity"] = "moved around a bit but mostly sat down"

    if row["productivity_score"] < -0.3:
        mood["productivity"] = "struggled to focus, not much work done"
    elif row["productivity_score"] > 0.3:
        mood["productivity"] = "focused on work, checked off most tasks"
    else:
        mood["productivity"] = "average day of productivity"

    if row["sleep_hours"] < 4:
        mood["sleep"] = "exhausted from a poor nights sleep"
    elif row["sleep_hours"] > 7:
        mood["sleep"] = "refreshed from a good nights sleep"
    else:
        mood["sleep"] = "had okay sleep, gets me through work"

    return mood

def work_hours_to_word(work_hours):
    if work_hours < 6:
        return "short day"
    elif work_hours > 9:
        return "long day"
    else:
        return "typical day"

def generate_journals(row_batch):
    chat_messages = []

    opening_styles = [
        "Being with a complain or praise about your day.",
        "Begin with physical sensations like 'My eyes hurt...', 'My back hurts...', 'Feeling Energised...'",
        "Begin with a though about how fast or slow the day has went.",
        "Begin by mentioning food, hunger or lunch break",
        "Begin mentioning your mental wellbeing like 'Feeling Exhausted...', 'Feeling Motivated'",
        "Begin with an action you are doing right now like 'Staring at my screen', 'Closing my laptop'"
    ]

    for index, row in row_batch.iterrows():
        mood = convert_to_mood(row)
        traits = [
            mood["nutrition"],
            mood["activity"],
            mood["productivity"],
            mood["stress"],
            mood["sleep"]
        ]
        random.shuffle(traits)

        scores = {
            "nutrition": row["nutrition_score"],
            "activity": row["activity_score"],
            "productivity": row["productivity_score"],
            "stress": row["stress_score"],
        }

        #Prioritising dominant traits
        dominant_trait = max(scores, key=lambda k: abs(scores[k]))
        dominant_value = scores[dominant_trait]

        feeling = "great" if dominant_value > 0 else "bad"
        dominant_trait_instruction = f"Make this entry focused on your {dominant_trait} being {feeling}. Briefly include the other facts."


        opening = random.choice(opening_styles)

        scenario = textwrap.dedent(f"""\
        Write a 2 sentence personal reflection
        Today you worked {work_hours_to_word(row["work_hours"])}
        
        Write a journal entry for someone who:
        {traits[0]}
        {traits[1]}
        {traits[2]}
        {traits[3]}
        {traits[4]}
        
        STRICT INSTRUCTION:
        1. {opening}
        2. {dominant_trait_instruction}
        3.Never start the first sentence with the words "I", "Today", "Waking", "Awoke", "As I", "It was" or "My day"
        4.Be casual and emotionally honest, ensure you only use natural language as a private diary, no number or scores.""")

        chat_messages.append([
            {"role": "system", "content": "You are a creative writer writing highly unique 2 sentence reflections. You must strictly obey the strict instructions and never start journal entries the exact same way."},
            {"role": "user", "content": scenario}
        ])


    result = journal_generator(chat_messages,
                               max_new_tokens = 140,
                               num_return_sequences = 1,
                               batch_size=len(chat_messages),
                               do_sample = True,
                               temperature = 0.75,
                               top_p = 0.9,
                               repetition_penalty = 1.2,
                               )
    journal_entries = []

    #cleanup

    for res in result:
        entry = res[0]['generated_text'][2]['content']
        clean_entry = entry.strip().replace('\n', ' ')

        #2 sentence limit
        sentences = [s.strip() for s in clean_entry.split('.') if s.strip()]
        two_sentences = sentences[:2]

        if two_sentences:
            final_entry = '. '.join(two_sentences) + '.'
        else:
            final_entry = clean_entry

        journal_entries.append(final_entry)

    return journal_entries

test_mode = False
num_test_examples = 5
batch_size = 16

if test_mode:
    test_data = data.sample(n=num_test_examples, random_state=30)
    print("Testing mode...")
    print("="*50)
    for index, row in test_data.iterrows():
        journal = generate_journals(row)
        print(f"""
        Inputs:
        Nutrition: {row['nutrition_score']}
        Activity: {row['activity_score']}
        Productivity: {row['productivity_score']}
        Stress: {row['stress_score']}
        Sleep hours: {row['sleep_hours']} Hours
        Work hours: {row['work_hours']} Hours
        
        Journal Result:
        {journal}
        
        """)
        print("="*50)

else:
    path = "../Dataset/new_journal_entries_nlp_dataset.csv"

    for i in range(0, len(data), batch_size):
        batch = data.iloc[i:i + batch_size]
        print(f"Processing rows {i} out of {len(data)}")
        #slices data to match the batch
        journal_entry = generate_journals(batch)
        batch_results = []
        for j, (index, row) in enumerate(batch.iterrows()):
            results_row = {
                "journal_entry": journal_entry[j],
                "burnout_score": row["burnout_score"],
                "nutrition_score": row["nutrition_score"],
                "activity_score": row["activity_score"],
                "productivity_score": row["productivity_score"],
                "stress_score": row["stress_score"],
            }
            batch_results.append(results_row)

        batch = pd.DataFrame(batch_results)

        write_header = True if i == 0 else False

        batch.to_csv(path, mode = 'a', header=write_header, index=False)
        print(f"Batch saved")


    print(f"Journal entries saved to {path}")



