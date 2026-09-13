import React, { useState } from 'react'
import FloatingNav from './components/FloatingNav.jsx'
import LandingPage from './pages/LandingPage.jsx'
import PredictPage from './pages/PredictPage.jsx'
import PipelinePage from './pages/PipelinePage.jsx'
import ExplainabilityPage from './pages/ExplainabilityPage.jsx'
import DatasetPage from './pages/DatasetPage.jsx'
import ComparisonPage from './pages/ComparisonPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [activePrediction, setActivePrediction] = useState(null)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePredictionComplete = (predData) => {
    setActivePrediction(predData)
  }

  return (
    <div className="app-container">
      {/* Floating Navigation Pill */}
      <FloatingNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Module Content */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <LandingPage setActiveTab={handleTabChange} />
        )}

        {activeTab === 'predict' && (
          <PredictPage
            setActiveTab={handleTabChange}
            onPredictionComplete={handlePredictionComplete}
            lastResult={activePrediction}
          />
        )}

        {activeTab === 'quantum' && (
          <PipelinePage setActiveTab={handleTabChange} />
        )}

        {activeTab === 'explain' && (
          <ExplainabilityPage activePrediction={activePrediction} />
        )}

        {activeTab === 'dataset' && (
          <DatasetPage />
        )}

        {activeTab === 'performance' && (
          <ComparisonPage />
        )}

        {activeTab === 'report' && (
          <ReportPage
            activePrediction={activePrediction}
            setActiveTab={handleTabChange}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  )
}
