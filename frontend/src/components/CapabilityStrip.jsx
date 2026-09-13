import React from 'react'

const CAPABILITIES = [
  { title: 'AI-Powered', desc: 'Data-driven risk assessment' },
  { title: 'Explainable', desc: 'Feature-level insights' },
  { title: 'Research Ready', desc: 'Designed for experimentation' },
  { title: 'Scalable', desc: 'Future-ready architecture' },
]

export default function CapabilityStrip() {
  return (
    <div className="capability-strip" style={{
      background: '#FAFAFA',
      borderTop: '1px solid #E5E5E5',
      borderBottom: '1px solid #E5E5E5',
      padding: '1.75rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
      }}>
        {CAPABILITIES.map((c, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#B91C1C',
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#171717' }}>{c.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#666666' }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
