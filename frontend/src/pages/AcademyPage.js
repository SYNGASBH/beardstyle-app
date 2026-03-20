import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { userAPI } from '../services/api';
import CoursePlayer from '../components/academy/CoursePlayer';

const AcademyPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    // Check subscription from user data first (fast), then verify with backend
    if (user?.subscriptionTier === 'premium') {
      setIsPremium(true);
    }

    userAPI.getPremiumStatus()
      .then(res => setIsPremium(res.data.isPremium))
      .catch(() => {}) // keep whatever we had
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  const handleUpgrade = () => {
    // TODO: Replace with actual payment/upgrade flow when ready
    navigate('/register');
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <CoursePlayer
        isPremium={isPremium}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default AcademyPage;
