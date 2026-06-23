import { Heart } from 'lucide-react';
import { Property } from '../types';
import { useTranslation } from 'react-i18next';

export function ZHomeCard({ property, onClick, isSaved = false, onToggleSave }: { property: Property, onClick?: () => void, isSaved?: boolean, onToggleSave?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="min-w-[280px] sm:min-w-[320px] w-[280px] sm:w-[320px] flex-shrink-0 flex flex-col rounded-[6px] overflow-hidden border border-[#F5EFEB] bg-[#FFFFFF] hover:shadow-md hover:border-[#C8D9E6] transition-all relative cursor-pointer group" onClick={onClick}>
      <div className="relative h-[220px] sm:h-[280px] w-full overflow-hidden bg-gray-100">
         <img src={property.image} alt={property.address} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
         
         {property.badgeText && (
           <div className={`absolute top-2 left-2 text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px] shadow-sm z-10 ${property.badgeType === 'red' ? 'bg-[#2F4156]' : 'bg-[#567C8D]'}`}>
             {property.badgeText}
           </div>
         )}
         
         <button 
           className={`absolute top-2 right-2 z-10 p-1.5 transition-colors drop-shadow-md rounded-full ${isSaved ? 'text-red-500 bg-white/80' : 'text-white hover:text-red-500'}`}
           onClick={(e) => { e.stopPropagation(); onToggleSave?.(); }}
         >
           <Heart size={20} strokeWidth={isSaved ? 0 : 1.5} className={isSaved ? 'fill-red-500' : ''} />
         </button>
         
         <div className="absolute right-1 bottom-1 bg-[#FFFFFF]/90 border border-[#F5EFEB]/50 text-[#2F4156] text-[9px] font-bold px-[3px] py-[1px] z-10 opacity-90 rounded-sm uppercase tracking-wider backdrop-blur-sm">
            IDX
         </div>
      </div>
      
      <div className="p-3.5 flex flex-col">
         <div className="text-[22px] sm:text-[24px] font-bold text-[#2F4156] leading-none mb-2">
            RF {property.price.toLocaleString()}
         </div>
         
         <div className="flex items-center text-[14px] text-[#2F4156] gap-1.5 mb-1.5 flex-wrap">
             <span className="font-semibold">{property.beds}</span> {t('bds')}
             <span className="text-[#567C8D] font-light text-[12px] relative top-[1px]">|</span>
             <span className="font-semibold">{property.baths}</span> {t('ba')}
             <span className="text-[#567C8D] font-light text-[12px] relative top-[1px]">|</span>
             <span className="font-semibold">{property.sqft.toLocaleString()}</span> {t('sqft')}
             <span className="text-[#567C8D] font-light text-[12px] relative top-[1px]">|</span>
             <span className="text-[#2F4156] font-medium">{t(property.status)}</span>
         </div>
         
         <div className="text-[14px] text-[#2F4156] mb-1 truncate font-normal">
            {property.address}
         </div>
         
         <div className="text-[10px] text-[#567C8D] uppercase line-clamp-1 leading-tight tracking-[0.02em] mt-1 font-medium">
            {t('MLS ID')} {property.mlsId}, {t('LISTING BY:')} {property.agent}
         </div>
      </div>
    </div>
  );
}
