import React, { useState } from 'react'
import QuantumCircuitVisualizer from '../components/QuantumCircuitVisualizer.jsx'
import { Cpu, ArrowRight, Layers, Zap, Info, X, CheckCircle2 } from 'lucide-react'

const PIPELINE_STAGES_META = [
  {
    step: '01',
    title: 'PATIENT DATA',
    sub: 'Biomedical Vector',
    whatHappens: 'Collects raw clinical measurements (Age, BP, Glucose, BMI, Cholesterol) from patient assessment inputs.',
    realSpecs: { Qubits: '6 Qubits', Features: '8 - 30 Clinical Features', Mode: 'Raw Tabular Input' },
  },
  {
    step: '02',
    title: 'PREPROCESSING',
    sub: 'StandardScaler',
    whatHappens: 'Imputes missing values and scales features to zero mean and unit variance ($z = (x - \\mu)/\\sigma$) for optimal quantum rotation mapping.',
    realSpecs: { Scaler: 'StandardScaler', Imputer: 'KNN / Mean Imputation', Range: 'Standardized (-3 to +3)' },
  },
  {
    step: '03',
    title: 'PCA SELECTION',
    sub: 'Feature Reduction',
    whatHappens: 'Applies Principal Component Analysis to compress high-dimensional feature vectors into a 6-component subspace matching our 6-qubit register size.',
    realSpecs: { Dimensions: 'Compressed to 6 PCs', RetainedVariance: '74.2% - 88.4%', QubitMapping: '1 PC per Qubit' },
  },
  {
    step: '04',
    title: 'QUANTUM ENCODING',
    sub: 'Rx(θ) Rotations',
    whatHappens: 'Encodes reduced feature values into quantum state angles using single-qubit rotational gates $|\\psi\\rangle = R_x(\\theta)|0\\rangle$.',
    realSpecs: { EncodingMethod: 'Angle Encoding Rx(θ)', Rotations: '6 Single-Qubit Gates', StateSpace: '2^6 Hilbert Space' },
  },
  {
    step: '05',
    title: 'QUANTUM CIRCUIT',
    sub: '6-Qubit VQC',
    whatHappens: 'Executes a 12-layer Variational Quantum Circuit with Strongly Entangling CNOT gates to capture complex non-linear feature correlations.',
    realSpecs: { QubitCount: '6 Qubits', CircuitDepth: '12 Layers', Simulator: 'PennyLane lightning.qubit', Weights: '36 Trainable Parameters' },
  },
  {
    step: '06',
    title: 'CLASSICAL LAYER',
    sub: 'Soft-Voting Layer',
    whatHappens: 'Measures quantum expectation values $\\langle Z \\rangle$ and combines them with classical XGBoost ensemble probabilities via weighted soft-voting.',
    realSpecs: { Measurement: 'PauliZ Expectation <Z_i>', Ensemble: 'XGBoost + RandomForest', HybridWeight: '0.5 QML + 0.5 Classical' },
  },
  {
    step: '07',
    title: 'PREDICTION',
    sub: 'Risk Score %',
    whatHappens: 'Generates final disease risk probability %, confidence interval, and risk classification badge (Low / Medium / High).',
    realSpecs: { Output: 'Probability % [0 - 100%]', Categories: 'Low / Medium / High', Latency: '< 150ms' },
  },
]

export default function PipelinePage() {
  const [selectedStage, setSelectedStage] = useState(PIPELINE_STAGES_META[4]) // Default to Quantum Circuit step

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag">
          <Cpu size={14} />
          <span>03 MODEL ANALYSIS & ARCHITECTURE</span>
        </div>
        <h1 className="section-title">Hybrid AI Diagnostic Model Architecture</h1>
        <p className="lead-text">
          Explore the 7-stage diagnostic processing pipeline combining classical preprocessing, feature reduction, variational quantum circuits, and XGBoost ensemble soft-voting.
        </p>
      </div>

      {/* ── 1. CLICKABLE 7-STAGE QUANTUM PIPELINE ───────────────────── */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--red-bright)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
          CLICKABLE PIPELINE STAGES
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', alignItems: 'center' }}>
          {PIPELINE_STAGES_META.map((item, idx) => {
            const isSel = selectedStage.step === item.step
            return (
              <React.Fragment key={item.step}>
                <div
                  onClick={() => setSelectedStage(item)}
                  style={{
                    background: isSel ? 'var(--red-bright)' : 'var(--bg-canvas)',
                    color: isSel ? '#FFF' : 'var(--text-main)',
                    padding: '1rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                    border: isSel ? '2px solid var(--red-dark)' : '1px solid var(--border-light)',
                    boxShadow: isSel ? 'var(--shadow-red)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 800 }}>{item.step}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, margin: '0.2rem 0' }}>{item.title}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{item.sub}</div>
                </div>
                {idx < 6 && (
                  <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-subtle)' }}>
                    <ArrowRight size={14} />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* ── 2. "WHAT HAPPENS HERE?" DETAIL MODAL/PANEL ───────────────── */}
      {selectedStage && (
        <div
          className="card"
          style={{
            marginBottom: '2.5rem',
            padding: '2rem',
            background: 'var(--red-bg-subtle)',
            border: '2px solid var(--red-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--red-bright)' }}>
              <Info size={20} />
              <h3 style={{ fontSize: '1.25rem' }}>STAGE {selectedStage.step}: WHAT HAPPENS HERE?</h3>
            </div>
            <span className="badge quantum-pill">{selectedStage.title}</span>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {selectedStage.whatHappens}
          </p>

          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--red-bright)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            REAL STAGE PARAMETERS & METRICS
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            {Object.entries(selectedStage.realSpecs).map(([key, val]) => (
              <div key={key} style={{ background: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{key}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. CIRCUIT DIAGRAM VISUALIZER ──────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <QuantumCircuitVisualizer />
      </div>
    </div>
  )
}
