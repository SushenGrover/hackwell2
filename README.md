# 🏥 Healytics: Chronic Care Patient Deterioration Predictor  

An **AI-driven risk prediction engine** that forecasts the **90-day risk of deterioration** for chronic care patients.  
This project combines **high-accuracy machine learning** with **interpretable explainability** and a **clinician-friendly dashboard**, enabling proactive interventions and reducing preventable hospitalizations.  

---

## ✨ Key Features  

- **90-Day Risk Prediction**  
  Uses 30–180 days of patient vitals, labs, and adherence data to forecast deterioration probability.  

- **SHAP Explainability**  
  Provides **personalized, local explanations** of risk scores, showing which patient factors (e.g., heart rate variability, oxygen saturation) contribute most.  

- **Intuitive Dashboard**  
  Clear cohort view with **color-coded risk scores (Green → Red)**, highlighting the **top 10 high-risk patients**.  

- **Detail View**  
  In-depth patient trends and actionable risk drivers to support **clinical decision-making**.  

---

## 💻 Tech Stack  

| Component    | Technology                  | Description                                                   |
|--------------|-----------------------------|---------------------------------------------------------------|
| **Frontend** | React + Tailwind CSS        | SPA dashboard with a responsive, modern UI.                   |
| **Backend**  | Python, Flask, Flask-CORS   | REST API serving predictions and data processing.              |
| **AI/ML**    | XGBoost, SHAP, SMOTE        | Gradient boosting model with SHAP explainability.             |
| **Data**     | Pandas, NumPy               | Cleaning, feature engineering, and transformation.            |

---

## 🚀 Getting Started  

### 1. Project Structure  
```
/ai-risk-prediction-engine
├── backend/
│ ├── api.py # Flask API for predictions
│ ├── train_and_save_model.py # Train & save ML model + explainer
│ ├── ehr_dataset.csv # Training dataset (sample)
│ ├── risk_prediction_model.pkl # Saved XGBoost model
│ ├── shap_explainer.pkl # Saved SHAP explainer
│ └── feature_names.pkl # Saved feature list
├── frontend/
│ ├── src/
│ │ └── Dashboard.jsx # Main React dashboard component
│ └── ... # Standard React project setup
└── README.md
```

---

### 2. Backend Setup & Training  

**Install dependencies:**  
```bash
pip install Flask Flask-CORS pandas numpy xgboost scikit-learn joblib imblearn shap
```
Train the model (one-time):
```bash
python backend/train_and_save_model.py
```
This generates:

risk_prediction_model.pkl

shap_explainer.pkl

feature_names.pkl

Run API Server:
```bash
python backend/api.py
```
Server runs at: http://localhost:5000
3. Frontend Setup (React)

Install dependencies:
cd frontend
npm install

Run the app:
npm start

Frontend runs at: http://localhost:3000

### Screenshots
| View                            | Screenshot                                           |
| ------------------------------- | ---------------------------------------------------- |
| Main Dashboard (Cohort View)    | ![Dashboard View](https://github.com/SushenGrover/hackwell2/blob/main/images/1.png)     |
| Add Patient Modal               | ![Add Patient](https://github.com/SushenGrover/hackwell2/blob/main/images/2.png)     |
| Patient Detail View (High Risk) | ![High Risk Detail](https://github.com/SushenGrover/hackwell2/blob/main/images/3.png) |
| SHAP Risk Drivers               | ![SHAP Explanation](https://github.com/SushenGrover/hackwell2/blob/main/images/4.png) |
| Full Patient Table View         | ![Full Table](https://github.com/SushenGrover/hackwell2/blob/main/images/5.png)             |

### Live Deployment Link
https://hackwell-roan.vercel.app/
