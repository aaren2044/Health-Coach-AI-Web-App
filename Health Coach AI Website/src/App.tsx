import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import AIGuidance from "./pages/AIGuidance";
import Exercise from "./pages/Exercise";
import Profile from "./pages/Profile";
import DietRecommendations from "./pages/DietRecommendations";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import HeartRatePage from "./pages/HeartRatePage";
import WeightPage from "./pages/WeightPage";
import BloodOxygenPage from "./pages/BloodOxygenPage";
import BodyTemperaturePage from "./pages/BodyTemperaturePage";
import SleepPage from "./pages/SleepPage";
import ExercisePage from "./pages/ExercisePage";
import Documents from "./pages/Documents";
import Medication from './pages/Medication';
import useAuth from "./hooks/useAuth";
import ActivitySummaryPage from "./pages/ActivitySummaryPage";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
            {isAuthenticated && (
              <div className="sticky top-0 z-50">
                <Navbar isAuthenticated={isAuthenticated} />
              </div>
            )}
            
            <main className={isAuthenticated ? "pt-16" : ""}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/profile-setup" element={isAuthenticated ? <ProfileSetup /> : <LoginPage />} />
                  <Route path="/ai-guidance" element={isAuthenticated ? <AIGuidance /> : <LoginPage />} />
                  <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <LoginPage />} />
                  <Route path="/exercise" element={isAuthenticated ? <Exercise /> : <LoginPage />} />
                  <Route path="/profile" element={isAuthenticated ? <Profile /> : <LoginPage />} />
                  <Route path="/diet" element={isAuthenticated ? <DietRecommendations /> : <LoginPage />} />
                  <Route path="/monitoring" element={isAuthenticated ? <MonitoringDashboard /> : <LoginPage />} />
                  <Route path="/monitoring/heart-rate" element={isAuthenticated ? <HeartRatePage /> : <LoginPage />} />
                  <Route path="/monitoring/sleep" element={isAuthenticated ? <SleepPage /> : <LoginPage />} />
                  <Route path="/monitoring/blood-oxygen" element={isAuthenticated ? <BloodOxygenPage /> : <LoginPage />} />
                  <Route path="/monitoring/temperature" element={isAuthenticated ? <BodyTemperaturePage /> : <LoginPage />} />
                  <Route path="/monitoring/activity" element={isAuthenticated ? <ExercisePage /> : <LoginPage />} />
                  <Route path="/monitoring/weight" element={isAuthenticated ? <WeightPage /> : <LoginPage />} />
                  <Route path="/medication" element={isAuthenticated ? <Medication /> : <LoginPage />} />
                  <Route path="/activity-summary" element={isAuthenticated ? <ActivitySummaryPage /> : <LoginPage />} />
                  <Route path="/documents" element={isAuthenticated ? <Documents /> : <LoginPage />} />
                </Routes>
              </AnimatePresence>
            </main>

            <Toaster position="bottom-right" />
          </div>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;