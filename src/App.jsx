import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import LandingPage from './pages/LandingPage.jsx';

const AppPage = lazy(() => import('./pages/AppPage.jsx'));
const PremiumPage = lazy(() => import('./pages/PremiumPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

function AppFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-dark flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<AppFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/app" element={<AppPage />} />
                  <Route path="/premium" element={<PremiumPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <Toast />
          </div>
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  );
}
