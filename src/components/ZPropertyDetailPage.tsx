import React from 'react';
import { MapPin, Star, Bed, Bath, Layout, Wind, Utensils, Waves, Wifi, Car, Heart, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZPropertyDetailPage({ property, savedPropertyIds = [], onToggleSave }: { property: any, savedPropertyIds?: string[], onToggleSave?: (id: string) => void }) {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const isSaved = property ? savedPropertyIds.includes(property.id?.toString()) : false;

  const images = [
    property?.images?.[0] || property?.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
    property?.images?.[1] || "https://images.unsplash.com/photo-1600607687931-cebf00523e42?auto=format&fit=crop&q=80&w=800",
    property?.images?.[2] || "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
    property?.images?.[3] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    property?.images?.[4] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    property?.images?.[5] || "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800",
    property?.images?.[6] || "https://images.unsplash.com/photo-1600607688969-a5bfcd394f55?auto=format&fit=crop&q=80&w=800",
    property?.images?.[7] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    property?.images?.[8] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
  ];

  const mainImage = images[activeIndex];
  const displayImages = images.slice(0, 8);

  const title = property?.address?.split(',')[0] || "Veloura Residences";
  const address = property?.address || "Miami, Florida, celinam delware 2098";
  const price = property?.price || 4050;
  const beds = property?.bedrooms || property?.beds || 2;
  const baths = property?.rooms || property?.baths || 3;
  const sqft = property?.sqft || 10000;
  
  return (
    <div className="bg-[#FFFFFF] w-full min-h-full pb-20">
      
      {/* Top Image Gallery */}
      <div className="w-full px-4 sm:px-[100px] pt-0 sm:pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main Left Image */}
          <div className="flex-1 rounded-none sm:rounded-2xl overflow-hidden h-[400px] md:h-[640px]">
            <img src={mainImage} className="w-full h-full object-cover block transition-opacity duration-300" alt="Property main" />
          </div>
          
          {/* Right Images (2 columns x 4 rows) */}
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
                      <span className="text-white text-[24px] font-semibold">7+</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
                     onClick={(e) => { e.stopPropagation(); if(property && onToggleSave) onToggleSave(property.id?.toString()); }}
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
                  ${price.toLocaleString()} <span className="text-[18px] font-medium text-[#567C8D]">USD</span>
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
                <h4 className="text-[16px] font-medium text-[#1A1A1A] mb-6">Amenities</h4>
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
                    <span className="text-[14px] font-medium">Smoking Area</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Utensils size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">Kitchen</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Waves size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">balcony</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Wifi size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">Wifi</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#567C8D]">
                    <Car size={18} className="text-[#1A1A1A]" />
                    <span className="text-[14px] font-medium">Parking Area</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Areas & Lot */}
            <div className="mb-10">
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-4">Areas & Lot</h3>
              <div className="bg-[#FFFFFF] border border-[#E0E6ED] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] w-full">
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#E0E6ED]">
                  <span className="text-[15px] font-medium text-[#567C8D]">{t('Status')}</span>
                  <span className="text-[15px] font-medium text-[#1A1A1A]">{t(property?.status || "For sale")}</span>
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
                  <span className="text-[15px] font-medium text-[#1A1A1A]">{property?.mlsId || "0978347"}</span>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-4">
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-4">{t('Map')}</h3>
              <div className="bg-[#FFFFFF] border border-[#E0E6ED] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-[400px] w-full">
                <iframe
                  title="Property Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.53925916665!2d-80.29949920266738!3d25.782390733064336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1692285817865!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col gap-6 lg:pt-2 sticky top-6">
            
            {/* Agent Profile Card */}
            <div className="bg-[#F6F6F6] rounded-2xl p-6 border border-[#EBEBEB]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Alex Ripon" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#1A1A1A]">Alex Ripon</h4>
                  <p className="text-[13px] text-[#567C8D]">687 3rd Ave, New York, USA</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#567C8D]">Office Phone:</span>
                  <span className="text-[#1A1A1A] font-medium">+2224555597</span>
                </div>
                <div className="h-[1px] w-full bg-[#EBEBEB]"></div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#567C8D]">Office Phone:</span>
                  <span className="text-[#1A1A1A] font-medium">+3334555596</span>
                </div>
                <div className="h-[1px] w-full bg-[#EBEBEB]"></div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#567C8D]">WhatsApp:</span>
                  <span className="text-[#1A1A1A] font-medium">3334555595</span>
                </div>
                <div className="h-[1px] w-full bg-[#EBEBEB]"></div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#567C8D]">Email:</span>
                  <span className="text-[#1A1A1A] font-medium">alexripon@example.com</span>
                </div>
              </div>

              <button className="w-full bg-[#1A1A1A] hover:bg-black text-white font-medium py-3.5 rounded-xl transition-colors text-[14px]">
                View My Porperty
              </button>
            </div>

            {/* Schedule Tour Card */}
            <div className="bg-[#F6F6F6] rounded-2xl p-6 border border-[#EBEBEB]">
              <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">{t('Schedule tour')}</h3>
              <p className="text-[#567C8D] text-[13px] leading-relaxed mb-6">
                See your future home up close — book a tour with Real Nest today and let us help you find the perfect place!
              </p>

              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-[#567C8D] font-medium">{t('Property ID')}</label>
                  <input type="text" defaultValue={property?.mlsId || "66R986"} className="bg-white border border-[#EBEBEB] p-3 rounded-xl text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-[#567C8D] font-medium">{t('Property Name')}</label>
                  <input type="text" defaultValue={title} className="bg-white border border-[#EBEBEB] p-3 rounded-xl text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm" />
                </div>
                <div className="flex flex-col gap-1.5 mb-2">
                  <label className="text-[13px] text-[#567C8D] font-medium">{t('Full Name')}</label>
                  <input type="text" placeholder="Jane Doe" className="bg-white border border-[#EBEBEB] p-3 rounded-xl text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm" />
                </div>
                <button type="button" className="w-full bg-[#1A1A1A] hover:bg-black text-white font-medium py-3.5 rounded-xl transition-colors text-[14px] mt-2">
                  {t('Submit Request')}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}
