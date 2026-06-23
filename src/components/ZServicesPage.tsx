import { Wrench, Key, Home, Camera, Shield, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZServicesPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex-1 overflow-y-auto bg-[#F5EFEB]">
      <div className="bg-[#2F4156] py-20 px-6 sm:px-8 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{t('Our Services')}</h1>
        <p className="text-[#C8D9E6] text-lg max-w-2xl mx-auto mb-8">
          {t('From property management to home appraisal, discover our full suite of professional real estate services.')}
        </p>
        <button className="bg-[#567C8D] hover:bg-[#C8D9E6] hover:text-[#2F4156] text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg inline-flex items-center gap-2">
          {t('Explore Services')} <ArrowRight size={20} />
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <Home size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Property Valuation')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t("Get an accurate, expert assessment of your property's current market value using our comprehensive data models.")}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <Key size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Property Management')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Full-service management for landlords, including tenant screening, rent collection, and maintenance.')}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <Wrench size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Home Improvement')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t("Connect with vetted contractors and interior designers to boost your home's value before selling.")}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <Camera size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Professional Staging')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Maximize your sale price with our premium staging and professional photography services.')}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#F5EFEB] rounded-xl flex items-center justify-center text-[#567C8D] mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Title & Escrow')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Secure, efficient closing services ensuring a smooth transfer of property ownership.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
