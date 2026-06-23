import React from 'react';
import { Heart as HeartIcon, Share2, MapPin, Search, ChevronLeft, ChevronRight, Check, Wifi, Car, Shield, Coffee, Zap, Info, Building2, Bed, Bath, Layout, Wind, Utensils, Waves, ArrowLeft, MessageCircle, Lock, Calendar, Hash, Star, Heart, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon for property detail map
const propertyMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [posterProfile, setPosterProfile] = React.useState<any>(null);
  const isSaved = property ? savedPropertyIds.includes(property.id?.toString()) : false;

  // Fetch the real property poster's profile
  React.useEffect(() => {
    const ownerId = property?.owner_id;
    if (!ownerId) return;
    api.getProfile(ownerId).then(profile => {
      if (profile) setPosterProfile(profile);
    });
  }, [property?.owner_id]);

  // Poster display values — real data if available, graceful fallback otherwise
  const posterName = posterProfile?.full_name || property?.agent || null;
  const posterEmail = posterProfile?.email || null;
  const posterPhone = posterProfile?.phone || null;
  const posterAvatar = posterProfile?.avatar_url || null;
  const posterAddress = posterProfile?.address || null;
  const posterId = property?.owner_id || null;

  const images = [
    property?.images?.[0] || property?.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000',
    property?.images?.[1] || 'https://images.unsplash.com/photo-1600607687931-cebf00523e42?auto=format&fit=crop&q=80&w=800',
    property?.images?.[2] || 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    property?.images?.[3] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    property?.images?.[4] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    property?.images?.[5] || 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800',
    property?.images?.[6] || 'https://images.unsplash.com/photo-1600607688969-a5bfcd394f55?auto=format&fit=crop&q=80&w=800',
    property?.images?.[7] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    property?.images?.[8] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  ];

  const mainImage = images[activeIndex];
  const displayImages = images.slice(0, 8);

  const title = property?.title || property?.address?.split(',')[0] || '';
  const address = property?.address || '';
  const price = property?.price || 0;
  const beds = property?.bedrooms || property?.beds || 0;
  const baths = property?.rooms || property?.baths || 0;
  const sqft = property?.sqft || 0;

  // Reactively Inject Top-Tier SEO for this specific property
  useSEO({
    title: title || 'Property Detail',
    description: `Stunning ${beds} bed, ${baths} bath ${property?.propertyType || 'property'} for sale/rent at ${address}. Price: RWF ${price.toLocaleString()}. Connect with verified owners on Zitta, Rwanda's premium real estate platform.`,
    keywords: `${title}, ${address}, ${property?.propertyType || 'Apartment'} Kigali, real estate Rwanda, buy house Kigali, rent ${property?.propertyType || 'home'} Rwanda, ${beds} bedrooms Kigali`,
    image: mainImage
  });

  // Map coordinates — use property's real lat/lng, fallback to Kigali center
  const propLat = Number(property?.lat) || -1.9403;
  const propLng = Number(property?.lng) || 29.8739;

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

      {/* Top Image Gallery */}
      <div className="w-full px-4 sm:px-[100px] pt-0 sm:pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main Left Image */}
          {images.length > 0 ? (
            <div className="flex-1 rounded-none sm:rounded-2xl overflow-hidden h-[400px] md:h-[640px]">
              <img src={mainImage} className="w-full h-full object-cover block transition-opacity duration-300" alt="Property main" />
            </div>
          ) : (
            <div className="flex-1 rounded-none sm:rounded-2xl bg-[#E0E6ED] flex items-center justify-center h-[400px] md:h-[640px]">
              <span className="text-[#567C8D] font-medium text-[18px]">No Photos Available</span>
            </div>
          )}

          {/* Right Images (2 columns x 4 rows) - Only show if there's more than 1 image */}
          {images.length > 1 && (
            <div className="flex shrink-0 w-full px-4 sm:px-4 md:w-[336px] overflow-x-auto md:overflow-hidden pb-2 md:pb-0 hide-scrollbar">
              <div className="grid grid-rows-2 grid-flow-col md:grid-flow-row md:grid-cols-2 md:grid-rows-4 gap-4 w-max md:w-[336px]">
                {displayImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`rounded-2xl overflow-hidden relative w-[120px] h-[100px] md:w-[160px] md:h-[148px] cursor-pointer border-2 transition-all ${activeIndex === idx ? 'border-[#1A1A1A] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover block" alt={`Property thumbnail ${idx + 1}`} />
                    {idx === 7 && images.length > 8 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors hover:bg-black/50">
                        <span className="text-white text-[24px] font-semibold"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="w-full px-4 sm:px-[100px] pb-12 mt-6 md:mt-2">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 w-full">

          {/* Left Column - Property Details */}
          <div className="flex-1 flex flex-col pt-2 w-full min-w-0">

            {/* Header: Title and Price */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div className="flex-1 min-w-0 pr-0 md:pr-4">
                <h1 className="text-[32px] sm:text-[42px] font-semibold text-[#1A1A1A] leading-tight mb-3 break-words">
                  {title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[#567C8D]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin size={18} className="flex-shrink-0" />
                    <span className="text-[15px] whitespace-normal break-words">{address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#F5A623] font-medium flex-shrink-0">
                    <Star size={16} className="fill-[#F5A623]" />
                    <span className="text-[#1A1A1A] font-semibold">5.0</span>
                  </div>
                  <button
                    className="ml-auto md:ml-0 flex items-center gap-1.5 font-medium transition-colors hover:text-red-500"
                    onClick={(e) => { e.stopPropagation(); if (property && onToggleSave) onToggleSave(property.id?.toString()); }}
                  >
                    <Heart size={18} strokeWidth={isSaved ? 0 : 1.5} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
                    <span className={isSaved ? 'text-red-500' : ''}>{isSaved ? t('Saved') : t('Save')}</span>
                  </button>
                  <button className="flex items-center gap-1.5 font-medium transition-colors hover:text-[#1A1A1A]">
                    <Share size={18} strokeWidth={1.5} />
                    <span>{t('Share')}</span>
                  </button>
                </div>
              </div>
              <div className="text-left md:text-right mt-2 md:mt-0 flex-shrink-0">
                <div className="text-[32px] font-bold text-[#1A1A1A] flex items-baseline md:justify-end gap-1.5 whitespace-nowrap">
                  RF {price.toLocaleString()} <span className="text-[18px] font-medium text-[#567C8D]">Rwf</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">{t('Description')}:</h3>
              <p className="text-[#567C8D] text-[15px] leading-relaxed">
                Discover this modern {beds}-bedroom apartment located in the heart of the city, offering a perfect blend of comfort and convenience. Enjoy breathtaking skyline views, an open-concept kitchen, spacious living areas, and a private balcony ideal for relaxing evenings.
              </p>
            </div>

            {/* Key Features (Amenities) */}
            <div className="mb-10">
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-4">{t('Key Features')}:</h3>
              <div className="bg-[#FFFFFF] border border-[#E0E6ED] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <h4 className="text-[16px] font-medium text-[#1A1A1A] mb-6">{t('Amenities')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Bed size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{beds} {t('Beds')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Bath size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{baths} {t('Baths')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Layout size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{sqft >= 1000 ? Math.floor(sqft / 1000) + 'k' : sqft} {t('sq ft')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Wind size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{t('Smoking Area')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Utensils size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{t('Kitchen')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Waves size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{t('Balcony')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Wifi size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{t('Wifi')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Car size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">{t('Parking Area')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Areas & Lot */}
            <div className="mb-10">
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-4">{t('Areas & Lot')}</h3>
              <div className="bg-[#FFFFFF] border border-[#E0E6ED] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] w-full">
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#E0E6ED]">
                  <span className="text-[15px] font-medium text-[#567C8D]">{t('Status')}</span>
                  <span className="text-[15px] font-medium text-[#1A1A1A]">{t(property?.status || 'For sale')}</span>
                </div>
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#E0E6ED]">
                  <span className="text-[15px] font-medium text-[#567C8D]">{t('Location')}</span>
                  <span className="text-[15px] font-medium text-[#1A1A1A] truncate max-w-[200px] sm:max-w-none">{address}</span>
                </div>
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#E0E6ED]">
                  <span className="text-[15px] font-medium text-[#567C8D]">{t('Living Space')}</span>
                  <span className="text-[15px] font-medium text-[#1A1A1A]">{sqft.toLocaleString()} {t('sq ft')}</span>
                </div>
                <div className="flex justify-between items-center px-6 py-5">
                  <span className="text-[15px] font-medium text-[#567C8D]">{t('MLS ID')}</span>
                  <span className="text-[15px] font-medium text-[#1A1A1A]">{property?.mlsId || '0978347'}</span>
                </div>
              </div>
            </div>

            {/* Map Section — Leaflet with real property coordinates */}
            <div className="mb-4">
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-4">{t('Map')}</h3>
              <div className="bg-[#FFFFFF] border border-[#E0E6ED] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]" style={{ height: '400px' }}>
                <MapContainer
                  center={[propLat, propLng]}
                  zoom={15}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; CARTO'
                    url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[propLat, propLng]} icon={propertyMarkerIcon} />
                </MapContainer>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col gap-6 lg:pt-2 sticky top-6">

            {/* Property Owner / Agent Profile Card — real data from Supabase profiles */}
            <div className="bg-[#F6F6F6] rounded-2xl p-6 border border-[#EBEBEB]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#E0E6ED] flex items-center justify-center text-[#567C8D]">
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
                  <h4 className="text-[16px] font-bold text-[#1A1A1A]">{posterName || t('Owner')}</h4>
                  {posterAddress && <p className="text-[13px] text-[#567C8D]">{posterAddress}</p>}
                </div>
              </div>

              <div className="space-y-4">
                {posterPhone && (
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#567C8D]">{t('Phone:')}</span>
                    <span className="text-[#1A1A1A] font-medium">{posterPhone}</span>
                  </div>
                )}

                {posterPhone && posterEmail && <div className="h-[1px] w-full bg-[#EBEBEB]"></div>}

                {posterEmail && (
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#567C8D]">{t('Email:')}</span>
                    <span className="text-[#1A1A1A] font-medium truncate max-w-[180px]">{posterEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Card — replaces Schedule Tour */}
            <div className="bg-[#F6F6F6] rounded-2xl p-6 border border-[#EBEBEB]">
              {/* Icon badge */}
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-white" />
              </div>

              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">{t('Have a conversation')}</h3>
              <p className="text-[#567C8D] text-[13px] leading-relaxed mb-6">
                {t('Have a question about this property? Send a direct message to the owner and get a quick response.')}
              </p>

              {currentUser ? (
                <button
                  id="chat-with-owner-btn"
                  onClick={handleChatWithOwner}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <MessageCircle size={18} />
                  {t('Chat with Owner')}
                </button>
              ) : (
                <button
                  id="chat-with-owner-signin-btn"
                  onClick={handleChatWithOwner}
                  className="w-full bg-[#567C8D] hover:bg-[#2F4156] text-white font-semibold py-3.5 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock size={16} />
                  {t('Chat with Owner')}
                </button>
              )}

              {!currentUser && (
                <p className="text-[12px] text-[#A0B3C6] text-center mt-3">
                  {t('You need an account to message property owners.')}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
