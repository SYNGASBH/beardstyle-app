import React, { useEffect, useRef, useState } from 'react';
import { createGuideGeometry } from './guideGeometry';
import StepAnimation from './StepAnimation';

// Detailed how-to per step: sub-steps, the most common mistake, and how to check the result.
const DETAILS = {
  "full-beard": [
    {
      "how": [
        "Pogledaj se iz profila i blago podigni bradu.",
        "Stavi dva prsta iznad Adamove jabučice — gornji prst je granica.",
        "Zamisli luk od ugla vilice ispod jednog uha, preko te tačke, do ugla vilice ispod drugog uha.",
        "Trimer bez nastavka vodi odozdo prema liniji, nikad preko nje."
      ],
      "mistake": "Linija previsoko na vilici: brada izgleda kao da „visi“, a lice djeluje punije.",
      "check": "Iz profila linija prati vilicu, a ispod nje nema dlaka."
    },
    {
      "how": [
        "Spoji donji rub zaliska i ugao usana zamišljenom linijom.",
        "Ukloni samo dlake koje strše iznad prirodne linije rasta.",
        "Trimer drži okomito, sječivom uz kožu, i radi kratke poteze odozgo prema dolje.",
        "Uradi jednu stranu, pa u ogledalu prenesi istu visinu na drugu."
      ],
      "mistake": "Prenisko spuštena linija obraza: brada izgleda rijetka, a lice duže.",
      "check": "Sprijeda su linije obraza na istoj visini s obje strane."
    },
    {
      "how": [
        "Iščešljaj bradu u smjeru rasta.",
        "Nastavak 15 mm (duži od željenog) i prođi cijelu bradu.",
        "Po potrebi 12 mm samo na obrazima; dio na bradi ostaje duži.",
        "Trimer vodi sporo, u smjeru rasta, s preklapanjem poteza."
      ],
      "mistake": "Odmah najkraći nastavak — skraćeno se ne može vratiti.",
      "check": "Kad prstima prođeš kroz bradu, nema „rupa“ ni stepenica."
    },
    {
      "how": [
        "Operi bradu i ručnikom je osuši da ostane blago vlažna.",
        "Utrljaj 3–4 kapi ulja među dlanovima i nanesi od korijena prema vrhovima.",
        "Četkom češljaj od obraza prema dolje i od brade prema naprijed.",
        "Makazama skrati samo pojedinačne dlake koje strše iz obrisa."
      ],
      "mistake": "Previše ulja: brada izgleda masno i lijepi se.",
      "check": "Brada je mekana, blago sjaji i drži oblik bez grudvica."
    }
  ],
  "goatee": [
    {
      "how": [
        "Iz uglova usana povuci zamišljene okomite linije prema dolje.",
        "Sve između tih linija, ispod donje usne, ostaje.",
        "Gornja granica je pregib ispod donje usne, donja prirodni rub brade.",
        "Obris označi laganim dodirom trimera bez nastavka, bez rezanja do kože."
      ],
      "mistake": "Bradica šira od usana: prelazi u bradu i gubi oblik.",
      "check": "Ivice prate uglove usana i iste su širine lijevo i desno."
    },
    {
      "how": [
        "Trimerom bez nastavka prvo skrati sve izvan zone.",
        "Nanesi pjenu ili gel na obraze, gornju usnu i vrat.",
        "Brij u smjeru rasta dlake, kratkim potezima, uz zategnutu kožu.",
        "Uz ivicu bradice brij sporo i ostavi milimetar rezerve."
      ],
      "mistake": "Brijanje uz samu ivicu u jednom potezu — lako se odsiječe dio bradice.",
      "check": "Koža oko bradice je glatka, a obris je netaknut."
    },
    {
      "how": [
        "Iščešljaj bradicu prema dolje.",
        "Nastavak 8 mm, a po želji zatim 6 mm.",
        "Trimer vodi od dna prema gore, suprotno rastu, za ujednačenu dužinu.",
        "Vrh možeš ostaviti 1–2 mm dužim za blago zaobljen oblik."
      ],
      "mistake": "Kraći nastavak na ivicama nego u sredini: oblik izgleda „ispran“.",
      "check": "Iz profila bradica ima ujednačenu debljinu."
    },
    {
      "how": [
        "Precizni trimer ili brijač vodi tačno po obrisu.",
        "Uglove blago zaobli.",
        "Provjeri u ogledalu sprijeda i odozdo.",
        "Završi hladnom vodom i balzamom poslije brijanja."
      ],
      "mistake": "Oštri geometrijski uglovi izgledaju vještački.",
      "check": "Lijeva i desna ivica su iste širine i visine."
    }
  ],
  "van-dyke": [
    {
      "how": [
        "Trimerom bez nastavka skrati obraze, zaliske i vrat.",
        "Ostavi brkove i centralnu bradicu do širine uglova usana.",
        "Nanesi pjenu i brij u smjeru rasta.",
        "Uz buduće ivice ostavi 2–3 mm rezerve."
      ],
      "mistake": "Brijanje odmah do konačne ivice — asimetriju je kasnije teško ispraviti.",
      "check": "Ostali su samo brkovi i bradica, s malom rezervom oko njih."
    },
    {
      "how": [
        "Iščešljaj brkove prema dolje.",
        "Preciznim trimerom definiši donji rub brkova uz liniju usne.",
        "U uglovima usana ukloni dlake tako da brkovi ne dodiruju bradicu.",
        "Razmak između brkova i bradice neka bude 3–5 mm."
      ],
      "mistake": "Brkovi spojeni s bradicom — to je kružna brada, ne Van Dyke.",
      "check": "S obje strane usta vidi se jasan i jednak razmak."
    },
    {
      "how": [
        "Iščešljaj bradicu prema dolje i naprijed.",
        "Sa strana trimeruj koso prema dnu, tako da se sužava.",
        "Vrh oblikuj makazama u blagi šiljak.",
        "Gore, ispod usne, širina ne prelazi uglove usana."
      ],
      "mistake": "Prevelik ili kriv šiljak — provjeri ga i iz profila.",
      "check": "Bradica je obrnuti trokut s vrhom tačno ispod sredine usana."
    },
    {
      "how": [
        "Stani ispred ogledala s glavom ravno.",
        "Zamisli okomitu liniju kroz nos i sredinu brade.",
        "Uporedi visinu i širinu lijeve i desne strane brkova i bradice.",
        "Makazama ukloni pojedinačne dlake koje strše."
      ],
      "mistake": "Ispravljanje asimetrije stalnim skraćivanjem — oblik postaje premali.",
      "check": "Lijeva i desna polovina su kao u ogledalu; nema dlaka koje strše."
    }
  ]
};

const VISUALS = {
  'full-beard': {
    image: '/assets/academy/parametric/full-beard.svg', alt: 'Detaljan grafitni crtež pune brade',
    steps: [
      { title: 'Linija vrata', text: 'Obrij područje ispod označene linije. Položaj prilagodi svom vratu.', kind: 'neck' },
      { title: 'Linije obraza', text: 'Prati prirodni rub brade s obje strane obraza.', kind: 'cheeks' },
      { title: 'Ujednačena dužina', text: 'Nastavak 12–15 mm. Trimer vodi u smjeru rasta dlake.', kind: 'length' },
      { title: 'Oblikovanje i njega', text: 'Strelice pokazuju smjer četkanja prema donjem rubu brade.', kind: 'brush' },
    ],
  },
  goatee: {
    image: '/assets/academy/parametric/goatee.svg', alt: 'Detaljan grafitni crtež kozje bradice bez brkova',
    steps: [
      { title: 'Zona kozje bradice', text: 'Sačuvaj dlake samo na centralnom dijelu brade, ispod donje usne.', kind: 'chin' },
      { title: 'Čisti obrazi i gornja usna', text: 'Obrij bočna područja i gornju usnu; centralna bradica ostaje.', kind: 'shave' },
      { title: 'Dužina 6–8 mm', text: 'Ujednači dlake unutar označenog područja nastavkom trimera.', kind: 'chin' },
      { title: 'Uredne ivice', text: 'Prati označeni obris. Provjeri jednaku širinu s obje strane.', kind: 'chin' },
    ],
  },
  'van-dyke': {
    image: '/assets/academy/parametric/van-dyke.svg', alt: 'Detaljan grafitni crtež Van Dyke brkova i odvojene bradice',
    steps: [
      { title: 'Obrij bočne zone', text: 'Obrazi i vrat ostaju glatki. Brkove i centralnu bradicu sačuvaj.', kind: 'shave' },
      { title: 'Odvojeni brkovi', text: 'Istaknuto područje je rub brkova; ispod njih sačuvaj jasan razmak.', kind: 'mustache' },
      { title: 'Šiljasta bradica', text: 'Oblikuj centralnu bradicu prema donjem vrhu.', kind: 'point' },
      { title: 'Provjera simetrije', text: 'Središnja linija pomaže usporediti lijevu i desnu stranu.', kind: 'symmetry' },
    ],
  },
};

function Annotation({ kind, guideId }) {
  const geometry = createGuideGeometry(guideId);
  const shave = kind === 'shave' || kind === 'neck';
  const direction = kind === 'brush' || kind === 'symmetry';
  const boundary = geometry.zones[kind];
  return <svg viewBox={geometry.viewBox} className="ag-annotation" aria-hidden="true">
    <g fill="none" stroke={shave ? '#A5452C' : direction ? '#42677b' : '#94703c'}
      strokeWidth="1.6" strokeDasharray={direction ? '4 5' : '7 5'} strokeLinecap="round" strokeLinejoin="round">
      <path d={kind === 'neck' ? geometry.neckShave : boundary}
        fill={shave ? '#A5452C' : 'none'} fillOpacity="0.07" />
      {kind === 'shave' && guideId === 'goatee' && <path d={geometry.upperLipShave} fill="#A5452C" fillOpacity="0.07" />}
      {kind === 'shave' && <path d={geometry.neckShave} fill="#A5452C" fillOpacity="0.07" />}
    </g>
  </svg>;
}
export default function GuideIllustration({ guideId, stepIndex, onZoomOpen }) {
  const visual = VISUALS[guideId] || VISUALS.goatee;
  const index = visual.steps[stepIndex] ? stepIndex : 0;
  const step = visual.steps[index];
  const detail = DETAILS[guideId]?.[index] || DETAILS.goatee[index];
  const [annotations, setAnnotations] = useState(true);
  const [animate, setAnimate] = useState(true);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [zoom, setZoom] = useState(false);
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoom) {
      if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
    } else if (dialog.close) dialog.close(); else dialog.removeAttribute('open');
  }, [zoom]);
  const drawing = () => <div className="ag-drawing">
    <img src={visual.image} alt={visual.alt} width="1024" height="1024" />
    {annotations && <Annotation kind={step.kind} guideId={guideId} />}
    {annotations && animate && <StepAnimation key={`${guideId}-${index}`} kind={step.kind} guideId={guideId} reducedMotion={!!reducedMotion} />}
  </div>;
  return <div className="ag-visual">
    <div className="ag-visual-toolbar">
      <label><input type="checkbox" checked={annotations} onChange={e => setAnnotations(e.target.checked)} /> Prikaži oznake</label>
      <label><input type="checkbox" checked={animate} disabled={!annotations} onChange={e => setAnimate(e.target.checked)} /> Animacija</label>
      <button type="button" onClick={() => { onZoomOpen?.(); setZoom(true); }}>Povećaj sliku ↗</button>
    </div>
    {drawing()}
    <div className="ag-visual-caption" aria-live="polite">
      <strong>{step.title}</strong><p>{step.text}</p>
      <ol className="ag-howto" aria-label="Kako, korak po korak">
        {detail.how.map(item => <li key={item}>{item}</li>)}
      </ol>
      <div className="ag-step-notes">
        <div className="ag-note-mistake"><strong>Česta greška:</strong> {detail.mistake}</div>
        <div className="ag-note-check"><strong>Provjera:</strong> {detail.check}</div>
      </div>
      <div className="ag-legend"><span>🟠 Linija / područje oblikovanja</span><span>🔴 Područje za brijanje</span><span>🔵 Smjer / simetrija</span></div>
      <small>Oznake su orijentacione; prilagodi ih obliku svog lica.</small>
    </div>
    <dialog ref={dialogRef} className="ag-zoom-dialog" aria-label="Povećana ilustracija brade" onCancel={e => { e.preventDefault(); setZoom(false); }}
      onClick={e => { if (e.target === e.currentTarget) setZoom(false); }}>
      {zoom && <div className="ag-zoom-content">
        <div className="ag-zoom-header"><strong>{step.title}</strong><button onClick={() => setZoom(false)}>Zatvori ×</button></div>
        {drawing()}
        <p>{step.text}</p>
      </div>}
    </dialog>
  </div>;
}

export { VISUALS, DETAILS };
