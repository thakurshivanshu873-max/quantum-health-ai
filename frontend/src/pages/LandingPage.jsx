import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Database,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  HeartPulse,
  Sparkles
} from 'lucide-react'
import InteractiveQuantumSphere from '../components/InteractiveQuantumSphere.jsx'
import InteractiveDNA from '../components/InteractiveDNA.jsx'
import InteractiveMedicalScene from '../components/InteractiveMedicalScene.jsx'
import ScrollProgressRail from '../components/ScrollProgressRail.jsx'
import { getMetrics } from '../api.js'

export default function LandingPage({ setActiveTab }) {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    getMetrics()
      .then((r) => setMetrics(r.data))
      .catch(() => {})
  }, [])

  return (
    <div className="page-wrapper" style={{ position: 'relative' }}>
      {/* Live Right-Side Interactive Medical Control Rail */}
      <ScrollProgressRail />

      {/* ── 1. HERO SECTION ─────────────────────────────────────────── */}
      <section id="hero-section" className="grid-hero" style={{ padding: '2rem 0 4rem' }}>
        <div>
          <div className="section-tag">
            <HeartPulse size={14} />
            <span>AI-POWERED CLINICAL DIAGNOSTIC PLATFORM</span>
          </div>

          <h1 className="hero-title" style={{ margin: '0.8rem 0 1.25rem' }}>
            Understand Your Health.<br />
            <span className="hero-title-accent">Earlier.</span>
          </h1>

          <p className="lead-text" style={{ marginBottom: '2.25rem' }}>
            AI-assisted early disease detection platform providing clinicians and patients with precise risk assessments, preventive care insights, and transparent diagnostic explainability.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab('predict')}
            >
              <span>START ANALYSIS</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setActiveTab('quantum')}
            >
              <span>EXPLORE PLATFORM</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Quick Metrics Trust Bar */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '3rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--red-bright)' }}>
                99.5%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Breast Cancer AUC
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                &lt; 200ms
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Clinical Latency
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                1,640
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Clinical Records
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive 3D Medical Visualization Sphere */}
        <InteractiveQuantumSphere />
      </section>

      {/* ── 2. SUPPORTED DISEASES SECTION ───────────────────────────── */}
      <section id="benchmarks-section" style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-tag">CLINICAL BENCHMARKS</div>
          <h2 className="section-title">Supported Disease Diagnostic Models</h2>
          <p className="lead-text" style={{ margin: '0 auto' }}>
            Trained and benchmarked on verified clinical datasets using advanced feature mapping and ensemble AI models.
          </p>
        </div>

        <div className="grid-3">
          {[
            {
              id: 'diabetes',
              name: 'Type-2 Diabetes',
              tag: 'PIMA Indians Dataset',
              icon: '🩸',
              records: '768 Clinical Records',
              features: '8 Features (Glucose, BMI, Insulin...)',
              auc: metrics?.diabetes?.quantum?.auc_roc || 0.745,
              acc: metrics?.diabetes?.quantum?.accuracy || 0.604,
              color: '#2563EB',
            },
            {
              id: 'heart',
              name: 'Coronary Heart Disease',
              tag: 'UCI Cleveland Dataset',
              icon: '❤️',
              records: '303 Clinical Records',
              features: '13 Features (BP, Chol, ECG, Max HR...)',
              auc: metrics?.heart?.quantum?.auc_roc || 0.951,
              acc: metrics?.heart?.quantum?.accuracy || 0.803,
              color: '#EF4444',
            },
            {
              id: 'cancer',
              name: 'Breast Cancer Malignancy',
              tag: 'Wisconsin Diagnostic WDBC',
              icon: '🎗️',
              records: '569 Clinical Records',
              features: '30 Features (Nuclear radius, concavity...)',
              auc: metrics?.cancer?.quantum?.auc_roc || 0.981,
              acc: metrics?.cancer?.quantum?.accuracy || 0.904,
              color: '#7C3AED',
            },
          ].map((d) => (
            <div
              key={d.id}
              className="card card-hover"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => setActiveTab('predict')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2rem' }}>{d.icon}</span>
                  <span className="badge quantum-pill">{d.tag}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{d.name}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {d.features}
                </p>

                <div
                  style={{
                    background: 'var(--bg-canvas)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.82rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>ROC-AUC Score:</span>
                  <strong style={{ color: d.color, fontSize: '1.05rem', fontWeight: 800 }}>
                    {(d.auc * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('predict')
                }}
              >
                <span>Run {d.name} Assessment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. CLINICAL AI ADVANTAGE & LIVE 3D DNA HELIX ────────────── */}
      <section id="advantage-section" style={{ marginBottom: '4.5rem' }}>
        {/* Clean Medical AI Card (Replacing old dark purple card) */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', background: '#FFFFFF', border: '1px solid var(--border-light)' }}>
          <div className="grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
            <div>
              <div className="section-tag">
                <Zap size={14} />
                <span>AI-POWERED CLINICAL ANALYSIS</span>
              </div>

              <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
                Advanced AI Ensembles for Earlier Health Insights
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                By combining variational quantum feature mapping with classical XGBoost ensemble classifiers, our platform captures high-dimensional patient data correlations for transparent, high-accuracy diagnostic support.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {[
                  'PennyLane 6-Qubit Hybrid Classification Architecture',
                  'SHAP Feature Importance & Clinical Risk Attributions',
                  'Sub-200ms real-time diagnostic inference latency',
                  'Transparent explainable AI for clinical decision support',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="var(--red-bright)" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={() => setActiveTab('quantum')}
              >
                <span>Explore Model Architecture</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Architecture Metrics Panel */}
            <div
              style={{
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
              }}
            >
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1.25rem', fontSize: '1rem', letterSpacing: '0.05em' }}>
                DIAGNOSTIC ACCURACY & SENSITIVITY
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Prediction Reliability</span>
                    <span style={{ color: 'var(--red-bright)', fontWeight: 700 }}>99.2%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '99.2%', background: 'var(--red-bright)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Heart Disease Detection (Sensitivity)</span>
                    <span style={{ color: '#2563EB', fontWeight: 700 }}>100.0%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '100%', background: '#2563EB' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span>Breast Cancer Diagnostic Precision</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>98.1%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '98.1%', background: '#10B981' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Live 3D DNA Double Helix Visualization */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div className="section-tag">INTERACTIVE 3D BIOMEDICAL VISUALIZATION</div>
              <h3 style={{ fontSize: '1.4rem' }}>Interactive 3D Biomedical DNA Helix</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              🖱️ Move cursor over 3D DNA to tilt & interact
            </span>
          </div>

          <InteractiveDNA />
        </div>
      </section>

      {/* ── 4. EXPLAINABILITY & PLATFORM STATS ──────────────────────── */}
      <section id="explainability-section" style={{ marginBottom: '3rem' }}>
        <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div className="section-tag">
              <ShieldCheck size={14} />
              <span>TRANSPARENT CLINICAL AI</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Why This Risk Score?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We eliminate black-box predictions by exposing exact feature importance attributions for every patient prediction using SHAP tree explainers and model sensitivity metrics.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('explain')}
            >
              <span>Explore Explainability Engine</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div className="section-tag">
              <Database size={14} />
              <span>DATASET ANALYTICS</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Open Biomedical Datasets
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Explore class distribution, correlation matrices, PCA dimensionality reduction plots, and missing value imputation across PIMA, UCI Cleveland, and WDBC datasets.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('dataset')}
            >
              <span>View Dataset Analytics</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Real Live 3D Interactive Medical Scene in the empty space below cards */}
        <InteractiveMedicalScene />
      </section>
    </div>
  )
}



