from transformers import pipeline

burnout_ai = pipeline('text-classification', model = "./burnout_nlp_model", tokenizer = "./burnout_nlp_model")

#text = 'I managed to complete everything but felt very stressed and burned out'
text = 'I had a healthy breakfast mixed with nuts and vegetables'
results = burnout_ai(text, top_k=None)

result_mapping = {
    "LABEL_0": "burnout_score",
    "LABEL_1": "nutrition_score",
    "LABEL_2": "activity_score",
    "LABEL_3": "productivity_score",
    "LABEL_4": "stress_score",
}

for result in results:
    label = result['label']
    score = result['score']
    name = result_mapping[label]
    print(f"{name}: {score}")