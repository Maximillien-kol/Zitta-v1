import { Scale, FileText, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZLegalAdvicePage() {
  const { t } = useTranslation();
  return (
    <div className="w-full flex-1 overflow-y-auto bg-[#F5EFEB]">
      <div className="bg-[#567C8D] py-20 px-6 sm:px-8 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{t('Legal Support & Advice')}</h1>
        <p className="text-[#F5EFEB] text-lg max-w-2xl mx-auto mb-8">
          {t('Navigate the complexities of real estate law with our network of experienced attorneys and legal professionals.')}
        </p>
        <button className="bg-[#2F4156] hover:bg-[#FFFFFF] hover:text-[#2F4156] text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg inline-flex items-center gap-2">
          {t('Consult an Expert')} <ArrowRight size={20} />
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <Scale size={32} className="text-[#567C8D] mb-6" />
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Dispute Resolution')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Expert mediation and representation for tenant-landlord disputes, boundary issues, and contract disagreements.')}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <FileText size={32} className="text-[#567C8D] mb-6" />
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Contract Review')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Meticulous review of purchase agreements, lease documents, and closing paperwork to protect your interests.')}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] hover:shadow-md transition-shadow">
            <ShieldCheck size={32} className="text-[#567C8D] mb-6" />
            <h3 className="text-xl font-bold text-[#2F4156] mb-3">{t('Title Insurance')}</h3>
            <p className="text-[#567C8D] leading-relaxed">
              {t('Comprehensive title searches and insurance coordination to ensure a clear transfer of property ownership.')}
            </p>
          </div>
        </div>

        <div className="mt-16 bg-[#2F4156] rounded-2xl p-8 sm:p-12 text-center">
             <h2 className="text-3xl font-bold text-white mb-4">{t('Need immediate assistance?')}</h2>
             <p className="text-[#C8D9E6] mb-8 max-w-xl mx-auto">{t('Our legal support hotline is available 24/7 for urgent real estate matters and consultation routing.')}</p>
             <button className="bg-white text-[#2F4156] px-8 py-3 rounded-lg font-bold hover:bg-[#F5EFEB] transition-colors">{t('Call 1-800-LAW-HOME')}</button>
        </div>
      </div>
    </div>
  );
}
