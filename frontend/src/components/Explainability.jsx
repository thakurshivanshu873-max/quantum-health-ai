import React from 'react'

const EXPLAINABILITY_ITEMS = [
  { feature: 'Glucose', pct: 32 },
  { feature: 'BMI', pct: 24 },
  { feature: 'Age', pct: 18 },
  { feature: 'Blood Pressure', pct: 14 },
]

export default function Explainability({ explanationData, isDemo = true }) {
  const items = explanationData?.feature_names
    ? explanationData.feature_names.slice(0, 4).map((name, i) => ({
        feature: name,
        pct: Math.abs(Math.round((explanationData.shap_values[i] || 0.15) * 100)),
      }))
    : EXPLAINABILITY_ITEMS

  return (
    <section id="explainability" className="section section-alt">
      <div className="section-header">
        <div className="section-tag">INTERPRETABILITY</div>
        <h2>Understanding the Prediction</h2>
        <p className="section-subtitle">The model identifies the features that contributed most strongly to the generated prediction.</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Horizontal Red Progress Bars */}
        <div className="card" style={{ background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>Feature Importance (%)</span>
            {isDemo && <span className="research-chip">Demo Explanation</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item.feature}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span style={{ color: '#171717' }}>{item.feature}</span>
                  <span style={{ color: '#B91C1C', fontWeight: 700 }}>{item.pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${item.pct}%`, background: '#B91C1C' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Card */}
        <div className="card" style={{ background: '#FFFFFF' }}>
          <h3 style={{ marginBottom: '0.75rem', color: '#B91C1C' }}>Feature Attribution Summary</h3>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem' }}>
            Elevated blood glucose levels present the highest individual risk contribution (+32%), followed by body mass index (+24%) and age parameters (+18%).
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666666', borderTop: '1px solid #E5E5E5', paddingTop: '0.6rem', margin: 0 }}>
            Explainer methodology: SHAP (SHapley Additive exPlanations) tree attributions & PennyLane finite-difference autograd gradients.
          </p>
        </div>
      </div>
    </section>
  )
}
