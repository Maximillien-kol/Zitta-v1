import { HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZGetHelpPage() {
  const { t } = useTranslation();
  return (
    <div className="w-full flex-1 overflow-y-auto bg-[#F5EFEB]">
      <div className="bg-[#FFFFFF] border-b border-[#C8D9E6] py-16 px-6 sm:px-8 text-center pt-24">
        <div className="w-16 h-16 bg-[#C8D9E6] rounded-full flex items-center justify-center text-[#2F4156] mx-auto mb-6">
           <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2F4156] tracking-tight mb-4">{t('How can we help?')}</h1>
        <div className="max-w-2xl mx-auto relative mt-8">
           <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]" size={20} />
           <input 
             type="text" 
             placeholder={t('Search knowledge base...')} 
             className="w-full bg-[#F5EFEB] border border-[#C8D9E6] text-[#2F4156] placeholder:text-[#567C8D] rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#567C8D] transition-shadow text-lg"
           />
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-[#2F4156] mb-8 text-center">{t('Contact Options')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <MessageCircle size={36} className="text-[#567C8D] mb-4" />
            <h3 className="text-xl font-bold text-[#2F4156] mb-2">{t('Live Chat')}</h3>
            <p className="text-[#567C8D] text-sm mb-6 flex-1">
              {t('Chat with a support agent in real-time. Available Mon-Fri, 9am - 6pm EST.')}
            </p>
            <button className="w-full bg-[#567C8D] hover:bg-[#2F4156] text-white py-2.5 rounded-lg font-medium transition-colors">{t('Start Chat')}</button>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <Phone size={36} className="text-[#567C8D] mb-4" />
            <h3 className="text-xl font-bold text-[#2F4156] mb-2">{t('Call Us')}</h3>
            <p className="text-[#567C8D] text-sm mb-6 flex-1">
              {t('Speak directly with our support team. Available 24/7 for urgent inquiries.')}
            </p>
            <button className="w-full bg-[#F5EFEB] hover:bg-[#C8D9E6] text-[#2F4156] border border-[#C8D9E6] py-2.5 rounded-lg font-medium transition-colors">{t('1-800-ZITTA')}</button>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-sm border border-[#C8D9E6] flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <Mail size={36} className="text-[#567C8D] mb-4" />
            <h3 className="text-xl font-bold text-[#2F4156] mb-2">{t('Email Support')}</h3>
            <p className="text-[#567C8D] text-sm mb-6 flex-1">
              {t("Send us an email and we'll get back to you within 24 hours.")}
            </p>
            <button className="w-full bg-[#F5EFEB] hover:bg-[#C8D9E6] text-[#2F4156] border border-[#C8D9E6] py-2.5 rounded-lg font-medium transition-colors">{t('Send Email')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SearchIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)
