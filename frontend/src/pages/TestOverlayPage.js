import React, { useState } from 'react';
import BeardStylePreview from '../components/BeardStylePreview';
import { hasRealSketch, getAvailableSketches } from '../components/SketchOverlay';

/**
 * Test Page - Preview beard overlays WITHOUT using AI credits
 * This allows testing the overlay system before spending money
 * Now supports both SVG overlays and Midjourney-generated AI sketches
 */
const TestOverlayPage = () => {
  const [testImage, setTestImage] = useState(null);
  const [selectedBeardStyle, setSelectedBeardStyle] = useState('full-beard');
  const [showPreview, setShowPreview] = useState(false);

  // Available beard styles - mark which have AI sketches
  const beardStyles = [
    { key: 'full-beard', name: 'Full Beard', emoji: '🧔' },
    { key: 'stubble', name: 'Stubble', emoji: '✨' },
    { key: 'van-dyke', name: 'Van Dyke', emoji: '🎩' },
    { key: 'clean-shaven', name: 'Clean Shaven', emoji: '😊' },
    { key: 'short-boxed-beard', name: 'Short Boxed', emoji: '📦' },
    { key: 'corporate-beard', name: 'Corporate', emoji: '💼' },
    { key: 'goatee', name: 'Goatee', emoji: '🎯' },
    { key: 'balbo', name: 'Balbo', emoji: '⚓' },
    { key: 'circle-beard', name: 'Circle Beard', emoji: '⭕' },
    { key: 'ducktail', name: 'Ducktail', emoji: '🦆' },
    { key: 'garibaldi', name: 'Garibaldi', emoji: '🦁' },
    { key: 'mutton-chops', name: 'Mutton Chops', emoji: '🥩' },
    { key: 'anchor-beard', name: 'Anchor Beard', emoji: '⚓' },
    { key: 'chin-strap', name: 'Chin Strap', emoji: '➖' },
    { key: 'beardstache', name: 'Beardstache', emoji: '👨' },
    { key: 'handlebar', name: 'Handlebar', emoji: '🎭' }
  ];

  // Count available AI sketches
  const availableSketchCount = getAvailableSketches().length;

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestImage(e.target.result);
        setShowPreview(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use existing uploaded image
  const useExistingImage = () => {
    // Latest upload from backend
    setTestImage('http://localhost:5000/uploads/user-3-1767894711525-300722842.jpg');
    setShowPreview(false);
  };

  const handleTryStyle = (styleKey) => {
    setSelectedBeardStyle(styleKey);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧪 Test Beard Overlay System
          </h1>
          <p className="text-gray-600">
            Test how beard overlays work WITHOUT spending AI credits!
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              No AI credits used
            </span>
            <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
              {availableSketchCount} AI Sketches available
            </span>
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              Instant preview
            </span>
          </div>
        </div>

        {/* Image Upload Section */}
        {!testImage && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Upload Your Image
            </h2>
            <div className="space-y-4">
              {/* File Upload */}
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-gray-600 font-semibold">
                    Click to upload your image
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG, or WebP (Max 5MB)
                  </p>
                </div>
              </label>

              {/* Or use existing */}
              <div className="text-center">
                <p className="text-gray-500 mb-2">— OR —</p>
                <button
                  onClick={useExistingImage}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Use Last Uploaded Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Style Selection */}
        {testImage && !showPreview && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Select Beard Style to Test
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {beardStyles.map((style) => {
                const hasAISketch = hasRealSketch(style.key);
                return (
                  <button
                    key={style.key}
                    onClick={() => handleTryStyle(style.key)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      selectedBeardStyle === style.key
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 bg-white'
                    }`}
                  >
                    {/* AI Sketch Badge */}
                    {hasAISketch && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                        AI
                      </div>
                    )}
                    <div className="text-4xl mb-2">{style.emoji}</div>
                    <div className="font-semibold text-sm text-gray-900">
                      {style.name}
                    </div>
                    {hasAISketch && (
                      <div className="text-xs text-purple-600 mt-1">
                        Midjourney sketch
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Preview current selection */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={testImage}
                    alt="Your upload"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Your Image</p>
                    <p className="text-sm font-semibold text-gray-900">Ready to preview</p>
                  </div>
                </div>
                <button
                  onClick={() => setTestImage(null)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && testImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-5xl bg-white rounded-xl p-8">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 z-50 bg-gray-100 hover:bg-gray-200 rounded-full p-3 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <BeardStylePreview
                userImage={testImage}
                beardStyle={selectedBeardStyle}
                styleName={beardStyles.find(s => s.key === selectedBeardStyle)?.name || 'Style'}
                showControls={true}
                onSave={(data) => {
                  console.log('Style selected:', data);
                  alert(`✅ Style saved! You can now download the image with "${data.styleName}" beard.`);
                  setShowPreview(false);
                }}
              />

              {/* Try different style button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg"
                >
                  ← Try Different Style
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">
            How This Works (No AI Credits Required):
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li><strong>AI Sketches</strong> - Midjourney-generated graphite pencil sketches with mix-blend-mode: multiply (white background becomes transparent)</li>
            <li><strong>SVG Overlays</strong> - Hand-crafted beard SVGs with customizable colors</li>
            <li><strong>Real-time Adjustments</strong> - Change opacity, size, position, and color instantly</li>
            <li><strong>Download Image</strong> - Get PNG with beard combined on your face</li>
            <li><strong>Zero AI Cost</strong> - This doesn't use Claude AI credits at all</li>
          </ul>
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-800 text-sm">
              <strong>Styles with AI badge</strong> have real Midjourney-generated sketches.
              Toggle between "AI Sketch" and "SVG" mode in the preview to compare!
            </p>
          </div>
        </div>

        {/* Overlay Modes Comparison */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-2">AI Sketch Mode</h4>
            <ul className="space-y-1 text-purple-800 text-sm">
              <li>Midjourney graphite sketches</li>
              <li>Realistic pencil texture</li>
              <li>mix-blend-mode: multiply</li>
              <li>Position & scale controls</li>
              <li>{availableSketchCount} styles available</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-2">SVG Overlay Mode</h4>
            <ul className="space-y-1 text-green-800 text-sm">
              <li>Hand-crafted SVG paths</li>
              <li>Stroke-only rendering</li>
              <li>Custom color selection</li>
              <li>Opacity & scale controls</li>
              <li>All {beardStyles.length} styles available</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h4 className="font-bold text-amber-900 mb-2">Full AI Analysis</h4>
            <ul className="space-y-1 text-amber-800 text-sm">
              <li>Auto face detection</li>
              <li>Perfect beard positioning</li>
              <li>Face shape analysis</li>
              <li>Personalized recommendations</li>
              <li>$0.03/analysis (via Upload page)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOverlayPage;
