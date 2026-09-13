"""
app.py – FastAPI backend for the Hybrid QML Platform.

Endpoints:
  GET  /api/health          – health check
  GET  /api/diseases        – list available diseases + field definitions
  GET  /api/metrics         – benchmark metrics from training
  POST /api/predict         – single patient prediction
  POST /api/batch           – CSV batch prediction
"""
import os, sys, json, io, time, logging, traceback
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
import joblib

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# ── Path setup ──────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.preprocessor import DiseasePreprocessor, DISEASE_FEATURES
from backend.classical_model import ClassicalModel
from backend.quantum_model import QuantumVQC

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODELS_DIR = ROOT / "models"
METRICS_FILE = MODELS_DIR / "metrics.json"

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Hybrid QML Platform",
    description="Quantum-Classical ML for Early Disease Detection",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model cache ──────────────────────────────────────────────────────────────
_model_cache: Dict[str, Any] = {}


def _load_models(disease: str):
    if disease not in _model_cache:
        try:
            prep     = DiseasePreprocessor.load(disease)
            cl_model = ClassicalModel.load(disease)
            q_model  = QuantumVQC.load(disease)
            imp      = joblib.load(MODELS_DIR / f"{disease}_imp.pkl")
            scaler   = joblib.load(MODELS_DIR / f"{disease}_scaler.pkl")
            _model_cache[disease] = dict(prep=prep, classical=cl_model,
                                         quantum=q_model, imp=imp, scaler=scaler)
            logger.info(f"Loaded models for {disease}")
        except FileNotFoundError as e:
            raise HTTPException(status_code=503,
                                detail=f"Models for '{disease}' not found. "
                                       f"Run train_models.py first. ({e})")
    return _model_cache[disease]


# ── Disease field definitions for frontend forms ─────────────────────────────
DISEASE_FORMS = {
    "diabetes": {
        "label": "Diabetes (PIMA)",
        "icon": "🩸",
        "description": "Early detection of Type-2 Diabetes using the PIMA Indians dataset",
        "fields": [
            {"name": "Pregnancies",              "label": "Pregnancies",                      "type": "number", "min": 0,   "max": 20,   "step": 1,    "unit": "count"},
            {"name": "Glucose",                  "label": "Glucose (Plasma)",                 "type": "number", "min": 0,   "max": 300,  "step": 1,    "unit": "mg/dL"},
            {"name": "BloodPressure",            "label": "Blood Pressure (Diastolic)",       "type": "number", "min": 0,   "max": 200,  "step": 1,    "unit": "mmHg"},
            {"name": "SkinThickness",            "label": "Skin Thickness (Triceps)",         "type": "number", "min": 0,   "max": 100,  "step": 1,    "unit": "mm"},
            {"name": "Insulin",                  "label": "2-hr Serum Insulin",               "type": "number", "min": 0,   "max": 900,  "step": 1,    "unit": "μU/mL"},
            {"name": "BMI",                      "label": "Body Mass Index (BMI)",            "type": "number", "min": 0,   "max": 70,   "step": 0.1,  "unit": "kg/m²"},
            {"name": "DiabetesPedigreeFunction", "label": "Diabetes Pedigree Function",       "type": "number", "min": 0,   "max": 2.5,  "step": 0.001,"unit": "score"},
            {"name": "Age",                      "label": "Age",                              "type": "number", "min": 1,   "max": 120,  "step": 1,    "unit": "years"},
        ],
    },
    "heart": {
        "label": "Heart Disease (UCI Cleveland)",
        "icon": "❤️",
        "description": "Early detection of Coronary Heart Disease using the UCI Cleveland dataset",
        "fields": [
            {"name": "age",      "label": "Age",                          "type": "number",  "min": 1,    "max": 120,  "step": 1,   "unit": "years"},
            {"name": "sex",      "label": "Sex",                          "type": "select",  "options": [{"value": 1, "label": "Male"}, {"value": 0, "label": "Female"}]},
            {"name": "cp",       "label": "Chest Pain Type",              "type": "select",  "options": [{"value": 0, "label": "Typical Angina"}, {"value": 1, "label": "Atypical Angina"}, {"value": 2, "label": "Non-Anginal Pain"}, {"value": 3, "label": "Asymptomatic"}]},
            {"name": "trestbps", "label": "Resting Blood Pressure",      "type": "number",  "min": 60,   "max": 250,  "step": 1,   "unit": "mmHg"},
            {"name": "chol",     "label": "Serum Cholesterol",            "type": "number",  "min": 100,  "max": 600,  "step": 1,   "unit": "mg/dL"},
            {"name": "fbs",      "label": "Fasting Blood Sugar > 120",    "type": "select",  "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]},
            {"name": "restecg",  "label": "Resting ECG Results",          "type": "select",  "options": [{"value": 0, "label": "Normal"}, {"value": 1, "label": "ST-T Abnormality"}, {"value": 2, "label": "LVH"}]},
            {"name": "thalach",  "label": "Max Heart Rate Achieved",      "type": "number",  "min": 60,   "max": 250,  "step": 1,   "unit": "bpm"},
            {"name": "exang",    "label": "Exercise Induced Angina",      "type": "select",  "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}]},
            {"name": "oldpeak",  "label": "ST Depression (Exercise)",     "type": "number",  "min": 0,    "max": 10,   "step": 0.1, "unit": "mm"},
            {"name": "slope",    "label": "Slope of Peak ST Segment",     "type": "select",  "options": [{"value": 0, "label": "Upsloping"}, {"value": 1, "label": "Flat"}, {"value": 2, "label": "Downsloping"}]},
            {"name": "ca",       "label": "Major Vessels (Fluoroscopy)",  "type": "number",  "min": 0,    "max": 4,    "step": 1,   "unit": "count"},
            {"name": "thal",     "label": "Thalassemia",                  "type": "select",  "options": [{"value": 1, "label": "Normal"}, {"value": 2, "label": "Fixed Defect"}, {"value": 3, "label": "Reversable Defect"}]},
        ],
    },
    "cancer": {
        "label": "Breast Cancer (Wisconsin)",
        "icon": "🎗️",
        "description": "Early malignancy detection using the Wisconsin Breast Cancer dataset",
        "fields": [
            {"name": "mean radius",            "label": "Mean Radius",              "type": "number", "min": 0, "max": 30,   "step": 0.01, "unit": "mm"},
            {"name": "mean texture",           "label": "Mean Texture",             "type": "number", "min": 0, "max": 50,   "step": 0.01, "unit": ""},
            {"name": "mean perimeter",         "label": "Mean Perimeter",           "type": "number", "min": 0, "max": 200,  "step": 0.1,  "unit": "mm"},
            {"name": "mean area",              "label": "Mean Area",                "type": "number", "min": 0, "max": 2600, "step": 1,    "unit": "mm²"},
            {"name": "mean smoothness",        "label": "Mean Smoothness",          "type": "number", "min": 0, "max": 0.2,  "step": 0.001,"unit": ""},
            {"name": "mean compactness",       "label": "Mean Compactness",         "type": "number", "min": 0, "max": 0.4,  "step": 0.001,"unit": ""},
            {"name": "mean concavity",         "label": "Mean Concavity",           "type": "number", "min": 0, "max": 0.5,  "step": 0.001,"unit": ""},
            {"name": "mean concave points",    "label": "Mean Concave Points",      "type": "number", "min": 0, "max": 0.2,  "step": 0.001,"unit": ""},
            {"name": "mean symmetry",          "label": "Mean Symmetry",            "type": "number", "min": 0, "max": 0.4,  "step": 0.001,"unit": ""},
            {"name": "mean fractal dimension", "label": "Mean Fractal Dimension",   "type": "number", "min": 0, "max": 0.1,  "step": 0.001,"unit": ""},
        ],
    },
}

# Fill cancer with sensible defaults for remaining 20 features (hidden from form)
_CANCER_FULL_FEATURES = DISEASE_FEATURES["cancer"]["features"]
_CANCER_FORM_FEATURES = {f["name"] for f in DISEASE_FORMS["cancer"]["fields"]}
_CANCER_HIDDEN_DEFAULTS = {
    f: 0.0 for f in _CANCER_FULL_FEATURES if f not in _CANCER_FORM_FEATURES
}


# ── Pydantic schemas ─────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    disease: str = Field(..., description="'diabetes' | 'heart' | 'cancer'")
    patient_data: Dict[str, float] = Field(..., description="Feature name → value")
    mode: str = Field("both", description="'classical' | 'quantum' | 'both'")


class PredictResponse(BaseModel):
    disease: str
    mode: str
    latency_ms: float
    classical: Optional[Dict] = None
    quantum: Optional[Dict] = None


# ── Helpers ──────────────────────────────────────────────────────────────────
def _risk_category(prob: float) -> str:
    if prob < 0.35:   return "Low"
    elif prob < 0.65: return "Medium"
    else:             return "High"


def _preprocess_input(disease: str, patient_data: dict, models: dict) -> np.ndarray:
    feats = DISEASE_FEATURES[disease]["features"]
    # Fill cancer hidden fields
    if disease == "cancer":
        for k, v in _CANCER_HIDDEN_DEFAULTS.items():
            if k not in patient_data:
                patient_data[k] = v
    row = np.array([[patient_data.get(f, np.nan) for f in feats]], dtype=float)
    return models["prep"].transform(row)


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Hybrid QML Platform running"}


@app.get("/api/diseases")
def get_diseases():
    return {"diseases": DISEASE_FORMS}


@app.get("/api/metrics")
def get_metrics():
    if not METRICS_FILE.exists():
        raise HTTPException(status_code=503,
                            detail="Metrics not found. Run train_models.py first.")
    with open(METRICS_FILE) as f:
        return json.load(f)


@app.post("/api/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    t0 = time.time()
    disease = req.disease.lower()
    if disease not in DISEASE_FORMS:
        raise HTTPException(status_code=400, detail=f"Unknown disease: {disease}")

    models = _load_models(disease)
    try:
        X = _preprocess_input(disease, dict(req.patient_data), models)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Preprocessing failed: {e}")

    pca_feature_names = [f"PC{i+1}" for i in range(X.shape[1])]
    result = PredictResponse(disease=disease, mode=req.mode, latency_ms=0)

    if req.mode in ("classical", "both"):
        cl = models["classical"]
        prob = float(cl.predict_proba(X)[0, 1])
        expl = cl.explain(X)
        result.classical = {
            "probability": round(prob, 4),
            "risk_category": _risk_category(prob),
            "confidence": round(abs(prob - 0.5) * 2, 4),
            "explanation": expl,
        }

    if req.mode in ("quantum", "both"):
        qm = models["quantum"]
        prob = float(qm.predict_proba(X)[0, 1])
        expl = qm.explain(X[0], feature_names=pca_feature_names)
        result.quantum = {
            "probability": round(prob, 4),
            "risk_category": _risk_category(prob),
            "confidence": round(abs(prob - 0.5) * 2, 4),
            "explanation": expl,
        }

    result.latency_ms = round((time.time() - t0) * 1000, 1)
    return result


@app.post("/api/batch")
async def batch_predict(
    disease: str = Form(...),
    mode: str = Form("classical"),
    file: UploadFile = File(...),
):
    disease = disease.lower()
    if disease not in DISEASE_FORMS:
        raise HTTPException(status_code=400, detail=f"Unknown disease: {disease}")

    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception:
        raise HTTPException(status_code=422, detail="Could not parse CSV file.")

    models = _load_models(disease)
    feats = DISEASE_FEATURES[disease]["features"]
    missing = [f for f in feats if f not in df.columns]
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing columns: {missing}")

    X_raw = df[feats].values.astype(float)
    X = models["prep"].transform(X_raw)

    results = []
    model = models["classical"] if mode == "classical" else models["quantum"]
    probs = model.predict_proba(X)[:, 1]
    preds = (probs >= 0.5).astype(int)

    for i, (prob, pred) in enumerate(zip(probs, preds)):
        results.append({
            "row": i + 1,
            "probability": round(float(prob), 4),
            "prediction": int(pred),
            "risk_category": _risk_category(float(prob)),
        })

    return {"disease": disease, "mode": mode, "n_patients": len(df), "results": results}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
