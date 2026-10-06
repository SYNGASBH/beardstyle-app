import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import CoursePlayer, { COURSES } from '../components/academy/CoursePlayer';
import useAcademyProgress from '../hooks/useAcademyProgress';

export default function AcademyPage() {
  const { isAuthenticated, user, accountType } = useAuthStore();
  const userId = isAuthenticated && accountType !== 'salon' ? user?.id || user?.userId : null;
  const { completed, complete, notice, retrySync } = useAcademyProgress(userId, COURSES);
  return <div className="max-w-3xl mx-auto px-4 py-8">
    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
      <p>Sve lekcije su privremeno besplatne i dostupne bez pretplate.</p>
      {!userId && <p className="text-sm mt-2">Napredak se čuva na ovom uređaju. <Link to="/login" className="underline">Prijavi se</Link> za sinhronizaciju s računom.</p>}
    </div>
    {notice && <div className="mb-4 text-sm text-gray-600" role="status">
      {notice} {userId && <button className="underline ml-2" onClick={retrySync}>Sinhronizuj ponovo</button>}
    </div>}
    <CoursePlayer key={userId || 'guest'} openAccess completedLessons={completed} onCompleteLesson={complete} />
  </div>;
}
