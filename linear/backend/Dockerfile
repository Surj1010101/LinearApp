# Hugging Face Spaces runs Docker containers on port 7860 by default.
# This image installs the FastAPI backend, pre-downloads the NLTK lexicon,
# and starts uvicorn. Total image is ~250 MB.

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=7860

WORKDIR /app

# System deps for psycopg2 + bcrypt build
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install -r requirements.txt \
 && python -m nltk.downloader -d /usr/local/share/nltk_data vader_lexicon

ENV NLTK_DATA=/usr/local/share/nltk_data

COPY app ./app

# Hugging Face injects $PORT; bind 0.0.0.0
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
