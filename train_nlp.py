import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset

#sources:https://huggingface.co/docs/transformers/en/training
#https://www.youtube.com/watch?v=QEaBAZQCtwE&t=1s

#Fetching the dataset for AI tuning
filepath = "C:\\Users\danel\PycharmProjects\AI-Training-Model-Linear-App\Dataset\\nlp_fine_tuning.csv"
data = pd.read_csv(filepath)
data = data.dropna()

hugging_face_dataset = Dataset.from_pandas(data)
#Renaming column sentiment score to label so it can be found by the ai
hugging_face_dataset = hugging_face_dataset.rename_column('sentiment_score', 'labels')

#Initialising AI
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
#loading model and providing expected labels (1 as it will be the sentiment score)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=1)

#Tokenisation rule
def tokenize(examples):
    return tokenizer(examples["journal_entry"], padding="max_length", truncation=True)
#Apply rule to dataset
tokenized_dataset = hugging_face_dataset.map(tokenize, batched=True)

train_dataset = tokenized_dataset
#set training parameters
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=2,
)
#create the trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)
#start training
trainer.train()

trainer.save_model("./burnout_nlp_model")
tokenizer.save_pretrained("./burnout_nlp_model")
print("Model saved")