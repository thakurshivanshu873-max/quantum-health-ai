import React, { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* Left: Medical Logo */}
        <button className="navbar-brand" onClick={() => scrollToSection('hero')}>
          <div className="brand-cross-icon">+</div>
          <span className="brand-text">
            QuantumHealth <span>AI</span>
          </span>
        </button>

        {/* Center: Navigation Links (Desktop) */}
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button className="nav-link" onClick={() => scrollToSection('hero')}>Home</button>
          <button className="nav-link" onClick={() => scrollToSection('assessment')}>Risk Assessment</button>
          <button className="nav-link" onClick={() => scrollToSection('technology')}>Technology</button>
          <button className="nav-link" onClick={() => scrollToSection('performance')}>Performance</button>
          <button className="nav-link" onClick={() => scrollToSection('explainability')}>Explainability</button>
          <button className="nav-link" onClick={() => scrollToSection('dataset')}>Dataset</button>
        </div>

        {/* Right: Research Chip & Primary Action Button */}
        <div className="navbar-right-actions">
          <span className="research-chip">Research Prototype</span>
          <button className="btn btn-primary btn-sm" onClick={() => scrollToSection('assessment')}>
            Start Assessment
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  )
}
