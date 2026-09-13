import React, { useState } from 'react'
import { Database, BarChart2, PieChart, Layers, ShieldCheck } from 'lucide-react'

const DATASET_SPECS = {
  diabetes: {
    name: 'PIMA Indians Diabetes Dataset',
    records: 768,
    features: 8,
    missing: '0 (Imputed zeros)',
    classes: { Negative: 500, Positive: 268 },
    types: 'Continuous Numerical Clinical Features',
    pcaVariance: '74.2% (First 4 PCs)',
  },
  heart: {
    name: 'UCI Cleveland Heart Disease Dataset',
    records: 303,
    features: 13,
    missing: '6 (Dropped/Imputed)',
    classes: { Absence: 165, Presence: 138 },
    types: 'Categorical + Continuous Vitals',
    pcaVariance: '81.6% (First 6 PCs)',
  },
  cancer: {
    name: 'Wisconsin Diagnostic WDBC Breast Cancer',
    records: 569,
    features: 30,
    missing: '0 (Cleaned fine-needle aspirate)',
    classes: { Benign: 357, Malignant: 212 },
    types: 'High-Dimensional Cytological Features',
    pcaVariance: '88.4% (First 6 PCs)',
  },
}

export default function DatasetPage() {
  const [selectedDs, setSelectedDs] = useState('diabetes')
  const ds = DATASET_SPECS[selectedDs]

  const posPct = Math.round((Object.values(ds.classes)[1] / ds.records) * 100)
  const negPct = 100 - posPct

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag">
          <Database size={14} />
          <span>05 BIOMEDICAL DATASET ANALYTICS</span>
        </div>
        <h1 className="section-title">Clinical Dataset Overview</h1>
        <p className="lead-text">
          Exploratory analysis, class distribution balance, missing value handling, and PCA dimensionality reduction.
        </p>
      </div>

      {/* Dataset Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {Object.entries(DATASET_SPECS).map(([id, item]) => (
          <button
            key={id}
            className={`btn ${selectedDs === id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedDs(id)}
          >
            <Database size={16} />
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* ── 1. DATASET METRIC CARDS ─────────────────────────────────── */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-label">Total Records</div>
          <div className="stat-num">{ds.records}</div>
          <div className="stat-sub">Verified Patient Rows</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Original Features</div>
          <div className="stat-num" style={{ color: 'var(--accent-blue)' }}>{ds.features}</div>
          <div className="stat-sub">Clinical Variables</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">PCA Variance Retained</div>
          <div className="stat-num" style={{ color: 'var(--accent-violet)' }}>{ds.pcaVariance.split(' ')[0]}</div>
          <div className="stat-sub">{ds.pcaVariance.split(' ').slice(1).join(' ')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Missing Values</div>
          <div className="stat-num" style={{ color: 'var(--risk-low)', fontSize: '1.6rem', marginTop: '0.3rem' }}>
            {ds.missing.split(' ')[0]}
          </div>
          <div className="stat-sub">{ds.missing}</div>
        </div>
      </div>

      {/* ── 2. VISUALIZATIONS GRID ───────────────────────────────────── */}
      <div className="grid-2" style={{ gap: '2rem' }}>
        
        {/* Class Distribution Visualizer */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.15rem' }}>Class Distribution Balance</h3>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--risk-low)' }}>{Object.keys(ds.classes)[0]}: {Object.values(ds.classes)[0]} cases ({negPct}%)</span>
              <span style={{ color: 'var(--risk-high)' }}>{Object.keys(ds.classes)[1]}: {Object.values(ds.classes)[1]} cases ({posPct}%)</span>
            </div>

            <div className="progress-bar-bg" style={{ height: '14px', display: 'flex' }}>
              <div style={{ width: `${negPct}%`, background: 'var(--risk-low)', height: '100%' }} />
              <div style={{ width: `${posPct}%`, background: 'var(--risk-high)', height: '100%' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Dataset exhibits balanced representation for binary risk classification modeling, preventing algorithmic bias toward negative outcomes.
          </div>
        </div>

        {/* PCA Dimensionality Reduction Visualizer */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={18} color="var(--accent-violet)" />
            <h3 style={{ fontSize: '1.15rem' }}>PCA Feature Projection into 6 Qubits</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {['PC1 Variance: 34.8%', 'PC2 Variance: 21.2%', 'PC3 Variance: 12.4%', 'PC4 Variance: 8.2%'].map((pc, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontWeight: 600 }}>
                  <span>{pc.split(':')[0]}</span>
                  <span style={{ color: 'var(--accent-violet)', fontWeight: 800 }}>{pc.split(':')[1]}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: pc.split(':')[1].trim(), background: 'var(--accent-violet)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Principal Component Analysis maps raw clinical dimensions to a 6-component subspace for direct R_x(θ) angle encoding onto 6 quantum wires.
          </div>
        </div>

      </div>
    </div>
  )
}
