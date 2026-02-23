import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AIResultsPage from './pages/AIResultsPage';
import QuestionnairePage from './pages/QuestionnairePage';
import GalleryPage from './pages/GalleryPage';
import PreviewPage from './pages/PreviewPage';
import SalonDashboard from './pages/SalonDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TestOverlayPage from './pages/TestOverlayPage';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Create a client
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
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
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

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Salon Routes */}
              <Route path="/salon" element={<SalonDashboard />} />
              <Route path="/salon/session/:code" element={<SalonDashboard />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
