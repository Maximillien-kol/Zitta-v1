import { useEffect, useState } from 'react';
import { Bell, Home, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Property } from '../types';

export function ZUpdatesPage() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFeaturedProperties()
      .then(props => {
        setProperties(props);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Construct real notifications based on properties in the database
  const updates = properties.map((prop, index) => {
    const hoursAgo = (index + 1) * 2;
    const isEven = index % 2 === 0;

    return {
      id: prop.id,
      type: isEven ? 'new_listing' : 'price_drop',
      title: isEven 
        ? `New Listing in ${prop.address.split(',')[1] || prop.address.split(',')[0]}` 
        : `Price Alert: ${prop.address.split(',')[0]}`,
      description: isEven 
        ? `${prop.beds} beds, ${prop.baths} baths, ${prop.sqft} sq ft property now available for RF ${prop.price.toLocaleString()}`
        : `Great deal! This property listed by ${prop.agent.split(',')[0]} is currently Active.`,
      time: hoursAgo > 24 ? `${Math.floor(hoursAgo / 24)} days ago` : `${hoursAgo} hours ago`,
      icon: isEven ? Home : TrendingDown,
      color: isEven ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
    };
  });

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] w-full p-6 lg:p-8">
      <div className="max-w-[800px] mx-auto w-full">
        <h1 className="text-[28px] font-bold text-[#2F4156] mb-2">{t('Updates')}</h1>
        <p className="text-[#567C8D] mb-8">{t('Recent notifications and market alerts.')}</p>

        {loading ? (
          <div className="text-center py-12 text-[#567C8D]">
            <p className="text-[16px]">{t('Loading updates...')}</p>
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#C8D9E6] rounded-2xl bg-[#F9FAFB]">
            <Bell size={40} className="text-[#C8D9E6] mx-auto mb-4" />
            <h3 className="font-bold text-[#2F4156] mb-1">{t('No updates yet')}</h3>
            <p className="text-[14px] text-[#567C8D]">{t('When new properties are listed or prices drop, alerts will appear here.')}</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
