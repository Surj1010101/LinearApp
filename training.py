import pandas as pd
from sklearn.model_selection import train_test_split
import tensorflow as tf

filepath = "C:\\Users\danel\PycharmProjects\AI-Training-Model-Linear-App\Dataset\work_from_home_burnout_dataset.csv"
data = pd.read_csv(filepath)

#removing irrelevant columns
data = data.drop(columns=['user_id', 'burnout_risk'])

#formatting data
data['day_type'] = data['day_type'].map({'Weekday': 0, 'Weekend': 1})

#input and target
inputs = data[['day_type', 'work_hours', 'screen_time_hours', 'meetings_count', 'breaks_taken', 'after_hours_work', 'sleep_hours', 'task_completion_rate']]
target = data['burnout_score']

#Split data 80 percent training and 20 percent testing
#This means 20 percent of the data will be used to test AI accuracy
X_train, X_test, y_train, y_test = train_test_split(inputs, target, test_size=0.2, random_state=42)

#Creating neural network
model = tf.keras.models.Sequential([
    #Input shape: 8 as we have 8 pieces of data per user as shown in inputs
    #Activation: rectified linear unit used for deeper understanding of impact in changes
    tf.keras.layers.Dense(32, activation='relu', input_shape=(8,)),
    tf.keras.layers.Dense(16, activation='relu'),
    #Last layer must be 1 dense as we are outputting a single value (burnout score)
    tf.keras.layers.Dense(1)
])

#compiling
#mean squared error used to measure the error of the ai output vs real result
#MSE will square the number and take the average of the whole dataset
model.compile(optimizer='adam', loss='mean_squared_error')

#training model
model.fit(X_train, y_train, epochs=50)

loss = model.evaluate(X_test, y_test)
print("MSE: ", loss)

#Convert model to tensorflow lite
#As we are building a mobile application a lite version of the model must be used for it to run effectively
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

with open("model.tflite", "wb") as f:
    f.write(tflite_model)
print("tflite model saved")