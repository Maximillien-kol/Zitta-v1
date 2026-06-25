import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';

interface ZOwnerLoginProps {
  onLogin?: (email: string, password: string) => void;
  error?: string;
}

export function ZOwnerLogin({ onLogin, error }: ZOwnerLoginProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useSEO({
    title: t('Property Owner Login'),
    description: t('Log in to your Zitta Property Dashboard. Manage your listings, chat with buyers, and grow your real estate portfolio in Rwanda.'),
    keywords: 'list property Rwanda, sell house Kigali, real estate agent dashboard Rwanda, Zitta landlord login'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    // onLogin will set loading to false via auth state change
    onLogin?.(email, password);
    // Small timeout fallback to re-enable button if nothing happens
    setTimeout(() => setLoading(false), 4000);
  };

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
          <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-1">{t('Login')}</h1>
          <p className="text-[13px] text-[#567C8D] mb-6">{t('Access your property owner dashboard')}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                <Mail size={18} strokeWidth={2} />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('Email address')}
                required
                autoComplete="email"
                className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-4 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#567C8D]">
                <Lock size={18} strokeWidth={2} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('Password')}
                required
                autoComplete="current-password"
                className="w-full bg-[#F9FAFB] border border-[#E0E6ED] rounded-xl pl-12 pr-12 py-3.5 text-[15px] text-[#1A1A1A] outline-none focus:bg-white focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#567C8D] hover:text-[#2F4156]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!email || !password || loading}
              className="w-full py-3.5 rounded-xl font-bold text-[15px] bg-[#567C8D] hover:bg-[#2F4156] text-white transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('Logging in...') : t('Log in')}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F5EFEB] text-center">
            <span className="text-[13px] text-[#567C8D]">{t('New property owner?')} </span>
            <Link to="/owner/register" className="text-[13px] font-bold text-[#567C8D] hover:text-[#2F4156] underline">
              {t('Create account')}
            </Link>
          </div>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-[12px] text-[#A0B3C6] hover:text-[#567C8D] transition-colors">
            {t('Back to Zitta')}
          </Link>
        </p>
      </div>
    </div>
  );
}
