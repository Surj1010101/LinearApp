import numpy as np
import tensorflow as tf

interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

#Testing realistic employee scenarios
#['day_type', 'work_hours', 'screen_time_hours', 'meetings_count', 'breaks_taken', 'after_hours_work', 'sleep_hours', 'task_completion_rate']
scenarios = {
    "Best Case (Expected: low burnout)": [0, 7, 4, 2, 3, 0, 8, 90],
    "Average Case (Expected: mid range burnout)": [0, 9, 6, 4, 2, 1, 7, 70],
    "Worst Case (Expected: high burnout)": [1, 15, 10, 7, 1, 5, 4, 30],


}

for name, data in scenarios.items():
    test_data = np.array([data], dtype=np.float32)
    interpreter.set_tensor(input_details[0]['index'], test_data)
    interpreter.invoke()
    prediction = interpreter.get_tensor(output_details[0]['index'])
    print(f"{name}: Predicted burnout score = {prediction[0][0]:.2f}")
