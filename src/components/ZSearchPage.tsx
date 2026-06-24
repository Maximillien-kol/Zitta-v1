import { useState, useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { api } from '../services/api';
import { SearchProperty } from '../types';
import { ZSearchCard } from './ZSearchCard';
import { useSEO } from '../hooks/useSEO';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { FilterState } from './ZFilterBar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Helper component to fix map sizing issues when toggling
function MapResizer({ mapEnabled }: { mapEnabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // Wait for transition
  }, [mapEnabled, map]);
  return null;
}

// Location pin icon (SVG-based DivIcon)
const createLocationIcon = () => {
  return new L.DivIcon({
    className: 'custom-location-marker',
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z" fill="#2F4156"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
    tooltipAnchor: [0, -32]
  });
};

const locationIcon = createLocationIcon();

// Parse price filter to min/max range
function parsePriceFilter(price: string): { min: number; max: number } {
  if (!price || price === 'Any price') return { min: 0, max: Infinity };
  if (price === 'Under RF 100k') return { min: 0, max: 100000 };
  if (price === 'RF 100k - RF 300k') return { min: 100000, max: 300000 };
  if (price === 'RF 300k - RF 500k') return { min: 300000, max: 500000 };
  if (price === 'RF 500k - RF 1M') return { min: 500000, max: 1000000 };
  if (price === 'Over RF 1M') return { min: 1000000, max: Infinity };
  return { min: 0, max: Infinity };
}

// Parse beds filter to minimum count
function parseBedsFilter(beds: string): number {
  if (!beds || beds === 'Any') return 0;
  const match = beds.match(/^(\d+)\+/);
  return match ? parseInt(match[1], 10) : 0;
}

// Map property type filter labels to database values
function matchPropertyType(filterType: string, propType?: string): boolean {
  if (!filterType || filterType === 'Any type') return true;
  if (!propType) return true;
  const normalizedFilter = filterType.toLowerCase();
  const normalizedProp = propType.toLowerCase();
  // Match common variants
  if (normalizedFilter === 'houses' && (normalizedProp.includes('house') || normalizedProp.includes('villa'))) return true;
  if (normalizedFilter === 'townhomes' && normalizedProp.includes('townho')) return true;
  if (normalizedFilter === 'multi-family' && normalizedProp.includes('multi')) return true;
  if (normalizedFilter === 'condos/co-ops' && (normalizedProp.includes('condo') || normalizedProp.includes('co-op'))) return true;
  if (normalizedFilter === 'lots/land' && (normalizedProp.includes('lot') || normalizedProp.includes('land'))) return true;
  // Also match exact or contains
  return normalizedProp.includes(normalizedFilter) || normalizedFilter.includes(normalizedProp);
}

// Map status filter to property status values
function matchStatus(filterStatus: string, propStatus?: string): boolean {
  if (!filterStatus || filterStatus === 'Any status') return true;
  if (!propStatus) return true;
  const fs = filterStatus.toLowerCase();
  const ps = propStatus.toLowerCase();
  if (fs === 'for sale' && (ps === 'for sale' || ps === 'active')) return true;
  if (fs === 'for rent' && ps === 'for rent') return true;
  if (fs === 'sold' && ps === 'sold') return true;
  return false;
}

export function ZSearchPage({ onPropertyClick, savedPropertyIds = [], onToggleSave, filters }: { onPropertyClick?: (property: any) => void, savedPropertyIds?: string[], onToggleSave?: (id: string) => void, filters?: FilterState }) {
  const [mapEnabled, setMapEnabled] = useState(false);
  const [allProperties, setAllProperties] = useState<SearchProperty[]>([]);
  const { t } = useTranslation();

  // Intense Global SEO for the Search/Listings Page
  useSEO({
    title: 'Browse Real Estate',
    description: 'Browse the largest selection of houses, apartments, and commercial real estate for rent and sale in Rwanda. Filter by price, location, and amenities.',
    keywords: 'Rwanda real estate listings, houses for sale Kigali, apartments for rent Rwanda, Kigali property map, zero commission real estate'
  });

  useEffect(() => {
    api.searchProperties({}).then(setAllProperties);
  }, []);

  // Apply client-side filtering
  const filteredProperties = useMemo(() => {
    if (!filters) return allProperties;

    return allProperties.filter(prop => {
      // Search text filter
      if (filters.searchText && filters.searchText.trim()) {
        const search = filters.searchText.toLowerCase();
        if (!prop.address.toLowerCase().includes(search)) return false;
      }

      // Status filter
      if (!matchStatus(filters.status, (prop as any).status)) return false;

      // Price filter
      const { min, max } = parsePriceFilter(filters.price);
      if (prop.price < min || prop.price > max) return false;

      // Beds & baths filter
      const minBeds = parseBedsFilter(filters.beds);
      if (minBeds > 0 && prop.bedrooms < minBeds) return false;

      // Property type filter
      if (!matchPropertyType(filters.propertyType, (prop as any).property_type)) return false;

      return true;
    });
  }, [allProperties, filters]);

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5EFEB]">
        <h1 className="text-[22px] font-bold text-[#2F4156]">{filteredProperties.length} {t('objects found')}</h1>
        
        <div className="flex items-center gap-2 border border-[#C8D9E6] rounded-full pl-4 pr-1 py-1 shadow-sm ml-auto">
          <span className="text-[15px] font-medium text-[#2F4156]">{t('Map')}</span>
          <button 
            className={`w-[44px] h-[24px] rounded-full relative transition-colors ${mapEnabled ? 'bg-[#567C8D]' : 'bg-[#C8D9E6]'}`}
            onClick={() => setMapEnabled(!mapEnabled)}
          >
            <div className={`absolute top-[2px] w-[20px] h-[20px] rounded-full bg-[#FFFFFF] shadow-sm transition-all duration-300 ${mapEnabled ? 'left-[22px]' : 'left-[2px]'}`}></div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* List View */}
        <div className={`overflow-y-auto px-6 pt-6 pb-20 ${mapEnabled ? 'w-[55%]' : 'w-full'} transition-all duration-300 flex-shrink-0 z-10 bg-[#FFFFFF] relative`}>
          <div className={`grid gap-x-4 gap-y-5 ${mapEnabled ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'}`}>
            {filteredProperties.map(prop => (
              <ZSearchCard key={prop.id} property={prop} onClick={() => onPropertyClick?.(prop)} isSaved={savedPropertyIds.includes(prop.id.toString())} onToggleSave={() => onToggleSave?.(prop.id.toString())} />
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className={`absolute top-0 right-0 h-full transition-all duration-300 bg-[#F5EFEB] border-l border-[#C8D9E6] z-0 ${mapEnabled ? 'w-[45%] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
          <div className="w-full h-full p-2">
            <div className="w-full h-full rounded-tl-3xl shadow-sm overflow-hidden flex bg-[#FFFFFF]">
               <MapContainer 
                  center={[-1.9403, 29.8739]} // Rwanda center (Kigali)
                  zoom={8} 
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={false}
                  preferCanvas={true}
               >
                  <MapResizer mapEnabled={mapEnabled} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    updateWhenIdle={true}
                    keepBuffer={2}
                  />
                  {filteredProperties.map(prop => (
                    <Marker 
                      key={prop.id} 
                      position={[prop.lat, prop.lng]}
                      icon={locationIcon}
                    >
                       {/* Price tooltip on hover */}
                       <Tooltip 
                         direction="top" 
                         offset={[0, -4]}
                         className="price-tooltip"
                       >
                         <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#2F4156' }}>
                           RF {(prop.price / 1000).toLocaleString('en-US')}k
                         </span>
                       </Tooltip>
                       {/* Full popup on click */}
                       <Popup 
                         className="custom-popup"
                         closeButton={false}
                         minWidth={240}
                       >
                          <div 
                             className="p-1 -m-1 cursor-pointer hover:opacity-90 transition-opacity"
                             onClick={() => onPropertyClick?.(prop)}
                          >
                             <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 relative">
                               <img src={prop.images[0]} className="w-full h-full object-cover" />
                             </div>
                             <h3 className="text-[18px] font-bold text-[#2F4156] mb-1 leading-tight">
                               RF {prop.price.toLocaleString()}
                             </h3>
                             <div className="flex items-center gap-1.5">
                               <MapPin size={12} className="text-[#567C8D]" strokeWidth={3} />
                               <span className="text-[13px] text-[#567C8D] font-medium truncate">{prop.address}</span>
                             </div>
                          </div>
                       </Popup>
                    </Marker>
                  ))}
               </MapContainer>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .leaflet-popup-tip {
          width: 14px;
          height: 14px;
          margin-top: -7px;
        }
        .custom-location-marker {
          background: transparent !important;
          border: none !important;
        }
        .price-tooltip {
          background: #2F4156 !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .price-tooltip .leaflet-tooltip-top::before,
        .price-tooltip::before {
          border-top-color: #2F4156 !important;
        }
        .price-tooltip span {
          color: white !important;
        }
      `}} />
    </div>
  )
}
