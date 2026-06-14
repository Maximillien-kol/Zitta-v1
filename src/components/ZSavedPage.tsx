import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SearchProperty } from '../types';
import { ZSearchCard } from './ZSearchCard';
import { useTranslation } from 'react-i18next';

export function ZSavedPage({ onPropertyClick, savedPropertyIds = [], onToggleSave }: { onPropertyClick?: (property: any) => void, savedPropertyIds?: string[], onToggleSave?: (id: string) => void }) {
  const { t } = useTranslation();
  const [savedProperties, setSavedProperties] = useState<SearchProperty[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.getPropertiesByIds(savedPropertyIds).then(sorted => {
      setSavedProperties(sorted);
      setLoading(false);
    });
  }, [savedPropertyIds]);

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] w-full p-6 lg:p-8">
      <div className="mx-auto w-full">
        <h1 className="text-[28px] font-bold text-[#2F4156] mb-2">{t('Saved homes')}</h1>
        <p className="text-[#567C8D] mb-8">{savedProperties.length} {t('properties saved')}</p>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#F5EFEB] rounded-2xl">
            <p className="text-[#567C8D]">{t('Loading saved homes...')}</p>
          </div>
        ) : savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
            {savedProperties.map(prop => (
              <ZSearchCard key={prop.id} property={prop} onClick={() => onPropertyClick?.(prop)} isSaved={true} onToggleSave={() => onToggleSave?.(prop.id.toString())} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-[#F5EFEB] rounded-2xl">
            <h3 className="text-[18px] font-semibold text-[#2F4156] mb-2">{t('No saved homes yet')}</h3>
            <p className="text-[#567C8D]">{t('Heart a home to save it here.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
