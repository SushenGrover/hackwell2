import pandas as pd
import xgboost as xgb
import joblib

df = pd.read_csv('enhanced_aggregated_patient_data.csv')

vitals = ['bp_systolic', 'bp_diastolic', 'heart_rate', 'respiratory_rate',
          'temperature', 'oxygen_saturation', 'symptom_severity']
agg_funcs = ['mean', 'std', 'min', 'max']
agg_dict = {v: agg_funcs for v in vitals}
agg_dict['med_adherence'] = 'mean'

agg_df = df.groupby('Cx').agg(agg_dict)
agg_df.columns = ['_'.join(col) for col in agg_df.columns]
agg_df.reset_index(inplace=True)

labels = df.groupby('Cx')['progressed_to_critical'].max().reset_index()

training_df = pd.merge(agg_df, labels, on='Cx')

features = training_df.drop(['Cx', 'progressed_to_critical'], axis=1)
target = training_df['progressed_to_critical']

model = xgb.XGBClassifier(
    use_label_encoder=False,
    eval_metric='logloss',
    n_estimators=100,
    random_state=42
)
model.fit(features, target)

joblib.dump(model, 'risk_prediction_model.pkl')
joblib.dump(features.columns.tolist(), 'feature_names.pkl')

