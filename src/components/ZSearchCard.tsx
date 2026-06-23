import React from 'react';
import { MapPin, Heart, Bed, Bath, Maximize2, Clock, Star } from 'lucide-react';
import { SearchProperty } from '../types';
import { useTranslation } from 'react-i18next';

export const ZSearchCard: React.FC<{ property: SearchProperty, onClick?: () => void, isSaved?: boolean, onToggleSave?: () => void }> = ({ property, onClick, isSaved = false, onToggleSave }) => {
  const { t } = useTranslation();
  
  // Use first part of the address as title for display
  const title = property.address.split(',')[0];
  
  return (
    <div className="flex flex-col bg-[#FFFFFF] rounded-[20px] border border-[#F5EFEB] shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer w-full" onClick={onClick}>
      <div className="w-full relative h-[260px] overflow-hidden">
        <img src={property.images[0]} alt={property.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Top Overlays */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <div className="bg-[#FFFFFF] px-3 py-1 rounded-full text-[13px] font-medium text-[#2F4156] shadow-sm">
            {t('New Listing')}
          </div>
          <div className="bg-[#FFFFFF] px-2 py-1 rounded-full text-[13px] font-medium text-[#2F4156] shadow-sm flex items-center gap-1">
            4.9 <Star size={12} className="fill-[#F5A623] text-[#F5A623]" />
          </div>
        </div>
        <button 
          className={`absolute top-3 right-3 z-10 p-2 transition-colors drop-shadow-md rounded-full ${isSaved ? 'text-red-500 bg-white/80' : 'text-white hover:text-red-500'}`}
          onClick={(e) => { e.stopPropagation(); onToggleSave?.(); }}
        >
          <Heart size={24} strokeWidth={isSaved ? 0 : 1.5} className={isSaved ? 'fill-red-500' : ''} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col pt-3">
        {/* Price */}
        <h3 className="text-[24px] font-bold text-[#2F4156] leading-none flex items-baseline gap-1 mb-1.5">
          RF {property.price.toLocaleString()} <span className="text-[16px] text-[#567C8D] font-normal">{t('/year')}</span>
        </h3>
        
        {/* Title */}
        <h4 className="text-[17px] text-[#2F4156] font-medium leading-tight mb-2">
          {title}, {t('Villa')}
        </h4>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
           <MapPin size={16} className="text-[#567C8D]" strokeWidth={2} />
           <span className="text-[14px] text-[#567C8D] font-medium">{property.address}</span>
        </div>
        
        {/* Pills */}
        <div className="flex items-center gap-2 mb-3">
           <div className="flex items-center gap-1.5 border border-[#C8D9E6] rounded-lg px-2.5 py-1.5 text-[13px] text-[#567C8D] font-medium">
             <Bed size={16} className="text-[#C8D9E6]" />
             {property.bedrooms} {t('Beds')}
           </div>
           <div className="flex items-center gap-1.5 border border-[#C8D9E6] rounded-lg px-2.5 py-1.5 text-[13px] text-[#567C8D] font-medium">
             <Bath size={16} className="text-[#C8D9E6]" />
             {property.rooms} {t('Baths')}
           </div>
           <div className="flex items-center gap-1.5 border border-[#C8D9E6] rounded-lg px-2.5 py-1.5 text-[13px] text-[#567C8D] font-medium">
             <Maximize2 size={16} className="text-[#C8D9E6]" />
             {property.sqft} m²
           </div>
        </div>
      </div>
    </div>
  );
}
