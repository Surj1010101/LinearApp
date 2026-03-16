from transformers import pipeline
import pandas as pd

import time

journal_generator = pipeline('text-generation', model="TinyLlama/TinyLlama-1.1B-Chat-v1.0", device=0)

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
    for index, row in row_batch.iterrows():
        mood = convert_to_mood(row)
        scenario = f"""Write a realistic 2 sentence journal from someone working from home
        Here are some good examples:
        Example 1: I rushed through debugging all morning and forgot to eat anything until late afternoon while barely leaving my chair
        
        Example 2: I wrote clean code in the morning then enjoyed soup and a walk which helped me stay focused
        
        Example 3: Couldn't focus on anything, kept snacking, hope things get better tomorrow 
        
        Today they worked {work_hours_to_word(row["work_hours"])}
        Write a journal entry for someone who:
        {mood["nutrition"]}
        {mood["activity"]}
        {mood["productivity"]}
        {mood["stress"]}
        {mood["sleep"]}
        
        Ensure its written in first person. Be casual and emotionally honest, ensure you only use natural language as a private diary, no number or scores."""

        chat_messages.append([{"role": "user", "content": scenario}])


    result = journal_generator(chat_messages, max_new_tokens = 160, num_return_sequences = 1, batch_size=len(chat_messages))
    journal_entries = []

    for result in result:
        entry = result[0]['generated_text'][1]['content']
        journal_entries.append(entry)

    return journal_entries

test_mode = False
num_test_examples = 5
batch_size = 8

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
    results = []

    for i in range(0, len(data), batch_size):
        batch = data.iloc[i:i + batch_size]
        print(f"Processing rows {i} out of {len(data)}")
        #slices data to match the batch
        journal_entry = generate_journals(batch)
        for j, (index, row) in enumerate(batch.iterrows()):
            results_row = {
                "journal_entry": journal_entry,
                "burnout_score": row["burnout_score"],
                "nutrition_score": row["nutrition_score"],
                "activity_score": row["activity_score"],
                "productivity_score": row["productivity_score"],
                "stress_score": row["stress_score"],
            }
            results.append(results_row)

    results = pd.DataFrame(results)

    path = "Dataset\\journal_entries_nlp_dataset.csv"
    results.to_csv(path, index=False)

    print(f"Journal entries saved to {path}")



