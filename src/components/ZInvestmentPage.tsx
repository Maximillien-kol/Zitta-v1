import { TrendingUp, PieChart, Building2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZInvestmentPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex-1 overflow-y-auto bg-[#F5EFEB]">
      <div className="bg-[#2F4156] py-20 px-6 sm:px-8 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{t('Real Estate Investment')}</h1>
        <p className="text-[#C8D9E6] text-lg max-w-2xl mx-auto mb-8">
          {t('Build generational wealth with our carefully curated portfolio of high-yield properties and market insights.')}
        </p>
        <button className="bg-[#567C8D] hover:bg-[#C8D9E6] hover:text-[#2F4156] text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg inline-flex items-center gap-2">
          {t('Start Investing')} <ArrowRight size={20} />
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6]">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Market Analysis')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Access real-time data and predictive analytics to make informed decisions on up-and-coming neighborhoods.')}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6]">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <PieChart size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Portfolio Diversification')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Spread your risk across residential, commercial, and multi-family units managed by our expert team.')}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6]">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Property Management')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Enjoy passive income while we handle tenant screening, maintenance, and rent collection.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
