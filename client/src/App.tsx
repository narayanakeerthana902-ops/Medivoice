import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { TriageProvider } from './context/TriageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { TriageResultsPage } from './pages/TriageResultsPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <TriageProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/checker" element={<SymptomCheckerPage />} />
                <Route path="/assistant" element={<VoiceAssistantPage />} />
                <Route path="/results" element={<TriageResultsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TriageProvider>
    </LanguageProvider>
  );
};

export default App;
