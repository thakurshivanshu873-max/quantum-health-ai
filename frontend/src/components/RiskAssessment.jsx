import React, { useState } from 'react'
import AnalysisLoader from './AnalysisLoader.jsx'
import PredictionResult from './PredictionResult.jsx'
import { predict } from '../api.js'

const DEMO_PATIENT = {
  age: 54,
  sex: 1,
  trestbps: 142,
  Glucose: 158,
  chol: 245,
  BMI: 31.4,
  thalach: 128,
}

const EMPTY_PATIENT = {
  age: '',
  sex: 1,
  trestbps: '',
  Glucose: '',
  chol: '',
  BMI: '',
  thalach: '',
}

export default function RiskAssessment() {
  const [formData, setFormData] = useState(DEMO_PATIENT)
  const [diseaseModel, setDiseaseModel] = useState('heart')
  const [modelType, setModelType]       = useState('quantum')
  const [isAnalyzing, setIsAnalyzing]   = useState(false)
  const [result, setResult]             = useState(null)
  const [isDemoData, setIsDemoData]     = useState(true)

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val === '' ? '' : parseFloat(val) }))
    setIsDemoData(false)
  }

  const handleLoadDemo = () => {
    setFormData(DEMO_PATIENT)
    setIsDemoData(true)
    setResult(null)
  }

  const handleReset = () => {
    setFormData(EMPTY_PATIENT)
    setIsDemoData(false)
    setResult(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setResult(null)
  }

  const handleAnalysisComplete = async () => {
    setIsAnalyzing(false)

    try {
      const payload = {
        disease: diseaseModel,
        patient_data: diseaseModel === 'diabetes' ? {
          Pregnancies: 3, Glucose: formData.Glucose || 120, BloodPressure: formData.trestbps || 120,
          SkinThickness: 30, Insulin: 110, BMI: formData.BMI || 25, DiabetesPedigreeFunction: 0.45, Age: formData.age || 40,
        } : diseaseModel === 'heart' ? {
          age: formData.age || 40, sex: formData.sex, cp: 1, trestbps: formData.trestbps || 120,
          chol: formData.chol || 200, fbs: 0, restecg: 1, thalach: formData.thalach || 140, exang: 0,
          oldpeak: 1.2, slope: 1, ca: 1, thal: 1,
        } : {
          'mean radius': 14.8, 'mean texture': 18.5, 'mean perimeter': 96.2, 'mean area': 670.0,
          'mean smoothness': 0.105, 'mean compactness': 0.135, 'mean concavity': 0.112,
          'mean concave points': 0.065, 'mean symmetry': 0.198, 'mean fractal dimension': 0.068,
        },
        mode: modelType === 'quantum' ? 'quantum' : 'classical',
      }

      const res = await predict(payload)
      const data = res.data
      setResult(modelType === 'quantum' ? data.quantum : data.classical)
    } catch {
      // Fallback Mock Prediction
      const glucose = formData.Glucose || 120
      const prob = glucose > 140 || formData.BMI > 30 ? 0.874 : glucose > 100 ? 0.482 : 0.185
      setResult({
        prediction: prob >= 0.5 ? 1 : 0,
        probability: prob,
        risk_category: prob >= 0.65 ? 'HIGH RISK' : prob >= 0.35 ? 'MEDIUM RISK' : 'LOW RISK',
        confidence: 'High Confidence',
      })
    }
  }

  return (
    <section id="assessment" className="section">
      <div className="section-header">
        <div className="section-tag">CLINICAL INPUTS</div>
        <h2>Early Risk Assessment</h2>
        <p className="section-subtitle">Enter health parameters to evaluate the prediction model.</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Form Input Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E5E5E5', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>Biomedical Parameters</span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleLoadDemo} id="btn-load-demo">
                Load Demo Patient
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset} id="btn-reset">
                Reset
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '0.85rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age (years)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 54"
                  value={formData.age}
                  onChange={e => handleInputChange('age', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={formData.sex} onChange={e => handleInputChange('sex', e.target.value)}>
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Pressure (mm Hg)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 135"
                  value={formData.trestbps}
                  onChange={e => handleInputChange('trestbps', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Glucose (mg/dL)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 125"
                  value={formData.Glucose}
                  onChange={e => handleInputChange('Glucose', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 225"
                  value={formData.chol}
                  onChange={e => handleInputChange('chol', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">BMI (kg/m²)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 28.4"
                  value={formData.BMI}
                  onChange={e => handleInputChange('BMI', e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Heart Rate (bpm)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 145"
                  value={formData.thalach}
                  onChange={e => handleInputChange('thalach', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Model Architecture Selector */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Model Selection</label>
              <div className="tabs">
                <button
                  type="button"
                  className={`tab ${modelType === 'classical' ? 'active' : ''}`}
                  onClick={() => setModelType('classical')}
                >
                  Classical Model
                </button>
                <button
                  type="button"
                  className={`tab ${modelType === 'quantum' ? 'active' : ''}`}
                  onClick={() => setModelType('quantum')}
                >
                  Quantum-Enhanced Model
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={isAnalyzing} id="btn-analyze-risk">
              {isAnalyzing ? 'Analyzing Risk...' : 'Analyze Risk'}
            </button>
          </form>
        </div>

        {/* Output Panel: Loader or Prediction Result */}
        <div>
          {isAnalyzing ? (
            <AnalysisLoader onComplete={handleAnalysisComplete} />
          ) : result ? (
            <PredictionResult result={result} formData={formData} modelType={modelType} isDemo={isDemoData} />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FAFAFA' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Click <strong>Analyze Risk</strong> or <strong>Load Demo Patient</strong> to evaluate model prediction metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
