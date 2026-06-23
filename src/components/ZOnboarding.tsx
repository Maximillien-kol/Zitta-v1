import React, { useState } from 'react';
import { Home, Building, TrendingUp, Compass, Check, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ZOnboarding({ onComplete }: { onComplete?: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const goals = [
    { id: 'buy', title: t('Buy a home'), icon: Home, desc: t('Find your dream home') },
    { id: 'rent', title: t('Rent a place'), icon: Building, desc: t('Find a place to rent') },
    { id: 'invest', title: t('Invest'), icon: TrendingUp, desc: t('Grow your portfolio') },
    { id: 'explore', title: t('Just exploring'), icon: Compass, desc: t("See what's out there") },
  ];

  const handleCreateAccount = async () => {
    if (!fullName || !email || !password) return;
    setLoading(true);
    setError('');
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, user_type: 'visitor', goal }
        }
      });
      if (signUpError) throw signUpError;
      // Account created — immediately redirect (no separate success screen)
      if (onComplete) {
        onComplete();
      } else {
        navigate('/inbox');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] flex flex-col items-center justify-start px-4 py-12">
      <div className="w-full max-w-[540px]">

        {/* Steps indicator — 2 steps only */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${step > s ? 'bg-[#2F4156] text-white' :
                  step === s ? 'bg-[#567C8D] text-white ring-4 ring-[#567C8D]/20' :
                    'bg-[#F5EFEB] text-[#567C8D] border border-[#E0E6ED]'
                }`}>
                {step > s ? <Check size={14} strokeWidth={3} /> : s}
              </div>
              {s < 2 && (
                <div className={`h-1 w-16 rounded-full transition-all ${step > s ? 'bg-[#2F4156]' : 'bg-[#F5EFEB]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div>
            <h1 className="text-[26px] font-bold text-[#1A1A1A] mb-2 text-center">{t('What are you looking for?')}</h1>
            <p className="text-[#567C8D] text-[15px] text-center mb-8">{t('Help us personalise your experience')}</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {goals.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${goal === g.id
                      ? 'border-[#567C8D] bg-[#F5EFEB] ring-1 ring-[#567C8D]'
                      : 'border-[#E0E6ED] bg-white hover:border-[#C8D9E6] hover:bg-[#F9FAFB]'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${goal === g.id ? 'bg-[#567C8D] text-white' : 'bg-[#F5EFEB] text-[#2F4156]'}`}>
                    <g.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className={`font-bold text-[14px] mb-0.5 ${goal === g.id ? 'text-[#567C8D]' : 'text-[#1A1A1A]'}`}>{g.title}</h3>
                  <p className="text-[#A0B3C6] text-[12px]">{g.desc}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!goal}
              className={`w-full py-4 rounded-xl font-bold text-[15px] transition-colors flex items-center justify-center gap-2 ${goal ? 'bg-[#567C8D] hover:bg-[#2F4156] text-white' : 'bg-[#F5EFEB] text-[#A0B3C6] cursor-not-allowed'}`}
            >
              {t('Continue')} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Account details (final step) */}
        {step === 2 && (
          <div>
            <h1 className="text-[26px] font-bold text-[#1A1A1A] mb-2 text-center">{t('Create your account')}</h1>
            <p className="text-[#567C8D] text-[15px] text-center mb-8">{t('So property owners can reach you back')}</p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-3 mb-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]"><User size={18} strokeWidth={2} /></div>
                <input
                  type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder={t('Full name')}
                  className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]"><Mail size={18} strokeWidth={2} /></div>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t('Email address')}
                  className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]"><Lock size={18} strokeWidth={2} /></div>
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={t('Create a password (min. 6 chars)')}
                  className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-12 py-3.5 text-[15px] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleCreateAccount}
              disabled={!fullName || !email || !password || loading}
              className={`w-full py-4 rounded-xl font-bold text-[15px] transition-colors flex items-center justify-center gap-2 ${fullName && email && password && !loading ? 'bg-[#567C8D] hover:bg-[#2F4156] text-white' : 'bg-[#F5EFEB] text-[#A0B3C6] cursor-not-allowed'}`}
            >
              {loading ? t('Creating account...') : <><span>{t('Get Started')}</span><ArrowRight size={18} /></>}
            </button>
            <button onClick={() => setStep(1)} className="w-full mt-3 py-3 text-[#567C8D] hover:text-[#2F4156] text-[14px] font-medium transition-colors">
              {t('Back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
