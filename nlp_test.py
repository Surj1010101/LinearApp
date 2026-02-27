from transformers import pipeline

sentiment_ai = pipeline('sentiment-analysis')

def get_text_score(user_text):
    raw_result = sentiment_ai(user_text)
    data = raw_result[0]
    label = data['label']
    score = data['score']
    if label == "NEGATIVE": return score * -1
    else: return score

print(get_text_score('I feel tired, but i got a lot of things done'))
