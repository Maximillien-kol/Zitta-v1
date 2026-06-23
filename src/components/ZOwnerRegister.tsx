import { useState } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabase';
import { useSEO } from '../hooks/useSEO';

interface ZOwnerRegisterProps {
  onRegisterSuccess?: () => void;
}

export function ZOwnerRegister({ onRegisterSuccess }: ZOwnerRegisterProps) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useSEO({
    title: t('Register as Property Owner'),
    description: t('Create a free property owner account on Zitta to list your houses, apartments, and land in Rwanda. Connect directly with thousands of potential buyers.'),
    keywords: 'register real estate agent Kigali, list house for sale Rwanda, property owner dashboard Rwanda'
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone, user_type: 'owner' }
        }
      });
      if (signUpError) throw signUpError;

      // Insert profile row
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          email,
          phone,
          is_public: true
        });
      }

      setSuccess(true);
      onRegisterSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center px-4">
        <div className="w-full max-w-[420px] text-center">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <Link to="/" className="flex items-center text-[#567C8D]">
              <span className="font-semibold tracking-tighter -skew-x-[12deg] text-[28px] mr-[1px]">z</span>
              <span className="font-medium text-[26px]">itta</span>
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E6ED]">
            <div className="w-16 h-16 rounded-full bg-[#567C8D] flex items-center justify-center mx-auto mb-5">
              <Check size={30} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2">{t('Account created!')}</h2>
            <p className="text-[14px] text-[#567C8D] mb-6">
              {t('Check your email to confirm your account, then sign in to access your dashboard.')}
            </p>
            <Link
              to="/owner/login"
              className="block w-full py-3.5 rounded-xl font-bold text-[15px] bg-[#567C8D] hover:bg-[#2F4156] text-white transition-colors text-center"
            >
              {t('Go to Login')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Link to="/" className="flex items-center text-[#567C8D]">
            <span className="font-semibold tracking-tighter -skew-x-[12deg] text-[28px] mr-[1px]">z</span>
            <span className="font-medium text-[26px]">itta</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E6ED]">
          <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-1">{t('Create Owner Account')}</h1>
          <p className="text-[13px] text-[#567C8D] mb-6">{t('List and manage your properties on Zitta')}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]"><User size={18} strokeWidth={2} /></div>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder={t('Full name')} required
                className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]"><Mail size={18} strokeWidth={2} /></div>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('Email address')} required autoComplete="email"
                className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]"><Phone size={18} strokeWidth={2} /></div>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder={t('Phone number (optional)')}
                className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]"><Lock size={18} strokeWidth={2} /></div>
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={t('Create password (min. 6 chars)')} required minLength={6}
                className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-12 py-3.5 text-[15px] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#567C8D] hover:text-[#2F4156]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={!fullName || !email || !password || loading}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] bg-[#567C8D] hover:bg-[#2F4156] text-white transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('Creating account...') : t('Create Account')}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F5EFEB] text-center">
            <span className="text-[13px] text-[#567C8D]">{t('Already have an account?')} </span>
            <Link to="/owner/login" className="text-[13px] font-bold text-[#567C8D] hover:text-[#2F4156] underline">
              {t('Sign in')}
            </Link>
          </div>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-[12px] text-[#A0B3C6] hover:text-[#567C8D] transition-colors"> {t('Back to Zitta')}</Link>
        </p>
      </div>
    </div>
  );
}
