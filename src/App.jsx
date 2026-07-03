import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import LandingPage from './pages/LandingPage.jsx';

const AppPage = lazy(() => import('./pages/AppPage.jsx'));
const PremiumPage = lazy(() => import('./pages/PremiumPage.jsx'));

function AppFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-dark flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<AppFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<AppPage />} />
                <Route path="/premium" element={<PremiumPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toast />
        </div>
      </HashRouter>
    </AppProvider>
  );
}
