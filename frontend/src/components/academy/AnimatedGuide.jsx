import React, { useState, useCallback, useEffect, useRef } from 'react';
import './AnimatedGuide.css';

// ─── Inline icons ─────────────────────────────────────────────────
const IconChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconCheck = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconInfo = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);
const IconPause = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);
const IconLock = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
);

// ─── SVG beard shape primitives ───────────────────────────────────
const BeardSVG = {
  full: (
    <g>
      <ellipse cx="80" cy="95" rx="55" ry="42" fill="#5a3825" />
      <ellipse cx="80" cy="85" rx="48" ry="35" fill="#6b4430" />
      <rect x="32" y="60" width="96" height="38" rx="8" fill="#6b4430" />
    </g>
  ),
  goatee: (
    <g>
      <ellipse cx="80" cy="105" rx="22" ry="28" fill="#5a3825" />
      <ellipse cx="80" cy="98" rx="18" ry="22" fill="#6b4430" />
      <rect x="65" y="68" width="30" height="8" rx="4" fill="#6b4430" />
    </g>
  ),
  'van-dyke': (
    <g>
      <ellipse cx="80" cy="108" rx="18" ry="24" fill="#5a3825" />
      <ellipse cx="80" cy="102" rx="14" ry="18" fill="#6b4430" />
      <rect x="50" y="62" width="60" height="6" rx="3" fill="#5a3825" />
      <ellipse cx="58" cy="65" rx="12" ry="4" fill="#6b4430" />
      <ellipse cx="102" cy="65" rx="12" ry="4" fill="#6b4430" />
    </g>
  ),
  stubble: (
    <g opacity="0.5">
      <ellipse cx="80" cy="95" rx="52" ry="38" fill="#555" />
      <rect x="28" y="62" width="104" height="36" rx="8" fill="#555" />
    </g>
  ),
  balbo: (
    <g>
      <ellipse cx="80" cy="105" rx="28" ry="25" fill="#5a3825" />
      <ellipse cx="80" cy="100" rx="24" ry="20" fill="#6b4430" />
      <rect x="55" y="62" width="50" height="6" rx="3" fill="#5a3825" />
    </g>
  ),
  'circle-beard': (
    <g>
      <ellipse cx="80" cy="98" rx="24" ry="26" fill="#5a3825" />
      <ellipse cx="80" cy="95" rx="20" ry="22" fill="#6b4430" />
      <circle cx="80" cy="88" r="18" fill="none" stroke="#5a3825" strokeWidth="6" />
    </g>
  ),
  'short-boxed': (
    <g>
      <rect x="38" y="72" width="84" height="38" rx="6" fill="#5a3825" />
      <rect x="42" y="75" width="76" height="32" rx="4" fill="#6b4430" />
    </g>
  ),
};

// ─── Face SVG (dark bg version) ───────────────────────────────────
const FaceSVG = ({ beardShape, highlight, razorActive }) => (
  <svg viewBox="0 0 160 160" className="ag-face-svg" aria-hidden="true">
    <ellipse cx="80" cy="72" rx="52" ry="60" fill="#e8c098" />
    <ellipse cx="28" cy="68" rx="8" ry="14" fill="#ddb488" />
    <ellipse cx="132" cy="68" rx="8" ry="14" fill="#ddb488" />
    <ellipse cx="62" cy="55" rx="6" ry="4" fill="#3a2a1a" />
    <ellipse cx="98" cy="55" rx="6" ry="4" fill="#3a2a1a" />
    <ellipse cx="80" cy="72" rx="6" ry="8" fill="#d4a878" />
    <path d="M68 82 Q80 90 92 82" stroke="#a07050" strokeWidth="2" fill="none" />

    {beardShape && BeardSVG[beardShape]}

    {highlight && (
      <rect
        x={highlight.x} y={highlight.y}
        width={highlight.w} height={highlight.h}
        rx="4" fill="none"
        stroke="#EF9F27" strokeWidth="2" strokeDasharray="4 2"
        opacity="0.8"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
      </rect>
    )}

    {razorActive && (
      <g>
        <rect x="130" y="40" width="6" height="28" rx="2" fill="#888" />
        <rect x="128" y="36" width="10" height="8" rx="2" fill="#666" />
        <line x1="133" y1="68" x2="110" y2="85" stroke="#EF9F27" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      </g>
    )}
  </svg>
);

// ─── Guide data ───────────────────────────────────────────────────
const GUIDES = {
  'full-beard': {
    id: 'full-beard',
    title: 'Full Beard',
    subtitle: 'Klasična puna brada',
    difficulty: 'Srednje',
    duration: '10–15 min',
    tools: ['Trimer', 'Makaze', 'Ulje za bradu', 'Četka'],
    steps: [
      { id: 1, label: 'Definiši liniju vrata', instruction: 'Zamislite liniju od uha do uha koja prolazi 2 prsta iznad Adamove jabučice. Sve ispod obrijte.', tip: 'Koristite dva prsta iznad Adamove jabučice kao mjerilo za prirodnu liniju vrata.', beardShape: 'full', razorActive: true, highlight: { x: 30, y: 100, w: 100, h: 20 } },
      { id: 2, label: 'Definiši liniju obraza', instruction: 'Prirodna linija od jagodične kosti do ugla usana. Obrijte sve iznad te linije.', tip: 'Neka linija bude prirodna — previše ravna linija izgleda neprirodno.', beardShape: 'full', razorActive: true, highlight: { x: 30, y: 55, w: 100, h: 18 } },
      { id: 3, label: 'Ujednači dužinu', instruction: 'Trimerom na 12-15mm prođite cijelu bradu u smjeru rasta dlake.', tip: 'Uvijek počnite s dužim nastavkom — skratiti možete, vratiti ne.', beardShape: 'full', razorActive: false, highlight: null },
      { id: 4, label: 'Oblikuj i njega', instruction: 'Četkom oblikujte bradu. Nanesite ulje za bradu i ravnomjerno rasporedite.', tip: 'Ulje nanosite na vlažnu bradu za bolje upijanje. 3-4 kapi je dovoljno.', beardShape: 'full', razorActive: false, highlight: null },
    ],
  },
  goatee: {
    id: 'goatee',
    title: 'Goatee',
    subtitle: 'Kozja bradica — preciznost je ključ',
    difficulty: 'Srednje',
    duration: '8–10 min',
    tools: ['Trimer', 'Brijač', 'Pjena za brijanje'],
    steps: [
      { id: 1, label: 'Definiši oblik', instruction: 'Zamislite krug oko usta i brade. To je zona goateeja — sve van toga mora biti obrijano.', tip: 'Koristite ugao usana kao referentnu tačku za širinu.', beardShape: 'goatee', razorActive: false, highlight: { x: 55, y: 75, w: 50, h: 55 } },
      { id: 2, label: 'Obrij obraze', instruction: 'Brijačem čisto obrijte obraze. Pažljivo oko ivica goateeja.', tip: 'Brijte u smjeru rasta dlake da izbjegnete iritaciju.', beardShape: 'goatee', razorActive: true, highlight: { x: 28, y: 60, w: 30, h: 40 } },
      { id: 3, label: 'Trimuj na dužinu', instruction: 'Trimerom na 6-8mm ujednačite dužinu goateeja.', tip: 'Duži goatee daje ozbiljniji izgled, kraći je moderniji.', beardShape: 'goatee', razorActive: false, highlight: null },
      { id: 4, label: 'Oštri ivice', instruction: 'Brijačem precizno definišite ivice goateeja za čist završetak.', tip: 'Malo zaobljene ivice izgledaju prirodnije od oštrih geometrijskih.', beardShape: 'goatee', razorActive: true, highlight: { x: 58, y: 90, w: 44, h: 30 } },
    ],
  },
  'van-dyke': {
    id: 'van-dyke',
    title: 'Van Dyke',
    subtitle: 'Odvojeni brkovi i bradica',
    difficulty: 'Napredno',
    duration: '12–15 min',
    tools: ['Trimer', 'Brijač', 'Precizni trimer', 'Pjena'],
    steps: [
      { id: 1, label: 'Obrij obraze i vrat', instruction: 'Čisto obrijte obraze, zaliske i vrat. Ostavite samo brkove i bradicu.', tip: 'Koristite pjenu i brijte u smjeru rasta za glatki rezultat.', beardShape: 'van-dyke', razorActive: true, highlight: { x: 28, y: 55, w: 30, h: 45 } },
      { id: 2, label: 'Oblikuj brkove', instruction: 'Preciznim trimerom definišite donji rub brkova. Brkovi moraju biti odvojeni od bradice.', tip: 'Razmak od 3-5mm između brkova i bradice je idealan za Van Dyke.', beardShape: 'van-dyke', razorActive: false, highlight: { x: 50, y: 58, w: 60, h: 14 } },
      { id: 3, label: 'Definiši bradicu', instruction: 'Oblikujte bradicu u blagi šiljak. Širina ne prelazi uglove usana.', tip: 'Bradica se sužava prema dnu — razmislite o obrnutom trokutu.', beardShape: 'van-dyke', razorActive: true, highlight: { x: 60, y: 85, w: 40, h: 40 } },
      { id: 4, label: 'Završno dotjerivanje', instruction: 'Trimerom ujednačite dužinu. Makazama uklonite odbjeglu dlaku.', tip: 'Svakodnevno podrezivanje ivica održava Van Dyke urednim.', beardShape: 'van-dyke', razorActive: false, highlight: null },
    ],
  },
};

// ─── Difficulty class helper ──────────────────────────────────────
const diffClass = (d) => {
  if (d === 'Početnik') return 'ag-difficulty ag-diff-easy';
  if (d === 'Napredno') return 'ag-difficulty ag-diff-hard';
  return 'ag-difficulty ag-diff-medium';
};

// ─── AnimatedGuide Component ──────────────────────────────────────
const AnimatedGuide = ({
  guideId = 'goatee',
  isPremium = false,
  onUpgrade,
  className = '',
}) => {
  const guide = GUIDES[guideId] || GUIDES.goatee;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [animKey, setAnimKey] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(null);

  const step = guide.steps[currentStep];
  const totalSteps = guide.steps.length;
  const completedCount = Object.keys(completedSteps).length;
  const progress = (completedCount / totalSteps) * 100;

  const isLocked = !isPremium && currentStep >= 2;

  // Auto-play
  useEffect(() => {
    if (!autoPlay) { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= totalSteps || (!isPremium && next >= 2)) {
          setAutoPlay(false);
          return prev;
        }
        setCompletedSteps(p => ({ ...p, [prev]: true }));
        setAnimKey(k => k + 1);
        return next;
      });
    }, 4000);
    return () => clearInterval(autoRef.current);
  }, [autoPlay, totalSteps, isPremium]);

  const goToStep = useCallback((idx) => {
    if (!isPremium && idx >= 2) return;
    setCurrentStep(idx);
    setAnimKey(k => k + 1);
    setAutoPlay(false);
  }, [isPremium]);

  const nextStep = useCallback(() => {
    setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
    if (currentStep < totalSteps - 1) {
      const next = currentStep + 1;
      if (!isPremium && next >= 2) return;
      setCurrentStep(next);
      setAnimKey(k => k + 1);
    }
  }, [currentStep, totalSteps, isPremium]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnimKey(k => k + 1);
    }
  }, [currentStep]);

  const toggleMark = useCallback(() => {
    setCompletedSteps(prev => {
      const copy = { ...prev };
      if (copy[currentStep]) delete copy[currentStep];
      else copy[currentStep] = true;
      return copy;
    });
  }, [currentStep]);

  return (
    <div className={`ag-root ${className}`}>
      {/* Header */}
      <div className="ag-header">
        <div className="ag-header-left">
          <h3 className="ag-title">{guide.title}</h3>
          <p className="ag-subtitle">{guide.subtitle}</p>
        </div>
        <div className="ag-header-right">
          <span className={diffClass(guide.difficulty)}>{guide.difficulty}</span>
          <span className="ag-duration">{guide.duration}</span>
        </div>
      </div>

      {/* Tools */}
      <div className="ag-tools">
        {guide.tools.map(tool => (
          <span key={tool} className="ag-tool-chip">{tool}</span>
        ))}
      </div>

      {/* Stage */}
      <div className="ag-stage">
        {/* Step overlay */}
        <div className="ag-step-overlay">
          <span className="ag-step-counter">Korak {currentStep + 1}/{totalSteps}</span>
          <span className="ag-step-name">{step.label}</span>
        </div>

        {/* Face SVG */}
        {isLocked ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)' }}>
            <IconLock size={28} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Premium</span>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                style={{ marginTop: 4, padding: '6px 14px', background: '#EF9F27', color: '#412402', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
              >
                Nadogradi
              </button>
            )}
          </div>
        ) : (
          <div key={animKey} className="ag-face-animated">
            <FaceSVG
              beardShape={step.beardShape}
              highlight={step.highlight}
              razorActive={step.razorActive}
            />
          </div>
        )}

        {/* Dots */}
        <div className="ag-dots">
          {guide.steps.map((s, idx) => {
            const locked = !isPremium && idx >= 2;
            let cls = 'ag-dot';
            if (idx === currentStep) cls += ' ag-dot-active';
            else if (completedSteps[idx]) cls += ' ag-dot-done';
            return (
              <button
                key={s.id}
                className={cls}
                onClick={() => !locked && goToStep(idx)}
                disabled={locked}
                aria-label={`Korak ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Controls */}
        <div className="ag-controls">
          <button
            className="ag-ctrl-btn"
            onClick={prevStep}
            disabled={currentStep === 0}
            aria-label="Prethodni korak"
          >
            <IconChevronLeft />
          </button>
          <button
            className={`ag-ctrl-btn ag-ctrl-play ${autoPlay ? 'ag-playing' : ''}`}
            onClick={() => setAutoPlay(p => !p)}
            aria-label={autoPlay ? 'Pauziraj' : 'Pusti automatski'}
          >
            {autoPlay ? <IconPause /> : <IconPlay />}
          </button>
          <button
            className="ag-ctrl-btn"
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1 || (!isPremium && currentStep + 1 >= 2)}
            aria-label="Sljedeći korak"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* Instruction */}
      {!isLocked && (
        <div className="ag-instruction" key={`instr-${animKey}`}>
          <div className="ag-instruction-enter">
            <p className="ag-instruction-text">{step.instruction}</p>
            {step.tip && (
              <div className="ag-tip">
                <span className="ag-tip-icon"><IconInfo /></span>
                <span>{step.tip}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="ag-footer">
        <div className="ag-progress-wrap">
          <div className="ag-progress-bar">
            <div className="ag-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="ag-progress-label">{completedCount}/{totalSteps} koraka</span>
        </div>
        {!isLocked && (
          <button
            className={`ag-mark-btn ${completedSteps[currentStep] ? 'ag-mark-done' : ''}`}
            onClick={toggleMark}
          >
            <IconCheck size={11} />
            {completedSteps[currentStep] ? 'Gotovo' : 'Označi'}
          </button>
        )}
      </div>
    </div>
  );
};

export { GUIDES };
export default AnimatedGuide;
