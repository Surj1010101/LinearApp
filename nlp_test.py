from transformers import pipeline

burnout_ai = pipeline('text-classification', model = "./burnout_nlp_model", tokenizer = "./burnout_nlp_model")

#text = 'I managed to complete everything but felt very stressed and burned out'
text = 'I hate how much workload gets dumped on me recently, its starting to stress me out'
print(burnout_ai(text))
