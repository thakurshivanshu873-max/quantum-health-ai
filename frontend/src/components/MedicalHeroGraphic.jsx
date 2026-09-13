import React from 'react'

export default function MedicalHeroGraphic() {
  return (
    <div style={{
      width: '100%',
      height: '360px',
      background: '#FAFAFA',
      border: '1px solid #E5E5E5',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem',
    }}>
      <svg width="340" height="300" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Subtle Background Grid Lines */}
        <line x1="20" y1="50" x2="320" y2="50" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="20" y1="150" x2="320" y2="150" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="20" y1="250" x2="320" y2="250" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="90" y1="20" x2="90" y2="280" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="170" y1="20" x2="170" y2="280" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="250" y1="20" x2="250" y2="280" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />

        {/* Central Medical Cross Shield */}
        <rect x="140" y="110" width="60" height="60" rx="10" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
        <path d="M 164 125 V 155 M 149 140 H 179" stroke="#B91C1C" strokeWidth="5" strokeLinecap="round" />

        {/* Data Nodes & Molecular Network Lines */}
        <line x1="90" y1="80" x2="140" y2="120" stroke="#B91C1C" strokeWidth="1.5" />
        <line x1="250" y1="80" x2="200" y2="120" stroke="#B91C1C" strokeWidth="1.5" />
        <line x1="90" y1="220" x2="140" y2="160" stroke="#E5E5E5" strokeWidth="1.5" />
        <line x1="250" y1="220" x2="200" y2="160" stroke="#B91C1C" strokeWidth="1.5" />

        {/* Outer Data Nodes */}
        <circle cx="90" cy="80" r="14" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2" />
        <circle cx="90" cy="80" r="4" fill="#B91C1C" />

        <circle cx="250" cy="80" r="14" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2" />
        <circle cx="250" cy="80" r="4" fill="#B91C1C" />

        <circle cx="90" cy="220" r="12" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
        <circle cx="90" cy="220" r="4" fill="#666666" />

        <circle cx="250" cy="220" r="12" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2" />
        <circle cx="250" cy="220" r="4" fill="#B91C1C" />

        {/* Clean Cardiac Waveform Line at Bottom */}
        <path
          d="M 30 250 H 90 L 110 230 L 125 270 L 145 210 L 160 250 H 310"
          fill="none"
          stroke="#B91C1C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Minimal Quantum State Tags */}
        <rect x="25" y="30" width="85" height="22" rx="4" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1" />
        <text x="67" y="44" fill="#B91C1C" fontSize="10" fontWeight="600" textAnchor="middle">QML VECTOR</text>

        <rect x="225" y="30" width="90" height="22" rx="4" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
        <text x="270" y="44" fill="#666666" fontSize="10" fontWeight="600" textAnchor="middle">BIOMEDICAL</text>
      </svg>
    </div>
  )
}
