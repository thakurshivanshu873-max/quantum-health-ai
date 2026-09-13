import React from 'react'

export default function AITechnologyCards() {
  return (
    <section className="section section-alt">
      <div className="section-header">
        <div className="section-tag">RESEARCH PILLARS</div>
        <h2>AI Technology Pillars</h2>
      </div>

      <div className="grid-3">
        <div className="card" style={{ background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1rem', color: '#171717', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            CLASSICAL AI
          </h3>
          <p style={{ fontSize: '0.86rem', lineHeight: 1.55 }}>
            Traditional machine learning provides a baseline for evaluating disease-risk prediction.
          </p>
        </div>

        <div className="card" style={{ background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1rem', color: '#B91C1C', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            QUANTUM COMPUTING
          </h3>
          <p style={{ fontSize: '0.86rem', lineHeight: 1.55 }}>
            Quantum techniques are explored for advanced feature representation and model processing.
          </p>
        </div>

        <div className="card" style={{ background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1rem', color: '#171717', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            HYBRID APPROACH
          </h3>
          <p style={{ fontSize: '0.86rem', lineHeight: 1.55 }}>
            Classical and quantum components are combined within the research architecture.
          </p>
        </div>
      </div>
    </section>
  )
}
