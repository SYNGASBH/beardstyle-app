import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { stylesAPI } from '../services/api'
import { mergeRecommendations } from '../services/mergeRecommendations'
import { ResultsScreen } from '../components/ResultsScreen'
import RealisticBeardGenerator from '../components/RealisticBeardGenerator'

const AIResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [mergedResult, setMergedResult] = useState(null)
  const [error, setError] = useState(null)

  const [realisticStyle, setRealisticStyle] = useState(null)

  const uploadData = location.state

  const loadAIResults = useCallback(async (uploadId) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000)
    try {
      setLoading(true)
      const recResponse = await stylesAPI.getRecommendations({
        uploadId,
        faceShape: uploadData?.faceShape || 'oval',
        lifestyle: uploadData?.lifestyle || 'casual',
        maintenancePreference: uploadData?.maintenancePreference || 'medium',
      })

      // Merge backend AI analysis with static beard style data
      const aiAnalysis = recResponse.data.aiAnalysis
      const merged = mergeRecommendations(aiAnalysis || { faceShape: 'oval' })
      setMergedResult(merged)
    } catch (err) {
      console.error('Failed to load AI results:', err)
      if (err.name === 'CanceledError' || err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        setError('AI analiza traje predugo. Pokušajte ponovo ili nastavite sa upitnikom.')
      } else {
        setError('Greška pri učitavanju rezultata. Pokušajte ponovo.')
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [uploadData])

  useEffect(() => {
    if (!uploadData?.uploadId) {
      navigate('/upload')
      return
    }
    loadAIResults(uploadData.uploadId)
  }, [uploadData, navigate, loadAIResults])

  // --- Handlers ---

  const handleSave = (savedResult) => {
    console.log('Analysis saved:', savedResult)
  }

  const handleShare = (result) => {
    if (navigator.share) {
      navigator.share({
        title: 'BeardStyle — Moji rezultati',
        text: `Moj oblik lica: ${result.aiAnalysis.faceShape}`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
      alert('Link kopiran u clipboard!')
    }
  }

  const handleReset = () => {
    navigate('/upload')
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4" />
        <p className="text-gray-600">Analiziram vašu sliku pomoću AI...</p>
        <p className="text-sm text-gray-500 mt-2">Ovo može potrajati 30–60 sekundi</p>
      </div>
    )
  }

  // --- Error state (no results) ---
  if (error && !mergedResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => loadAIResults(uploadData.uploadId)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Pokušaj ponovo
          </button>
          <button
            onClick={() => navigate('/questionnaire', {
              state: { uploadId: uploadData.uploadId, imageUrl: uploadData.imageUrl }
            })}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Nastavi sa Upitnikom
          </button>
        </div>
      </div>
    )
  }

  // --- Main result view ---
  return (
    <>
      {/* Realistic Generator Modal */}
      {realisticStyle && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <RealisticBeardGenerator
            userPhoto={uploadData.imageUrl}
            style={realisticStyle}
            onClose={() => setRealisticStyle(null)}
          />
        </div>
      )}

      {/* ResultsScreen */}
      {mergedResult && (
        <ResultsScreen
          result={mergedResult}
          imageUrl={uploadData.imageUrl}
          onSave={handleSave}
          onShare={handleShare}
          onReset={handleReset}
          onRealistic={(style) => setRealisticStyle({ slug: style.slug || style.id, name: style.name })}
        />
      )}
    </>
  )
}

export default AIResultsPage
