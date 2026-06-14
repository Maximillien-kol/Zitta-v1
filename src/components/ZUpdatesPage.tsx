import { Bell, Home, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZUpdatesPage() {
  const { t } = useTranslation();

  const updates = [
    {
      id: 1,
      type: 'price_drop',
      title: 'Price Drop: $10,000 less',
      description: 'A property you saved in Miami just dropped its price.',
      time: '2 hours ago',
      icon: TrendingDown,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      type: 'new_listing',
      title: 'New Listing Matches Your Search',
      description: '3 beds, 2 baths in downtown area.',
      time: '5 hours ago',
      icon: Home,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      type: 'general',
      title: 'Weekly Market Update',
      description: 'See the latest trends in the real estate market.',
      time: '1 day ago',
      icon: Bell,
      color: 'bg-[#F5EFEB] text-[#567C8D]'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] w-full p-6 lg:p-8">
      <div className="max-w-[800px] mx-auto w-full">
        <h1 className="text-[28px] font-bold text-[#2F4156] mb-2">{t('Updates')}</h1>
        <p className="text-[#567C8D] mb-8">{t('Recent notifications and market alerts.')}</p>

        <div className="flex flex-col gap-4">
          {updates.map(update => (
            <div key={update.id} className="flex gap-4 p-5 rounded-2xl border border-[#C8D9E6] hover:shadow-md transition-shadow bg-white">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${update.color}`}>
                <update.icon size={20} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                  <h3 className="text-[16px] font-semibold text-[#2F4156]">{t(update.title)}</h3>
                  <span className="text-[12px] font-medium text-[#567C8D] whitespace-nowrap">{t(update.time)}</span>
                </div>
                <p className="text-[14px] text-[#567C8D] leading-relaxed">{t(update.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
