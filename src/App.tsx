import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ZTopNav } from './components/ZTopNav';
import { ZSideNav } from './components/ZSideNav';
import { ZHero } from './components/ZHero';
import { ZHomeCard } from './components/ZHomeCard';
import { ZFilterBar, FilterState, defaultFilterState } from './components/ZFilterBar';
import { ZSearchPage } from './components/ZSearchPage';
import { ZInvestmentPage } from './components/ZInvestmentPage';
import { ZLegalAdvicePage } from './components/ZLegalAdvicePage';
import { ZGetHelpPage } from './components/ZGetHelpPage';
import { ZServicesPage } from './components/ZServicesPage';
import { ZPropertyDetailPage } from './components/ZPropertyDetailPage';
import { ZDashboardPage } from './components/ZDashboardPage';
import { ZOwnerLogin } from './components/ZOwnerLogin';
import { ZOwnerRegister } from './components/ZOwnerRegister';
import { ZOnboarding } from './components/ZOnboarding';
import { api } from './services/api';
import { supabase } from './services/supabase';
import { Property } from './types';
import { ZUpdatesPage } from './components/ZUpdatesPage';
import { ZSavedPage } from './components/ZSavedPage';
import { ZInboxPage } from './components/ZInboxPage';
import { useTranslation } from 'react-i18next';

type UserRole = 'owner' | 'visitor';
type CurrentUser = { id: string; email: string; role: UserRole } | null;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [searchType, setSearchType] = useState('For sale');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({ ...defaultFilterState });

  const handleFiltersChange = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
  }, []);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [loginError, setLoginError] = useState('');

  // Derive user role from Supabase metadata
  const resolveRole = (user: any): UserRole => {
    const t = user?.user_metadata?.user_type;
    // 'owner' if explicitly set, or if no type (legacy accounts treated as owner)
    return t === 'visitor' ? 'visitor' : 'owner';
  };

  useEffect(() => {
    api.getFeaturedProperties().then(setFeaturedProperties);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = resolveRole(session.user);
        setIsAuthenticated(true);
        setCurrentUser({ id: session.user.id, email: session.user.email || '', role });
        api.getSavedPropertyIds().then(setSavedPropertyIds);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = resolveRole(session.user);
        setIsAuthenticated(true);
        setCurrentUser({ id: session.user.id, email: session.user.email || '', role });
        api.getSavedPropertyIds().then(setSavedPropertyIds);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setSavedPropertyIds([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Owner Login handler ─────────────────────────────────────────────────
  const handleOwnerLogin = async (email: string, password: string) => {
    setLoginError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setLoginError(error.message); return; }
    const role = resolveRole(data.user);
    setIsAuthenticated(true);
    setCurrentUser({ id: data.user!.id, email: data.user!.email || '', role });
    navigate('/dashboard');
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  // ── Chat with owner ─────────────────────────────────────────────────────
  const handleTalkToAgent = async (agentName: string, agentId: string) => {
    if (!currentUser) {
      navigate('/onboard');
      return;
    }
    try {
      const propertyId = selectedProperty?.id || 'prop';
      const buyerName = currentUser.email.split('@')[0];
      const conversation = await api.createConversation(
        propertyId.toString(), currentUser.id, agentId, agentName, buyerName
      );
      navigate(`/inbox?chat=${conversation.id}`);
    } catch (e) {
      console.error('Failed to start conversation:', e);
    }
  };

  // ── Onboarding complete ─────────────────────────────────────────────────
  const handleOnboardingComplete = () => {
    const redirect = new URLSearchParams(location.search).get('redirect');
    navigate(redirect === 'inbox' ? '/inbox' : '/');
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    navigate(`/property/${property.id}`);
  };

  const toggleSave = async (propertyId: string) => {
    try {
      const isSaved = savedPropertyIds.includes(propertyId);
      setSavedPropertyIds(prev => isSaved ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
      if (isSaved) await api.removeSavedProperty(propertyId);
      else await api.saveProperty(propertyId);
    } catch (e) {
      console.error('Failed to toggle save', e);
    }
  };

  const handleNavAction = (action: string) => {
    if (action === 'Buy') navigate('/buy');
    else if (action === 'Rent') navigate('/rent');
    else navigate('/search');
  };

  // ── Route groups ────────────────────────────────────────────────────────
  const path = location.pathname;
  const isSearchPath = ['/search', '/buy', '/rent', '/properties', '/sell'].includes(path);
  const isDashboardPath = path.startsWith('/dashboard');
  const isOwnerAuthPath = path.startsWith('/owner/');

  useEffect(() => {
    if (path === '/rent') setSearchType('For rent');
    else if (path === '/buy' || path === '/sell') setSearchType('For sale');
  }, [path]);

  // ── Dashboard — owner only, no topnav/sidenav ──────────────────────────
  if (isDashboardPath) {
    if (!isAuthenticated || currentUser?.role !== 'owner') {
      return <Navigate to="/owner/login" replace />;
    }
    return <ZDashboardPage onLogout={handleLogout} />;
  }

  // ── Owner auth pages — standalone layout ───────────────────────────────
  if (isOwnerAuthPath) {
    return (
      <Routes location={location}>
        <Route path="/owner/login" element={<ZOwnerLogin onLogin={handleOwnerLogin} error={loginError} />} />
        <Route path="/owner/register" element={<ZOwnerRegister />} />
        <Route path="*" element={<Navigate to="/owner/login" replace />} />
      </Routes>
    );
  }


  // ── Main app shell ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5EFEB] font-sans antialiased flex flex-col text-[#2F4156]">
      <div className="sticky top-0 z-50 bg-[#FFFFFF] w-full">
        <ZTopNav onNavClick={(view) => { if (view === 'SignIn') navigate('/onboard'); }} />
      </div>

      <div className="flex flex-1 w-full overflow-hidden relative">
        <ZSideNav isAuthenticated={isAuthenticated} />

        <div className="flex-1 md:ml-[80px] flex flex-col overflow-hidden pb-[64px] md:pb-0">
          {isSearchPath && (
            <div className="sticky top-0 z-40 bg-white w-full">
              <ZFilterBar searchType={searchType} onSearchTypeChange={setSearchType} onFiltersChange={handleFiltersChange} />
            </div>
          )}

          <main className={`flex-1 outline-none ${isSearchPath ? 'flex flex-col overflow-hidden' : 'block overflow-y-auto bg-[#FFFFFF]'}`} tabIndex={-1}>
            <Routes location={location}>

              {/* Home */}
              <Route path="/" element={
                <>
                  <ZHero onAction={handleNavAction} />
                  <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-12 w-full pb-12">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <h2 className="text-[18px] md:text-[20px] font-semibold text-[#2F4156]">{t('Homes For You')}</h2>
                        <p className="text-[14px] md:text-[15px] text-[#567C8D] mt-0.5">{t('Based on homes you recently viewed')}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2">
                        <button className="w-[32px] h-[32px] rounded-full border border-[#C8D9E6] flex items-center justify-center text-[#2F4156] hover:bg-[#F5EFEB] transition-colors">
                          <ChevronLeft size={18} strokeWidth={1.5} />
                        </button>
                        <button className="w-[32px] h-[32px] rounded-full border border-[#C8D9E6] flex items-center justify-center text-[#2F4156] hover:bg-[#F5EFEB] transition-colors">
                          <ChevronRight size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                      {featuredProperties.map(prop => (
                        <div key={prop.id} className="snap-start pt-1 pb-1">
                          <ZHomeCard property={prop} onClick={() => handlePropertyClick(prop)} isSaved={savedPropertyIds.includes(prop.id.toString())} onToggleSave={() => toggleSave(prop.id.toString())} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-14 pt-8 border-t border-[#C8D9E6]">
                      <h2 className="text-[18px] md:text-[20px] font-semibold text-[#2F4156] mb-4">{t('Find homes you can afford with BuyAbility™')}</h2>
                    </div>
                  </div>
                </>
              } />

              {/* Search / browse */}
              <Route path="/search" element={<ZSearchPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} filters={activeFilters} />} />
              <Route path="/buy" element={<ZSearchPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} filters={activeFilters} />} />
              <Route path="/rent" element={<ZSearchPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} filters={activeFilters} />} />
              <Route path="/sell" element={<ZSearchPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} filters={activeFilters} />} />
              <Route path="/properties" element={<ZSearchPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} filters={activeFilters} />} />

              {/* Property detail */}
              <Route path="/property/:id" element={
                <ZPropertyDetailPage
                  property={selectedProperty}
                  savedPropertyIds={savedPropertyIds}
                  onToggleSave={toggleSave}
                  onTalkToAgent={handleTalkToAgent}
                  currentUser={currentUser}
                />
              } />

              {/* Info pages */}
              <Route path="/investment" element={<ZInvestmentPage />} />
              <Route path="/legal-advice" element={<ZLegalAdvicePage />} />
              <Route path="/get-help" element={<ZGetHelpPage />} />
              <Route path="/services" element={<ZServicesPage />} />
              <Route path="/updates" element={<ZUpdatesPage />} />
              <Route path="/saved" element={<ZSavedPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} />} />

              {/* Onboarding */}
              <Route path="/onboard" element={<ZOnboarding onComplete={handleOnboardingComplete} />} />
              <Route path="/sign-in" element={<Navigate to="/onboard" replace />} />

              {/* Inbox — any authenticated user */}
              <Route path="/inbox" element={
                isAuthenticated
                  ? <ZInboxPage currentUser={currentUser} />
                  : <Navigate to="/onboard?redirect=inbox" replace />
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
