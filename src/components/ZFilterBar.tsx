import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal, Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function ZFilterBar({ searchType = 'For sale', onSearchTypeChange, initialFilters = {} }: { searchType?: string, onSearchTypeChange?: (val: string) => void, initialFilters?: any }) {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter local states
  const [tempStatus, setTempStatus] = useState(searchType !== 'Any status' ? searchType : 'For sale');
  const [price, setPrice] = useState(initialFilters.price || 'Any price');
  const [tempPrice, setTempPrice] = useState(initialFilters.price || 'Any price');
  const [beds, setBeds] = useState(initialFilters.beds ? `${initialFilters.beds}+` : 'Any');
  const [tempBeds, setTempBeds] = useState(initialFilters.beds ? `${initialFilters.beds}+` : 'Any');
  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'Any type';
  const initType = initialFilters.propertyType ? capitalize(initialFilters.propertyType) : 'Any type';
  const [type, setType] = useState(initType);
  const [tempType, setTempType] = useState(initType);

  // More Filters state
  const defaultListingTypes = ['Owner posted', 'Agent listed', 'New construction', 'Foreclosures', 'Auctions'];
  const [maxHoa, setMaxHoa] = useState('Any');
  const [listingTypes, setListingTypes] = useState<string[]>(defaultListingTypes);
  const [listingStatuses, setListingStatuses] = useState<string[]>([]);
  const [tours, setTours] = useState<string[]>([]);
  const [parkingSpots, setParkingSpots] = useState('Any');

  const [tempMaxHoa, setTempMaxHoa] = useState('Any');
  const [tempListingTypes, setTempListingTypes] = useState<string[]>(defaultListingTypes);
  const [tempListingStatuses, setTempListingStatuses] = useState<string[]>([]);
  const [tempTours, setTempTours] = useState<string[]>([]);
  const [tempParkingSpots, setTempParkingSpots] = useState('Any');

  useEffect(() => {
    setTempStatus(searchType !== 'Any status' ? searchType : 'For sale');
  }, [searchType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
      if (name === 'status') setTempStatus(searchType !== 'Any status' ? searchType : 'For sale');
      if (name === 'price') setTempPrice(price);
      if (name === 'beds') setTempBeds(beds);
      if (name === 'type') setTempType(type);
      if (name === 'filters') {
         setTempMaxHoa(maxHoa);
         setTempListingTypes([...listingTypes]);
         setTempListingStatuses([...listingStatuses]);
         setTempTours([...tours]);
         setTempParkingSpots(parkingSpots);
      }
    }
  };

  const applyStatus = () => {
    onSearchTypeChange?.(tempStatus);
    setOpenDropdown(null);
  };
  
  const applyPrice = () => {
    setPrice(tempPrice);
    setOpenDropdown(null);
  };

  const applyBeds = () => {
    setBeds(tempBeds);
    setOpenDropdown(null);
  };

  const applyType = () => {
    setType(tempType);
    setOpenDropdown(null);
  };

  const applyFilters = () => {
     setMaxHoa(tempMaxHoa);
     setListingTypes([...tempListingTypes]);
     setListingStatuses([...tempListingStatuses]);
     setTours([...tempTours]);
     setParkingSpots(tempParkingSpots);
     setOpenDropdown(null);
  };

  const resetFilters = () => {
     setTempMaxHoa('Any');
     setTempListingTypes(defaultListingTypes);
     setTempListingStatuses([]);
     setTempTours([]);
     setTempParkingSpots('Any');
  };

  let activeFiltersCount = 0;
  if (maxHoa !== 'Any') activeFiltersCount++;
  if (listingTypes.length !== defaultListingTypes.length) activeFiltersCount++;
  if (listingStatuses.length > 0) activeFiltersCount++;
  if (tours.length > 0) activeFiltersCount++;
  if (parkingSpots !== 'Any') activeFiltersCount++;

  const statusOptions = ['For sale', 'For rent', 'Sold'];
  const priceOptions = ['Any price', 'Under $100k', '$100k - $300k', '$300k - $500k', '$500k - $1M', 'Over $1M'];
  const bedsOptions = ['Any', '1+ Beds & Baths', '2+ Beds & Baths', '3+ Beds & Baths', '4+ Beds & Baths'];
  const typeOptions = ['Any type', 'Houses', 'Townhomes', 'Multi-family', 'Condos/Co-ops', 'Lots/Land'];

  const allListingTypes = defaultListingTypes;
  const allListingStatuses = ['Coming soon', 'Accepting backup offers', 'Pending & under contract'];
  const allTours = ['Must have open house', 'Must have 3D Tour', 'Must have Showcase'];

  const RadioOption: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
    <div className="flex items-center gap-3 py-2.5 cursor-pointer group" onClick={onClick}>
      <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center flex-shrink-0 transition-colors ${selected ? 'border-[#0054d6] bg-white' : 'border-[#C8D9E6] bg-white group-hover:border-[#567C8D]'}`}>
        {selected && <div className="w-[10px] h-[10px] rounded-full bg-[#0054d6]"></div>}
      </div>
      <span className="text-[15px] text-[#2F4156]">{t(label)}</span>
    </div>
  );

  const CheckboxOption: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <div className={`w-[22px] h-[22px] rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'border-[#0054d6] bg-[#0054d6]' : 'border-[#C8D9E6] bg-white group-hover:border-[#567C8D]'}`}>
        {checked && <Check size={16} strokeWidth={3} className="text-white" />}
      </div>
      <span className="text-[15px] text-[#2F4156] select-none">{t(label)}</span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    </label>
  );

  const toggleArrayItem = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  return (
    <div ref={containerRef} className="flex items-center w-full px-4 md:px-6 py-[10px] border-b border-[#F5EFEB] bg-[#FFFFFF] gap-2.5 overflow-visible relative">
      
      {/* Search Input */}
      <div className="flex items-center border border-[#C8D9E6] rounded-lg px-3 py-1.5 flex-1 min-w-[220px] max-w-[550px] bg-[#FFFFFF] mr-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[40px]">
        <input 
          type="text" 
          defaultValue="NY" 
          className="flex-1 outline-none text-[16px] text-[#2F4156] font-normal min-w-0 bg-transparent"
        />
        <button className="flex items-center justify-center mr-2.5 text-white bg-[#567C8D] hover:bg-[#2F4156] rounded-full w-[18px] h-[18px] transition-colors">
          <X size={12} strokeWidth={2.5} />
        </button>
        <button className="text-[#2F4156] hover:text-[#567C8D] transition-colors">
          <Search size={22} strokeWidth={2} />
        </button>
      </div>

      {/* For sale */}
      <div className="relative">
        <button 
          onClick={() => toggleDropdown('status')}
          className={`flex items-center gap-1.5 border px-4 h-[40px] rounded-lg whitespace-nowrap transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${openDropdown === 'status' ? 'border-[#0054d6] bg-[#e8f3ff] text-[#0054d6] ring-[1px] ring-[#0054d6]' : 'border-[#C8D9E6] bg-[#FFFFFF] text-[#2F4156] hover:bg-[#F5EFEB]'}`}
        >
          <span className="text-[15px] font-bold">{t(searchType === 'Any status' ? 'For sale' : searchType)}</span>
          {openDropdown === 'status' ? <ChevronUp size={18} strokeWidth={2.5} className="ml-0.5" /> : <ChevronDown size={18} strokeWidth={2.5} className="ml-0.5" />}
        </button>
        {openDropdown === 'status' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#E0E6ED] p-4 z-50">
            <div className="flex flex-col gap-1 mb-4">
              {statusOptions.map(opt => (
                <RadioOption key={opt} label={opt} selected={tempStatus === opt} onClick={() => setTempStatus(opt)} />
              ))}
            </div>
            <button onClick={applyStatus} className="w-full bg-[#0054d6] hover:bg-[#004bbd] text-white font-bold py-2.5 rounded-lg transition-colors text-[15px]">{t('Apply')}</button>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="relative">
        <button 
          onClick={() => toggleDropdown('price')}
          className={`flex items-center gap-1.5 border px-4 h-[40px] rounded-lg whitespace-nowrap transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${openDropdown === 'price' ? 'border-[#0054d6] bg-[#e8f3ff] text-[#0054d6] ring-[1px] ring-[#0054d6]' : 'border-[#C8D9E6] bg-[#FFFFFF] text-[#2F4156] hover:bg-[#F5EFEB]'}`}
        >
          <span className="text-[15px] font-bold">{t(price === 'Any price' ? 'Price' : price)}</span>
          {openDropdown === 'price' ? <ChevronUp size={18} strokeWidth={2.5} className="ml-0.5" /> : <ChevronDown size={18} strokeWidth={2.5} className="ml-0.5" />}
        </button>
        {openDropdown === 'price' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#E0E6ED] p-4 z-50">
            <div className="flex flex-col gap-1 mb-4 max-h-[260px] overflow-y-auto pr-2">
              {priceOptions.map(opt => (
                <RadioOption key={opt} label={opt} selected={tempPrice === opt} onClick={() => setTempPrice(opt)} />
              ))}
            </div>
            <button onClick={applyPrice} className="w-full bg-[#0054d6] hover:bg-[#004bbd] text-white font-bold py-2.5 rounded-lg transition-colors text-[15px]">{t('Apply')}</button>
          </div>
        )}
      </div>

      {/* Beds & baths */}
      <div className="relative">
        <button 
          onClick={() => toggleDropdown('beds')}
          className={`flex items-center gap-1.5 border px-4 h-[40px] rounded-lg whitespace-nowrap transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${openDropdown === 'beds' ? 'border-[#0054d6] bg-[#e8f3ff] text-[#0054d6] ring-[1px] ring-[#0054d6]' : 'border-[#C8D9E6] bg-[#FFFFFF] text-[#2F4156] hover:bg-[#F5EFEB]'}`}
        >
          <span className="text-[15px] font-bold">{t(beds === 'Any' ? 'Beds & baths' : beds)}</span>
          {openDropdown === 'beds' ? <ChevronUp size={18} strokeWidth={2.5} className="ml-0.5" /> : <ChevronDown size={18} strokeWidth={2.5} className="ml-0.5" />}
        </button>
        {openDropdown === 'beds' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#E0E6ED] p-4 z-50">
            <div className="flex flex-col gap-1 mb-4">
              {bedsOptions.map(opt => (
                <RadioOption key={opt} label={opt} selected={tempBeds === opt} onClick={() => setTempBeds(opt)} />
              ))}
            </div>
            <button onClick={applyBeds} className="w-full bg-[#0054d6] hover:bg-[#004bbd] text-white font-bold py-2.5 rounded-lg transition-colors text-[15px]">{t('Apply')}</button>
          </div>
        )}
      </div>

      {/* Property type */}
      <div className="relative">
        <button 
          onClick={() => toggleDropdown('type')}
          className={`flex items-center gap-1.5 border px-4 h-[40px] rounded-lg whitespace-nowrap transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${openDropdown === 'type' ? 'border-[#0054d6] bg-[#e8f3ff] text-[#0054d6] ring-[1px] ring-[#0054d6]' : 'border-[#C8D9E6] bg-[#FFFFFF] text-[#2F4156] hover:bg-[#F5EFEB]'}`}
        >
          <span className="text-[15px] font-bold">{t(type === 'Any type' ? 'Property type' : type)}</span>
          {openDropdown === 'type' ? <ChevronUp size={18} strokeWidth={2.5} className="ml-0.5" /> : <ChevronDown size={18} strokeWidth={2.5} className="ml-0.5" />}
        </button>
        {openDropdown === 'type' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#E0E6ED] p-4 z-50">
            <div className="flex flex-col gap-1 mb-4">
              {typeOptions.map(opt => (
                <RadioOption key={opt} label={opt} selected={tempType === opt} onClick={() => setTempType(opt)} />
              ))}
            </div>
            <button onClick={applyType} className="w-full bg-[#0054d6] hover:bg-[#004bbd] text-white font-bold py-2.5 rounded-lg transition-colors text-[15px]">{t('Apply')}</button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="relative">
        <button 
          onClick={() => toggleDropdown('filters')}
          className={`flex items-center gap-1.5 border px-4 h-[40px] rounded-lg whitespace-nowrap transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
            openDropdown === 'filters' || activeFiltersCount > 0
              ? 'border-[#0054d6] bg-[#e8f3ff] text-[#0054d6] ring-[1px] ring-[#0054d6]' 
              : 'border-[#C8D9E6] bg-[#FFFFFF] text-[#2F4156] hover:bg-[#F5EFEB]'
          }`}
        >
          <SlidersHorizontal size={16} strokeWidth={2.5} />
          <span className="text-[15px] font-bold">{t('Filters')}</span>
          {activeFiltersCount > 0 && <span className="ml-1 bg-white border border-[#0054d6] text-[#0054d6] text-[12px] font-bold px-1.5 py-0.5 rounded-full leading-none">{activeFiltersCount}</span>}
          {openDropdown === 'filters' ? <ChevronUp size={18} strokeWidth={2.5} className="ml-0.5" /> : (activeFiltersCount > 0 ? <ChevronDown size={18} strokeWidth={2.5} className="ml-0.5" /> : null)}
        </button>
        {openDropdown === 'filters' && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[350px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#E0E6ED] overflow-hidden z-50 flex flex-col max-h-[70vh]">
            <div className="p-4 border-b border-[#E0E6ED] bg-[#F5EFEB] flex items-center justify-between sticky top-0 z-10">
              <span className="font-bold text-[#2F4156] text-[16px]">{t('More Filters')}</span>
              <button className="text-[#2F4156] hover:text-[#0054d6]" onClick={() => setOpenDropdown(null)}><X size={20} /></button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                 <span className="font-bold text-[#1A1A1A] text-[14px]">{t('Max HOA')}</span>
                 <select 
                   value={tempMaxHoa} 
                   onChange={(e) => setTempMaxHoa(e.target.value)}
                   className="w-full border border-[#C8D9E6] rounded-lg p-2.5 text-[15px] text-[#2F4156] outline-none focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6]"
                 >
                   <option value="Any">Any</option>
                   <option value="$100/mo">$100/mo</option>
                   <option value="$200/mo">$200/mo</option>
                   <option value="$300/mo">$300/mo</option>
                 </select>
               </div>

               <div className="flex flex-col gap-1.5">
                 <span className="font-bold text-[#1A1A1A] text-[14px] mb-1">{t('Listing type')}</span>
                 {allListingTypes.map(typ => (
                   <CheckboxOption key={typ} label={typ} checked={tempListingTypes.includes(typ)} onChange={() => toggleArrayItem(tempListingTypes, setTempListingTypes, typ)} />
                 ))}
               </div>

               <div className="flex flex-col gap-1.5">
                 <span className="font-bold text-[#1A1A1A] text-[14px] mb-1">{t('Listing status')}</span>
                 {allListingStatuses.map(stat => (
                   <CheckboxOption key={stat} label={stat} checked={tempListingStatuses.includes(stat)} onChange={() => toggleArrayItem(tempListingStatuses, setTempListingStatuses, stat)} />
                 ))}
               </div>

               <div className="flex flex-col gap-1.5">
                 <span className="font-bold text-[#1A1A1A] text-[14px] mb-1">{t('Tours')}</span>
                 {allTours.map(tour => (
                   <CheckboxOption key={tour} label={tour} checked={tempTours.includes(tour)} onChange={() => toggleArrayItem(tempTours, setTempTours, tour)} />
                 ))}
               </div>

               <div className="flex flex-col gap-2">
                 <span className="font-bold text-[#1A1A1A] text-[14px]">{t('Parking spots')}</span>
                 <select 
                   value={tempParkingSpots} 
                   onChange={(e) => setTempParkingSpots(e.target.value)}
                   className="w-full border border-[#C8D9E6] rounded-lg p-2.5 text-[15px] text-[#2F4156] outline-none focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6]"
                 >
                   <option value="Any">Any</option>
                   <option value="1+ Spaces">1+ Spaces</option>
                   <option value="2+ Spaces">2+ Spaces</option>
                   <option value="3+ Spaces">3+ Spaces</option>
                 </select>
               </div>
            </div>
            
            <div className="p-4 border-t border-[#E0E6ED] flex items-center justify-between bg-white sticky bottom-0 z-10">
               <button onClick={resetFilters} className="text-[15px] font-bold text-[#0054d6] hover:underline px-2">{t('Reset all filters')}</button>
               <button onClick={applyFilters} className="bg-[#0054d6] hover:bg-[#004bbd] text-white font-bold px-8 py-2.5 rounded-xl transition-colors text-[15px]">{t('Apply')}</button>
            </div>
          </div>
        )}
      </div>

      {/* Save search */}
      <button className="bg-[#567C8D] hover:bg-[#2F4156] text-white text-[15px] font-bold px-5 h-[40px] rounded-lg transition-colors whitespace-nowrap ml-auto shadow-sm">
        {t('Save search')}
      </button>

    </div>
  );
}
