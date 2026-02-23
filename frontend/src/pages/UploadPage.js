import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import useAuthStore from '../context/useAuthStore';

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/upload' } });
    }
  }, [isAuthenticated, navigate]);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Molimo odaberite sliku (JPG, PNG, itd.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Slika je prevelika. Maksimalna veličina je 10MB.');
      return;
    }

    setUploadedImage(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Handle click to upload
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setUseCamera(true);
      setError(null);
    } catch (err) {
      setError('Ne mogu pristupiti kameri. Provjerite dozvole.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        handleFileSelect(file);
        stopCamera();
      }, 'image/jpeg');
    }
  };

  // Upload to backend
  const handleUpload = async () => {
    if (!uploadedImage) {
      setError('Molimo odaberite sliku prvo.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);

      const response = await userAPI.uploadImage(formData);

      // Navigate to AI results page if AI analysis is available
      if (response.data.upload && response.data.upload.id) {
        navigate('/ai-results', {
          state: {
            uploadId: response.data.upload.id,
            imageUrl: response.data.upload.fileUrl,
            aiAnalysis: response.data.aiAnalysis
          }
        });
      } else {
        // Fallback to questionnaire if no AI analysis
        navigate('/questionnaire', {
          state: {
            uploadId: response.data.upload?.id,
            imageUrl: response.data.upload?.fileUrl
          }
        });
      }
    } catch (err) {
      setError('Greška pri uploadu slike. Pokušajte ponovo.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Clear selection
  const handleClear = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Upload Sliku Lica</h1>
      <p className="text-gray-600 mb-8">
        Uploadujte sliku ili koristite kameru za najbolje preporuke stilova brade
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!previewUrl && !useCamera && (
        <div className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <svg 
              className="mx-auto h-16 w-16 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            
            <p className="text-lg mb-2">
              {isDragging ? 'Ispustite sliku ovdje' : 'Kliknite ili prevucite sliku'}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG ili JPEG do 10MB
            </p>
          </div>

          {/* Camera Option */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Ili</p>
            <button
              onClick={startCamera}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Koristi Kameru
            </button>
          </div>
        </div>
      )}

      {/* Camera View */}
      {useCamera && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full"
              autoPlay
              playsInline
            />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={capturePhoto}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              📸 Uslikaj
            </button>
            <button
              onClick={stopCamera}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Otkaži
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploadujem...' : 'Nastavi ka Preporukama'}
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Obriši
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">💡 Savjeti za najbolje rezultate:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Koristite dobro osvijetljenu fotografiju</li>
          <li>✓ Gledajte direktno u kameru</li>
          <li>✓ Uklonite naočare ili maske</li>
          <li>✓ Izraz lica treba biti neutralan</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
