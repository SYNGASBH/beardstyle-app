import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAPI, stylesAPI } from '../services/api';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import BeardStylePreview from '../components/BeardStylePreview';

const AIResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const uploadData = location.state;

  const loadAIResults = useCallback(async (uploadId) => {
    try {
      setLoading(true);

      // First, get recommendations — this triggers lazy AI analysis if not yet done
      const recResponse = await stylesAPI.getRecommendations({
        uploadId: uploadId,
        lifestyle: uploadData?.lifestyle || 'casual',
        maintenancePreference: uploadData?.maintenancePreference || 'medium',
      });

      setRecommendations(recResponse.data.recommendations);

      // If recommend returned AI analysis inline, use it
      if (recResponse.data.aiAnalysis) {
        setAnalysis(recResponse.data.aiAnalysis);
      } else {
        // Otherwise fetch the full analysis from the dedicated endpoint
        try {
          const analysisResponse = await userAPI.getAIAnalysis(uploadId);
          setAnalysis(analysisResponse.data.analysis);
        } catch (analysisErr) {
          console.warn('AI analysis not available:', analysisErr);
          // Continue without detailed analysis — recommendations still work
        }
      }
    } catch (err) {
      console.error('Failed to load AI results:', err);
      setError('Greška pri učitavanju rezultata. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  }, [uploadData]);

  useEffect(() => {
    if (!uploadData?.uploadId) {
      navigate('/upload');
      return;
    }

    loadAIResults(uploadData.uploadId);
  }, [uploadData, navigate, loadAIResults]);

  const handleStylePreview = (styleId, styleName, beardStyleKey) => {
    setSelectedStyle({
      id: styleId,
      name: styleName,
      beardStyleKey: beardStyleKey
    });
    setShowPreview(true);
  };

  const handleContinueToQuestionnaire = () => {
    navigate('/questionnaire', {
      state: {
        uploadId: uploadData.uploadId,
        imageUrl: uploadData.imageUrl,
        aiAnalysis: analysis
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Analiziram vašu sliku pomoću AI...</p>
        <p className="text-sm text-gray-500 mt-2">Ovo može potrajati 10-20 sekundi</p>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'AI analiza nije dostupna. Molimo nastavite sa upitnikom.'}
        </div>
        <button
          onClick={handleContinueToQuestionnaire}
          className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Nastavi sa Upitnikom
        </button>
      </div>
    );
  }

  const facialChars = analysis?.facialCharacteristics
    ? (typeof analysis.facialCharacteristics === 'string'
        ? JSON.parse(analysis.facialCharacteristics)
        : analysis.facialCharacteristics)
    : null;

  const stylingAdvice = analysis?.stylingAdvice
    ? (typeof analysis.stylingAdvice === 'string'
        ? JSON.parse(analysis.stylingAdvice)
        : analysis.stylingAdvice)
    : null;

  const maintenanceGuide = analysis?.maintenanceGuide
    ? (typeof analysis.maintenanceGuide === 'string'
        ? JSON.parse(analysis.maintenanceGuide)
        : analysis.maintenanceGuide)
    : null;

  // Map style names to beard overlay keys
  const styleNameToKey = (styleName) => {
    const mapping = {
      'Full Beard': 'full-beard',
      'Corporate Beard': 'corporate-beard',
      'Goatee': 'goatee',
      'Van Dyke': 'van-dyke',
      'Stubble': 'stubble',
      'Circle Beard': 'circle-beard',
      'Handlebar': 'handlebar',
      'Balbo': 'balbo',
      'Mutton Chops': 'mutton-chops',
      'Ducktail': 'ducktail'
    };
    return mapping[styleName] || 'full-beard';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Preview Modal */}
      {showPreview && selectedStyle && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <BeardStylePreview
              userImage={uploadData.imageUrl}
              beardStyle={selectedStyle.beardStyleKey}
              styleName={selectedStyle.name}
              onSave={(data) => {
                console.log('Style saved:', data);
                setShowPreview(false);
              }}
            />
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-2">AI Analiza Rezultati</h1>
      <p className="text-gray-600 mb-8">
        Analizirali smo vašu sliku i kreirali personalizirane preporuke
      </p>

      {/* WOW Factor: Before/After Preview with Top Recommendation */}
      {recommendations.length > 0 && recommendations.find(r => r.aiRecommended) && (
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Pogledajte Vašu Transformaciju!</h2>
            <p className="text-gray-600">
              Evo kako biste izgledali sa našom #1 preporukom
            </p>
          </div>
          <BeforeAfterSlider
            beforeImage={uploadData.imageUrl}
            afterImage={uploadData.imageUrl}
            styleName={recommendations.find(r => r.aiRecommended)?.name || 'Recommended Style'}
            beardStyle={styleNameToKey(recommendations.find(r => r.aiRecommended)?.name)}
            showControls={false}
          />
          <div className="text-center mt-6">
            <button
              onClick={() => handleStylePreview(
                recommendations.find(r => r.aiRecommended)?.id,
                recommendations.find(r => r.aiRecommended)?.name,
                styleNameToKey(recommendations.find(r => r.aiRecommended)?.name)
              )}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Pokušaj Ovaj Stil
            </button>
          </div>
        </div>
      )}

      {/* Image and Face Shape */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Uploaded Image */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold mb-4">Vaša Slika</h2>
          <img
            src={uploadData.imageUrl}
            alt="Your face"
            className="w-full rounded-lg"
          />
        </div>

        {/* Face Shape Analysis */}
        {analysis && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Oblik Lica</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-red-600 capitalize">
                  {analysis.faceShape}
                </span>
                {analysis.confidence && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {analysis.confidence}% sigurnosti
                  </span>
                )}
              </div>
            </div>

            {facialChars && (
              <>
                <h3 className="font-bold mb-3">Karakteristike Lica:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Širina Čela:</span>
                    <span className="font-semibold capitalize">{facialChars.foreheadWidth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Struktura Vilice:</span>
                    <span className="font-semibold capitalize">{facialChars.jawlineStructure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Oblik Brade:</span>
                    <span className="font-semibold capitalize">{facialChars.chinShape}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dužina Lica:</span>
                    <span className="font-semibold capitalize">{facialChars.faceLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jagodice:</span>
                    <span className="font-semibold capitalize">{facialChars.cheekbones}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Simetrija:</span>
                    <span className="font-semibold capitalize">{facialChars.facialSymmetry}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Styling Advice */}
      {stylingAdvice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Savjeti za Stilizovanje</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-green-700 mb-2">Naglasi:</h3>
              <ul className="space-y-1">
                {stylingAdvice.emphasize?.map((item, idx) => (
                  <li key={idx} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-red-700 mb-2">Umanji:</h3>
              <ul className="space-y-1">
                {stylingAdvice.minimize?.map((item, idx) => (
                  <li key={idx} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {stylingAdvice.lengthGuidance && (
            <div className="mt-4 pt-4 border-t border-blue-300">
              <h3 className="font-bold mb-2">Smjernice za Dužinu:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Brada:</span>{' '}
                  <span className="font-semibold capitalize">{stylingAdvice.lengthGuidance.chin}</span>
                </div>
                <div>
                  <span className="text-gray-600">Obrazi:</span>{' '}
                  <span className="font-semibold capitalize">{stylingAdvice.lengthGuidance.cheeks}</span>
                </div>
                <div>
                  <span className="text-gray-600">Brkovi:</span>{' '}
                  <span className="font-semibold capitalize">{stylingAdvice.lengthGuidance.mustache}</span>
                </div>
                <div>
                  <span className="text-gray-600">Zalisci:</span>{' '}
                  <span className="font-semibold capitalize">{stylingAdvice.lengthGuidance.sideburns}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Recommended Styles */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">AI Preporučeni Stilovi</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.filter(r => r.aiRecommended).map((style) => (
              <div
                key={style.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-red-500"
              >
                {style.image_url && (
                  <img
                    src={style.image_url}
                    alt={style.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{style.name}</h3>
                    {style.aiMatchScore && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                        {style.aiMatchScore}% match
                      </span>
                    )}
                  </div>

                  {style.aiReasoning && (
                    <p className="text-sm text-gray-600 mb-3">{style.aiReasoning}</p>
                  )}

                  {style.aiKeyBenefits && (
                    <div className="text-xs mb-3">
                      {style.aiKeyBenefits.slice(0, 2).map((benefit, idx) => (
                        <div key={idx} className="flex items-start mb-1">
                          <span className="text-green-600 mr-1">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleStylePreview(style.id, style.name, styleNameToKey(style.name))}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Pokušaj Ovaj Stil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Guide */}
      {maintenanceGuide && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Vodič za Održavanje</h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-bold mb-2">Frekvencija Trimovanja:</h3>
              <p className="text-gray-700">{maintenanceGuide.trimmingFrequency}</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Nivo Posvećenosti:</h3>
              <p className="text-gray-700 capitalize">
                {maintenanceGuide.timeCommitment} ({maintenanceGuide.difficultyLevel})
              </p>
            </div>
          </div>

          {maintenanceGuide.recommendedProducts && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Preporučeni Proizvodi:</h3>
              <div className="flex flex-wrap gap-2">
                {maintenanceGuide.recommendedProducts.map((product, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm border">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}

          {maintenanceGuide.stylingTechniques && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Tehnike Stilizovanja:</h3>
              <ul className="space-y-1">
                {maintenanceGuide.stylingTechniques.map((technique, idx) => (
                  <li key={idx} className="text-gray-700">• {technique}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Additional Notes */}
      {analysis?.additionalNotes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-2">💡 Dodatne Napomene:</h3>
          <p className="text-gray-700">{analysis.additionalNotes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleContinueToQuestionnaire}
          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Nastavi sa Detaljnim Upitnikom
        </button>
        <button
          onClick={() => navigate('/gallery')}
          className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Pregledaj Sve Stilove
        </button>
      </div>
    </div>
  );
};

export default AIResultsPage;
