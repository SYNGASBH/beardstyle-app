import React, { useEffect, useRef, useState } from 'react';
import { createGuideGeometry } from './guideGeometry';

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
  const step = visual.steps[stepIndex] || visual.steps[0];
  const [annotations, setAnnotations] = useState(true);
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
  </div>;
  return <div className="ag-visual">
    <div className="ag-visual-toolbar">
      <label><input type="checkbox" checked={annotations} onChange={e => setAnnotations(e.target.checked)} /> Prikaži oznake</label>
      <button type="button" onClick={() => { onZoomOpen?.(); setZoom(true); }}>Povećaj sliku ↗</button>
    </div>
    {drawing()}
    <div className="ag-visual-caption" aria-live="polite">
      <strong>{step.title}</strong><p>{step.text}</p>
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

export { VISUALS };
