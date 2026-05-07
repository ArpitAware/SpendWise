/**
 * App.jsx — Root component with routing, providers, and route guards
 * New: HomePage, AboutPage, PricingPage accessible always
 *      CurrencyProvider wraps entire app
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Suspense, lazy } from 'react';

// Public marketing pages (always accessible)
const HomePage    = lazy(() => import('./pages/public/HomePage'));
const AboutPage   = lazy(() => import('./pages/public/AboutPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));

// Auth pages
const LoginPage    = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// App pages (protected)
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ExpensesPage  = lazy(() => import('./pages/ExpensesPage'));
const BudgetPage    = lazy(() => import('./pages/BudgetPage'));
const ProfilePage   = lazy(() => import('./pages/ProfilePage'));

import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// ─── Route Guards ─────────────────────────────────────────────────────────────
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Login/Register redirect to dashboard if already logged in
const AuthRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{ duration: 3000 }}
            />
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                {/* ── Always-public marketing pages ── */}
                <Route path="/"        element={<HomePage />} />
                <Route path="/about"   element={<AboutPage />} />
                <Route path="/pricing" element={<PricingPage />} />

                {/* ── Auth pages (redirect if logged in) ── */}
                <Route element={<AuthRoute />}>
                  <Route path="/login"    element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* ── Protected app pages ── */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/expenses"  element={<ExpensesPage />} />
                    <Route path="/budget"    element={<BudgetPage />} />
                    <Route path="/profile"   element={<ProfilePage />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
