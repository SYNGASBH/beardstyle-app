import { useState, useEffect, useCallback, useRef } from 'react';
import { userAPI } from '../services/api';

export function readProgress(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || (key === 'bs_progress:guest' ? localStorage.getItem('bs_progress') : null) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).filter(([, done]) => done === true)) : {};
  } catch (_) { return {}; }
}

export default function useAcademyProgress(userId, courses) {
  const key = `bs_progress:${userId || 'guest'}`;
  const [completed, setCompleted] = useState(() => readProgress(key));
  const [notice, setNotice] = useState('');
  const [retry, setRetry] = useState(0);
  const scope = useRef(key);
  scope.current = key;
  const current = useRef(completed);
  current.current = completed;

  const save = useCallback(value => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (_) { setNotice('Preglednik ne dopušta spremanje napretka na ovom uređaju.'); }
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    const local = readProgress(key);
    current.current = local;
    setCompleted(local); setNotice('');
    if (!userId) return () => { cancelled = true; };
    async function sync() {
      try {
        const response = await userAPI.getLessonProgress();
        if (cancelled) return;
        const remote = Object.fromEntries((response.data.completedLessons || []).map(lesson => [lesson.lesson_id, true]));
        const merged = { ...remote, ...current.current };
        current.current = merged;
        setCompleted(merged); save(merged);
        const pending = courses.flatMap(course => course.lessons
          .filter(lesson => merged[lesson.id] && !remote[lesson.id])
          .map(lesson => userAPI.completeLesson(course.id, lesson.id)));
        await Promise.all(pending);
        if (!cancelled) setNotice('Napredak je sinhronizovan s računom.');
      } catch (_) {
        if (!cancelled) setNotice('Napredak je sačuvan na uređaju. Sinhronizacija s računom trenutno nije dostupna.');
      }
    }
    sync();
    return () => { cancelled = true; };
  }, [key, userId, courses, retry, save]);

  const complete = useCallback((courseId, lessonId) => {
    const expectedKey = key;
    const value = { ...current.current, [lessonId]: true };
    current.current = value; setCompleted(value); save(value);
    if (userId) userAPI.completeLesson(courseId, lessonId).then(() => {
      if (scope.current === expectedKey) setNotice('Napredak je sinhronizovan s računom.');
    }).catch(() => {
      if (scope.current === expectedKey) setNotice('Napredak je sačuvan na uređaju. Sinhronizacija s računom trenutno nije dostupna.');
    });
  }, [key, userId, save]);

  return { completed, complete, notice, retrySync: () => setRetry(value => value + 1) };
}
