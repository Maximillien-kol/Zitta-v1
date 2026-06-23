import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Check, Home, DollarSign, Building, TrendingUp, MapPin, Search, Compass, Users, Heart, Star, User, UsersRound, Baby, Home as HomeIcon, Zap, Shield, Coffee, Car, Wifi, Dog, Trees, Smartphone, Bell, Clock, Bot, MessageSquare, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ZSignInPage({ onSignIn, onDashboardLogin, initialMode }: { onSignIn?: (filters?: any, authData?: any) => void, onDashboardLogin?: (email: string, password: string) => void, initialMode?: 'onboarding' | 'login' }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'onboarding' | 'login'>(initialMode || 'onboarding');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  
  // -- Step 1: Goal --
  const [goal, setGoal] = useState<string>('');

  const goals = [
    { id: 'buy', title: 'Buy a home', icon: Home, desc: 'Find your dream home' },
    { id: 'rent', title: 'Rent a place', icon: Building, desc: 'Find a place to rent' },
    { id: 'invest', title: 'Invest in property', icon: TrendingUp, desc: 'Grow your portfolio' },
    { id: 'sell', title: 'Sell my property', icon: DollarSign, desc: 'List your property' },
    { id: 'explore', title: 'Just exploring', icon: Compass, desc: 'Seeing what is out there' },
  ];

  // -- Step 2: Budget --
  const [budgetType, setBudgetType] = useState<string>('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const budgetTypes = [
    { id: 'exploring', title: 'Just exploring options' },
    { id: 'comfortable', title: 'Comfortable range' },
    { id: 'stretching', title: 'Stretching a bit for the right place' },
    { id: 'decided', title: 'Already decided budget' },
  ];

  // -- Step 3: Location --
  const [location, setLocation] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [commute, setCommute] = useState<string>('');
  const [radius, setRadius] = useState<number>(10);
  const [suggestLocation, setSuggestLocation] = useState(false);

  // -- Step 4: Lifestyle --
  const [livingSituation, setLivingSituation] = useState('');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const livingSituations = [
    { id: 'me', title: 'Just me', icon: User },
    { id: 'couple', title: 'Couple', icon: Users },
    { id: 'family', title: 'Family', icon: Baby },
    { id: 'shared', title: 'Shared house', icon: UsersRound },
  ];

  const priorityOptions = [
    { id: 'quiet', title: 'Quiet environment', icon: Coffee },
    { id: 'nightlife', title: 'Nightlife / city vibe', icon: Star },
    { id: 'family_friendly', title: 'Family-friendly', icon: Heart },
    { id: 'wfh', title: 'Work-from-home setup', icon: Zap },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'luxury', title: 'Luxury & aesthetics', icon: Star },
  ];

  const featureOptions = [
    { id: 'wifi', title: 'WiFi ready', icon: Wifi },
    { id: 'parking', title: 'Parking', icon: Car },
    { id: 'furnished', title: 'Furnished', icon: HomeIcon },
    { id: 'pets', title: 'Pet friendly', icon: Dog },
    { id: 'outdoor', title: 'Garden / balcony', icon: Trees },
  ];

  const toggleArrayItem = (array: string[], setArray: (val: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  // -- Step 5: Property Preferences --
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [condition, setCondition] = useState('');

  const propertyTypes = [
    { id: 'apartment', title: 'Apartment' },
    { id: 'house', title: 'House' },
    { id: 'studio', title: 'Studio' },
    { id: 'commercial', title: 'Commercial' },
  ];

  const conditionTypes = [
    { id: 'new', title: 'New build' },
    { id: 'renovated', title: 'Recently renovated' },
    { id: 'old', title: 'Old but affordable' },
  ];

  // -- Step 6: Setup --
  const [contactMethod, setContactMethod] = useState('inapp');
  const [notificationStyle, setNotificationStyle] = useState('instant');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleNext = () => setStep(prev => Math.min(prev + 1, 6));

  const getStepProgress = (s: number) => {
    if (s === 1) return goal ? 1 : 0;
    if (s === 2) {
      if (!budgetType) return 0;
      if (budgetType === 'exploring') return 1;
      if (minBudget || maxBudget) return 1;
      return 0.5;
    }
    if (s === 3) {
      if (!location && !suggestLocation) return 0;
      if (workLocation && !commute) return 0.7;
      return 1;
    }
    if (s === 4) {
      let p = 0;
      if (livingSituation) p += 0.4;
      if (priorities.length > 0) p += 0.3;
      if (features.length > 0) p += 0.3;
      return p;
    }
    if (s === 5) {
      let p = 0;
      if (propertyType.length > 0) p += 0.4;
      if (beds || baths) p += 0.3;
      if (condition) p += 0.3;
      return p;
    }
    if (s === 6) {
      let p = 0;
      if (contactMethod && notificationStyle) p += 0.2;
      let fields = 0;
      if (fullName) fields++;
      if (phone) fields++;
      if (email) fields++;
      if (password) fields++;
      p += (fields / 4) * 0.8;
      return Math.min(p, 1);
    }
    return 0;
  };
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  const handleFinish = () => {
    if (onSignIn) {
      onSignIn({
        goal: goal,
        propertyType: propertyType[0] || 'Any type',
        beds: beds || 'Any',
        price: maxBudget ? maxBudget : 'Any price',
      }, {
        email,
        password,
        fullName,
        phone
      });
    }
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center mb-12 px-4 w-full max-w-[640px] mx-auto">
      {[1, 2, 3, 4, 5, 6].map((s, idx) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold transition-all duration-300 z-10 ${
              step > s ? 'bg-[#1A1A1A] text-white' : 
              step === s ? 'bg-[#0054d6] text-white ring-4 ring-[#0054d6]/20' : 
              'bg-[#F5EFEB] text-[#567C8D] border border-[#E0E6ED]'
            }`}>
              {step > s ? <Check size={16} strokeWidth={3} /> : s}
            </div>
          </div>
          {idx < 5 && (
            <div className="flex-1 h-1 mx-1 md:mx-2 rounded-full bg-[#F5EFEB] relative overflow-hidden transition-colors">
              <div 
                className={`absolute top-0 left-0 bottom-0 transition-all duration-500 ease-out z-0 ${step > idx + 1 ? 'bg-[#1A1A1A]' : 'bg-[#0054d6]'}`}
                style={{ width: step > s ? '100%' : step === s ? `${getStepProgress(s) * 100}%` : '0%' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans py-12 px-4">
      {mode === 'login' ? (
        <div className="w-full flex-1 flex flex-col max-w-[440px] mx-auto items-center justify-center animate-in fade-in zoom-in-95 duration-300">
           <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-3 text-center">{t('Welcome back')}</h1>
           <p className="text-[15px] text-[#567C8D] text-center mb-8">{t('Log in to continue picking up where you left off.')}</p>
           
           <div className="w-full flex flex-col gap-4">
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                     <Mail size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('Email address')}
                    className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                  />
               </div>
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                     <Lock size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('Enter password')}
                    className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-12 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#567C8D] hover:text-[#1A1A1A] transition-colors"
                  >
                     {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                  </button>
               </div>

               <button 
                 onClick={() => {
                   if (onDashboardLogin) {
                     onDashboardLogin(email, password);
                   } else {
                     handleFinish();
                   }
                 }} 
                 disabled={!email || !password}
                 className={`w-full py-4 rounded-xl font-bold transition-all text-[16px] shadow-md mt-2 ${email && password ? 'bg-[#1A1A1A] hover:bg-black text-white' : 'bg-[#E0E6ED] text-[#A0B3C6] cursor-not-allowed'}`}
               >
                 {t('Log in')}
               </button>

               <div className="mt-8 text-center border-t border-[#E0E6ED] pt-6">
                 <span className="text-[14px] text-[#567C8D]">{t("Don't have an account?")}</span>
                 <button onClick={() => setMode('onboarding')} className="ml-2 text-[14px] font-bold text-[#0054d6] hover:underline">
                   {t('Sign up')}
                 </button>
               </div>
           </div>
        </div>
      ) : (
        <>
          {renderStepper()}

          <div className="w-full flex-1 flex flex-col max-w-[640px] mx-auto">
             
             {/* Step 1: Goal */}
             {step === 1 && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                 <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-3 text-center">{t('What are you looking to do?')}</h1>
                 <p className="text-[15px] text-[#567C8D] text-center mb-10">{t('Let\'s start by understanding your primary goal.')}</p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {goals.map((g, i) => (
                     <div 
                       key={g.id}
                       onClick={() => {
                         setGoal(g.id);
                         if (g.id === 'explore') setBudgetType('exploring');
                       }}
                       className={`p-4 md:p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${
                         i === goals.length - 1 ? 'md:col-span-2' : ''
                       } ${
                         goal === g.id 
                           ? 'border-[#0054d6] bg-[#0054d6]/5 ring-1 ring-[#0054d6] shadow-sm' 
                           : 'border-[#E0E6ED] hover:border-[#C8D9E6] hover:bg-[#F9FAFB] bg-white'
                       }`}
                     >
                       <div className={`p-3 rounded-xl ${goal === g.id ? 'bg-[#0054d6] text-white' : 'bg-[#F5EFEB] text-[#2F4156]'}`}>
                         <g.icon size={24} strokeWidth={2} />
                       </div>
                       <div className="flex-1">
                         <h3 className={`font-bold text-[17px] mb-0.5 ${goal === g.id ? 'text-[#0054d6]' : 'text-[#1A1A1A]'}`}>{g.title}</h3>
                         <p className="text-[#567C8D] text-[14px] leading-relaxed line-clamp-1">{g.desc}</p>
                       </div>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${goal === g.id ? 'border-[#0054d6]' : 'border-[#C8D9E6]'}`}>
                          {goal === g.id && <div className="w-2.5 h-2.5 bg-[#0054d6] rounded-full" />}
                       </div>
                     </div>
                   ))}
                 </div>

                 <div className="mt-10 flex justify-center">
                    <button onClick={handleNext} disabled={!goal} className={`px-12 py-4 rounded-xl font-bold text-[16px] text-white transition-colors min-w-[200px] ${goal ? 'bg-[#0054d6] hover:bg-[#004bbd]' : 'bg-[#C8D9E6] cursor-not-allowed'}`}>{t('Continue')}</button>
                 </div>

                 <div className="mt-8 text-center border-t border-[#E0E6ED] pt-6">
                    <span className="text-[14px] text-[#567C8D]">{t("Already have an account?")}</span>
                    <button onClick={() => setMode('login')} className="ml-2 text-[14px] font-bold text-[#0054d6] hover:underline">
                      {t('Log in')}
                    </button>
                 </div>
               </div>
             )}

         {/* Step 2: Budget Comfort Zone */}
         {step === 2 && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
             <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-3 text-center">{t('What\'s your budget scenario?')}</h1>
             <p className="text-[15px] text-[#567C8D] text-center mb-10">{t('We won\'t hold you to exact numbers just yet.')}</p>

             <div className="flex flex-col gap-8">
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {budgetTypes.map(bt => (
                   <div 
                     key={bt.id}
                     onClick={() => setBudgetType(bt.id)}
                     className={`py-4 px-5 rounded-xl border cursor-pointer font-medium transition-all text-[15px] ${
                       budgetType === bt.id 
                        ? 'border-[#0054d6] bg-[#0054d6]/5 text-[#0054d6] ring-1 ring-[#0054d6]' 
                        : 'border-[#E0E6ED] hover:border-[#C8D9E6] text-[#2F4156] bg-white hover:bg-[#F9FAFB]'
                     }`}
                   >
                     {bt.title}
                   </div>
                 ))}
               </div>

               {budgetType && budgetType !== 'exploring' && (
                 <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-4 p-5 bg-[#F9FAFB] rounded-2xl border border-[#E0E6ED]">
                   <label className="text-[15px] font-bold text-[#1A1A1A]">{t('Optional: Set a rough range')}</label>
                   <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D] font-medium">RF</div>
                        <input 
                          type="number" 
                          value={minBudget}
                          onChange={(e) => setMinBudget(e.target.value)}
                          placeholder="Min budget"
                          className="w-full bg-white border border-[#E0E6ED] rounded-xl pl-8 pr-4 py-3.5 text-[15px] outline-none focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                        />
                      </div>
                      <span className="text-[#A0B3C6] font-medium">to</span>
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D] font-medium">RF</div>
                        <input 
                          type="number" 
                          value={maxBudget}
                          onChange={(e) => setMaxBudget(e.target.value)}
                          placeholder="Max budget"
                          className="w-full bg-white border border-[#E0E6ED] rounded-xl pl-8 pr-4 py-3.5 text-[15px] outline-none focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                        />
                      </div>
                   </div>
                 </div>
               )}

             </div>

             <div className="flex gap-4 mt-10">
                <button onClick={handleBack} className="px-6 py-4 rounded-xl font-bold text-[#567C8D] border border-[#E0E6ED] hover:bg-[#F9FAFB] transition-colors">{t('Back')}</button>
                <button onClick={handleNext} disabled={!budgetType} className={`flex-1 py-4 rounded-xl font-bold text-[16px] text-white transition-colors ${budgetType ? 'bg-[#0054d6] hover:bg-[#004bbd]' : 'bg-[#C8D9E6] cursor-not-allowed'}`}>{t('Continue')}</button>
             </div>
           </div>
         )}

         {/* Step 3: Location */}
         {step === 3 && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
             <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-3 text-center">{t('Where do you want to be?')}</h1>
             <p className="text-[15px] text-[#567C8D] text-center mb-10">{t('This helps our AI map out the best options for you.')}</p>

             <div className="flex flex-col gap-6">
               
               <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-bold text-[#1A1A1A]">{t('Preferred cities or areas')}</label>
                  <div className="relative">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                        <Search size={20} strokeWidth={2} />
                     </div>
                     <input 
                       type="text" 
                       value={location}
                       onChange={(e) => {
                         setLocation(e.target.value);
                         if (suggestLocation) setSuggestLocation(false);
                       }}
                       placeholder={t('Search locations...')}
                       className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-4 text-[16px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                     />
                  </div>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer group w-max">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${suggestLocation ? 'bg-[#0054d6] border-[#0054d6]' : 'border-[#C8D9E6] bg-white group-hover:border-[#567C8D]'}`}>
                        {suggestLocation && <Check size={14} className="text-white" strokeWidth={3} />}
                     </div>
                     <span className="text-[14px] text-[#567C8D] group-hover:text-[#1A1A1A] transition-colors font-medium">{t('I\'m not sure, suggest for me')}</span>
                  </label>
               </div>

               <div className="h-[1px] bg-[#E0E6ED] my-2"></div>

               <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-bold text-[#1A1A1A]">{t('Work location (optional)')}</label>
                  <div className="relative flex items-center">
                     <div className="absolute left-4 text-[#567C8D]">
                        <Building size={20} strokeWidth={2} />
                     </div>
                     <input 
                       type="text" 
                       value={workLocation}
                       onChange={(e) => setWorkLocation(e.target.value)}
                       placeholder={t('Enter work address or city')}
                       className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-4 text-[16px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                     />
                  </div>
               </div>

               {workLocation && (
                 <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-4">
                   <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-[#1A1A1A]">{t('Willing to commute?')}</label>
                      <div className="grid grid-cols-3 gap-3">
                         {['Yes', 'No', 'Flexible'].map(opt => (
                           <button 
                             key={opt}
                             onClick={() => setCommute(opt)}
                             className={`py-3 rounded-xl border font-medium text-[14px] transition-all ${commute === opt ? 'border-[#0054d6] bg-[#0054d6]/5 text-[#0054d6]' : 'border-[#E0E6ED] text-[#567C8D] hover:bg-[#F9FAFB]'}`}
                           >
                             {opt}
                           </button>
                         ))}
                      </div>
                   </div>

                   {commute && commute !== 'No' && (
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[14px] font-bold text-[#1A1A1A]">{t('Max commute distance (km)')}</label>
                          <span className="text-[#0054d6] font-bold">{radius} km</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="100" 
                          value={radius}
                          onChange={(e) => setRadius(parseInt(e.target.value))}
                          className="w-full h-2 bg-[#E0E6ED] rounded-lg appearance-none cursor-pointer accent-[#0054d6]"
                        />
                     </div>
                   )}
                 </div>
               )}

             </div>

             <div className="flex gap-4 mt-10">
                <button onClick={handleBack} className="px-6 py-4 rounded-xl font-bold text-[#567C8D] border border-[#E0E6ED] hover:bg-[#F9FAFB] transition-colors">{t('Back')}</button>
                <button onClick={handleNext} disabled={!location && !suggestLocation} className={`flex-1 py-4 rounded-xl font-bold text-[16px] text-white transition-colors ${(location || suggestLocation) ? 'bg-[#0054d6] hover:bg-[#004bbd]' : 'bg-[#C8D9E6] cursor-not-allowed'}`}>{t('Continue')}</button>
             </div>
           </div>
         )}

         {/* Step 4: Lifestyle */}
         {step === 4 && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
             <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-3 text-center">{t('Your Lifestyle Profile')}</h1>
             <p className="text-[15px] text-[#567C8D] text-center mb-10">{t('This helps us rank properties based on what truly matters to you.')}</p>

             <div className="flex flex-col gap-8">
               
               <div className="flex flex-col gap-3">
                  <label className="text-[15px] font-bold text-[#1A1A1A]">{t('Who will live there?')}</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {livingSituations.map(sit => (
                       <div 
                         key={sit.id}
                         onClick={() => setLivingSituation(sit.id)}
                         className={`py-3 px-3 rounded-xl border cursor-pointer text-center font-medium transition-all flex flex-col items-center gap-2 ${
                           livingSituation === sit.id 
                            ? 'border-[#0054d6] bg-[#0054d6]/5 text-[#0054d6] ring-1 ring-[#0054d6]' 
                            : 'border-[#E0E6ED] hover:border-[#C8D9E6] text-[#2F4156] bg-white hover:bg-[#F9FAFB]'
                         }`}
                       >
                         <sit.icon size={24} strokeWidth={1.5} className={livingSituation === sit.id ? "text-[#0054d6]" : "text-[#567C8D]"} />
                         <span className="text-[13px]">{sit.title}</span>
                       </div>
                    ))}
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-[15px] font-bold text-[#1A1A1A]">{t('What neighborhood vibe matters most?')}</label>
                  <div className="flex flex-wrap gap-2">
                    {priorityOptions.map(p => (
                       <button 
                         key={p.id}
                         onClick={() => toggleArrayItem(priorities, setPriorities, p.id)}
                         className={`py-2 px-4 rounded-full border text-[14px] font-medium transition-all flex items-center gap-2 ${
                           priorities.includes(p.id)
                            ? 'border-[#0054d6] bg-[#0054d6] text-white' 
                            : 'border-[#E0E6ED] text-[#2F4156] hover:bg-[#F9FAFB] hover:border-[#C8D9E6]'
                         }`}
                       >
                         <p.icon size={16} strokeWidth={2} />
                         {p.title}
                       </button>
                    ))}
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-[15px] font-bold text-[#1A1A1A]">{t('Must-have features')}</label>
                  <div className="flex flex-wrap gap-2">
                    {featureOptions.map(f => (
                       <button 
                         key={f.id}
                         onClick={() => toggleArrayItem(features, setFeatures, f.id)}
                         className={`py-2 px-4 rounded-full border text-[14px] font-medium transition-all flex items-center gap-2 ${
                           features.includes(f.id)
                            ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' 
                            : 'border-[#E0E6ED] text-[#2F4156] hover:bg-[#F9FAFB] hover:border-[#C8D9E6]'
                         }`}
                       >
                         <f.icon size={16} strokeWidth={2} />
                         {f.title}
                       </button>
                    ))}
                  </div>
               </div>

             </div>

             <div className="flex gap-4 mt-12">
                <button onClick={handleBack} className="px-6 py-4 rounded-xl font-bold text-[#567C8D] border border-[#E0E6ED] hover:bg-[#F9FAFB] transition-colors">{t('Back')}</button>
                <button onClick={handleNext} disabled={!livingSituation} className={`flex-1 py-4 rounded-xl font-bold text-[16px] text-white transition-colors ${livingSituation ? 'bg-[#0054d6] hover:bg-[#004bbd]' : 'bg-[#C8D9E6] cursor-not-allowed'}`}>{t('Continue')}</button>
             </div>
           </div>
         )}

         {/* Step 5: Property Preferences */}
         {step === 5 && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
             <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-3 text-center">{t('The Property Basics')}</h1>
             <p className="text-[15px] text-[#567C8D] text-center mb-10">{t('Let\'s filter the structure and size.')}</p>

             <div className="flex flex-col gap-8">
               
               <div className="flex flex-col gap-3">
                  <label className="text-[15px] font-bold text-[#1A1A1A]">{t('Property Type')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map(pt => (
                       <div 
                         key={pt.id}
                         onClick={() => toggleArrayItem(propertyType, setPropertyType, pt.id)}
                         className={`py-3 px-4 rounded-xl border cursor-pointer font-medium transition-all flex items-center justify-between ${
                           propertyType.includes(pt.id)
                            ? 'border-[#0054d6] bg-[#0054d6]/5 text-[#0054d6] ring-1 ring-[#0054d6]' 
                            : 'border-[#E0E6ED] hover:border-[#C8D9E6] text-[#2F4156] bg-white hover:bg-[#F9FAFB]'
                         }`}
                       >
                         {pt.title}
                         {propertyType.includes(pt.id) && <Check size={18} strokeWidth={2.5} />}
                       </div>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-[#1A1A1A]">{t('Bedrooms')}</label>
                    <select 
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl px-4 py-4 text-[16px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>{t('Any')}</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-[#1A1A1A]">{t('Bathrooms')}</label>
                    <select 
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl px-4 py-4 text-[16px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>{t('Any')}</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                 </div>
               </div>

               <div className="flex flex-col gap-3">
                  <label className="text-[15px] font-bold text-[#1A1A1A]">{t('Preferred Condition')}</label>
                  <div className="flex flex-col gap-2">
                    {conditionTypes.map(c => (
                       <label key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] cursor-pointer transition-colors group">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${condition === c.id ? 'border-[#0054d6]' : 'border-[#C8D9E6] group-hover:border-[#567C8D]'}`}>
                           {condition === c.id && <div className="w-2.5 h-2.5 bg-[#0054d6] rounded-full"></div>}
                         </div>
                         <input type="radio" name="condition" className="hidden" checked={condition === c.id} onChange={() => setCondition(c.id)} />
                         <span className="text-[15px] font-medium text-[#1A1A1A]">{c.title}</span>
                       </label>
                    ))}
                  </div>
               </div>

             </div>

             <div className="flex gap-4 mt-10">
                <button onClick={handleBack} className="px-6 py-4 rounded-xl font-bold text-[#567C8D] border border-[#E0E6ED] hover:bg-[#F9FAFB] transition-colors">{t('Back')}</button>
                <button onClick={handleNext} disabled={propertyType.length === 0} className={`flex-1 py-4 rounded-xl font-bold text-[16px] text-white transition-colors ${propertyType.length > 0 ? 'bg-[#0054d6] hover:bg-[#004bbd]' : 'bg-[#C8D9E6] cursor-not-allowed'}`}>{t('Continue')}</button>
             </div>
           </div>
         )}


         {/* Step 6: Account Setup */}
         {step === 6 && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mb-10">
             <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] mb-3 text-center">{t('Connect & Finish')}</h1>
             <p className="text-[15px] text-[#567C8D] text-center mb-8">{t('Create your account and set up how we contact you.')}</p>

             <div className="flex flex-col gap-8">
               
               {/* Personal Details Form */}
               <div className="flex flex-col gap-4">
                 <h3 className="font-bold text-[#1A1A1A] text-[16px] border-b border-[#E0E6ED] pb-2 text-center md:text-left">{t('Personal Details')}</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                         <User size={18} strokeWidth={2} />
                      </div>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('Full Name')}
                        className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                      />
                   </div>
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                         <Phone size={18} strokeWidth={2} />
                      </div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('Phone Number')}
                        className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                      />
                   </div>
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                         <Mail size={18} strokeWidth={2} />
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('Email address')}
                        className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                      />
                   </div>
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                         <Lock size={18} strokeWidth={2} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('Create password')}
                        className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-12 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#0054d6] focus:ring-1 focus:ring-[#0054d6] transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#567C8D] hover:text-[#1A1A1A] transition-colors"
                      >
                         {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                      </button>
                   </div>
                 </div>
               </div>

               {/* Communication Setup */}
               <div className="flex flex-col gap-4 text-center md:text-left text-left">
                 <h3 className="font-bold text-[#1A1A1A] text-[16px] border-b border-[#E0E6ED] pb-2 flex">{t('Contact & Alerts')}</h3>
                 
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                   {['WhatsApp', 'Email', 'SMS', 'In-App'].map(cm => (
                     <button 
                       key={cm}
                       onClick={() => setContactMethod(cm.toLowerCase())}
                       className={`py-2.5 px-3 rounded-xl border text-[13px] font-bold transition-all ${contactMethod === cm.toLowerCase() ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm' : 'bg-[#F9FAFB] border-[#E0E6ED] text-[#567C8D] hover:bg-white hover:border-[#C8D9E6]'}`}
                     >
                       {cm}
                     </button>
                   ))}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-left">
                   {['Instant matches', 'Daily summary', 'Weekly digest'].map(ns => (
                     <label key={ns} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E0E6ED] cursor-pointer group hover:bg-white hover:border-[#C8D9E6] transition-colors">
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${notificationStyle === ns.toLowerCase() ? 'border-[#0054d6]' : 'border-[#C8D9E6]'}`}>
                         {notificationStyle === ns.toLowerCase() && <div className="w-2.5 h-2.5 bg-[#0054d6] rounded-full"></div>}
                       </div>
                       <input type="radio" className="hidden" checked={notificationStyle === ns.toLowerCase()} onChange={() => setNotificationStyle(ns.toLowerCase())} />
                       <span className="text-[14px] font-medium text-[#1A1A1A]">{ns}</span>
                     </label>
                   ))}
                 </div>
               </div>
             </div>

             <div className="flex gap-4 mt-10">
                <button onClick={handleBack} className="px-6 py-4 rounded-xl font-bold text-[#567C8D] border border-[#E0E6ED] hover:bg-[#F9FAFB] transition-colors">{t('Back')}</button>
                <button 
                  onClick={handleFinish} 
                  disabled={!fullName || !email || !password}
                  className={`flex-1 py-4 rounded-xl font-bold transition-all text-[16px] shadow-md flex items-center justify-center gap-2 ${fullName && email && password ? 'bg-[#1A1A1A] hover:bg-black text-white' : 'bg-[#E0E6ED] text-[#A0B3C6] cursor-not-allowed'}`}
                >
                  <span className="mt-0.5">{t('Start Exploring')}</span>
                  <Compass size={18} />
                </button>
             </div>
           </div>
         )}
      </div>
      </>
      )}
    </div>
  );
}



