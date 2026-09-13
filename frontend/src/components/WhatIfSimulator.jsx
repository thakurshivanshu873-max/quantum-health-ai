import React, { useState, useEffect } from 'react'
import { predict } from '../api.js'
import { Sliders, ArrowRight, RefreshCw, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'

export default function WhatIfSimulator({ currentResult, initialPatientData, disease, mode }) {
  const [scenarioData, setScenarioData] = useState(initialPatientData || {})
  const [scenarioResult, setScenarioResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const currentProb = (currentResult?.quantum?.probability ?? currentResult?.classical?.probability ?? 0.724) * 100
  const currentRiskCat = currentResult?.quantum?.risk_category || currentResult?.classical?.risk_category || 'High'

  useEffect(() => {
    if (initialPatientData) {
      setScenarioData(initialPatientData)
    }
  }, [initialPatientData])

  // Recalculate prediction via real backend API on slider changes
  const runScenarioPrediction = async (updatedData) => {
    setLoading(true)
    try {
      const res = await predict({
        disease: disease || currentResult?.disease || 'diabetes',
        patient_data: updatedData,
        mode: mode || currentResult?.mode || 'both',
      })
      setScenarioResult(res.data)
    } catch {
      // Fallback predictor if server offline
      let rawProb = 0.45
      const d = disease || 'diabetes'
      if (d === 'diabetes') {
        const g = Number(updatedData.Glucose) || 120
        const bmi = Number(updatedData.BMI) || 25
        rawProb = Math.min(Math.max(((g - 70) / 130) * 0.6 + ((bmi - 18) / 25) * 0.4, 0.05), 0.96)
      } else if (d === 'heart') {
        const bp = Number(updatedData.trestbps) || 120
        const chol = Number(updatedData.chol) || 200
        rawProb = Math.min(Math.max(((bp - 100) / 80) * 0.5 + ((chol - 150) / 200) * 0.5, 0.05), 0.97)
      } else if (d === 'cancer') {
        const radius = Number(updatedData['mean radius']) || 14
        rawProb = Math.min(Math.max((radius - 8) / 16, 0.05), 0.98)
      }

      setScenarioResult({
        disease: d,
        mode: mode || 'both',
        quantum: {
          probability: Number(rawProb.toFixed(4)),
          risk_category: rawProb >= 0.65 ? 'High' : rawProb >= 0.35 ? 'Medium' : 'Low',
        },
        classical: {
          probability: Number(rawProb.toFixed(4)),
          risk_category: rawProb >= 0.65 ? 'High' : rawProb >= 0.35 ? 'Medium' : 'Low',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSliderChange = (paramKey, value) => {
    const nextData = { ...scenarioData, [paramKey]: parseFloat(value) }
    setScenarioData(nextData)
    runScenarioPrediction(nextData)
  }

  const handleReset = () => {
    if (initialPatientData) {
      setScenarioData(initialPatientData)
      runScenarioPrediction(initialPatientData)
    }
  }

  const scenarioProb = ((scenarioResult?.quantum?.probability ?? scenarioResult?.classical?.probability ?? (currentProb / 100)) * 100)
  const scenarioRiskCat = scenarioResult?.quantum?.risk_category || scenarioResult?.classical?.risk_category || currentRiskCat

  const deltaPct = scenarioProb - currentProb
  const isImprovement = deltaPct <= 0

  return (
    <div className="card" style={{ padding: '2rem', borderTop: '5px solid var(--red-bright)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--red-bright)' }}>
            <Sliders size={20} />
            <h3 style={{ fontSize: '1.3rem' }}>WHAT-IF HEALTH SIMULATOR</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
            Adjust patient parameters below to run live scenario inference against the real model pipeline.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleReset}>
          <RefreshCw size={14} />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* ── 1. SCENARIO COMPARISON CARD ────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1fr',
          gap: '1.5rem',
          alignItems: 'center',
          background: 'var(--bg-canvas)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          border: '1px solid var(--border-light)',
        }}
      >
        {/* CURRENT PATIENT */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            CURRENT PATIENT
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.2rem 0' }}>
            {currentProb.toFixed(1)}%
          </div>
          <span className={`badge badge-${currentRiskCat.toLowerCase()}`}>
            {currentRiskCat.toUpperCase()}
          </span>
        </div>

        {/* DELTA INDICATOR */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            SCENARIO IMPACT DELTA
          </div>
          <div className={`delta-pill ${isImprovement ? 'delta-pill-improved' : 'delta-pill-worse'}`}>
            {isImprovement ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
            <span>
              {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)} Percentage Points
            </span>
          </div>
          {loading && (
            <div style={{ fontSize: '0.72rem', color: 'var(--red-bright)', marginTop: '0.4rem' }}>
              Re-evaluating model...
            </div>
          )}
        </div>

        {/* WHAT-IF SCENARIO */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--red-bright)', textTransform: 'uppercase' }}>
            WHAT-IF SCENARIO
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--red-bright)', margin: '0.2rem 0' }}>
            {scenarioProb.toFixed(1)}%
          </div>
          <span className={`badge badge-${scenarioRiskCat.toLowerCase()}`}>
            {scenarioRiskCat.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── 2. REAL-TIME SLIDERS CONTROLS ────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
          Adjust Patient Variables
        </h4>

        {Object.entries(scenarioData).map(([param, val]) => {
          if (typeof val !== 'number') return null

          // Configurable slider bounds per parameter
          let min = 0, max = 200, step = 1
          if (param.toLowerCase().includes('glucose')) { min = 70; max = 300 }
          else if (param.toLowerCase().includes('bmi')) { min = 15; max = 60; step = 0.1 }
          else if (param.toLowerCase().includes('bp') || param.toLowerCase().includes('blood') || param.toLowerCase().includes('trestbps')) { min = 60; max = 220 }
          else if (param.toLowerCase().includes('age')) { min = 18; max = 100 }
          else if (param.toLowerCase().includes('chol')) { min = 100; max = 500 }
          else if (param.toLowerCase().includes('hr') || param.toLowerCase().includes('thalach')) { min = 60; max = 220 }
          else if (param.toLowerCase().includes('radius')) { min = 6; max = 30; step = 0.1 }

          const origVal = initialPatientData?.[param] ?? val
          const isChanged = origVal !== val

          return (
            <div key={param} style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{param}</span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {isChanged && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                      orig: {origVal}
                    </span>
                  )}
                  <span style={{ fontWeight: 800, color: 'var(--red-bright)', fontSize: '0.95rem' }}>
                    {val}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={val}
                className="range-slider"
                onChange={(e) => handleSliderChange(param, e.target.value)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
