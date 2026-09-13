import React, { useState } from 'react'
import ShapChart from '../components/ShapChart.jsx'
import { ShieldCheck, Cpu, Bot, HelpCircle, AlertCircle } from 'lucide-react'

export default function ExplainabilityPage({ activePrediction }) {
  const [method, setMethod] = useState('quantum')

  const quantumExpl = activePrediction?.quantum?.explanation
  const classicalExpl = activePrediction?.classical?.explanation

  const activeExplanation = method === 'quantum' ? quantumExpl : classicalExpl

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag">
          <ShieldCheck size={14} />
          <span>04 TRANSPARENT MEDICAL AI</span>
        </div>
        <h1 className="section-title">WHY THIS RESULT?</h1>
        <p className="lead-text">
          Explaining patient risk probability through quantitative feature attributions and gradient sensitivities.
        </p>
      </div>

      <div className="grid-hero" style={{ gridTemplateColumns: '1fr 420px', alignItems: 'start', gap: '2rem', minHeight: 'auto' }}>
        
        {/* ── LEFT FEATURE IMPORTANCE CHART ───────────────────────────── */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>Feature Contribution Attributions</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Relative impact of patient clinical parameters on predicted disease risk.
              </p>
            </div>

            {/* Explainer Method Toggle */}
            <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-canvas)', padding: '0.3rem', borderRadius: 'var(--radius-full)' }}>
              <button
                className={`btn btn-sm ${method === 'quantum' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setMethod('quantum')}
              >
                <Cpu size={14} />
                <span>Quantum Gradients</span>
              </button>
              <button
                className={`btn btn-sm ${method === 'classical' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setMethod('classical')}
              >
                <Bot size={14} />
                <span>Classical SHAP</span>
              </button>
            </div>
          </div>

          <ShapChart explanation={activeExplanation} />
        </div>

        {/* ── RIGHT DISTINCTION & METHODOLOGY CARDS ───────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Requirement 7: Explicit Distinction Box */}
          <div className="card" style={{ borderLeft: '4px solid var(--accent-violet)', background: 'rgba(124, 58, 237, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-violet)' }}>
              <HelpCircle size={18} />
              <h3 style={{ fontSize: '1rem' }}>Model vs UI Interpretation</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.84rem', lineHeight: 1.55 }}>
              <div>
                <strong style={{ color: 'var(--accent-violet)' }}>● Model-Derived Explanation:</strong> Mathematical attributions computed via PennyLane finite-difference quantum state gradients (∂P / ∂θ_i) and TreeSHAP Shapley values.
              </div>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>● UI Interpretation:</strong> User-facing visual risk progress bars mapping raw attributions into intuitive percentages for clinical decision support.
              </div>
            </div>
          </div>

          {/* Explanation Methodology Card */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem' }}>Attribution Methodology</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>
                <strong>Parameter-Shift Rule:</strong> Calculates exact quantum state derivatives on PennyLane R_x(θ) gates without numerical approximation errors.
              </div>
              <div>
                <strong>Shapley Additive Values:</strong> Ensures fair contribution credit allocation across collinear clinical features (Glucose, BMI, Age).
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
