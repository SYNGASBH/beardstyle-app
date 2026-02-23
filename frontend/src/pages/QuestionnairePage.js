import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stylesAPI, userAPI } from '../services/api';
import useAuthStore from '../context/useAuthStore';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [faceTypes, setFaceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    faceShape: '',
    lifestyle: '',
    maintenancePreference: '',
    ageRange: '',
  });

  useEffect(() => {
    loadFaceTypes();
  }, []);

  const loadFaceTypes = async () => {
    try {
      const response = await stylesAPI.getFaceTypes();
      setFaceTypes(response.data.faceTypes || response.data || []);
    } catch (err) {
      console.error('Error loading face types:', err);
      setFaceTypes([]);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setError('');
  };

  const handleNext = () => {
    if (step === 1 && !formData.faceShape) {
      setError('Molimo odaberite oblik lica');
      return;
    }
    if (step === 2 && !formData.lifestyle) {
      setError('Molimo odaberite stil života');
      return;
    }
    if (step === 3 && !formData.maintenancePreference) {
      setError('Molimo odaberite nivo održavanja');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.ageRange) {
      setError('Molimo odaberite starosnu grupu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get recommendations
      const response = await stylesAPI.getRecommendations(formData);
      const recommendations = response.data;

      // Save questionnaire if authenticated
      if (isAuthenticated) {
        await userAPI.submitQuestionnaire(formData);
      }

      // Navigate to results with recommendations
      navigate('/preview', {
        state: {
          recommendations,
          questionnaire: formData
        }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri obradi upitnika');
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Oblik vašeg lica</h2>
        <p className="text-gray-600">Izaberite oblik koji najbolje odgovara vašem licu</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {faceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleChange('faceShape', type.name)}
            className={`p-6 rounded-xl border-2 transition-all text-center hover:shadow-lg ${
              formData.faceShape === type.name
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-4xl mb-2">👤</div>
            <div className="font-semibold text-gray-900">{type.name}</div>
            <div className="text-sm text-gray-600 mt-1">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vaš stil života</h2>
        <p className="text-gray-600">Kako provodite većinu svog vremena?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { value: 'corporate', label: 'Korporativno', icon: '💼', desc: 'Poslovno okruženje, sastanci' },
          { value: 'casual', label: 'Casual', icon: '👔', desc: 'Opušteno, svakodnevno' },
          { value: 'creative', label: 'Kreativno', icon: '🎨', desc: 'Artistički, slobodno izražavanje' },
          { value: 'outdoor', label: 'Na otvorenom', icon: '🏕️', desc: 'Aktivnosti u prirodi, sport' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange('lifestyle', option.value)}
            className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
              formData.lifestyle === option.value
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{option.icon}</div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nivo održavanja</h2>
        <p className="text-gray-600">Koliko vremena želite posvetiti održavanju brade?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { value: 'low', label: 'Nisko', icon: '⚡', desc: 'Minimalno održavanje, prirodan izgled' },
          { value: 'medium', label: 'Srednje', icon: '⭐', desc: 'Redovno trimovanje i njega' },
          { value: 'high', label: 'Visoko', icon: '💎', desc: 'Detaljno održavanje, preciznost' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange('maintenancePreference', option.value)}
            className={`p-6 rounded-xl border-2 transition-all text-center hover:shadow-lg ${
              formData.maintenancePreference === option.value
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-4xl mb-2">{option.icon}</div>
            <div className="font-semibold text-gray-900 text-lg">{option.label}</div>
            <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Starosna grupa</h2>
        <p className="text-gray-600">Izaberite vašu starosnu grupu</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '18-25', label: '18-25', icon: '🧑' },
          { value: '26-35', label: '26-35', icon: '👨' },
          { value: '36-45', label: '36-45', icon: '👨‍💼' },
          { value: '46+', label: '46+', icon: '👴' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange('ageRange', option.value)}
            className={`p-6 rounded-xl border-2 transition-all text-center hover:shadow-lg ${
              formData.ageRange === option.value
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-4xl mb-2">{option.icon}</div>
            <div className="font-semibold text-gray-900 text-lg">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Korak {step} od 4</span>
            <span className="text-sm font-medium text-gray-700">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Steps */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Nazad
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Sledeće
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`ml-auto px-6 py-3 rounded-lg font-semibold transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loading ? 'Obrada...' : 'Pronađi stilove'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;
