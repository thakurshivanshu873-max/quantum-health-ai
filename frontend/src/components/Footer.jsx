import React from 'react'

export default function Footer({ setActiveTab }) {
  return (
    <footer
      style={{
        background: 'var(--bg-navy)',
        color: '#FFFFFF',
        padding: '3.5rem 0 2rem',
        borderTop: '1px solid var(--border-navy)',
        marginTop: '4rem',
      }}
    >
      <div className="page-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', fontWeight: 800, color: '#FFF', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--accent-violet)' }}>⚛</span> QuantumHealth AI
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-navy-muted)', maxWidth: '380px', lineHeight: 1.6 }}>
              Hybrid Quantum Machine Learning Platform for early disease risk assessment combining 6-qubit PennyLane VQC with XGBoost ensembles.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { id: 'overview', label: '01 Overview' },
              { id: 'predict', label: '02 Prediction' },
              { id: 'quantum', label: '03 QML Pipeline' },
              { id: 'explain', label: '04 Explainability' },
              { id: 'dataset', label: '05 Dataset' },
              { id: 'performance', label: '06 Performance' },
              { id: 'report', label: '07 Reports' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-navy-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-navy-muted)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span>© 2026 QuantumHealth AI Platform · Commercial-Grade Health-Tech UI</span>
          <span className="badge quantum-pill" style={{ fontSize: '0.7rem' }}>
            SIH Problem SIH26139 · Research Prototype
          </span>
        </div>
      </div>
    </footer>
  )
}
