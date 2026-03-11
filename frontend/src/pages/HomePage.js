import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Sparkles, Users, TrendingUp, ChevronDown, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  // Track scroll for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for section reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.15 }
    );
    sectionRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const addRef = (i) => (el) => { sectionRefs.current[i] = el; };
  const isVis = (id) => visibleSections.has(id);

  const handleStartNow = () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease-out';
    setTimeout(() => {
      navigate('/upload');
      document.body.style.opacity = '1';
    }, 400);
  };

  const steps = [
    { num: 1, title: 'Upload Fotografiju', desc: 'Slikaj se ili uploaduj postojecu fotografiju. AI automatski detektuje tvoje lice.', Icon: Camera },
    { num: 2, title: 'AI Analizira Lice', desc: 'Napredna AI tehnologija analizira oblik lica, crte i proporcije za precizne preporuke.', Icon: Sparkles },
    { num: 3, title: 'Pregledaj & Vizualizuj', desc: 'Vidi realisticne AI vizualizacije kako svaki stil brade izgleda na tvom licu.', Icon: TrendingUp },
  ];

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* ═══ HERO — Full-screen parallax ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BG layer (slow) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-primary-950"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        {/* Decorative blurs (mid layer) */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        {/* Content (foreground — moves opposite) */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ transform: `translateY(${scrollY * -0.12}px)` }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-sm text-gray-300">AI-Powered Beard Styling</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 tracking-tight">
            <span className="block text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Pronadi Svoj
            </span>
            <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Savrseni Stil
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            AI tehnologija analizira tvoje lice i preporucuje idealan stil brade.
            Vizualizuj rezultat prije nego posjetiš berbera.
          </p>

          {/* ── Golden CTA ── */}
          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <button
              onClick={handleStartNow}
              className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-gray-950
                         bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400
                         rounded-2xl transition-all duration-300
                         hover:scale-105 hover:shadow-[0_8px_40px_rgba(251,191,36,0.5)]
                         active:scale-[0.98]"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/40 via-yellow-300/30 to-amber-400/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3">
                <Camera size={22} />
                Pocni Sada
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <Link to="/ar-tryon" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-semibold">
              <span className="text-base">🪞</span> Probaj AR Try-On Uzivo
            </Link>
            <span className="hidden sm:inline text-gray-700">|</span>
            <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm underline underline-offset-4 decoration-gray-600 hover:decoration-white">
              Pregledaj galeriju stilova
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={addRef(0)} data-section="steps" className="relative py-24 md:py-32 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${isVis('steps') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Kako <span className="text-amber-400">Funkcionise</span>?</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Tri jednostavna koraka do savrsenog stila brade</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative group transition-all duration-700 ${isVis('steps') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 200 + 200}ms` }}
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
                )}
                <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-gray-950 font-black text-xl shadow-lg shadow-amber-400/20">
                      {step.num}
                    </div>
                    <step.Icon size={24} className="text-gray-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section ref={addRef(1)} data-section="features" className="relative py-24 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${isVis('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Zasto <span className="text-primary-400">BeardStyle</span>?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'AI Analiza Lica', desc: 'Claude AI detektuje oblik lica, crte i proporcije za precizne preporuke stilova.', gradient: 'from-primary-500/20 to-primary-600/5', border: 'hover:border-primary-500/30' },
              { title: 'Realisticna Vizualizacija', desc: 'Stable Diffusion inpainting prikazuje kako brada izgleda na tvom licu.', gradient: 'from-amber-500/20 to-amber-600/5', border: 'hover:border-amber-500/30' },
              { title: '16+ Stilova Brade', desc: 'Od Full Beard do Van Dyke — svaki stil sa detaljnim uputstvima za odrzavanje.', gradient: 'from-emerald-500/20 to-emerald-600/5', border: 'hover:border-emerald-500/30' },
              { title: 'B2B za Salone', desc: 'Collaborative sessions za berbere i klijente. Real-time konsultacije.', gradient: 'from-violet-500/20 to-violet-600/5', border: 'hover:border-violet-500/30' },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`bg-gradient-to-br ${f.gradient} border border-gray-800 ${f.border} rounded-2xl p-8 transition-all duration-700 hover:-translate-y-1 ${isVis('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 150 + 200}ms` }}
              >
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ B2B SALON ═══ */}
      <section ref={addRef(2)} data-section="salon" className="relative py-24 md:py-32 bg-gray-900">
        <div className={`max-w-4xl mx-auto px-6 text-center transition-all duration-700 ${isVis('salon') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Users size={48} className="mx-auto mb-6 text-primary-400" />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Za Frizerske Salone</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Napredna B2B rjesenja — collaborative sessions, customer management i real-time konsultacije sa klijentima.
          </p>
          <Link to="/salon" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all">
            Saznaj Vise <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section ref={addRef(3)} data-section="cta" className="relative py-24 md:py-32 bg-gradient-to-t from-gray-950 to-gray-900">
        <div className={`max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${isVis('cta') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Spreman za <span className="text-amber-400">Promjenu</span>?</h2>
          <p className="text-gray-400 text-lg mb-10">Uploaduj fotografiju i dobij personalizovane preporuke za stil brade za manje od 60 sekundi.</p>
          <button
            onClick={handleStartNow}
            className="group relative inline-flex items-center gap-3 px-12 py-5 text-lg font-bold text-gray-950
                       bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400
                       rounded-2xl transition-all duration-300
                       hover:scale-105 hover:shadow-[0_8px_40px_rgba(251,191,36,0.5)] active:scale-[0.98]"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/40 via-yellow-300/30 to-amber-400/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-3">
              <Camera size={22} />
              Pocni Besplatno
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
