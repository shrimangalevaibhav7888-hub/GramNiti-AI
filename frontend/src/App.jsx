import React, { useState, Suspense, lazy } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { GramNitiProvider, useGramNiti } from './contexts/GramNitiContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { LanguageOnboardingModal } from './components/onboarding/LanguageOnboardingModal';
import { AuthOnboardingModal } from './components/auth/AuthOnboardingModal';

// Fast first-load HomePage
import { HomePage } from './pages/HomePage';

// Lazy-loaded pages for optimized chunking
const PortalOverviewPage = lazy(() => import('./pages/PortalOverviewPage').then(m => ({ default: m.PortalOverviewPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AdvisorPage = lazy(() => import('./pages/AdvisorPage').then(m => ({ default: m.AdvisorPage })));
const SchemesPage = lazy(() => import('./pages/SchemesPage').then(m => ({ default: m.SchemesPage })));
const VerifyPage = lazy(() => import('./pages/VerifyPage').then(m => ({ default: m.VerifyPage })));
const EligibilityPage = lazy(() => import('./pages/EligibilityPage').then(m => ({ default: m.EligibilityPage })));
const FinancePage = lazy(() => import('./pages/FinancePage').then(m => ({ default: m.FinancePage })));
const SimulationPage = lazy(() => import('./pages/SimulationPage').then(m => ({ default: m.SimulationPage })));
const RiskPage = lazy(() => import('./pages/RiskPage').then(m => ({ default: m.RiskPage })));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const ActionPlanPage = lazy(() => import('./pages/ActionPlanPage').then(m => ({ default: m.ActionPlanPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-semibold text-slate-500">Loading GramNiti workspace...</span>
    </div>
  </div>
);

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { loading, error } = useGramNiti();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'overview':
        return <PortalOverviewPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'advisor':
        return <AdvisorPage setActiveTab={setActiveTab} />;
      case 'schemes':
        return <SchemesPage setActiveTab={setActiveTab} />;
      case 'verify':
        return <VerifyPage setActiveTab={setActiveTab} />;
      case 'eligibility':
        return <EligibilityPage setActiveTab={setActiveTab} />;
      case 'finance':
        return <FinancePage setActiveTab={setActiveTab} />;
      case 'simulation':
        return <SimulationPage setActiveTab={setActiveTab} />;
      case 'risk':
        return <RiskPage setActiveTab={setActiveTab} />;
      case 'documents':
        return <DocumentsPage setActiveTab={setActiveTab} />;
      case 'action-plan':
        return <ActionPlanPage setActiveTab={setActiveTab} />;
      case 'chat':
        return <ChatPage setActiveTab={setActiveTab} />;
      case 'admin':
        return <AdminPage setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfilePage setActiveTab={setActiveTab} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F3] font-sans text-slate-900">
      {/* 1-to-3 Preferred Language Onboarding / Settings Modal */}
      <LanguageOnboardingModal />

      {/* Rural Entrepreneur Authentication & Onboarding Flow Modal */}
      <AuthOnboardingModal setActiveTab={setActiveTab} />

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 lg:pb-8">
        <Suspense fallback={<PageLoader />}>
          {renderTabContent()}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <GramNitiProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </GramNitiProvider>
    </LanguageProvider>
  );
}
