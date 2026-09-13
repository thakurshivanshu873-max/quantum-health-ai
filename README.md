# QuantumHealth AI — Hybrid QML Early Disease Detection
### Smart India Hackathon 2026 · Problem Statement SIH26139 · Egreen Quanta

---

## 🚀 Quick Start

**Step 1 – Start Backend (in Terminal 1)**
```bash
cd /Users/tusharsoni/SIH/quantum-health-ai
./start_backend.sh
# OR: /opt/anaconda3/bin/python -m uvicorn backend.app:app --port 8000 --reload
```

**Step 2 – Start Frontend (in Terminal 2)**
```bash
cd /Users/tusharsoni/SIH/quantum-health-ai
./start_frontend.sh
# OR: cd frontend && npm run dev
```

**Open:** http://localhost:3000

---

## 📊 Trained Model Performance

| Disease      | Model     | Accuracy | Recall | F1     | AUC-ROC |
|-------------|-----------|----------|--------|--------|---------|
| Diabetes     | Classical | 0.7078   | 0.5741 | 0.5794 | 0.7754  |
| Diabetes     | Quantum   | 0.6948   | 0.2963 | 0.4051 | **0.7609** |
| Heart Disease| Classical | 0.8197   | 0.8571 | 0.8136 | 0.9307  |
| Heart Disease| Quantum   | 0.8197   | 0.7143 | 0.7843 | **0.9578** ⬆️ |
| Breast Cancer| Classical | 0.9561   | 0.9048 | 0.9383 | 0.9934  |
| Breast Cancer| Quantum   | 0.8421   | 0.5714 | 0.7273 | **0.9950** ⬆️ |

> **⚛️ Quantum AUC-ROC outperforms classical on Heart Disease (+2.7%) and Cancer (+0.2%)**

---

## 🏗️ Architecture

```
quantum-health-ai/
├── backend/
│   ├── app.py              ← FastAPI (5 endpoints)
│   ├── classical_model.py  ← XGBoost + RandomForest + SHAP
│   ├── quantum_model.py    ← PennyLane VQC (8 qubits)
│   ├── preprocessor.py     ← Impute → Scale → PCA → Angle-encode
│   └── train_models.py     ← Master training script
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx   ← Hero + Disease cards
│       │   ├── PredictPage.jsx   ← Patient form + Results
│       │   ├── DashboardPage.jsx ← Metrics + ROC + Confusion matrix
│       │   └── BatchPage.jsx     ← CSV upload
│       └── components/
│           ├── RiskGauge.jsx     ← Animated canvas gauge
│           └── ShapChart.jsx     ← Feature attribution chart
├── data/
│   ├── diabetes.csv    ← PIMA Indians
│   └── heart.csv       ← UCI Cleveland (auto-downloaded)
└── models/             ← Saved models + metrics.json
```

---

## ⚛️ Quantum Model Details

- **Framework:** PennyLane 0.45 with `lightning.qubit` simulator
- **Circuit:** Angle encoding (Rx per qubit) + `StronglyEntanglingLayers`
- **Qubits:** 8 (after PCA dimensionality reduction)
- **Layers:** 3 strongly-entangling layers
- **Optimizer:** Adam (lr=0.05, 60 epochs, batch_size=32)
- **Loss:** Binary cross-entropy, autograd-traced through the QNode
- **Explainability:** Finite-difference gradient attribution on PCA components

---

## 🌐 API Endpoints

| Method | Endpoint        | Description                              |
|--------|----------------|------------------------------------------|
| GET    | /api/health     | Health check                             |
| GET    | /api/diseases   | Disease field definitions for forms      |
| GET    | /api/metrics    | Benchmark metrics (all 3 diseases)       |
| POST   | /api/predict    | Single patient prediction                |
| POST   | /api/batch      | CSV batch prediction                     |

**Prediction request example:**
```json
{
  "disease": "diabetes",
  "patient_data": {
    "Pregnancies": 6, "Glucose": 148, "BloodPressure": 72,
    "SkinThickness": 35, "Insulin": 0, "BMI": 33.6,
    "DiabetesPedigreeFunction": 0.627, "Age": 50
  },
  "mode": "both"
}
```

---

## 🔁 Retrain Models

```bash
cd /Users/tusharsoni/SIH/quantum-health-ai
/opt/anaconda3/bin/python -m backend.train_models
```

---

## 🛠️ Tech Stack

| Layer         | Technology                              |
|--------------|-----------------------------------------|
| Frontend      | React 19 + Vite, Recharts, Canvas API  |
| Backend       | FastAPI + Uvicorn                       |
| Classical ML  | XGBoost, RandomForest (scikit-learn)    |
| Quantum ML    | PennyLane 0.45 (lightning.qubit sim)   |
| Explainability| SHAP (classical), Finite-diff (quantum) |
| Data          | PIMA Diabetes, UCI Cleveland, Wisconsin |
