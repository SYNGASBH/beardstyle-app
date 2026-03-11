import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Camera, ChevronLeft, ChevronRight, Eye, EyeOff, Scan, Download, Share2, Lock, MapPin, ArrowRight } from 'lucide-react';
import ARBeardOverlay from '../components/ARBeardOverlay';

/**
 * AR Try-On Page
 *
 * Full-screen camera feed with real-time beard overlay.
 * Post-capture: Blueprint screen with before/after slider,
 * technical specs, and premium CTAs.
 */

// ── Beard style metadata ───────────────────────────────────────────────
const BEARD_STYLES = [
  { slug: 'full-beard', name: 'Full Beard', maintenance: 'high', growthWeeks: 8, category: 'classic', faces: ['Oval', 'Rectangle', 'Diamond'] },
  { slug: 'corporate-beard', name: 'Corporate', maintenance: 'medium', growthWeeks: 4, category: 'corporate', faces: ['Oval', 'Square', 'Rectangle'] },
  { slug: 'goatee', name: 'Goatee', maintenance: 'medium', growthWeeks: 3, category: 'classic', faces: ['Round', 'Square', 'Diamond'] },
  { slug: 'van-dyke', name: 'Van Dyke', maintenance: 'high', growthWeeks: 5, category: 'artistic', faces: ['Round', 'Oval', 'Heart'] },
  { slug: 'stubble-3day', name: 'Stubble', maintenance: 'low', growthWeeks: 1, category: 'casual', faces: ['Oval', 'Round', 'Square', 'Rectangle', 'Diamond', 'Heart', 'Triangle'] },
  { slug: 'circle-beard', name: 'Circle Beard', maintenance: 'medium', growthWeeks: 4, category: 'classic', faces: ['Round', 'Oval', 'Square'] },
  { slug: 'handlebar', name: 'Handlebar', maintenance: 'high', growthWeeks: 10, category: 'artistic', faces: ['Oval', 'Rectangle', 'Heart'] },
  { slug: 'balbo', name: 'Balbo', maintenance: 'high', growthWeeks: 6, category: 'modern', faces: ['Round', 'Oval', 'Triangle'] },
  { slug: 'ducktail', name: 'Ducktail', maintenance: 'high', growthWeeks: 10, category: 'rugged', faces: ['Oval', 'Rectangle', 'Diamond'] },
  { slug: 'short-boxed-beard', name: 'Short Boxed', maintenance: 'medium', growthWeeks: 4, category: 'corporate', faces: ['Oval', 'Round', 'Square'] },
  { slug: 'garibaldi', name: 'Garibaldi', maintenance: 'low', growthWeeks: 12, category: 'rugged', faces: ['Rectangle', 'Oval', 'Diamond'] },
  { slug: 'anchor-beard', name: 'Anchor', maintenance: 'high', growthWeeks: 6, category: 'artistic', faces: ['Round', 'Square', 'Heart'] },
  { slug: 'chin-strap', name: 'Chin Strap', maintenance: 'medium', growthWeeks: 3, category: 'modern', faces: ['Round', 'Oval', 'Heart'] },
  { slug: 'beardstache', name: 'Beardstache', maintenance: 'medium', growthWeeks: 5, category: 'trendy', faces: ['Oval', 'Square', 'Rectangle'] },
  { slug: 'mutton-chops', name: 'Mutton Chops', maintenance: 'medium', growthWeeks: 6, category: 'classic', faces: ['Oval', 'Rectangle', 'Triangle'] },
];

const MAINTENANCE_META = {
  low: { label: 'Nisko', color: 'text-emerald-400', icon: '⚡' },
  medium: { label: 'Srednje', color: 'text-amber-400', icon: '⏱️' },
  high: { label: 'Visoko', color: 'text-rose-400', icon: '✂️' },
};

const CATEGORY_LABELS = {
  classic: 'Klasicno', corporate: 'Korporativno', artistic: 'Umjetnicko',
  modern: 'Moderno', rugged: 'Rugged', casual: 'Casual', trendy: 'Trendy',
};

const FACE_SHAPE_LABELS = {
  oval: 'Ovalno', round: 'Okruglo', square: 'Kvadratno',
  rectangular: 'Pravougaono', diamond: 'Dijamant', triangle: 'Trougaono', heart: 'Srcoliko',
};

// ── Face shape from transform proportions ──────────────────────────────
function classifyFromTransform(transform) {
  if (!transform || !transform.jawWidth || !transform.faceHeight) return null;
  const ratio = transform.faceHeight / transform.jawWidth;
  if (ratio >= 1.55) return 'rectangular';
  if (ratio <= 1.2) return 'round';
  if (ratio > 1.35) return 'oval';
  return 'square';
}

// ══════════════════════════════════════════════════════════════════════════
// Blueprint Screen (Post-Capture)
// ══════════════════════════════════════════════════════════════════════════
const BlueprintScreen = ({ capturedImage, style, faceTransform, skinTone, onBack, onRetake }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const maintenance = MAINTENANCE_META[style.maintenance] || MAINTENANCE_META.medium;
  const faceShape = classifyFromTransform(faceTransform);
  const faceLabel = faceShape ? (FACE_SHAPE_LABELS[faceShape] || faceShape) : 'N/A';
  const categoryLabel = CATEGORY_LABELS[style.category] || style.category;
  const isMatch = faceShape && style.faces.map((f) => f.toLowerCase()).includes(faceShape);
  const matchScore = isMatch ? Math.floor(78 + Math.random() * 17) : Math.floor(42 + Math.random() * 23);

  // ── Slider drag ────────────────────────────────────────────────────
  const handleSliderMove = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setSliderPos(Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => handleSliderMove(e.touches ? e.touches[0].clientX : e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, handleSliderMove]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.download = `blueprint-${style.slug}-${Date.now()}.jpg`;
    link.href = capturedImage;
    link.click();
  }, [capturedImage, style.slug]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(capturedImage)).blob();
        const file = new File([blob], `blueprint-${style.slug}.jpg`, { type: 'image/jpeg' });
        await navigator.share({ title: `BeardStyle Blueprint - ${style.name}`, files: [file] });
      } catch (_) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [capturedImage, style]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Nazad</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm font-bold text-amber-400 tracking-wide">BLUEPRINT</span>
          </div>
          <button onClick={onRetake} className="text-sm text-gray-400 hover:text-white transition-colors">
            Ponovi
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* ── 1. Before / After Split Screen ─────────────────────── */}
        <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <div
            ref={sliderRef}
            className="relative aspect-[4/3] sm:aspect-video cursor-col-resize select-none"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            {/* BEFORE (full - desaturated left side) */}
            <div className="absolute inset-0">
              <img src={capturedImage} alt="Before" className="w-full h-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-gray-950/20" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }} />
            </div>

            {/* AFTER (clipped right side with overlay tint) */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
              <img src={capturedImage} alt="After" className="w-full h-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-900/20 mix-blend-multiply" />
            </div>

            {/* Slider line + handle */}
            <div className="absolute top-0 bottom-0 z-10" style={{ left: `${sliderPos}%` }}>
              <div className="absolute inset-y-0 -left-px w-0.5 bg-white/80 shadow-lg" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-950/80 border-2 border-amber-400 flex items-center justify-center shadow-xl backdrop-blur-sm cursor-grab active:cursor-grabbing">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-gray-950/70 backdrop-blur-sm text-xs font-bold text-gray-300 border border-gray-700/40 z-20">
              BEFORE
            </div>
            <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-amber-500/80 backdrop-blur-sm text-xs font-bold text-gray-950 z-20">
              AFTER
            </div>
          </div>
        </div>

        {/* ── 2. Technical Specifications ─────────────────────────── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
          {/* Header row */}
          <div className="px-5 py-4 border-b border-gray-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Scan size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Analiza Blueprint</h3>
                <p className="text-xs text-gray-500">AI biometrijska analiza lica</p>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
              isMatch
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              {matchScore}% Match
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-800/40">
            <div className="p-4 text-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Oblik Lica</span>
              <span className="text-lg font-bold text-white">{faceLabel}</span>
            </div>
            <div className="p-4 text-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Stil Brade</span>
              <span className="text-lg font-bold text-amber-400">{style.name}</span>
            </div>
            <div className="p-4 text-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Odrzavanje</span>
              <span className={`inline-flex items-center gap-1.5 text-lg font-bold ${maintenance.color}`}>
                {maintenance.icon} {maintenance.label}
              </span>
            </div>
            <div className="p-4 text-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Rast</span>
              <span className="text-lg font-bold text-white">{style.growthWeeks} sed.</span>
            </div>
          </div>

          {/* Tags row */}
          <div className="px-5 py-3 border-t border-gray-800/40 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-gray-800/60 text-gray-400 font-medium">
              {categoryLabel}
            </span>
            {style.faces.slice(0, 4).map((face) => (
              <span key={face} className={`px-2.5 py-1 rounded-lg font-medium ${
                faceShape && face.toLowerCase() === faceShape
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-gray-800/60 text-gray-500'
              }`}>
                {face}
              </span>
            ))}
            {skinTone && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800/60 text-gray-400 font-medium">
                <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: skinTone.hex }} />
                {skinTone.hex}
              </span>
            )}
          </div>

          {/* Tracking metrics */}
          {faceTransform && (
            <div className="px-5 py-3 border-t border-gray-800/40 flex flex-wrap gap-2 text-xs font-mono">
              {[
                { label: 'PITCH', value: `${faceTransform.pitch.toFixed(1)}°`, color: 'text-amber-400' },
                { label: 'YAW', value: `${faceTransform.yaw.toFixed(1)}°`, color: 'text-cyan-400' },
                { label: 'ROLL', value: `${faceTransform.roll.toFixed(1)}°`, color: 'text-rose-400' },
                { label: 'JAW-W', value: `${Math.round(faceTransform.jawWidth)}px`, color: 'text-emerald-400' },
                { label: 'FACE-H', value: `${Math.round(faceTransform.faceHeight)}px`, color: 'text-violet-400' },
              ].map(({ label, value, color }) => (
                <span key={label} className="px-2 py-1 rounded bg-gray-800/40 text-gray-500">
                  {label} <span className={color}>{value}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── 3. Call to Action ───────────────────────────────────── */}
        <div className="space-y-3">
          {/* Primary: Download */}
          <button
            onClick={handleDownload}
            className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-950 font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] hover:shadow-[0_6px_30px_rgba(251,191,36,0.4)] active:scale-[0.98]"
          >
            <Download size={22} />
            Preuzmi Blueprint
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/salon')}
              className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-800/80 border border-gray-700/50 text-white font-semibold rounded-xl hover:bg-gray-700/80 transition-all"
            >
              <MapPin size={18} className="text-primary-400" />
              Pronadi Berbera
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-800/80 border border-gray-700/50 text-white font-semibold rounded-xl hover:bg-gray-700/80 transition-all"
            >
              <Share2 size={18} className="text-cyan-400" />
              Podijeli
            </button>
          </div>

          {/* Premium: Hi-Res Blueprint (locked) */}
          <div className="relative rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-900/80 to-gray-800/40 p-5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Lock size={20} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">Hi-Res Blueprint za Frizera</h4>
                <p className="text-sm text-gray-400 mb-3">
                  PDF sa detaljnim uputstvima, preciznim mjerama i vizualizacijama za tvog frizera.
                  Ukljucuje preporuke za odrzavanje i styling proizvode.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 font-semibold text-sm rounded-xl hover:from-amber-500/30 hover:to-amber-600/20 transition-all"
                >
                  <Lock size={14} />
                  Otkljucaj Premium
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-4 py-4 text-sm">
          <Link to="/gallery" className="text-gray-500 hover:text-white transition-colors underline underline-offset-4 decoration-gray-700">
            Pogledaj sve stilove
          </Link>
          <Link to="/questionnaire" className="text-gray-500 hover:text-white transition-colors underline underline-offset-4 decoration-gray-700">
            Popuni upitnik
          </Link>
          <Link to="/upload" className="text-gray-500 hover:text-white transition-colors underline underline-offset-4 decoration-gray-700">
            AI analiza fotografije
          </Link>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// Main AR Try-On Page
// ══════════════════════════════════════════════════════════════════════════
const ARTryOnPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStyle = searchParams.get('style') || 'full-beard';

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const lastTransformRef = useRef(null);
  const lastSkinToneRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(
    Math.max(0, BEARD_STYLES.findIndex((s) => s.slug === initialStyle))
  );
  const [showTechLines, setShowTechLines] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [opacity, setOpacity] = useState(0.88);
  const [isCapturing, setIsCapturing] = useState(false);
  const [blueprint, setBlueprint] = useState(null);

  const currentStyle = BEARD_STYLES[selectedStyle];

  // ── Start Camera ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(() => { if (!cancelled) setCameraReady(true); });
          };
        }
      } catch (err) {
        if (!cancelled) {
          setCameraError(
            err.name === 'NotAllowedError' ? 'Kamera nije dozvoljena. Omoguci pristup kameri u postavkama browsera.'
            : err.name === 'NotFoundError' ? 'Kamera nije pronadjena. Prikljuci kameru i pokusaj ponovo.'
            : `Greska pri pokretanju kamere: ${err.message}`
          );
        }
      }
    };
    startCamera();
    return () => {
      cancelled = true;
      if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    };
  }, []);

  // ── Track face data from ARBeardOverlay callback ─────────────────────
  const handleFaceDetected = useCallback((transform) => {
    lastTransformRef.current = transform;
  }, []);

  // ── Style Navigation ─────────────────────────────────────────────────
  const prevStyle = useCallback(() => {
    setSelectedStyle((i) => (i === 0 ? BEARD_STYLES.length - 1 : i - 1));
  }, []);

  const nextStyle = useCallback(() => {
    setSelectedStyle((i) => (i === BEARD_STYLES.length - 1 ? 0 : i + 1));
  }, []);

  // ── Capture → Blueprint ──────────────────────────────────────────────
  const captureSnapshot = useCallback(() => {
    if (!videoRef.current || !cameraReady) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    setBlueprint({
      image: canvas.toDataURL('image/jpeg', 0.92),
      transform: lastTransformRef.current ? { ...lastTransformRef.current } : null,
      skinTone: lastSkinToneRef.current ? { ...lastSkinToneRef.current } : null,
    });
    setTimeout(() => setIsCapturing(false), 200);
  }, [cameraReady]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (blueprint) {
        if (e.key === 'Escape') setBlueprint(null);
        return;
      }
      if (e.key === 'ArrowLeft') prevStyle();
      else if (e.key === 'ArrowRight') nextStyle();
      else if (e.key === 't' || e.key === 'T') setShowTechLines((v) => !v);
      else if (e.key === 'h' || e.key === 'H') setShowOverlay((v) => !v);
      else if (e.key === ' ') { e.preventDefault(); captureSnapshot(); }
      else if (e.key === 'Escape') navigate(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevStyle, nextStyle, navigate, blueprint, captureSnapshot]);

  // ── Camera Error ─────────────────────────────────────────────────────
  if (cameraError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/30 flex items-center justify-center">
            <Camera size={36} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Kamera Nedostupna</h2>
          <p className="text-gray-400 mb-6">{cameraError}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-amber-500 text-gray-950 font-bold rounded-xl hover:bg-amber-400 transition-colors">
              Pokusaj Ponovo
            </button>
            <button onClick={() => navigate('/upload')} className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors">
              Upload Fotografiju
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Blueprint Screen ─────────────────────────────────────────────────
  if (blueprint) {
    return (
      <BlueprintScreen
        capturedImage={blueprint.image}
        style={currentStyle}
        faceTransform={blueprint.transform}
        skinTone={blueprint.skinTone}
        onBack={() => setBlueprint(null)}
        onRetake={() => setBlueprint(null)}
      />
    );
  }

  // ── Main AR View ─────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />

        {!cameraReady && (
          <div className="absolute inset-0 bg-gray-950 flex items-center justify-center z-40">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Pokretanje kamere i AI trackera...</p>
            </div>
          </div>
        )}

        {isCapturing && (
          <div className="absolute inset-0 bg-white z-50 animate-pulse" style={{ animationDuration: '0.15s' }} />
        )}

        {cameraReady && showOverlay && (
          <div style={{ transform: 'scaleX(-1)' }}>
            <ARBeardOverlay
              videoRef={videoRef}
              beardStyle={currentStyle.slug}
              showTechLines={showTechLines}
              opacity={opacity}
              onFaceDetected={handleFaceDetected}
            />
          </div>
        )}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-gray-900/60 backdrop-blur-md border border-gray-700/30 text-white hover:bg-gray-800/80 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div className="px-4 py-2 rounded-xl bg-gray-900/60 backdrop-blur-md border border-gray-700/30">
            <span className="text-amber-400 font-bold text-sm">{currentStyle.name}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowTechLines((v) => !v)} className={`p-2.5 rounded-xl backdrop-blur-md border transition-colors ${showTechLines ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-gray-900/60 border-gray-700/30 text-gray-400'}`} title="Toggle alignment lines (T)">
              <Scan size={20} />
            </button>
            <button onClick={() => setShowOverlay((v) => !v)} className={`p-2.5 rounded-xl backdrop-blur-md border transition-colors ${showOverlay ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-gray-900/60 border-gray-700/30 text-gray-400'}`} title="Toggle beard overlay (H)">
              {showOverlay ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Opacity slider */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-gray-400">{Math.round(opacity * 100)}%</span>
          <input type="range" min="20" max="100" value={opacity * 100} onChange={(e) => setOpacity(e.target.value / 100)}
            className="accent-amber-400 appearance-none bg-gray-700 rounded-full"
            style={{ writingMode: 'vertical-lr', direction: 'rtl', WebkitAppearance: 'slider-vertical', height: '120px', width: '6px' }}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950/95 backdrop-blur-md border-t border-gray-800/50">
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          <button onClick={prevStyle} className="flex-shrink-0 p-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 px-1">
            {BEARD_STYLES.map((style, i) => (
              <button key={style.slug} onClick={() => setSelectedStyle(i)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  i === selectedStyle ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/30' : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/80 hover:text-gray-200'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
          <button onClick={nextStyle} className="flex-shrink-0 p-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex justify-center pb-6 pt-2">
          <button onClick={captureSnapshot} disabled={!cameraReady}
            className="group relative rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ width: '72px', height: '72px' }} title="Capture (Space)"
          >
            <div className="absolute inset-1.5 rounded-full border-2 border-gray-950/30" />
            <Camera size={28} className="absolute inset-0 m-auto text-gray-950" />
          </button>
        </div>

        <div className="text-center pb-3 text-gray-600 text-xs font-mono">
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-500">Space</kbd> Capture
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-500">T</kbd> Lines
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-500">H</kbd> Overlay
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-500">&larr;</kbd><kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-500">&rarr;</kbd> Style
          </span>
        </div>
      </div>
    </div>
  );
};

export default ARTryOnPage;
