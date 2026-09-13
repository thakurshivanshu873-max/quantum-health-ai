import React from 'react'
import QuantumCircuitVisualizer from './QuantumCircuitVisualizer.jsx'

export default function QuantumTechnology() {
  return (
    <section className="section">
      <div className="section-header">
        <div className="section-tag">TECHNICAL DEEP DIVE</div>
        <h2>Quantum Technology</h2>
        <p className="section-subtitle">Exploring quantum-enhanced feature representations and variational circuit architectures.</p>
      </div>

      {/* 4 Technical Pillars Grid */}
      <div className="grid-4" style={{ gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', color: '#B91C1C', marginBottom: '0.35rem' }}>Quantum Feature Mapping</h3>
          <p style={{ fontSize: '0.78rem', margin: 0 }}>
            Maps classical biomedical parameters into 2^N dimensional Hilbert state space using Rx angle rotations.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.95rem', color: '#B91C1C', marginBottom: '0.35rem' }}>Quantum Circuit</h3>
          <p style={{ fontSize: '0.78rem', margin: 0 }}>
            Utilizes strongly entangling CNOT layers to capture high-order non-linear feature correlations.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.95rem', color: '#B91C1C', marginBottom: '0.35rem' }}>Classical Optimization</h3>
          <p style={{ fontSize: '0.78rem', margin: 0 }}>
            Adam optimizer updates circuit parameter weights θ_W via autograd gradient descent.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.95rem', color: '#B91C1C', marginBottom: '0.35rem' }}>Quantum-Enhanced Model</h3>
          <p style={{ fontSize: '0.78rem', margin: 0 }}>
            Generates calibrated probability expectations for early risk assessment.
          </p>
        </div>
      </div>

      {/* Requirement 14: Conceptual Quantum Circuit Diagram */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem', background: '#FFFFFF' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: '#171717' }}>
          Conceptual Circuit Diagram
        </div>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          background: '#FAFAFA',
          border: '1px solid #E5E5E5',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          lineHeight: 1.8,
          color: '#171717',
          overflowX: 'auto',
        }}>
          <div>q0 ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>H</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>RY(θ0)</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>●</span> ─────── <span style={{ color: '#B91C1C', fontWeight: 700 }}>RY(w0)</span> ── <span style={{ color: '#666666' }}>[M]</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#B91C1C' }}>│</span></div>
          <div>q1 ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>H</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>RY(θ1)</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>X</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>●</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>RY(w1)</span> ── <span style={{ color: '#666666' }}>[M]</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#B91C1C' }}>│</span></div>
          <div>q2 ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>H</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>RY(θ2)</span> ────── <span style={{ color: '#B91C1C', fontWeight: 700 }}>X</span> ── <span style={{ color: '#B91C1C', fontWeight: 700 }}>RY(w2)</span> ── <span style={{ color: '#666666' }}>[M]</span></div>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#666666', marginTop: '0.75rem' }}>
          Initial state preparation applies Hadamard gates ($H$) followed by single-qubit parameter rotations ($RY$) and entangling CNOT operations ($● - X$).
        </p>
      </div>

      {/* Interactive 6-Qubit Simulator */}
      <QuantumCircuitVisualizer />
    </section>
  )
}
