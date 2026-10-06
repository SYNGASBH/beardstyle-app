import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ARBeardOverlay from '../components/ARBeardOverlay';
import { BEARD_STYLES } from '../data/beardStyles';
import { AR_SHAPES, captureARFrame } from '../utils/arPreview';

const styles = BEARD_STYLES.filter(style => AR_SHAPES[style.slug]);

export default function ARTryOnPage() {
  const [search] = useSearchParams();
  const requested = search.get('style');
  const [slug, setSlug] = useState(() => styles.find(s =>
    [s.slug, s.id, ...s.aliases].includes(requested))?.slug || 'full-beard');
  const style = styles.find(s => s.slug === slug);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const faceRef = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const [visible, setVisible] = useState(true);
  const [techLines, setTechLines] = useState(false);
  const [opacity, setOpacity] = useState(0.75);
  const [blueprint, setBlueprint] = useState(null);
  const [split, setSplit] = useState(50);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!attempt || blueprint) return;
    let cancelled = false;
    let stream;
    const video = videoRef.current;
    setReady(false); setTracking(false); setCameraError(''); setTrackingError('');
    faceRef.current = null;
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('Kamera zahtijeva HTTPS ili localhost i podržan preglednik.');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        video.srcObject = stream;
        await video.play();
        if (!cancelled) setReady(true);
      } catch (error) {
        if (!cancelled) {
          stream?.getTracks().forEach(t => t.stop());
          setCameraError(error.name === 'NotAllowedError'
            ? 'Pristup kameri je odbijen. Dozvoli kameru u postavkama preglednika pa pokušaj ponovo.'
            : error.name === 'NotFoundError' ? 'Kamera nije pronađena. Priključi kameru ili učitaj fotografiju.'
            : error.message);
        }
      }
    }
    start();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach(t => t.stop());
      if (video) video.srcObject = null;
    };
  }, [attempt, blueprint]);

  const onFace = useCallback(face => { faceRef.current = face; setTracking(true); }, []);
  const onLost = useCallback(() => { faceRef.current = null; setTracking(false); }, []);
  const capture = () => {
    if (!ready || !faceRef.current) return;
    try {
      const frames = captureARFrame(videoRef.current, visible ? overlayRef.current?.getCanvas() : null);
      setBlueprint({ ...frames, name: style.name, slug }); setMessage(''); setSplit(50);
    } catch (error) { setMessage(error.message); }
  };
  const download = () => {
    const link = document.createElement('a');
    link.href = blueprint.after; link.download = `beardstyle-${blueprint.slug}.jpg`; link.click();
  };
  const share = async () => {
    try {
      const blob = await (await fetch(blueprint.after)).blob();
      const file = new File([blob], `beardstyle-${blueprint.slug}.jpg`, { type: 'image/jpeg' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ title: `BeardStyle — ${blueprint.name}`, files: [file] });
      } else { download(); setMessage('Slika je preuzeta. Možeš je podijeliti iz svojih datoteka.'); }
    } catch (error) { if (error.name !== 'AbortError') setMessage('Dijeljenje nije uspjelo. Koristi Preuzmi sliku.'); }
  };

  return <div className="min-h-screen bg-gray-950 text-white px-4 py-6">
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-4">
        <Link to="/gallery" className="text-amber-400">← Galerija</Link>
        <h1 className="text-xl font-bold">AR try-on</h1>
        <Link to="/akademija" className="text-amber-400">Akademija</Link>
      </div>
      <p className="text-sm text-gray-400">Isprobaj oblik brade uživo. Ovo je ilustrativni prikaz koji dodaje bradu; postojeću bradu ne uklanja. Kamera se obrađuje na ovom uređaju.</p>
      {blueprint ? <>
        <h2 className="text-lg font-semibold">{blueprint.name} — prije i poslije</h2>
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
          <img src={blueprint.before} alt="Prije — originalni snimak" className="absolute inset-0 w-full h-full object-contain" />
          <img src={blueprint.after} alt="Poslije — snimak s AR bradom" className="absolute inset-0 w-full h-full object-contain" style={{ clipPath: `inset(0 0 0 ${split}%)` }} />
          <div className="absolute inset-y-0 border-l-2 border-amber-400" style={{ left: `${split}%` }} />
        </div>
        <label className="block">Prije / poslije
          <input aria-label="Prije / poslije" className="block w-full accent-amber-400" type="range" min="0" max="100" value={split} onChange={e => setSplit(Number(e.target.value))} />
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={download}>Preuzmi sliku</button>
          <button className="btn btn-secondary" onClick={share}>Podijeli</button>
          <button className="btn btn-secondary" onClick={() => setBlueprint(null)}>Ponovi snimak</button>
        </div>
      </> : <>
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
          <div className="absolute inset-0" style={{ transform: 'scaleX(-1)' }}>
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-contain" aria-label="Kamera za AR" />
            {ready && <ARBeardOverlay ref={overlayRef} videoRef={videoRef} beardStyle={slug} opacity={opacity}
              visible={visible} showTechLines={techLines} onFaceDetected={onFace} onTrackingLost={onLost} onError={setTrackingError} />}
          </div>
          {!ready && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center bg-gray-900/80">
            {cameraError ? <p role="alert">{cameraError}</p> : <p>{attempt ? 'Čekam kameru…' : 'Pokreni kameru da isprobaš bradu.'}</p>}
            {(!attempt || cameraError) && <button className="btn btn-primary" onClick={() => setAttempt(a => a+1)}>{attempt ? 'Pokušaj ponovo' : 'Pokreni kameru'}</button>}
            <Link className="text-amber-400" to="/upload">Učitaj fotografiju</Link>
          </div>}
        </div>
        {trackingError ? <div role="alert" className="text-amber-400 flex flex-wrap gap-3">
          <span>Praćenje lica nije dostupno: {trackingError}</span>
          <button onClick={() => setAttempt(a => a+1)} className="underline">Pokušaj ponovo</button>
        </div> : <p role="status" className="text-sm text-gray-400">{ready ? tracking ? 'Lice je prepoznato. Možeš snimiti prikaz.' : 'Gledaj ravno u kameru, uz dobro osvjetljenje.' : 'Kamera nije pokrenuta.'}</p>}
        <label className="block">Stil brade
          <select value={slug} onChange={e => { setSlug(e.target.value); faceRef.current = null; setTracking(false); }} className="block w-full bg-gray-800 rounded-lg p-3 mt-2">
            {styles.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-5">
          <label>Jačina prikaza <input aria-label="Jačina prikaza" type="range" min="0.2" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="accent-amber-400 align-middle" /></label>
          <label><input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} /> Prikaži bradu</label>
          <label><input type="checkbox" checked={techLines} onChange={e => setTechLines(e.target.checked)} /> Linija vilice</label>
        </div>
        <button className="btn btn-primary disabled:opacity-40" disabled={!ready || !tracking || !!trackingError} onClick={capture}>Snimi prikaz</button>
      </>}
      {message && <p role="status">{message}</p>}
    </div>
  </div>;
}
