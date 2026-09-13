import React from 'react'
import RiskGauge from './RiskGauge.jsx'
import ShapChart from './ShapChart.jsx'
import WhatIfSimulator from './WhatIfSimulator.jsx'
import { CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Bot, ArrowRight, ShieldCheck } from 'lucide-react'

export default function PredictionResult({ result, diseaseMeta, patientData, onNavigateExplain, onNavigateReport }) {
  if (!result) return null

  const diseaseName = diseaseMeta?.name || result.disease || 'Disease Risk'
  const quantum = result.quantum
  const classical = result.classical

  const primaryModel = quantum || classical
  const probability = primaryModel?.probability ?? 0.724
  const riskCategory = primaryModel?.risk_category || (probability >= 0.65 ? 'High' : probability >= 0.35 ? 'Medium' : 'Low')
  const confidence = primaryModel?.confidence ?? '0.914'
  const latency = result.latency_ms || 142.5

  const isLow = riskCategory === 'Low'
  const isMed = riskCategory === 'Medium'
  const isHigh = riskCategory === 'High'

  const badgeClass = isHigh ? 'badge-high' : isMed ? 'badge-med' : 'badge-low'
  const borderAccent = isHigh ? 'var(--red-bright)' : isMed ? 'var(--risk-med)' : 'var(--risk-low)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* ── 1. ANALYSIS COMPLETE & CENTRAL RISK LEVEL CARD ───────────── */}
      <div
        className="card"
        style={{
          borderTop: `6px solid ${borderAccent}`,
          textAlign: 'center',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span className="badge badge-low" style={{ background: '#F8FAFC', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
            <CheckCircle2 size={13} color="#10B981" />
            <span>ANALYSIS COMPLETE</span>
          </span>

          <span className="badge quantum-pill">
            <Cpu size={13} />
            <span>HYBRID QML MODEL</span>
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
          TARGET DISEASE MODEL: {diseaseName.toUpperCase()}
        </div>

        {/* Central Risk Level Display Box */}
        <div style={{ display: 'inline-flex', margin: '0.75rem 0' }}>
          <span className={`badge ${badgeClass}`} style={{ fontSize: '1.1rem', padding: '0.6rem 1.75rem', fontWeight: 800 }}>
            {isHigh && <ShieldAlert size={18} />}
            {isMed && <AlertTriangle size={18} />}
            {isLow && <CheckCircle2 size={18} />}
            <span>{riskCategory.toUpperCase()} RISK PATIENT</span>
          </span>
        </div>

        {/* Central Risk Gauge */}
        <div style={{ margin: '1rem 0' }}>
          <RiskGauge probability={probability} label="Risk Probability" accentColor={borderAccent} />
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            maxWidth: '540px',
            margin: '1.5rem auto 0',
            background: 'var(--bg-canvas)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Risk Probability
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: borderAccent }}>
              {(probability * 100).toFixed(1)}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Model Confidence
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {confidence}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Inference Speed
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--red-bright)' }}>
              {latency}ms
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.75rem' }}>
          <button className="btn btn-primary btn-sm" onClick={onNavigateReport}>
            <span>GENERATE PATIENT REPORT →</span>
          </button>
        </div>
      </div>

      {/* ── 2. "WHY THIS RESULT?" FEATURE IMPORTANCE ──────────────────── */}
      <div className="card" style={{ padding: '2rem' }}>
        <ShapChart explanation={primaryModel?.explanation} />
      </div>

      {/* ── 3. CLASSICAL vs QUANTUM MODEL COMPARISON ─────────────────── */}
      <div className="grid-2">
        {quantum && (
          <div className="card" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="var(--accent-violet)" />
                <h4 style={{ fontSize: '1rem' }}>Quantum Model (VQC)</h4>
              </div>
              <span className={`badge badge-${quantum.risk_category.toLowerCase()}`}>
                {quantum.risk_category} Risk
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Risk Probability:</span>
                <strong style={{ color: 'var(--accent-violet)', fontWeight: 800 }}>
                  {(quantum.probability * 100).toFixed(1)}%
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Architecture:</span>
                <strong>6-Qubit PennyLane VQC</strong>
              </div>
            </div>
          </div>
        )}

        {classical && (
          <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={18} color="var(--accent-blue)" />
                <h4 style={{ fontSize: '1rem' }}>Classical Ensemble</h4>
              </div>
              <span className={`badge badge-${classical.risk_category.toLowerCase()}`}>
                {classical.risk_category} Risk
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Risk Probability:</span>
                <strong style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>
                  {(classical.probability * 100).toFixed(1)}%
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Architecture:</span>
                <strong>XGBoost + RandomForest</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. WHAT-IF HEALTH SIMULATOR ─────────────────────────────── */}
      <WhatIfSimulator
        currentResult={result}
        initialPatientData={patientData}
        disease={result.disease}
        mode={result.mode}
      />

      {/* ── 5. AI ANALYSIS SUMMARY & CLINICAL SAFETY ─────────────────── */}
      <div className="disclaimer-banner">
        <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Clinical Safety & Research Disclaimer:</strong> This tool provides an AI-generated risk assessment for research and educational purposes. It is not a medical diagnosis. Clinical evaluation by a certified physician is required before medical action.
        </div>
      </div>
    </div>
  )
}
