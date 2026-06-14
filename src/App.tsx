import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ZTopNav } from './components/ZTopNav';
import { ZSideNav } from './components/ZSideNav';
import { ZHero } from './components/ZHero';
import { ZHomeCard } from './components/ZHomeCard';
import { ZFilterBar } from './components/ZFilterBar';
import { ZSearchPage } from './components/ZSearchPage';
import { ZInvestmentPage } from './components/ZInvestmentPage';
import { ZLegalAdvicePage } from './components/ZLegalAdvicePage';
import { ZGetHelpPage } from './components/ZGetHelpPage';
import { ZServicesPage } from './components/ZServicesPage';
import { ZPropertyDetailPage } from './components/ZPropertyDetailPage';
import { api } from './services/api';
import { Property } from './types';

import { ZUpdatesPage } from './components/ZUpdatesPage';
import { ZSavedPage } from './components/ZSavedPage';
import { ZSignInPage } from './components/ZSignInPage';
import { ZInboxPage } from './components/ZInboxPage';

export default function App() {
  const [activeView, setActiveView] = useState('Search'); // Default to Search based on request
  const [searchType, setSearchType] = useState('For sale');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  
  useEffect(() => {
    // Check if there are saved properties in local storage (mock backend logic)
    // Could connect to api.authenticate() if there is token
    api.getFeaturedProperties().then(setFeaturedProperties);
  }, []);

  const handleNavClick = (view: string) => {
    if (view === 'Buy') {
      setSearchType('For sale');
      setActiveView('Search');
    } else if (view === 'Rent') {
      setSearchType('For rent');
      setActiveView('Search');
    } else if (view === 'Properties') {
      setSearchType('For sale');
      setActiveView('Search');
    } else {
      setActiveView(view);
    }
  };

  const handleSignIn = async (filters?: any) => {
    try {
      if (filters) {
        // Mock authentication/save preferences call
        await api.authenticate(filters);
        
        if (filters.goal === 'rent') {
           setSearchType('For rent');
        } else if (filters.goal === 'buy') {
           setSearchType('For sale');
        }
        setSearchFilters(filters);
        setActiveView('Search');
      } else {
        await api.authenticate({});
        setActiveView('Home');
      }
    } catch (e) {
      console.error("Sign in failed");
    }
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    setActiveView('PropertyDetail');
  };

  const toggleSave = async (propertyId: string) => {
    try {
      const isSaved = savedPropertyIds.includes(propertyId);
      
      // Optimistic UI update
      setSavedPropertyIds(prev => 
        isSaved ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
      );
      
      // Background API sync
      if (isSaved) {
        await api.removeSavedProperty(propertyId);
      } else {
        await api.saveProperty(propertyId);
      }
    } catch (e) {
      // Revert on failure
      console.error("Failed to toggle save state", e);
      setSavedPropertyIds(prev => 
        savedPropertyIds.includes(propertyId) 
          ? [...prev, propertyId] 
          : prev.filter(id => id !== propertyId)
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] font-sans antialiased flex flex-col text-[#2F4156]">
       {/* Top Navigation - Full Width */}
       <div className="sticky top-0 z-50 bg-[#FFFFFF] w-full">
         <ZTopNav onLogoClick={() => setActiveView('Home')} onNavClick={handleNavClick} />
       </div>
       
       <div className="flex flex-1 w-full overflow-hidden relative">
         <ZSideNav activeView={activeView} onViewChange={handleNavClick} />
         
         <div className="flex-1 md:ml-[80px] flex flex-col overflow-hidden">
           {activeView === 'Search' && (
             <div className="sticky top-0 z-40 bg-white w-full">
               <ZFilterBar searchType={searchType} onSearchTypeChange={setSearchType} initialFilters={searchFilters} />
             </div>
           )}
           
           <main className={`flex-1 outline-none ${activeView === 'Search' ? 'flex flex-col overflow-hidden' : 'block overflow-y-auto bg-[#FFFFFF]'}`} tabIndex={-1}>
           {activeView === 'Search' ? (
             <ZSearchPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} />
           ) : activeView === 'PropertyDetail' ? (
             <ZPropertyDetailPage property={selectedProperty} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} />
           ) : activeView === 'Investment' ? (
             <ZInvestmentPage />
           ) : activeView === 'Legal Advice' ? (
             <ZLegalAdvicePage />
           ) : activeView === 'Get help' ? (
             <ZGetHelpPage />
           ) : activeView === 'Services' ? (
             <ZServicesPage />
           ) : activeView === 'Updates' ? (
             <ZUpdatesPage />
           ) : activeView === 'Saved' ? (
             <ZSavedPage onPropertyClick={handlePropertyClick} savedPropertyIds={savedPropertyIds} onToggleSave={toggleSave} />
           ) : activeView === 'SignIn' ? (
             <ZSignInPage onSignIn={handleSignIn} />
           ) : activeView === 'Inbox' ? (
             <ZInboxPage />
           ) : (
             <>
               <ZHero onAction={handleNavClick} />
               
               <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-12 w-full pb-12">
                 <div className="flex items-end justify-between mb-4">
                    <div>
                      <h2 className="text-[18px] md:text-[20px] font-semibold text-[#2F4156]">Homes For You</h2>
                      <p className="text-[14px] md:text-[15px] text-[#567C8D] mt-0.5">Based on homes you recently viewed</p>
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
                 
                 {/* Scrollable container with hidden scrollbar */}
                 <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {featuredProperties.map(prop => (
                       <div key={prop.id} className="snap-start pt-1 pb-1">
                         <ZHomeCard property={prop} onClick={() => handlePropertyClick(prop)} isSaved={savedPropertyIds.includes(prop.id.toString())} onToggleSave={() => toggleSave(prop.id.toString())} />
                       </div>
                    ))}
                 </div>
                 
                 <div className="mt-14 pt-8 border-t border-[#C8D9E6]">
                    <h2 className="text-[18px] md:text-[20px] font-semibold text-[#2F4156] mb-4">Find homes you can afford with BuyAbility™</h2>
                 </div>
               </div>
             </>
           )}
          </main>
        </div>
       </div>
    </div>
  );
}
