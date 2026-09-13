import React from 'react'
import {
  Activity,
  Cpu,
  BarChart2,
  FileText,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'overview',     num: '01', label: 'Overview',           icon: Activity },
  { id: 'predict',      num: '02', label: 'Health Assessment',  icon: Sparkles },
  { id: 'quantum',      num: '03', label: 'Model Analysis',     icon: Cpu },
  { id: 'explain',      num: '04', label: 'Explainability',     icon: ShieldAlert },
  { id: 'dataset',      num: '05', label: 'Dataset Analytics',  icon: Database },
  { id: 'performance',  num: '06', label: 'Model Performance', icon: BarChart2 },
  { id: 'report',       num: '07', label: 'Clinical Reports',   icon: FileText },
]

export default function FloatingNav({ activeTab, setActiveTab }) {
  return (
    <div className="floating-nav-wrapper">
      <div className="floating-nav-pill">
        {/* Brand Badge */}
        <button
          className="nav-brand"
          onClick={() => setActiveTab('overview')}
          title="QuantumHealth AI Platform"
        >
          <div className="nav-brand-icon">⚛</div>
          <span>QuantumHealth</span>
        </button>

        {/* Navigation Items */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
            >
              <span className="nav-num">{item.num}</span>
              <span>{item.label}</span>
            </button>
          )
        })}

        {/* Quick CTA */}
        <button
          className="btn btn-primary btn-sm"
          style={{ marginLeft: '0.4rem', padding: '0.45rem 0.9rem' }}
          onClick={() => setActiveTab('predict')}
        >
          <span>START ANALYSIS</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
