import re
from collections import Counter

import nltk
from nltk.data import find
from nltk.sentiment import SentimentIntensityAnalyzer


def ensure_vader_lexicon():
    try:
        find("sentiment/vader_lexicon.zip")
    except LookupError:
        nltk.download("vader_lexicon", quiet=True)


ensure_vader_lexicon()

sia = SentimentIntensityAnalyzer()

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "if", "of", "at", "by", "for", "with",
    "about", "to", "from", "in", "on", "is", "am", "are", "was", "were", "be",
    "been", "being", "have", "has", "had", "do", "does", "did", "this", "that",
    "these", "those", "i", "you", "he", "she", "it", "we", "they", "me", "him",
    "her", "us", "them", "my", "your", "his", "its", "our", "their", "as", "so",
    "just", "too", "very", "not", "no", "yes", "than", "then", "there", "here",
    "feel", "feeling", "today", "really", "bit", "kinda", "going", "got",
}


def analyze_sentiment(text):
    score = sia.polarity_scores(text)

    if score["compound"] >= 0.05:
        return "positive"

    if score["compound"] <= -0.05:
        return "negative"

    return "neutral"


def analyze_sentiment_full(text: str) -> tuple[str, float]:
    """Return (label, compound_score) for the given text."""
    score = sia.polarity_scores(text)
    compound = score["compound"]

    if compound >= 0.05:
        label = "positive"
    elif compound <= -0.05:
        label = "negative"
    else:
        label = "neutral"

    return label, round(compound, 3)


def extract_keywords(text: str, limit: int = 5) -> list[str]:
    """Pull the most frequent meaningful words from free text."""
    if not text:
        return []

    tokens = re.findall(r"[a-zA-Z']{3,}", text.lower())
    meaningful = [t for t in tokens if t not in STOPWORDS]

    if not meaningful:
        return []

    counts = Counter(meaningful)
    return [word for word, _ in counts.most_common(limit)]
