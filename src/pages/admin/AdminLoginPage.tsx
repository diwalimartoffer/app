import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DiyaIcon } from '../../components/common/DiyaIcon';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { isAdminAuthenticated, adminLogin } = useAdminAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to the secret dashboard orders route
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/dm-secure-portal-9472/orders');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = adminLogin(identifier, password);
    if (res.success) {
      navigate('/dm-secure-portal-9472/orders');
    } else {
      setError(res.error || 'Access Denied: Invalid credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 w-full">
      <div className="bg-[#150f0a] border border-amber-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl relative overflow-hidden glow-gold">
        {/* Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 mb-3 shadow-md">
            <DiyaIcon size={30} />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-1.5">
            Restricted System Gateway
          </div>
          <h1 className="text-2xl font-bold font-serif text-stone-100">
            Secure Portal
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Verification &amp; Order Fulfillment Vault
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">
              Secure Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="off"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter authorized username"
                className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl pl-9 pr-3 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <User className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="off"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full bg-[#1b120a] border border-amber-900/40 rounded-xl pl-9 pr-10 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-amber-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-xs shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-amber-950/50 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Encrypted Gateway · Unauthorized access strictly logged</span>
        </div>
      </div>
    </div>
  );
};
