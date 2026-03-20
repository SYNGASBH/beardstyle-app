import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components (always loaded)
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Lightweight pages (eager load - small bundles)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Heavy pages (lazy load - Three.js, MediaPipe, etc.)
const UploadPage = lazy(() => import('./pages/UploadPage'));
const AIResultsPage = lazy(() => import('./pages/AIResultsPage'));
const QuestionnairePage = lazy(() => import('./pages/QuestionnairePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PreviewPage = lazy(() => import('./pages/PreviewPage'));
const SalonDashboard = lazy(() => import('./pages/SalonDashboard'));
const TestOverlayPage = lazy(() => import('./pages/TestOverlayPage'));
const ARTryOnPage = lazy(() => import('./pages/ARTryOnPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));

// Loading spinner for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Učitavanje...</p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/ai-results" element={<AIResultsPage />} />
                  <Route path="/questionnaire" element={<QuestionnairePage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/preview" element={<PreviewPage />} />
                  <Route path="/preview/:styleId" element={<PreviewPage />} />
                  <Route path="/styles/:slug" element={<PreviewPage />} />
                  <Route path="/test-overlay" element={<TestOverlayPage />} />
                  <Route path="/ar-tryon" element={<ARTryOnPage />} />
                  <Route path="/akademija" element={<AcademyPage />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Salon Routes */}
                  <Route path="/salon" element={<SalonDashboard />} />
                  <Route path="/salon/session/:code" element={<SalonDashboard />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
