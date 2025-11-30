import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import HomePage from './components/HomePage';
import TripDashboard from './components/TripDashboard';
import ItineraryView from './components/ItineraryView';
import Navigation from './components/Navigation';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-stone-900 transition-colors duration-500">
          <Navigation />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<TripDashboard />} />
              <Route path="/itinerary/:id" element={<ItineraryView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <Toaster position="top-right" theme="dark" />
        </div>
      </Router>
    </ThemeProvider>
  );
}