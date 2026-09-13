import React from 'react'

export default function ResponsibleAI() {
  return (
    <section className="section">
      <div className="section-header">
        <div className="section-tag">ETHICS & COMPLIANCE</div>
        <h2>Responsible AI</h2>
        <p className="section-subtitle">Core principles guiding the research development and deployment of disease screening models.</p>
      </div>

      <div className="card" style={{ background: '#FAFAFA', borderLeft: '4px solid #B91C1C' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            { title: 'Non-Clinical Prototype', desc: 'Prototype output is not a medical diagnosis and cannot replace certified medical evaluation.' },
            { title: 'Dataset Sensitivity', desc: 'Model performance depends directly on dataset quality, distribution, and preprocessing parameters.' },
            { title: 'Clinical Validation Required', desc: 'All algorithmic risk predictions require appropriate multi-center clinical validation.' },
            { title: 'Explainability & Transparency', desc: 'Feature attributions and model reasoning are provided to ensure complete research transparency.' },
            { title: 'Data Security & Privacy', desc: 'Patient clinical parameter inputs must be anonymized and handled securely per privacy protocols.' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ color: '#B91C1C', fontWeight: 700 }}>•</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#171717', marginBottom: '0.2rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#666666', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
