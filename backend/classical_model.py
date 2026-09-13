"""
classical_model.py
XGBoost + RandomForest ensemble classifier with SHAP explainability.
"""
import numpy as np
import pandas as pd
import shap
import joblib
import os
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix, roc_curve
)
from xgboost import XGBClassifier

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


class ClassicalModel:
    """
    Soft-voting ensemble of XGBoost + RandomForest.
    Provides SHAP explainability on the XGBoost component.
    """

    def __init__(self, disease: str):
        self.disease = disease
        self.xgb = XGBClassifier(
            n_estimators=200,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            use_label_encoder=False,
            eval_metric="logloss",
            random_state=42,
        )
        self.rf = RandomForestClassifier(
            n_estimators=200,
            max_depth=6,
            random_state=42,
        )
        self.ensemble = VotingClassifier(
            estimators=[("xgb", self.xgb), ("rf", self.rf)],
            voting="soft",
        )
        self.explainer = None
        self.feature_names = None

    def fit(self, X_train: np.ndarray, y_train: np.ndarray, feature_names=None):
        self.feature_names = (
            feature_names if feature_names else [f"PC{i+1}" for i in range(X_train.shape[1])]
        )
        self.ensemble.fit(X_train, y_train)
        # Build SHAP explainer on XGBoost (trained inside ensemble)
        xgb_fitted = self.ensemble.named_estimators_["xgb"]
        self.explainer = shap.TreeExplainer(xgb_fitted)
        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        return self.ensemble.predict_proba(X)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.ensemble.predict(X)

    def explain(self, X: np.ndarray):
        """Return SHAP values for the positive class (index 1)."""
        shap_values = self.explainer.shap_values(X)
        # For binary classification shap_values is array of shape (n_samples, n_features)
        if isinstance(shap_values, list):
            shap_vals = shap_values[1]  # positive class
        else:
            shap_vals = shap_values
        return {
            "shap_values": shap_vals.tolist(),
            "feature_names": self.feature_names,
            "base_value": float(self.explainer.expected_value
                                if not isinstance(self.explainer.expected_value, (list, np.ndarray))
                                else self.explainer.expected_value[1]),
        }

    def compute_metrics(self, X_test: np.ndarray, y_test: np.ndarray) -> dict:
        y_pred = self.predict(X_test)
        y_prob = self.predict_proba(X_test)[:, 1]
        cm = confusion_matrix(y_test, y_pred)
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        tn, fp, fn, tp = cm.ravel()
        return {
            "accuracy": round(accuracy_score(y_test, y_pred), 4),
            "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
            "recall": round(recall_score(y_test, y_pred, zero_division=0), 4),
            "specificity": round(tn / (tn + fp) if (tn + fp) > 0 else 0.0, 4),
            "f1": round(f1_score(y_test, y_pred, zero_division=0), 4),
            "auc_roc": round(roc_auc_score(y_test, y_prob), 4),
            "confusion_matrix": cm.tolist(),
            "roc_curve": {
                "fpr": fpr.tolist()[::5],  # downsample for JSON
                "tpr": tpr.tolist()[::5],
            },
        }

    def save(self):
        os.makedirs(MODELS_DIR, exist_ok=True)
        path = os.path.join(MODELS_DIR, f"{self.disease}_classical.pkl")
        joblib.dump(self, path)
        return path

    @staticmethod
    def load(disease: str) -> "ClassicalModel":
        path = os.path.join(MODELS_DIR, f"{disease}_classical.pkl")
        return joblib.load(path)
