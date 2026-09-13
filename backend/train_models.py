"""
train_models.py
Master training script for all 3 disease models.
Run: python -m backend.train_models
"""
import os, sys, json, warnings
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer

warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from backend.preprocessor import DiseasePreprocessor, DISEASE_FEATURES
from backend.classical_model import ClassicalModel
from backend.quantum_model import QuantumVQC

DATA_DIR   = os.path.join(os.path.dirname(__file__), "..", "data")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

METRICS_FILE = os.path.join(MODELS_DIR, "metrics.json")


# ──────────────────────────────────────────────────────────────────────────────
# Dataset Loaders
# ──────────────────────────────────────────────────────────────────────────────

def load_diabetes():
    """PIMA Indians Diabetes Dataset (local CSV)."""
    path = os.path.join(DATA_DIR, "diabetes.csv")
    df = pd.read_csv(path)
    feats = DISEASE_FEATURES["diabetes"]["features"]
    target = DISEASE_FEATURES["diabetes"]["target"]
    # Replace zero values with NaN for biological features (they'll be imputed)
    zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
    df[zero_cols] = df[zero_cols].replace(0, np.nan)
    X = df[feats].values
    y = df[target].values
    return X, y, feats


def load_heart():
    """UCI Cleveland Heart Disease Dataset – download if not present."""
    path = os.path.join(DATA_DIR, "heart.csv")
    feats = DISEASE_FEATURES["heart"]["features"]

    if not os.path.exists(path):
        print("  Downloading UCI Heart Disease dataset...")
        import requests
        url = ("https://archive.ics.uci.edu/ml/machine-learning-databases/"
               "heart-disease/processed.cleveland.data")
        try:
            r = requests.get(url, timeout=15)
            lines = r.text.strip().split("\n")
            rows = [l.replace("?", "nan").split(",") for l in lines]
            col_names = feats + ["target"]
            df = pd.DataFrame(rows, columns=col_names, dtype=float)
            df["target"] = (df["target"] > 0).astype(int)
            df.to_csv(path, index=False)
            print(f"  Saved to {path}")
        except Exception as e:
            print(f"  Download failed ({e}). Generating synthetic heart data.")
            np.random.seed(42)
            n = 303
            X_syn = np.random.randn(n, len(feats))
            y_syn = (X_syn[:, 0] + X_syn[:, 7] - X_syn[:, 8] > 0).astype(int)
            df = pd.DataFrame(X_syn, columns=feats)
            df["target"] = y_syn
            df.to_csv(path, index=False)

    df = pd.read_csv(path)
    # Ensure target is binary
    if "target" in df.columns:
        df["target"] = (df["target"] > 0).astype(int)
    X = df[feats].values.astype(float)
    y = df["target"].values.astype(int)
    return X, y, feats


def load_cancer():
    """Wisconsin Breast Cancer dataset from sklearn."""
    data = load_breast_cancer()
    X = data.data
    # Labels: sklearn gives 0=malignant,1=benign; flip so 1=malignant (positive)
    y = 1 - data.target
    feats = list(data.feature_names)
    return X, y, feats


LOADERS = {
    "diabetes": load_diabetes,
    "heart": load_heart,
    "cancer": load_cancer,
}


# ──────────────────────────────────────────────────────────────────────────────
# Training loop
# ──────────────────────────────────────────────────────────────────────────────

def train_disease(disease: str, n_qubits: int = 8, q_epochs: int = 60) -> dict:
    print(f"\n{'='*60}")
    print(f"  Training models for: {disease.upper()}")
    print(f"{'='*60}")

    # 1. Load data
    X, y, feats = LOADERS[disease]()
    print(f"  Dataset shape: {X.shape}, Class balance: {np.bincount(y)}")

    # 2. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. Preprocessing
    print("  Fitting preprocessor (impute → scale → PCA → angle-scale)...")
    prep = DiseasePreprocessor(disease, n_components=n_qubits)
    X_train_q = prep.fit_transform(X_train)
    X_test_q  = prep.transform(X_test)
    prep.save()
    print(f"  Preprocessor saved. Quantum features shape: {X_train_q.shape}")

    # 4. Classical model (trained on raw scaled data for better performance)
    print("\n  [Classical] Training XGBoost + RandomForest ensemble...")
    from sklearn.preprocessing import StandardScaler
    from sklearn.impute import SimpleImputer

    imp = SimpleImputer(strategy="median")
    sc  = StandardScaler()
    X_train_cl = sc.fit_transform(imp.fit_transform(X_train))
    X_test_cl  = sc.transform(imp.transform(X_test))
    # Save these too
    import joblib
    joblib.dump(imp, os.path.join(MODELS_DIR, f"{disease}_imp.pkl"))
    joblib.dump(sc,  os.path.join(MODELS_DIR, f"{disease}_scaler.pkl"))

    classical = ClassicalModel(disease)
    # Use PCA component names for explainability (features fed are raw scaled)
    classical.feature_names = (
        [f"PC{i+1}" for i in range(X_train_q.shape[1])]
    )
    # Train on quantum-reduced features for fair comparison
    classical.fit(X_train_q, y_train)
    classical.save()
    cl_metrics = classical.compute_metrics(X_test_q, y_test)
    print(f"  Classical → Acc={cl_metrics['accuracy']}, AUC={cl_metrics['auc_roc']}, "
          f"Recall={cl_metrics['recall']}")

    # 5. Quantum VQC
    print(f"\n  [Quantum] Training VQC ({n_qubits} qubits)...")
    qmodel = QuantumVQC(
        disease=disease,
        n_qubits=n_qubits,
        n_layers=3,
        learning_rate=0.05,
        epochs=q_epochs,
        batch_size=32,
    )
    qmodel.fit(X_train_q, y_train)
    qmodel.save()
    q_metrics = qmodel.compute_metrics(X_test_q, y_test)
    print(f"  Quantum  → Acc={q_metrics['accuracy']}, AUC={q_metrics['auc_roc']}, "
          f"Recall={q_metrics['recall']}")

    return {
        "disease": disease,
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "n_features_original": int(X.shape[1]),
        "n_qubits": n_qubits,
        "classical": cl_metrics,
        "quantum": q_metrics,
    }


def main():
    all_metrics = {}
    for disease in ["diabetes", "heart", "cancer"]:
        try:
            result = train_disease(disease)
            all_metrics[disease] = result
        except Exception as e:
            print(f"\nERROR training {disease}: {e}")
            import traceback; traceback.print_exc()

    # Save combined metrics
    with open(METRICS_FILE, "w") as f:
        json.dump(all_metrics, f, indent=2)
    print(f"\n✅ All metrics saved to {METRICS_FILE}")

    # Summary table
    print("\n" + "="*70)
    print(f"  {'Disease':<12} {'Model':<12} {'Acc':>6} {'Recall':>8} {'F1':>6} {'AUC':>6}")
    print("  " + "-"*66)
    for d, r in all_metrics.items():
        for mtype in ["classical", "quantum"]:
            m = r[mtype]
            print(f"  {d:<12} {mtype:<12} {m['accuracy']:>6.4f} "
                  f"{m['recall']:>8.4f} {m['f1']:>6.4f} {m['auc_roc']:>6.4f}")
    print("="*70)


if __name__ == "__main__":
    main()
