from flask import Flask, request, jsonify
from transformers import pipeline
#creating flask application
#https://flask.palletsprojects.com/en/stable/quickstart/
app = Flask(__name__)
#Load burnout ai
burnout_ai = pipeline('text-classification', model = "./burnout_nlp_model", tokenizer = "./burnout_nlp_model")

@app.route("/analyse", methods=["POST"])
def analyse_entry():
    #store incoming entry
    incoming_entry = request.get_json()
    #extract journal entry
    text = incoming_entry.get("journal_entry", "")
    if text == "":
        return jsonify({"error": "no journal entry provided"}), 400

    #feed entry to the AI and return response
    ai_response = burnout_ai(text)
    sentiment_score = ai_response[0]["score"]
    return jsonify({"sentiment": sentiment_score})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)