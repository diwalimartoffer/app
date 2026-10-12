import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DiyaIcon } from '../components/common/DiyaIcon';
import { Eye, EyeOff, Lock, Phone, User, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
  redirect?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, redirect }) => {
  const { login, register, loading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isRegisterMode) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }

      const res = await register(fullName, `+91${cleanPhone}`, password);
      if (res.success) {
        navigate(redirect || '/checkout');
      } else if (res.error) {
        setError(res.error);
      }
    } else {
      const res = await login(`+91${cleanPhone}`, password);
      if (res.success) {
        navigate(redirect || '/checkout');
      } else if (res.error) {
        setError(res.error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 w-full">
      <div className="bg-[#150f0a] border border-amber-950/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden glow-gold">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        {/* Branding & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-950/50 border border-amber-500/30 mb-3 shadow-md">
            <DiyaIcon size={28} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-100 mb-1">
            {isRegisterMode ? 'Create Your Account' : 'Welcome to Diwali Mart'}
          </h2>
          <p className="text-xs text-stone-400">
            {isRegisterMode
              ? 'Register with your Indian mobile number & password to continue'
              : 'Sign in with your mobile number to access saved addresses and checkout'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#1a110a] rounded-xl border border-amber-950/60 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              !isRegisterMode
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              isRegisterMode
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name for Registration */}
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Mobile Number with +91 Country Tag */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Mobile Number
            </label>
            <div className="flex rounded-xl overflow-hidden border border-amber-900/40 focus-within:border-amber-500">
              <span className="bg-[#1e140c] text-amber-400 text-xs font-semibold px-3 py-2.5 flex items-center gap-1 border-r border-amber-900/40">
                <span>🇮🇳</span>
                <span>+91</span>
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#1b120a] px-3 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl pl-9 pr-10 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password for Registration */}
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : isRegisterMode
              ? 'Register & Continue'
              : 'Sign In & Continue'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill for Instant Testing */}
        {!isRegisterMode && (
          <div className="mt-4 p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-center">
            <p className="text-[11px] text-stone-400 mb-1.5">
              Quick Test Account (Synced across all browsers):
            </p>
            <button
              type="button"
              onClick={() => {
                setMobileNumber('9876543210');
                setPassword('Diwali2026!');
                setError(null);
              }}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              Fill Demo Login: 9876543210 / Diwali2026!
            </button>
          </div>
        )}

        {/* Security / Privacy notice */}
        <div className="mt-6 pt-4 border-t border-amber-950/50 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
          <span>Centralized Cloud Authentication with Cross-Browser Sync</span>
        </div>
      </div>
    </div>
  );
};
