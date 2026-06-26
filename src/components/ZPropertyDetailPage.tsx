import React from 'react';
import { Heart as HeartIcon, Share2, MapPin, Search, ChevronLeft, ChevronRight, Check, Wifi, Car, Shield, Coffee, Zap, Info, Building2, Bed, Bath, Layout, Wind, Utensils, Waves, ArrowLeft, MessageCircle, Lock, Calendar, Hash, Star, Heart, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Using global Leaflet default icon fixed in main.tsx

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

const createCurrentLocationIcon = () => {
  return new L.DivIcon({
    className: 'custom-location-marker current',
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z" fill="#4B7240"/>
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

const currentLocationIcon = createCurrentLocationIcon();

type CurrentUser = { id: string; email: string; role: 'admin' | 'user' } | null;

export function ZPropertyDetailPage({
  property,
  savedPropertyIds = [],
  onToggleSave,
  onTalkToAgent,
  currentUser
}: {
  property: any;
  savedPropertyIds?: string[];
  onToggleSave?: (id: string) => void;
  onTalkToAgent?: (agentName: string, agentId: string) => void;
  currentUser?: CurrentUser;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [posterProfile, setPosterProfile] = React.useState<any>(null);
  const [localProperty, setLocalProperty] = React.useState<any>(property);
  const [loading, setLoading] = React.useState(!property && !!id);

  React.useEffect(() => {
    if (property) {
      setLocalProperty(property);
      setLoading(false);
      return;
    }

    if (id) {
      setLoading(true);
      api.getPropertiesByIds([id]).then(props => {
        if (props.length > 0) setLocalProperty(props[0]);
        setLoading(false);
      });
    }
  }, [property, id]);

  const [similarProps, setSimilarProps] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (localProperty) {
      api.getFeaturedProperties().then(props => {
        const others = props.filter(prop => prop.id !== localProperty.id && prop.lat && prop.lng);
        setSimilarProps(others.slice(0, 3));
      });
    }
  }, [localProperty?.id]);

  const p = localProperty;
  const isSaved = p ? savedPropertyIds.includes(p.id?.toString()) : false;

  // Fetch the real property poster's profile
  React.useEffect(() => {
    const ownerId = p?.owner_id;
    if (!ownerId) return;
    api.getProfile(ownerId).then(profile => {
      if (profile) setPosterProfile(profile);
    });
  }, [p?.owner_id]);

  // Poster display values — real data if available, graceful fallback otherwise
  const posterName = posterProfile?.full_name || p?.agent || null;
  const posterEmail = posterProfile?.email || null;
  const posterPhone = posterProfile?.phone || null;
  const posterAvatar = posterProfile?.avatar_url || null;
  const posterAddress = posterProfile?.address || null;
  const posterId = p?.owner_id || null;

  const images = [
    p?.images?.[0] || p?.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000',
    p?.images?.[1] || 'https://images.unsplash.com/photo-1600607687931-cebf00523e42?auto=format&fit=crop&q=80&w=800',
    p?.images?.[2] || 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    p?.images?.[3] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    p?.images?.[4] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    p?.images?.[5] || 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800',
    p?.images?.[6] || 'https://images.unsplash.com/photo-1600607688969-a5bfcd394f55?auto=format&fit=crop&q=80&w=800',
    p?.images?.[7] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    p?.images?.[8] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  ];

  const mainImage = images[activeIndex];
  const displayImages = images.slice(0, 8);

  const title = p?.title || p?.address?.split(',')[0] || '';
  const address = p?.address || '';
  const price = p?.price || 0;
  const beds = p?.bedrooms || p?.beds || 0;
  const baths = p?.rooms || p?.baths || 0;
  const sqft = p?.sqft || 0;

  // Reactively Inject Top-Tier SEO for this specific property
  useSEO({
    title: title || 'Property Detail',
    description: `Stunning ${beds} bed, ${baths} bath ${p?.propertyType || p?.property_type || 'property'} for sale/rent at ${address}. Price: RWF ${price.toLocaleString()}. Connect with verified owners on Zitta, Rwanda's premium real estate platform.`,
    keywords: `${title}, ${address}, ${p?.propertyType || p?.property_type || 'Apartment'} Kigali, real estate Rwanda, buy house Kigali, rent ${p?.propertyType || p?.property_type || 'home'} Rwanda, ${beds} bedrooms Kigali`,
    image: mainImage
  });

  // Map coordinates — use property's real lat/lng, fallback to Kigali center
  const propLat = Number(p?.lat) || -1.9403;
  const propLng = Number(p?.lng) || 29.8739;

  const handleChatWithOwner = () => {
    if (!currentUser) {
      navigate('/sign-in?redirect=inbox');
      return;
    }
    if (onTalkToAgent) {
      onTalkToAgent(posterName, posterId);
    }
  };

  return (
    <div className="bg-[#FFFFFF] w-full min-h-full pb-20">

      {/* Top Image Gallery - Full Width Hero */}
      <div className="w-full h-[50vh] sm:h-[60vh] md:h-[75vh] relative bg-[#1A1A1A]">
        {images.length > 0 ? (
          <img src={mainImage} className="w-full h-full object-cover block transition-opacity duration-300" alt="Property main" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#A0B3C6] font-medium text-[18px]">{t('No Photos Available')}</span>
          </div>
        )}

        {/* Overlay Thumbnails at Bottom Center */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 z-10 pointer-events-none">
            <div className="flex gap-2 sm:gap-3 p-2 bg-black/30 backdrop-blur-md rounded-2xl overflow-x-auto hide-scrollbar max-w-full pointer-events-auto">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-12 md:w-[88px] md:h-[64px] rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 ${activeIndex === idx ? 'border-white opacity-100 scale-[1.02] shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content & Sidebar */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pb-12 mt-6 md:mt-10">

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex lg:hidden flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-[#E0E6ED]">
          <div className="flex-1 min-w-0 pr-0 md:pr-4">
            <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1A1A1A] leading-tight mb-2 break-words">
              {title}
            </h1>
            <div className="flex items-center gap-1.5 min-w-0 text-[#567C8D]">
              <span className="text-[15px] whitespace-normal break-words">{address}</span>
            </div>
          </div>
          <div className="mt-2 md:mt-0 flex-shrink-0">
            <div className="bg-[#F0F2F5] text-[#1A1A1A] px-4 py-2 rounded-lg font-semibold text-[14px] flex items-center gap-2 w-max">
              {t(p?.status || 'Active')} <span className="text-[#567C8D]">&rarr;</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 w-full">

          {/* Left Column - Property Details */}
          <div className="flex-1 flex flex-col w-full min-w-0 order-2 lg:order-1">

            {/* Desktop Header: Title and Address */}
            <div className="hidden lg:flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 pb-6 border-b border-[#E0E6ED]">
              <div className="flex-1 min-w-0 pr-0 md:pr-4">
                <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1A1A1A] leading-tight mb-2 break-words">
                  {title}
                </h1>
                <div className="flex items-center gap-1.5 min-w-0 text-[#567C8D]">
                  <span className="text-[15px] whitespace-normal break-words">{address}</span>
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex-shrink-0">
                <div className="bg-[#F0F2F5] text-[#1A1A1A] px-4 py-2 rounded-lg font-semibold text-[14px] flex items-center gap-2">
                  {p?.status || 'Active'} <span className="text-[#567C8D]"></span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-10">
              <div className="grid grid-cols-2 md:grid-cols-3 border border-[#E0E6ED] rounded-xl overflow-hidden">
                <div className="p-5 border-b border-r border-[#E0E6ED] flex gap-4 items-start">
                  <Layout size={20} className="text-[#567C8D] mt-0.5" />
                  <div>
                    <div className="text-[12px] text-[#567C8D] mb-1">{t('Land & building size')}</div>
                    <div className="font-semibold text-[#1A1A1A] text-[15px]">{sqft >= 1000 ? Math.floor(sqft / 1000) + 'k' : sqft} {t('sq ft')}</div>
                  </div>
                </div>
                <div className="p-5 border-b md:border-r border-[#E0E6ED] flex gap-4 items-start">
                  <Building2 size={20} className="text-[#567C8D] mt-0.5" />
                  <div>
                    <div className="text-[12px] text-[#567C8D] mb-1">{t('House style')}</div>
                    <div className="font-semibold text-[#1A1A1A] text-[15px]">{p?.propertyType || p?.property_type || 'Apartment'}</div>
                  </div>
                </div>
                <div className="p-5 border-b border-[#E0E6ED] flex gap-4 items-start col-span-2 md:col-span-1">
                  <Calendar size={20} className="text-[#567C8D] mt-0.5" />
                  <div>
                    <div className="text-[12px] text-[#567C8D] mb-1">{t('Year Built')}</div>
                    <div className="font-semibold text-[#1A1A1A] text-[15px]">{p?.yearBuilt || p?.year_built || '2023'}</div>
                  </div>
                </div>
                <div className="p-5 border-r border-[#E0E6ED] flex gap-4 items-start">
                  <Bed size={20} className="text-[#567C8D] mt-0.5" />
                  <div>
                    <div className="text-[12px] text-[#567C8D] mb-1">{t('Bedrooms')}</div>
                    <div className="font-semibold text-[#1A1A1A] text-[15px]">{beds} {t('bedrooms')}</div>
                  </div>
                </div>
                <div className="p-5 md:border-r border-[#E0E6ED] flex gap-4 items-start">
                  <Bath size={20} className="text-[#567C8D] mt-0.5" />
                  <div>
                    <div className="text-[12px] text-[#567C8D] mb-1">{t('Bathrooms')}</div>
                    <div className="font-semibold text-[#1A1A1A] text-[15px]">{baths} {t('bathrooms')}</div>
                  </div>
                </div>
                <div className="p-5 border-[#E0E6ED] flex gap-4 items-start col-span-2 md:col-span-1 border-t md:border-t-0">
                  <MapPin size={20} className="text-[#567C8D] mt-0.5" />
                  <div>
                    <div className="text-[12px] text-[#567C8D] mb-1">{t('Lot Size')}</div>
                    <div className="font-semibold text-[#1A1A1A] text-[15px]">{p?.lotSize || p?.lot_size || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features (Amenities) */}
            {p?.amenities && p.amenities.length > 0 && (
              <div className="mb-10">
                <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-4">{t('Amenities')}</h3>
                <div className="bg-[#FFFFFF] border border-[#E0E6ED] rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                    {p.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 text-[#567C8D]">
                        <div className="w-2 h-2 rounded-full bg-[#4B7240]"></div>
                        <span className="text-[15px] font-medium text-[#1A1A1A]">{t(amenity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* Description */}
            <div className="mb-10">
              <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-4">{t('About properties')}</h3>
              <p className="text-[#567C8D] text-[14px] sm:text-[15px] leading-[1.8] whitespace-pre-line">
                {p?.description || t('No description available.')}
              </p>
            </div>

            {/* Locations */}
            <div className="mb-10">
              <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-4">{t('Locations')}</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:flex-1 bg-[#F5F7FA] rounded-2xl overflow-hidden shadow-inner h-[350px] md:h-[400px] relative z-0">
                  <MapContainer
                    center={[propLat, propLng]}
                    zoom={13}
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[propLat, propLng]} icon={currentLocationIcon}>
                      <Tooltip direction="top" offset={[0, -4]} className="price-tooltip">
                        <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#4B7240' }}>
                          {t('This Property')}
                        </span>
                      </Tooltip>
                    </Marker>
                    {similarProps.map(sp => (
                      <Marker 
                        key={sp.id} 
                        position={[sp.lat || -1.94, sp.lng || 29.87]}
                        icon={locationIcon}
                      >
                        <Tooltip direction="top" offset={[0, -4]} className="price-tooltip">
                          <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#2F4156' }}>
                            RF {(sp.price / 1000).toLocaleString('en-US')}k
                          </span>
                        </Tooltip>
                        <Popup className="custom-popup" closeButton={false} minWidth={240}>
                          <div className="p-1 -m-1 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(`/property/${sp.id}`);
                          }}>
                             <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 relative">
                               <img src={sp.images?.[0] || ''} className="w-full h-full object-cover" />
                             </div>
                             <div className="text-[15px] font-bold text-[#1A1A1A] mb-1 leading-tight">{sp.title}</div>
                             <div className="text-[#567C8D] text-[13px] mb-2">{sp.address}</div>
                             <div className="font-bold text-[#4B7240] text-[15px]">
                               RF {sp.price.toLocaleString()}
                             </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
                <div className="w-full md:w-[320px] flex flex-col gap-4">
                  <div className="text-[14px] font-semibold text-[#1A1A1A] mb-1">{t('Similar properties nearby:')}</div>
                  {similarProps.length > 0 ? similarProps.map(sp => (
                    <div 
                      key={sp.id} 
                      className="flex justify-between items-center py-3 border-b border-[#E0E6ED] last:border-0 cursor-pointer hover:bg-[#F5F7FA] -mx-2 px-2 rounded-lg transition-colors"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/property/${sp.id}`);
                      }}
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#E0E6ED]">
                          <img src={sp.images?.[0] || ''} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-medium text-[#1A1A1A] truncate">{sp.title}</div>
                          <div className="text-[12px] text-[#A0B3C6] truncate">{sp.address}</div>
                        </div>
                      </div>
                      <div className="text-[14px] font-bold text-[#4B7240] whitespace-nowrap pl-2">
                        {sp.price >= 1000000 ? `${(sp.price / 1000000).toFixed(1)}M` : `${(sp.price / 1000).toFixed(0)}k`}
                      </div>
                    </div>
                  )) : (
                    <div className="text-[14px] text-[#A0B3C6]">{t('No similar properties nearby')}</div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="w-full lg:w-[380px] xl:w-[400px] flex-shrink-0 flex flex-col gap-6 lg:pt-2 sticky top-6 order-1 lg:order-2">

            {/* Price & Payment Card */}
            <div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E0E6ED] shadow-sm">
              <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-6">{t('Price & details')}</h3>

              <div className="mb-6">
                <div className="text-[12px] text-[#567C8D] mb-1">{t('Total Price')}</div>
                <div className="text-[32px] font-bold text-[#4B7240] flex items-baseline gap-1">
                  RF {price.toLocaleString()}
                </div>
              </div>

              <div className="space-y-0 border-t border-[#E0E6ED]">
                <div className="flex justify-between items-center py-4 border-b border-[#E0E6ED]">
                  <span className="text-[13px] text-[#567C8D]">{t('Property Type')}</span>
                  <span className="text-[13px] font-semibold text-[#1A1A1A]">{p?.propertyType || p?.property_type || 'Apartment'}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[#E0E6ED]">
                  <span className="text-[13px] text-[#567C8D]">{t('Status')}</span>
                  <span className="text-[13px] font-semibold text-[#1A1A1A]">{t(p?.status || 'Active')}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[#E0E6ED]">
                  <span className="text-[13px] text-[#567C8D]">{t('MLS #')}</span>
                  <span className="text-[13px] font-semibold text-[#1A1A1A]">{p?.mlsId || p?.mls_id || `ZITTA-${p?.id?.toString().slice(0, 6) || 'N/A'}`}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleChatWithOwner}
                  className="w-full bg-[#52634C] hover:bg-[#43513e] text-white font-medium py-3 rounded-lg transition-all text-[14px] flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle size={18} />
                  {t('Chat with Owner')}
                </button>

                <button
                  onClick={() => p && onToggleSave && onToggleSave(p.id.toString())}
                  className={`w-full py-3 rounded-lg transition-all border font-medium text-[14px] ${isSaved ? 'bg-[#F5F7FA] border-[#E0E6ED] text-[#1A1A1A] hover:bg-[#EAECEF]' : 'bg-[#F5F7FA] border-[#E0E6ED] text-[#1A1A1A] hover:bg-[#EAECEF]'} flex items-center justify-center gap-2`}
                >
                  <Heart size={18} fill={isSaved ? '#1A1A1A' : 'none'} className={isSaved ? 'text-[#1A1A1A]' : ''} />
                  {isSaved ? t('Saved') : t('Save Property')}
                </button>
              </div>

              {!currentUser && (
                <p className="text-[12px] text-[#A0B3C6] text-center mt-4">
                  {t('You need an account to message property owners.')}
                </p>
              )}
            </div>

            {/* Property Owner / Agent Profile Card */}
            <div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E0E6ED] shadow-sm">
              <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-4">{t('Listed by')}</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#E0E6ED] flex items-center justify-center text-[#567C8D]">
                  {posterAvatar ? (
                    <img
                      src={posterAvatar}
                      alt={posterName || 'Agent'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-[18px]">{(posterName || 'Z')[0].toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#1A1A1A]">{posterName || t('Owner')}</h4>
                  {posterAddress && <p className="text-[12px] text-[#A0B3C6]">{posterAddress}</p>}
                </div>
              </div>

              {(posterPhone || posterEmail) && (
                <div className="space-y-3 pt-3 border-t border-[#E0E6ED]">
                  {posterPhone && (
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="text-[#567C8D] font-medium">{t('Phone:')}</span>
                      <span className="text-[#1A1A1A]">{posterPhone}</span>
                    </div>
                  )}
                  {posterEmail && (
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="text-[#567C8D] font-medium">{t('Email:')}</span>
                      <span className="text-[#1A1A1A] truncate max-w-[200px]">{posterEmail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Loading overlay if fetching */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0054d6] border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
