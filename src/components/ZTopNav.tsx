import { Menu, ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const flags: Record<string, string> = {
  en: '/flags/us.png',
  fr: '/flags/fr.png',
  sw: '/flags/ke.png',
  rw: '/flags/rw.png'
};

export function ZTopNav({ onNavClick }: { onNavClick?: (view: string) => void }) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language || 'en';

  return (
    <>
      <header className="h-[80px] bg-[#FFFFFF] border-b border-[#F5EFEB] flex flex-col justify-center px-6 md:px-[80px] relative z-40">
        <div className="flex items-center justify-between">
          {/* Left Desktop Nav */}
          <nav className="hidden lg:flex items-center justify-start gap-4 xl:gap-6 flex-1">
            <Link to="/buy" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium">{t('Buy')}</Link>
            <Link to="/rent" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium whitespace-nowrap">{t('Rent')}</Link>
            <Link to="/sell" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium whitespace-nowrap">{t('Sell')}</Link>
            <Link to="/properties" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium whitespace-nowrap">{t('Properties')}</Link>
            <Link to="/services" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium whitespace-nowrap">{t('Services')}</Link>
          </nav>

          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-[#2F4156]">
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Center Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center justify-center px-4 cursor-pointer">
            <div className="text-[#567C8D] flex items-center">
              <span className="font-semibold tracking-tighter -skew-x-[12deg] text-[28px] mr-[1px]">z</span>
              <span className="font-medium text-[26px]">itta</span>
            </div>
          </Link>

          {/* Right Desktop Nav — Sign In removed */}
          <nav className="hidden lg:flex items-center justify-end gap-4 xl:gap-6 flex-1">
            <Link to="/investment" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium whitespace-nowrap">{t('Investment')}</Link>
            <Link to="/legal-advice" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium whitespace-nowrap">{t('Legal Advice')}</Link>
            <Link to="/get-help" className="text-[#2F4156] hover:text-[#567C8D] text-[15px] transition-colors leading-none font-medium whitespace-nowrap">{t('Get help')}</Link>

            {/* Language switcher */}
            <div className="relative group cursor-pointer ml-1">
              <button className="flex items-center gap-1.5 text-[#2F4156] hover:text-[#567C8D] transition-colors h-[40px] px-2 rounded-md hover:bg-[#F5EFEB]">
                <img src={flags[currentLang] || flags.en} alt={currentLang} className="w-5 object-contain" />
                <span className="text-[14px] font-medium uppercase">{currentLang}</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute right-0 top-full pt-1 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#FFFFFF] border border-[#F5EFEB] rounded-lg shadow-xl py-1">
                  <div onClick={() => changeLanguage('en')} className="px-4 py-2.5 hover:bg-[#F5EFEB] text-[14px] text-[#2F4156] cursor-pointer flex items-center gap-3 font-medium transition-colors">
                    <img src={flags.en} alt="en" className="w-5 object-contain" /> English (EN)
                  </div>
                  <div onClick={() => changeLanguage('fr')} className="px-4 py-2.5 hover:bg-[#F5EFEB] text-[14px] text-[#2F4156] cursor-pointer flex items-center gap-3 font-medium transition-colors">
                    <img src={flags.fr} alt="fr" className="w-5 object-contain" /> Français (FR)
                  </div>
                  <div onClick={() => changeLanguage('sw')} className="px-4 py-2.5 hover:bg-[#F5EFEB] text-[14px] text-[#2F4156] cursor-pointer flex items-center gap-3 font-medium transition-colors">
                    <img src={flags.sw} alt="sw" className="w-5 object-contain" /> Kiswahili (SW)
                  </div>
                  <div onClick={() => changeLanguage('rw')} className="px-4 py-2.5 hover:bg-[#F5EFEB] text-[14px] text-[#2F4156] cursor-pointer flex items-center gap-3 font-medium transition-colors">
                    <img src={flags.rw} alt="rw" className="w-5 object-contain" /> Kinyarwanda (RW)
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Spacer for mobile logo centering if needed */}
          <div className="lg:hidden w-[40px]"></div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFFFFF] flex flex-col">
          <div className="h-[80px] border-b border-[#F5EFEB] flex items-center justify-between px-6 flex-shrink-0">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -ml-2 text-[#2F4156]">
              <X size={24} strokeWidth={1.5} />
            </button>
            <div className="text-[#567C8D] flex items-center">
              <span className="font-semibold tracking-tighter -skew-x-[12deg] text-[28px] mr-[1px]">z</span>
              <span className="font-medium text-[26px]">itta</span>
            </div>
            <div className="w-[40px]"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/buy" className="text-[18px] font-medium text-[#2F4156]">{t('Buy')}</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/rent" className="text-[18px] font-medium text-[#2F4156]">{t('Rent')}</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/sell" className="text-[18px] font-medium text-[#2F4156]">{t('Sell')}</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/properties" className="text-[18px] font-medium text-[#2F4156]">{t('Properties')}</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/services" className="text-[18px] font-medium text-[#2F4156]">{t('Services')}</Link>
            
            <div className="h-[1px] bg-[#F5EFEB] my-2" />
            
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/investment" className="text-[18px] font-medium text-[#2F4156]">{t('Investment')}</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/legal-advice" className="text-[18px] font-medium text-[#2F4156]">{t('Legal Advice')}</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/get-help" className="text-[18px] font-medium text-[#2F4156]">{t('Get help')}</Link>

            <div className="mt-4">
              <span className="text-[14px] text-[#567C8D] font-medium mb-3 block">Language</span>
              <div className="flex flex-col gap-3">
                <button onClick={() => { changeLanguage('en'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3">
                  <img src={flags.en} alt="en" className="w-6 object-contain" /> <span className="text-[16px] font-medium text-[#2F4156]">English</span>
                </button>
                <button onClick={() => { changeLanguage('fr'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3">
                  <img src={flags.fr} alt="fr" className="w-6 object-contain" /> <span className="text-[16px] font-medium text-[#2F4156]">Français</span>
                </button>
                <button onClick={() => { changeLanguage('sw'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3">
                  <img src={flags.sw} alt="sw" className="w-6 object-contain" /> <span className="text-[16px] font-medium text-[#2F4156]">Kiswahili</span>
                </button>
                <button onClick={() => { changeLanguage('rw'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3">
                  <img src={flags.rw} alt="rw" className="w-6 object-contain" /> <span className="text-[16px] font-medium text-[#2F4156]">Kinyarwanda</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
