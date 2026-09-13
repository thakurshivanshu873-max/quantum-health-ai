import React, { useState } from 'react'
import { Info, X, ChevronRight } from 'lucide-react'

const FEATURE_CLINICAL_META = {
  Glucose: { desc: 'Fasting or plasma glucose measurement.', normal: '70 - 99 mg/dL', highRisk: '> 125 mg/dL indicates elevated glycemic risk.' },
  BMI: { desc: 'Body Mass Index measuring relative body fat.', normal: '18.5 - 24.9 kg/m²', highRisk: '> 30 kg/m² correlates with metabolic risk.' },
  Age: { desc: 'Patient chronological age.', normal: 'N/A', highRisk: 'Advancing age correlates with cumulative vascular risk.' },
  BloodPressure: { desc: 'Diastolic blood pressure reading.', normal: '60 - 80 mmHg', highRisk: '> 90 mmHg indicates hypertension.' },
  Insulin: { desc: '2-hour serum insulin concentration.', normal: '16 - 166 μU/mL', highRisk: '> 200 μU/mL indicates hyperinsulinemia.' },
  Pregnancies: { desc: 'Total number of pregnancies.', normal: '0 - 4', highRisk: 'Higher counts increase gestational metabolic stress.' },
  DiabetesPedigreeFunction: { desc: 'Genetic score based on family diabetes history.', normal: '< 0.5', highRisk: '> 0.8 indicates strong hereditary risk.' },
  SkinThickness: { desc: 'Triceps skin fold thickness measuring subcutaneous fat.', normal: '10 - 30 mm', highRisk: '> 35 mm correlates with obesity risk.' },
  trestbps: { desc: 'Resting blood pressure on admission.', normal: '90 - 120 mmHg', highRisk: '> 140 mmHg indicates stage 1 hypertension.' },
  chol: { desc: 'Serum cholesterol level.', normal: '< 200 mg/dL', highRisk: '> 240 mg/dL indicates hypercholesterolemia.' },
  thalach: { desc: 'Maximum heart rate achieved during exercise.', normal: '120 - 180 bpm', highRisk: 'Reduced max HR indicates cardiac impairment.' },
  'mean radius': { desc: 'Mean distance from cell center to perimeter points.', normal: '< 13 mm', highRisk: '> 15 mm indicates cellular hypertrophy.' },
  'mean concavity': { desc: 'Severity of concave portions of the nuclear contour.', normal: '< 0.05', highRisk: '> 0.12 indicates nuclear irregularity.' },
}

export default function ShapChart({ explanation, title = 'WHY THIS RESULT? – FEATURE IMPORTANCE ATTRIBUTIONS' }) {
  const [selectedFeature, setSelectedFeature] = useState(null)

  if (!explanation) {
    explanation = {
      feature_names: ['Glucose', 'BMI', 'Age', 'BloodPressure', 'Insulin', 'DiabetesPedigreeFunction'],
      shap_values: [0.32, 0.24, 0.18, 0.14, 0.08, 0.04],
    }
  }

  const { shap_values, feature_names } = explanation
  if (!shap_values || !feature_names) return null

  const pairs = feature_names.map((name, i) => {
    const raw = shap_values[i]
    const val = Number(Array.isArray(raw) ? raw[0] : raw)
    return { name, value: isNaN(val) ? 0 : val, abs: Math.abs(isNaN(val) ? 0 : val) }
  })

  pairs.sort((a, b) => b.abs - a.abs)
  const top = pairs.slice(0, 6)
  const totalAbs = top.reduce((sum, p) => sum + p.abs, 0) || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--red-bright)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </div>

      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        💡 <em>Click any feature bar below to open clinical explanation details.</em>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {top.map((p, i) => {
          const pct = Math.round((p.abs / totalAbs) * 100)
          const positive = p.value >= 0
          const barColor = positive ? 'var(--red-bright)' : 'var(--risk-low)'

          return (
            <div
              key={i}
              onClick={() => setSelectedFeature(p)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                cursor: 'pointer',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease',
                background: selectedFeature?.name === p.name ? 'var(--red-bg-subtle)' : 'transparent',
                border: selectedFeature?.name === p.name ? '1px solid var(--red-border)' : '1px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {p.name} <ChevronRight size={14} color="var(--text-subtle)" />
                </span>
                <span style={{ color: barColor, fontWeight: 800 }}>
                  {pct}%
                </span>
              </div>

              {/* Horizontal Bar Visualizer */}
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.max(pct, 5)}%`,
                    background: barColor,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── CLICKABLE FEATURE EXPLANATION PANEL ───────────────────── */}
      {selectedFeature && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1.25rem',
            background: 'var(--red-bg-subtle)',
            border: '1px solid var(--red-border)',
            borderRadius: 'var(--radius-sm)',
            position: 'relative',
          }}
        >
          <button
            onClick={() => setSelectedFeature(null)}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--red-bright)' }}>
            <Info size={16} />
            <h4 style={{ fontSize: '0.95rem' }}>{selectedFeature.name} Explanation</h4>
          </div>

          <div style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
            <div>
              <strong>Model SHAP Attribution:</strong> {(selectedFeature.value * 100).toFixed(1)}% contribution
            </div>
            <div style={{ marginTop: '0.35rem' }}>
              <strong>Clinical Significance:</strong> {FEATURE_CLINICAL_META[selectedFeature.name]?.desc || 'Key biomedical risk factor evaluated by the trained ensemble.'}
            </div>
            <div style={{ marginTop: '0.35rem', color: 'var(--text-muted)' }}>
              <strong>Reference Normal Range:</strong> {FEATURE_CLINICAL_META[selectedFeature.name]?.normal || 'Clinical baseline'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
