
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Assessment } from './pages/Assessment';
import { Results } from './pages/Results';
import { Login } from './pages/Login';
import { AssessmentData, PredictionResult } from './types';
import { saveProgress } from './services/storageService';
import { Loader2 } from 'lucide-react';
import FirebaseStudio from './pages/FirebaseStudio'; // Import FirebaseStudio

// Wrapper component to handle Auth State logic
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleStartAssessment = () => {
    setCurrentPage('assessment');
  };

  const handleAssessmentComplete = async (data: AssessmentData, result: PredictionResult) => {
    // 1. Update Local State for UI immediately
    setAssessmentData(data);
    setPredictionResult(result);
    setCurrentPage('results');
    
    // 2. Persist to Supabase
    if (user && user.uid) {
        try {
            await saveProgress(user.uid, data, result);
            console.log("Progress saved successfully for user:", user.uid);
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    }
  };

  const handleRetake = () => {
    setAssessmentData(null);
    setPredictionResult(null);
    setCurrentPage('assessment');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero onStart={handleStartAssessment} />;
      case 'assessment':
        return <Assessment onComplete={handleAssessmentComplete} />;
      case 'results':
        return assessmentData && predictionResult ? (
          <Results 
            data={assessmentData} 
            result={predictionResult} 
            onRetake={handleRetake} 
          />
        ) : (
          <Hero onStart={handleStartAssessment} />
        );
      case 'studio': // Add studio case
        return <FirebaseStudio />;
      default:
        return <Hero onStart={handleStartAssessment} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
