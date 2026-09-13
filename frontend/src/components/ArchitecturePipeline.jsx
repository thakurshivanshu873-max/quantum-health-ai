import React, { useState } from 'react'

const PIPELINE_STEPS = [
  { step: '1', title: 'Patient Data', short: 'Raw biomedical inputs', desc: 'Raw patient clinical parameters (Age, Blood Pressure, Glucose, BMI, Cholesterol).' },
  { step: '2', title: 'Data Preprocessing', short: 'Imputation & normalization', desc: 'Normalizes and prepares biomedical features for model processing using StandardScaler.' },
  { step: '3', title: 'Feature Selection', short: 'Identifies relevant inputs', desc: 'Identifies relevant input features for prediction via PCA dimensional reduction.' },
  { step: '4', title: 'Feature Encoding', short: 'Angle parameter mapping', desc: 'Maps scalar feature parameters x_i into rotation angles θ_i ∈ [0, π].' },
  { step: '5', title: 'Model Processing', short: 'VQC & classical execution', desc: 'Processes the selected features using the configured classical or quantum model.' },
  { step: '6', title: 'Risk Prediction', short: 'Calibrated score', desc: 'Generates a calibrated risk probability and output classification.' },
  { step: '7', title: 'Explainability', short: 'Attribution insights', desc: 'Calculates feature-level attributions and prediction rationale.' },
]

export default function ArchitecturePipeline() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="technology" className="section section-alt">
      <div className="section-header">
        <div className="section-tag">ARCHITECTURE PIPELINE</div>
        <h2>How It Works</h2>
        <p className="section-subtitle">Seven-stage data pipeline from clinical parameters to explainable risk metrics.</p>
      </div>

      {/* Pipeline Cards Grid */}
      <div className="grid-4" style={{ gap: '1rem', marginBottom: '1.75rem' }}>
        {PIPELINE_STEPS.map((s, idx) => {
          const isActive = activeStep === idx
          return (
            <div
              key={s.step}
              className="card"
              style={{
                background: isActive ? '#FEF2F2' : '#FFFFFF',
                borderColor: isActive ? '#B91C1C' : '#E5E5E5',
                cursor: 'pointer',
                padding: '1.15rem',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setActiveStep(idx)}
              onMouseEnter={() => setActiveStep(idx)}
            >
              <div style={{ color: isActive ? '#B91C1C' : '#666666', fontWeight: 700, fontSize: '0.76rem', marginBottom: '0.2rem' }}>
                Step {s.step}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#171717', marginBottom: '0.2rem' }}>{s.title}</div>
              <div style={{ fontSize: '0.74rem', color: '#666666' }}>{s.short}</div>
            </div>
          )
        })}
      </div>

      {/* Selected Step Explanation Box */}
      <div className="card" style={{ background: '#FFFFFF', borderLeft: '4px solid #B91C1C', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B91C1C' }}>Step {PIPELINE_STEPS[activeStep].step} Detail:</span>
          <strong style={{ fontSize: '0.95rem' }}>{PIPELINE_STEPS[activeStep].title}</strong>
        </div>
        <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-dark)' }}>
          "{PIPELINE_STEPS[activeStep].desc}"
        </p>
      </div>
    </section>
  )
}
