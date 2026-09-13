import React, { useEffect, useState } from 'react'

const ANALYSIS_STEPS = [
  'Analyzing health parameters...',
  'Preprocessing data',
  'Selecting relevant features',
  'Running prediction model',
  'Generating explanation',
  'Assessment complete',
]

export default function AnalysisLoader({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep < ANALYSIS_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 400)
      return () => clearTimeout(timer)
    } else {
      const finalTimer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 300)
      return () => clearTimeout(finalTimer)
    }
  }, [currentStep, onComplete])

  const progressPct = Math.round(((currentStep + 1) / ANALYSIS_STEPS.length) * 100)

  return (
    <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', background: '#FFFFFF' }}>
      <div style={{
        width: '42px',
        height: '42px',
        border: '3px solid #F0F0F0',
        borderTopColor: '#B91C1C',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 1.5rem',
      }} />

      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#171717' }}>
        {ANALYSIS_STEPS[currentStep]}
      </h3>

      <p style={{ fontSize: '0.82rem', color: '#666666', marginBottom: '1.5rem' }}>
        Evaluating health inputs using configured model parameters.
      </p>

      {/* Progress track */}
      <div style={{ maxWidth: '320px', margin: '0 auto' }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div style={{ fontSize: '0.72rem', color: '#888888', marginTop: '0.4rem', textAlign: 'right' }}>
          {progressPct}%
        </div>
      </div>
    </div>
  )
}
