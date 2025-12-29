import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AnimatePresence } from 'motion/react';
import HomePage from './components/HomePage';
import TripDashboard from './components/TripDashboard';
import ItineraryView from './components/ItineraryView';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Navigation from './components/Navigation';
import { Toaster } from 'sonner';


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-500">
            <Navigation />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<TripDashboard />} />
                <Route path="/itinerary/:id" element={<ItineraryView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
            <Toaster position="top-right" theme="system" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
