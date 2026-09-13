"""
preprocessor.py
Shared preprocessing pipeline: imputation, scaling, PCA to n_components.
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.impute import SimpleImputer
import joblib, os

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


DISEASE_FEATURES = {
    "diabetes": {
        "features": ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
                     "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"],
        "target": "Outcome",
        "n_qubits": 8,
    },
    "heart": {
        "features": ["age", "sex", "cp", "trestbps", "chol", "fbs",
                     "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"],
        "target": "target",
        "n_qubits": 8,
    },
    "cancer": {
        "features": [
            "mean radius", "mean texture", "mean perimeter", "mean area",
            "mean smoothness", "mean compactness", "mean concavity",
            "mean concave points", "mean symmetry", "mean fractal dimension",
            "radius error", "texture error", "perimeter error", "area error",
            "smoothness error", "compactness error", "concavity error",
            "concave points error", "symmetry error", "fractal dimension error",
            "worst radius", "worst texture", "worst perimeter", "worst area",
            "worst smoothness", "worst compactness", "worst concavity",
            "worst concave points", "worst symmetry", "worst fractal dimension",
        ],
        "target": "target",
        "n_qubits": 8,
    },
}


class DiseasePreprocessor:
    """
    End-to-end preprocessor for a single disease:
      1. Impute missing values (median)
      2. StandardScaler
      3. PCA to n_qubits components
      4. MinMaxScaler → [0, π] for quantum angle encoding
    """

    def __init__(self, disease: str, n_components: int = 8):
        self.disease = disease
        self.n_components = n_components
        self.imputer = SimpleImputer(strategy="median")
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=n_components, random_state=42)
        self.angle_scaler = MinMaxScaler(feature_range=(0, np.pi))
        self.feature_names = DISEASE_FEATURES[disease]["features"]
        self.is_fitted = False

    def fit(self, X: np.ndarray) -> "DiseasePreprocessor":
        X = self.imputer.fit_transform(X)
        X = self.scaler.fit_transform(X)
        n = min(self.n_components, X.shape[1])
        self.pca.n_components = n
        X = self.pca.fit_transform(X)
        self.angle_scaler.fit(X)
        self.is_fitted = True
        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        X = self.imputer.transform(X)
        X = self.scaler.transform(X)
        X = self.pca.transform(X)
        return self.angle_scaler.transform(X)

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        return self.fit(X).transform(X)

    def save(self):
        os.makedirs(MODELS_DIR, exist_ok=True)
        path = os.path.join(MODELS_DIR, f"{self.disease}_preprocessor.pkl")
        joblib.dump(self, path)
        return path

    @staticmethod
    def load(disease: str) -> "DiseasePreprocessor":
        path = os.path.join(MODELS_DIR, f"{disease}_preprocessor.pkl")
        return joblib.load(path)
