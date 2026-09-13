import React from 'react'

const DATASET_INFO = [
  {
    name: 'UCI Cleveland Heart Disease',
    samples: 303,
    features: 13,
    target: 'Diagnosis (0: Healthy, 1: Heart Disease)',
    missing: 'Mode Imputed (Ca, Thal)',
    trainSplit: '80% (242 samples)',
    testSplit: '20% (61 samples)',
    status: 'StandardScaler Normalized + PCA (8 Qubits)',
  },
  {
    name: 'PIMA Indians Diabetes',
    samples: 768,
    features: 8,
    target: 'Outcome (0: Healthy, 1: Diabetes)',
    missing: 'KNN Imputed',
    trainSplit: '80% (614 samples)',
    testSplit: '20% (154 samples)',
    status: 'StandardScaler Normalized + PCA (8 Qubits)',
  },
  {
    name: 'Wisconsin WDBC Breast Cancer',
    samples: 569,
    features: 30,
    target: 'Diagnosis (0: Benign, 1: Malignant)',
    missing: 'None (0 missing)',
    trainSplit: '80% (455 samples)',
    testSplit: '20% (114 samples)',
    status: 'StandardScaler Normalized + PCA (8 Qubits)',
  },
]

const SAMPLE_PREVIEW_ROWS = [
  { age: 63, gender: 'Male', glucose: 145, bmi: 33.6, bp: 145, target: 1 },
  { age: 37, gender: 'Male', glucose: 130, bmi: 26.6, bp: 130, target: 0 },
  { age: 41, gender: 'Female', glucose: 130, bmi: 28.1, bp: 120, target: 0 },
  { age: 56, gender: 'Male', glucose: 120, bmi: 31.4, bp: 140, target: 1 },
  { age: 57, gender: 'Female', glucose: 120, bmi: 35.4, bp: 120, target: 1 },
]

export default function DatasetSection() {
  return (
    <section id="dataset" className="section">
      <div className="section-header">
        <div className="section-tag">DATASET TELEMETRY</div>
        <h2>Dataset & Model Data</h2>
        <p className="section-subtitle">Standardized clinical datasets utilized for model baseline evaluation.</p>
      </div>

      {/* Info Cards */}
      <div className="grid-3" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        {DATASET_INFO.map((d, i) => (
          <div key={i} className="card">
            <h3 style={{ fontSize: '1rem', color: '#171717', marginBottom: '0.85rem' }}>{d.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
              <div><span style={{ color: '#666666' }}>Dataset: </span><strong>{d.name}</strong></div>
              <div><span style={{ color: '#666666' }}>Samples: </span><strong>{d.samples}</strong></div>
              <div><span style={{ color: '#666666' }}>Features: </span><strong>{d.features}</strong></div>
              <div><span style={{ color: '#666666' }}>Target Variable: </span><strong>{d.target}</strong></div>
              <div><span style={{ color: '#666666' }}>Missing Values: </span><strong>{d.missing}</strong></div>
              <div><span style={{ color: '#666666' }}>Training Split: </span><strong>{d.trainSplit}</strong></div>
              <div><span style={{ color: '#666666' }}>Testing Split: </span><strong>{d.testSplit}</strong></div>
              <div><span style={{ color: '#666666' }}>Preprocessing Status: </span><strong style={{ color: '#B91C1C' }}>{d.status}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Requirement 19: Sample Data Preview Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', background: '#FAFAFA', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sample Data Preview</span>
          <span className="research-chip">Demo Dataset Preview</span>
        </div>

        <table className="medical-table">
          <thead>
            <tr>
              <th>Age</th>
              <th>Gender</th>
              <th>Glucose (mg/dL)</th>
              <th>BMI (kg/m²)</th>
              <th>Blood Pressure (mm Hg)</th>
              <th>Target Class</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_PREVIEW_ROWS.map((row, idx) => (
              <tr key={idx}>
                <td>{row.age}</td>
                <td>{row.gender}</td>
                <td>{row.glucose}</td>
                <td>{row.bmi}</td>
                <td>{row.bp}</td>
                <td>
                  <span className={`badge ${row.target === 1 ? 'badge-high' : 'badge-low'}`}>
                    {row.target === 1 ? 'Positive (1)' : 'Negative (0)'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
