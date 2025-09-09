from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from frontend

# Load your saved model once
with open('best_patient_critical_progression_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Read CSV file from request
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file part in the request'}), 400

        df = pd.read_csv(file)

        # Check if required columns exist
        required_cols = ['bp_systolic', 'bp_diastolic', 'heart_rate', 'respiratory_rate', 'temperature',
                         'oxygen_saturation', 'med_adherence', 'symptom_severity']
        if not all(col in df.columns for col in required_cols):
            return jsonify({'error': 'Missing required columns in CSV'}), 400

        # Perform aggregation for features needed by model
        features = [
            df['bp_systolic'].mean(),
            df['bp_systolic'].max(),
            df['bp_diastolic'].mean(),
            df['bp_diastolic'].max(),
            df['heart_rate'].mean(),
            df['heart_rate'].max(),
            df['respiratory_rate'].mean(),
            df['respiratory_rate'].max(),
            df['temperature'].mean(),
            df['temperature'].max(),
            df['oxygen_saturation'].mean(),
            df['oxygen_saturation'].min(),
            df['med_adherence'].mean(),
            df['symptom_severity'].mean(),
            df['symptom_severity'].max()
        ]

        features_array = np.array(features).reshape(1, -1)

        # Predict probability of deterioration (class 1)
        prob = model.predict_proba(features_array)[0][1]

        return jsonify({'probability_of_deterioration': float(prob)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
