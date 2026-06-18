import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext';
import { AppLayout } from './layout/AppLayout';
import { PublicLayout } from './layout/PublicLayout';
import { ProtectedNavbarLayout } from './layout/ProtectedNavbarLayout';

import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { NewScanPage } from './pages/NewScanPage';
import { ScanResultPage } from './pages/ScanResultPage';

import { HomePage } from './pages/public/HomePage';
import { DiseasesPage } from './pages/public/DiseasesPage';
import { HealthTipsPage } from './pages/public/HealthTipsPage';
import { AboutPage } from './pages/public/AboutPage';

import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

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

          {/* Protected Routes without Sidebar (Navbar + Footer only) */}
          <Route element={<ProtectedNavbarLayout />}>
            <Route path="/app/profile" element={<ProfilePage />} />
            <Route path="/app/settings" element={<SettingsPage />} />
          </Route>

          {/* Protected Routes inside AppLayout (Sidebar + Dashboard) */}
          <Route element={<AppLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/patients" element={<PatientsPage />} />
            <Route path="/app/patients/:id" element={<PatientDetailPage />} />
            <Route path="/app/patients/:id/new-scan" element={<NewScanPage />} />
            <Route path="/app/scans/:id" element={<ScanResultPage />} />
          </Route>

          {/* Catch-all redirects to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
