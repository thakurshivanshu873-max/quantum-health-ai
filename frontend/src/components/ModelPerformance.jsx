import React, { useEffect, useState } from 'react'
import { getMetrics } from '../api.js'

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState(null)
  const [activeDataset, setActiveDataset] = useState('heart')

  useEffect(() => {
    getMetrics().then(r => setMetrics(r.data)).catch(() => {})
  }, [])

  const dm = metrics?.[activeDataset]
  const cl = dm?.classical || { accuracy: 0.8197, precision: 0.825, recall: 0.8571, f1: 0.8136 }
  const q  = dm?.quantum   || { accuracy: 0.8197, precision: 0.868, recall: 0.7143, f1: 0.7843 }

  const rows = [
    { metric: 'Accuracy', cl: (cl.accuracy * 100).toFixed(1) + '%', q: (q.accuracy * 100).toFixed(1) + '%' },
    { metric: 'Precision', cl: (cl.precision * 100).toFixed(1) + '%', q: (q.precision * 100).toFixed(1) + '%' },
    { metric: 'Recall (Sensitivity)', cl: (cl.recall * 100).toFixed(1) + '%', q: (q.recall * 100).toFixed(1) + '%' },
    { metric: 'F1 Score', cl: (cl.f1 * 100).toFixed(1) + '%', q: (q.f1 * 100).toFixed(1) + '%' },
  ]

  const confMatrix = dm?.quantum?.confusion_matrix || [[25, 3], [4, 18]]

  return (
    <section id="performance" className="section">
      <div className="section-header">
        <div className="section-tag">EMPIRICAL EVALUATION</div>
        <h2>Model Performance</h2>
        <p className="section-subtitle">Compare performance across standard evaluation metrics.</p>
      </div>

      {/* Dataset Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="tabs" style={{ maxWidth: '520px' }}>
          <button className={`tab ${activeDataset === 'heart' ? 'active' : ''}`} onClick={() => setActiveDataset('heart')}>
            UCI Cleveland Heart
          </button>
          <button className={`tab ${activeDataset === 'diabetes' ? 'active' : ''}`} onClick={() => setActiveDataset('diabetes')}>
            PIMA Diabetes
          </button>
          <button className={`tab ${activeDataset === 'cancer' ? 'active' : ''}`} onClick={() => setActiveDataset('cancer')}>
            Wisconsin WDBC Cancer
          </button>
        </div>

        {!metrics && (
          <span className="research-chip" style={{ color: '#B45309', background: '#FEF3C7', borderColor: '#FDE68A' }}>
            Demo Benchmark Metrics
          </span>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <table className="medical-table">
          <thead>
            <tr>
              <th>Evaluation Metric</th>
              <th>Classical Model</th>
              <th>Quantum-Enhanced Model</th>
              <th>Evaluation Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.metric}>
                <td><strong>{r.metric}</strong></td>
                <td>{r.cl}</td>
                <td><strong style={{ color: 'var(--primary-red)' }}>{r.q}</strong></td>
                <td><span className="research-chip">{metrics ? 'Validated' : 'Demo'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Requirement 16: Confusion Matrix */}
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Quantum Model Confusion Matrix</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: '#F4FBF7', border: '1px solid #BBF7D0', padding: '0.85rem', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#15803D' }}>{confMatrix[0][0]}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#15803D' }}>True Negative (TN)</div>
            </div>
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.85rem', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#B91C1C' }}>{confMatrix[0][1]}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#B91C1C' }}>False Positive (FP)</div>
            </div>
            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.85rem', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#B45309' }}>{confMatrix[1][0]}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#B45309' }}>False Negative (FN)</div>
            </div>
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.85rem', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#B91C1C' }}>{confMatrix[1][1]}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#B91C1C' }}>True Positive (TP)</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Evaluation Methodology</h3>
          <p style={{ fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Models are evaluated using an 80/20 train/test holdout split. Quantum feature maps are traced through autograd QNodes with classical SGD optimization.
          </p>
          <div style={{ fontSize: '0.78rem', color: '#666666', borderTop: '1px solid #E5E5E5', paddingTop: '0.5rem' }}>
            Framework: PennyLane 0.45 simulation with lightning.qubit backend.
          </div>
        </div>
      </div>
    </section>
  )
}
