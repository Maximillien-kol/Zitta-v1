import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { api } from '../services/api';
import { SearchProperty } from '../types';
import { ZSearchCard } from './ZSearchCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom icon to avoid default icon path issues in Vite
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a custom div icon mimicking the previous styling (black rounded pill)
const createPriceIcon = (price: number) => {
  return new L.DivIcon({
    className: 'custom-price-marker',
    html: `
      <div style="background-color: #2F4156; color: white; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: bold; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: relative; white-space: nowrap;">
        RF ${(price / 1000).toLocaleString('en-US')}k
        <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 12px; height: 12px; background-color: #2F4156; border-radius: 2px;"></div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 35],
    popupAnchor: [0, -40]
  });
};

export function ZSearchPage({ onPropertyClick, savedPropertyIds = [], onToggleSave }: { onPropertyClick?: (property: any) => void, savedPropertyIds?: string[], onToggleSave?: (id: string) => void }) {
  const [mapEnabled, setMapEnabled] = useState(false);
  const [properties, setProperties] = useState<SearchProperty[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    // In the future we will pass filters to this call
    api.searchProperties({}).then(setProperties);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5EFEB]">
        <h1 className="text-[22px] font-bold text-[#2F4156]">{properties.length} {t('objects found')}</h1>
        
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
            {properties.map(prop => (
              <ZSearchCard key={prop.id} property={prop} onClick={() => onPropertyClick?.(prop)} isSaved={savedPropertyIds.includes(prop.id.toString())} onToggleSave={() => onToggleSave?.(prop.id.toString())} />
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className={`absolute top-0 right-0 h-full transition-all duration-300 bg-[#F5EFEB] border-l border-[#C8D9E6] z-0 ${mapEnabled ? 'w-[45%] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
          <div className="w-full h-full p-2">
            <div className="w-full h-full rounded-tl-3xl shadow-sm overflow-hidden flex bg-[#FFFFFF]">
               {mapEnabled && (
                 <MapContainer 
                    center={[-1.9403, 30.0619]} // Kigali center
                    zoom={12} 
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={false}
                 >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {properties.map(prop => (
                      <Marker 
                        key={prop.id} 
                        position={[prop.lat, prop.lng]}
                        icon={createPriceIcon(prop.price)}
                      >
                         <Popup 
                           className="custom-popup"
                           closeButton={false}
                           minWidth={240}
                         >
                            <div className="p-1 -m-1">
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
               )}
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
        .custom-price-marker {
          background: transparent;
          border: none;
        }
      `}} />
    </div>
  )
}
