from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import logging
from sklearn.metrics import roc_auc_score, average_precision_score, confusion_matrix, precision_score, recall_score, accuracy_score, brier_score_loss

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'best_patient_critical_progression_model.pkl'
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None

REQUIRED_COLS_PREDICT = [
    'bp_systolic', 'bp_diastolic', 'heart_rate',
    'respiratory_rate', 'temperature',
    'oxygen_saturation', 'med_adherence', 'symptom_severity'
]

REQUIRED_COLS_EVALUATE = REQUIRED_COLS_PREDICT + ['true_label']

def aggregate_features(df):
    return [
        df['bp_systolic'].mean(), df['bp_systolic'].max(),
        df['bp_diastolic'].mean(), df['bp_diastolic'].max(),
        df['heart_rate'].mean(), df['heart_rate'].max(),
        df['respiratory_rate'].mean(), df['respiratory_rate'].max(),
        df['temperature'].mean(), df['temperature'].max(),
        df['oxygen_saturation'].mean(), df['oxygen_saturation'].min(),
        df['med_adherence'].mean(),
        df['symptom_severity'].mean(), df['symptom_severity'].max()
    ]

def calculate_metrics(y_true, y_pred_proba):
    y_pred = (y_pred_proba >= 0.5).astype(int)
    return {
        'AUROC': roc_auc_score(y_true, y_pred_proba),
        'AUPRC': average_precision_score(y_true, y_pred_proba),
        'Confusion_Matrix': confusion_matrix(y_true, y_pred).tolist(),
        'Precision': precision_score(y_true, y_pred),
        'Recall': recall_score(y_true, y_pred),
        'Accuracy': accuracy_score(y_true, y_pred),
        'Brier_Score': brier_score_loss(y_true, y_pred_proba)
    }

def get_recommended_actions(prob):
    """Return recommendations based on risk probability."""
    if prob >= 0.8:
        return [
            "Alert ICU for possible transfer or escalation.",
            "Start continuous vital sign monitoring.",
            "Consult senior physician immediately."
        ]
    elif prob >= 0.5:
        return [
            "Increase frequency of monitored vitals.",
            "Assess oxygen supply and make preparations.",
            "Start treatment escalation if clinically indicated."
        ]
    else:
        return [
            "Maintain standard monitoring.",
            "Reassess patient in scheduled rounds.",
        ]

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        logger.error("Model not loaded.")
        return jsonify({'error': 'Model not loaded on server'}), 500

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    try:
        df = pd.read_csv(file)
    except Exception as e:
        logger.error(f"Error reading CSV: {e}")
        return jsonify({'error': f'Could not read CSV file: {str(e)}'}), 400

    if not all(col in df.columns for col in REQUIRED_COLS_PREDICT):
        missing = [col for col in REQUIRED_COLS_PREDICT if col not in df.columns]
        logger.error(f"Missing columns: {missing}")
        return jsonify({'error': f'Missing required columns: {missing}'}), 400

    try:
        features = aggregate_features(df)
        features_array = np.array(features).reshape(1, -1)
        proba = model.predict_proba(features_array)
        logger.info(f"Predict_proba output: {proba}")

        if proba.shape[1] == 1:
            # Single class scenario: take probability of that class
            prob = float(proba[0][0])
        else:
            # Binary/multi-class: use probability of positive class at index 1
            prob = float(proba[0][1])

        recommendations = get_recommended_actions(prob)
        logger.info(f"Prediction complete: {prob:.4f} | Recommended Actions: {recommendations}")

        return jsonify({
            'probability_of_deterioration': prob,
            'recommended_actions': recommendations
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({'error': f'Error during prediction: {str(e)}'}), 500

@app.route('/evaluate', methods=['POST'])
def evaluate():
    if model is None:
        logger.error("Model not loaded.")
        return jsonify({'error': 'Model not loaded on server'}), 500

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    try:
        df = pd.read_csv(file)
    except Exception as e:
        logger.error(f"Error reading CSV: {e}")
        return jsonify({'error': f'Could not read CSV file: {str(e)}'}), 400

    if not all(col in df.columns for col in REQUIRED_COLS_EVALUATE):
        missing = [col for col in REQUIRED_COLS_EVALUATE if col not in df.columns]
        logger.error(f"Missing columns: {missing}")
        return jsonify({'error': f'Missing required columns: {missing}'}), 400

    try:
        features = aggregate_features(df)
        features_array = np.array(features).reshape(1, -1)
        prob = model.predict_proba(features_array)
        logger.info(f"Predict_proba output for evaluation: {prob}")

        if prob.shape[1] == 1:
            prob_value = float(prob[0][0])
        else:
            prob_value = float(prob[0][1])

        true_label = int(df['true_label'].iloc[0])
        metrics = calculate_metrics(np.array([true_label]), np.array([prob_value]))
        logger.info(f"Evaluation metrics: {metrics}")
        return jsonify(metrics)
    except Exception as e:
        logger.error(f"Evaluation error: {e}")
        return jsonify({'error': f'Error during evaluation: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, threaded=True)