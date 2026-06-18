import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext';
import { PublicLayout } from './layout/PublicLayout';
import { ProtectedNavbarLayout } from './layout/ProtectedNavbarLayout';

import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';

import { DashboardPage } from './pages/app/DashboardPage';
import { PatientsPage } from './pages/app/PatientsPage';
import { PatientDetailPage } from './pages/app/PatientDetailPage';
import { NewScanPage } from './pages/app/NewScanPage';
import { ScanResultPage } from './pages/app/ScanResultPage';

import { HomePage } from './pages/public/HomePage';
import { DiseasesPage } from './pages/public/DiseasesPage';
import { HealthTipsPage } from './pages/public/HealthTipsPage';
import { AboutPage } from './pages/public/AboutPage';

import { ProfilePage } from './pages/account/ProfilePage';
import { SettingsPage } from './pages/account/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes inside PublicLayout (Navbar + Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/diseases" element={<DiseasesPage />} />
            <Route path="/health-tips" element={<HealthTipsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes (Navbar + Footer only, no Sidebar) */}
          <Route element={<ProtectedNavbarLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/patients/:id/new-scan" element={<NewScanPage />} />
            <Route path="/scans/:id" element={<ScanResultPage />} />
          </Route>

          {/* Catch-all redirects to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
