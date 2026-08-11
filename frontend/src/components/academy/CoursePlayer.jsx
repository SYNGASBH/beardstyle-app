import React, { useState, useCallback, useEffect } from 'react';
import AnimatedGuide from './AnimatedGuide';
import './CoursePlayer.css';

// ─── SVG icons (inline, tiny) ─────────────────────────────────────
const IconChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconLock = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
);
const IconCheck = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
);

// ─── Course thumbnail (dark square with emoji-style icon) ─────────
const ThumbIcon = ({ type }) => {
  const icons = { basics: '✂️', advanced: '🎯', care: '🧴' };
  return <span style={{ fontSize: 20 }}>{icons[type] || '✂️'}</span>;
};

// ─── Helpers ──────────────────────────────────────────────────────
const levelClass = (level) => {
  if (level === 'Početnik') return 'cp-level-badge cp-level-easy';
  if (level === 'Napredno') return 'cp-level-badge cp-level-hard';
  return 'cp-level-badge cp-level-med';
};

const planClass = (plan) =>
  plan === 'premium' ? 'cp-plan-badge cp-plan-premium' : 'cp-plan-badge cp-plan-free';

// ─── Course data ──────────────────────────────────────────────────
const COURSES = [
  {
    id: 'beard-basics',
    title: 'Osnove njege brade',
    description: 'Kako pravilno održavati, trimati i oblikovati bradu od nule.',
    level: 'Početnik',
    plan: 'free',
    totalDuration: '25 min',
    thumbnail: 'basics',
    lessons: [
      { id: 'bb1', type: 'guide', guideId: 'full-beard', title: 'Kako oblikovati punu bradu', duration: '10 min', plan: 'free' },
      { id: 'bb2', type: 'guide', guideId: 'goatee', title: 'Goatee — korak po korak', duration: '8 min', plan: 'free' },
      {
        id: 'bb3', type: 'tips', title: 'Alati za bradu — šta ti treba', duration: '5 min', plan: 'free',
        content: { sections: [
          { heading: 'Obavezni alati', text: 'Kvalitetan trimer sa podesivom dužinom, brijač (safety razor ili straight), četka za bradu od divlje svinje, i fino ulje za bradu.' },
          { heading: 'Trimer vs makaze', text: 'Trimer za jednoliku dužinu i linije. Makaze za precizno dotjerivanje pojedinačnih dlaka koje strše. Idealno — koristi oboje.' },
          { heading: 'Njega kože ispod brade', text: 'Koža ispod brade treba hidrataciju. Koristi ulje za bradu svaki dan — ono hrani i kožu i dlaku. Peeling jednom sedmično sprječava urasle dlake.' },
        ]},
      },
    ],
  },
  {
    id: 'precision-styles',
    title: 'Precizni stilovi',
    description: 'Van Dyke, Balbo i drugi stilovi koji zahtijevaju preciznost.',
    level: 'Napredno',
    plan: 'premium',
    totalDuration: '30 min',
    thumbnail: 'advanced',
    lessons: [
      { id: 'ps1', type: 'guide', guideId: 'van-dyke', title: 'Van Dyke — masterclass', duration: '12 min', plan: 'premium' },
      {
        id: 'ps2', type: 'tips', title: 'Kako održavati simetriju', duration: '6 min', plan: 'premium',
        content: { sections: [
          { heading: 'Ogledalo je tvoj prijatelj', text: 'Koristi dva ogledala — jedno ispred, jedno sa strane. Provjeri profil s obje strane nakon svakog koraka.' },
          { heading: 'Marka i mjeri', text: 'Prije brijanja, koristi bijelu olovku ili eye-liner da označiš linije. To daje vizualni vodič i sprječava greške.' },
          { heading: 'Manje je više', text: 'Uvijek brij manje nego što misliš da treba. Lakše je skinuti još malo nego čekati da naraste.' },
        ]},
      },
      {
        id: 'ps3', type: 'tips', title: 'Balbo i Anchor — razlike i tehnike', duration: '8 min', plan: 'premium',
        content: { sections: [
          { heading: 'Balbo', text: 'Brkovi su odvojeni od brade. Nema dlaka na obrazima. Brada pokriva samo bradu i donju vilicu — ali ne spaja se sa brkovima.' },
          { heading: 'Anchor', text: 'Tanka linija duž vilice sa bradičnom na vrhu. Izgleda kao sidro. Zahtijeva precizni trimer i strpljenje.' },
          { heading: 'Zajednički savjet', text: 'Oba stila zahtijevaju svakodnevno održavanje ivica. Investiraj u dobar precizni trimer — isplati se.' },
        ]},
      },
    ],
  },
  {
    id: 'beard-care',
    title: 'Njega i proizvodi',
    description: 'Ulja, balzami, šamponi — za zdravu, sjajnu bradu.',
    level: 'Početnik',
    plan: 'free',
    totalDuration: '15 min',
    thumbnail: 'care',
    lessons: [
      {
        id: 'bc1', type: 'tips', title: 'Ulje za bradu — vodič', duration: '5 min', plan: 'free',
        content: { sections: [
          { heading: 'Zašto ulje?', text: 'Ulje za bradu hidratizira kožu ispod brade i omekšava dlake. Smanjuje svrbež, perut i suhoću.' },
          { heading: 'Kako nanijeti', text: '3-5 kapi na dlanove, razmaži i umasiraj od korijena prema vrhovima. Najbolje na vlažnu bradu nakon tuširanja.' },
          { heading: 'Koji sastojci', text: 'Traži jojoba ulje, arganovo ulje ili kokosovo ulje kao bazu. Izbjegavaj silikonske dodatke.' },
        ]},
      },
      {
        id: 'bc2', type: 'tips', title: 'Balzam vs ulje — kad šta', duration: '4 min', plan: 'free',
        content: { sections: [
          { heading: 'Ulje', text: 'Za kratke do srednje brade. Glavna svrha: hidratacija kože i dlake. Ne daje hold.' },
          { heading: 'Balzam', text: 'Za srednje do duge brade. Daje blagi hold i oblik. Sadrži pčelinji vosak koji drži formu.' },
          { heading: 'Kombinacija', text: 'Za duge brade: ulje prvo (hidratacija), pa balzam preko (forma). Ovo je zlatni standard.' },
        ]},
      },
      {
        id: 'bc3', type: 'tips', title: 'Pranje brade — greške koje svi rade', duration: '4 min', plan: 'premium',
        content: { sections: [
          { heading: 'Ne koristi šampon za kosu', text: 'Šampon za kosu je pregrub za bradu. Koristi specijalni beard wash ili blagi sulfate-free šampon.' },
          { heading: 'Koliko često', text: '2-3 puta sedmično je dovoljno. Svakodnevno pranje isušuje kožu i dlaku.' },
          { heading: 'Sušenje', text: 'Tapkaj ručnikom — ne trljaj. Trljanje uzrokuje frizz i lomljenje dlaka.' },
        ]},
      },
    ],
  },
];

// ─── CoursePlayer Component ───────────────────────────────────────
const CoursePlayer = ({ isPremium = false, onUpgrade }) => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bs_progress') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('bs_progress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId);
  const selectedLesson = selectedCourse?.lessons.find(l => l.id === selectedLessonId);

  const canAccessCourse = useCallback((course) => isPremium || course.plan === 'free', [isPremium]);
  const canAccessLesson = useCallback((lesson) => isPremium || lesson.plan === 'free', [isPremium]);

  const getCourseProgress = useCallback((course) => {
    const accessible = course.lessons.filter(l => isPremium || l.plan === 'free');
    const completed = accessible.filter(l => completedLessons[l.id]);
    return accessible.length > 0 ? Math.round((completed.length / accessible.length) * 100) : 0;
  }, [completedLessons, isPremium]);

  const completeLesson = useCallback((lessonId) => {
    setCompletedLessons(prev => ({ ...prev, [lessonId]: true }));
  }, []);

  const openCourse = useCallback((courseId) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId(null);
  }, []);

  const openLesson = useCallback((lessonId) => {
    const lesson = selectedCourse?.lessons.find(l => l.id === lessonId);
    if (!lesson || !canAccessLesson(lesson)) return;
    setSelectedLessonId(lessonId);
  }, [selectedCourse, canAccessLesson]);

  const goBack = useCallback(() => {
    if (selectedLessonId) setSelectedLessonId(null);
    else setSelectedCourseId(null);
  }, [selectedLessonId]);

  // ─── Lesson View ────────────────────────────────────────────────
  if (selectedLesson) {
    const locked = !canAccessLesson(selectedLesson);

    return (
      <div className="cp-root">
        <div className="cp-nav-row">
          <button className="cp-back-btn" onClick={goBack}>
            <IconChevronLeft /> Nazad
          </button>
        </div>

        <h3 className="cp-lesson-heading">{selectedLesson.title}</h3>

        {locked ? (
          <div className="cp-locked-lesson">
            <div className="cp-lock-icon"><IconLock size={24} /></div>
            <p className="cp-locked-text">Premium sadržaj</p>
            <p className="cp-locked-sub">Otključaj sve lekcije i vodiče</p>
            {onUpgrade && (
              <button className="cp-upgrade-btn" onClick={onUpgrade} style={{ marginTop: 12 }}>
                Nadogradi na Premium
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Guide type */}
            {selectedLesson.type === 'guide' && (
              <div className="cp-guide-wrap">
                <AnimatedGuide
                  guideId={selectedLesson.guideId}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade}
                />
              </div>
            )}

            {/* Tips type */}
            {selectedLesson.type === 'tips' && selectedLesson.content && (
              <div className="cp-tips-lesson">
                <div className="cp-tips-sections">
                  {selectedLesson.content.sections.map((section, idx) => (
                    <div key={idx} className="cp-tip-section">
                      <h4 className="cp-tip-heading">{section.heading}</h4>
                      <p className="cp-tip-text">{section.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete */}
            {!completedLessons[selectedLesson.id] ? (
              <button
                className="cp-complete-btn"
                onClick={() => completeLesson(selectedLesson.id)}
              >
                <IconCheck size={14} />
                Označi kao završeno
              </button>
            ) : (
              <button className="cp-complete-btn" style={{ background: '#1D9E75' }} disabled>
                <IconCheck size={14} />
                Završeno
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // ─── Course Detail (Lessons List) ───────────────────────────────
  if (selectedCourse) {
    const progress = getCourseProgress(selectedCourse);
    const completedCount = selectedCourse.lessons.filter(l => completedLessons[l.id]).length;
    const hasPremiumLessons = selectedCourse.lessons.some(l => l.plan === 'premium');

    return (
      <div className="cp-root">
        <div className="cp-nav-row">
          <button className="cp-back-btn" onClick={goBack}>
            <IconChevronLeft /> Kursevi
          </button>
          <span className="cp-lesson-progress-label">
            {completedCount}/{selectedCourse.lessons.length}
          </span>
        </div>

        {/* Hero */}
        <div className="cp-course-hero">
          <div className="cp-thumb-wrap">
            <ThumbIcon type={selectedCourse.thumbnail} />
          </div>
          <div>
            <h2 className="cp-hero-title">{selectedCourse.title}</h2>
            <div className="cp-hero-meta">
              <span className={levelClass(selectedCourse.level)}>{selectedCourse.level}</span>
              <span className={planClass(selectedCourse.plan)}>
                {selectedCourse.plan === 'premium' ? 'Premium' : 'Besplatno'}
              </span>
            </div>
            <div className="cp-hero-meta">
              <span className="cp-hero-dur">{selectedCourse.totalDuration}</span>
              <span className="cp-hero-count">· {selectedCourse.lessons.length} lekcija</span>
            </div>
            <p className="cp-hero-desc">{selectedCourse.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="cp-course-progress-wrap">
            <div className="cp-course-progress-bar">
              <div className="cp-course-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="cp-course-progress-label">{progress}%</span>
          </div>
        )}

        {/* Lesson rows */}
        <div className="cp-lesson-list">
          {selectedCourse.lessons.map((lesson, idx) => {
            const locked = !canAccessLesson(lesson);
            const done = !!completedLessons[lesson.id];

            return (
              <div
                key={lesson.id}
                className={`cp-lesson-row ${done ? 'cp-lesson-done' : ''} ${locked ? 'cp-lesson-locked' : ''}`}
                onClick={() => !locked && openLesson(lesson.id)}
                role="button"
                tabIndex={locked ? -1 : 0}
              >
                <div className={`cp-lesson-num ${done ? 'cp-lesson-num-done' : ''}`}>
                  {done ? <IconCheck /> : locked ? <IconLock size={10} /> : <span>{idx + 1}</span>}
                </div>
                <div className="cp-lesson-info">
                  <div className="cp-lesson-title">{lesson.title}</div>
                  <div className="cp-lesson-meta">
                    <span>{lesson.type === 'guide' ? 'Vodič' : 'Savjeti'}</span>
                    <span>·</span>
                    <span>{lesson.duration}</span>
                  </div>
                </div>
                {locked ? (
                  <span className="cp-plan-badge cp-plan-premium">Premium</span>
                ) : (
                  <span className="cp-lesson-icon"><IconChevronRight /></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Upgrade CTA */}
        {!isPremium && hasPremiumLessons && (
          <div className="cp-course-upgrade">
            <p>Otključaj sve lekcije ovog kursa</p>
            {onUpgrade && (
              <button className="cp-upgrade-btn" onClick={onUpgrade}>Nadogradi</button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Course List (Home) ─────────────────────────────────────────
  const showUpgrade = !isPremium && COURSES.some(c => c.plan === 'premium');

  return (
    <div className="cp-root">
      {/* Header */}
      <div className="cp-list-header">
        <h2 className="cp-list-title">
          <IconBook />{' '}Grooming Akademija
        </h2>
        <p className="cp-list-sub">Nauči kako pravilno njegovati i oblikovati bradu</p>
      </div>

      {/* Upgrade banner */}
      {showUpgrade && (
        <div className="cp-upgrade-banner">
          <p className="cp-upgrade-text">
            <strong>Premium</strong> — otključaj sve kurseve i vodiče
          </p>
          {onUpgrade && (
            <button className="cp-upgrade-btn" onClick={onUpgrade}>Nadogradi</button>
          )}
        </div>
      )}

      {/* Course cards */}
      <div className="cp-course-list">
        {COURSES.map(course => {
          const locked = !canAccessCourse(course);
          const progress = getCourseProgress(course);

          return (
            <div
              key={course.id}
              className={`cp-course-card ${locked ? 'cp-course-locked' : ''}`}
              onClick={() => locked ? onUpgrade?.() : openCourse(course.id)}
              role="button"
              tabIndex={0}
            >
              <div className="cp-thumb-wrap">
                <ThumbIcon type={course.thumbnail} />
              </div>

              <div className="cp-course-info">
                <div className="cp-course-meta-row">
                  <span className={levelClass(course.level)}>{course.level}</span>
                  <span className={planClass(course.plan)}>
                    {course.plan === 'premium' ? 'Premium' : 'Besplatno'}
                  </span>
                </div>
                <div className="cp-course-title">{course.title}</div>
                <div className="cp-course-desc">{course.description}</div>
                {!locked && progress > 0 && (
                  <div className="cp-mini-progress">
                    <div className="cp-mini-bar">
                      <div className="cp-mini-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="cp-mini-label">{progress}%</span>
                  </div>
                )}
              </div>

              <span className="cp-course-dur">{course.totalDuration}</span>

              {locked ? (
                <span className="cp-lock-indicator"><IconLock /></span>
              ) : (
                <span className="cp-arrow-indicator"><IconChevronRight /></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { COURSES };
export default CoursePlayer;
