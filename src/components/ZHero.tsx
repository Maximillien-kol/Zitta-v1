import { Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ZHero({ onAction }: { onAction?: (action: string) => void }) {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOverlay(true);
  };

  const handleAction = (type: string) => {
    setShowOverlay(false);
    onAction?.(type);
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] bg-gray-900 flex flex-col justify-center overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80" 
        alt="Hero background house" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6">
        <h1 className="text-white text-[32px] sm:text-[44px] md:text-[52px] font-bold mb-6 sm:mb-8 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-tight">
          {t('Rentals. Homes. Agents. Loans.')}
        </h1>
        <form onSubmit={handleSearch} className="w-full max-w-[800px] bg-[#FFFFFF] rounded-lg flex items-center shadow-lg p-1">
          <input 
            type="text" 
            className="flex-1 pl-4 pr-2 py-3.5 outline-none text-[15px] sm:text-[17px] text-[#2F4156] placeholder:text-[#567C8D] rounded-l-lg bg-transparent font-medium" 
            placeholder={t('Enter an address, neighborhood, city, or ZIP code')} 
          />
          <button type="submit" className="px-5 py-2 cursor-pointer text-[#2F4156] hover:text-[#567C8D] transition-colors bg-[#FFFFFF] rounded-r-lg flex items-center justify-center">
            <Search size={22} strokeWidth={2} />
          </button>
        </form>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#FFFFFF] rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 text-[#567C8D] hover:text-[#2F4156] transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-[#2F4156] mb-2 text-center">{t('What are you looking to do?')}</h2>
            <p className="text-[#567C8D] mb-8 text-center">{t('Choose an option to see the most relevant results for your search.')}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleAction('Buy')}
                className="flex-1 bg-[#567C8D] hover:bg-[#2F4156] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
              >
                {t('Buy a home')}
              </button>
              <button 
                onClick={() => handleAction('Rent')}
                className="flex-1 bg-[#FFFFFF] border-2 border-[#567C8D] text-[#567C8D] hover:bg-[#F5EFEB] font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
              >
                {t('Rent a home')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
