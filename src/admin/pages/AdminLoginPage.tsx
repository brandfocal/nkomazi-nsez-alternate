import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminRole } from '../types';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<AdminRole>('SUPER_ADMIN');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your corporate email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await login(email, password, roleSelection);
      navigate('/admin');
    } catch {
      setError('Invalid credentials or unauthorized login attempt.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: AdminRole) => {
    if (role === 'SUPER_ADMIN') {
      setEmail('sipho.ndlovu@nkomazisez.gov.za');
      setPassword('••••••••••••');
      setRoleSelection('SUPER_ADMIN');
    } else {
      setEmail('thandi.m@nkomazisez.gov.za');
      setPassword('••••••••••••');
      setRoleSelection('STANDARD_ADMIN');
    }
  };

  return (
    <div className="min-h-screen bg-[#081B12] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Poppins',system-ui,sans-serif]">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#28B674]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#F2AE37]/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-md w-full relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3 hover:opacity-90 transition-opacity" title="Back to Public Website">
            <img
              src="/NSEZ-Horizontal-Logo-white.png"
              alt="Mpumalanga Nkomazi SEZ"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow mx-auto"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
            Mpumalanga Nkomazi SEZ
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#F2AE37] font-semibold">
            Admin Management Portal
          </p>
        </div>

        {/* Demo Fast Login Helper */}
        <div className="bg-[#022A1A]/80 border border-[#28B674]/30 rounded-xl p-3.5 mb-6 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2AE37] mb-2">
            <Sparkles size={14} /> Quick Demo Logins (Click to autofill):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('SUPER_ADMIN')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <div className="text-[11px] font-bold text-white">Super Admin</div>
              <div className="text-[10px] text-white/60">Full approvals & delete</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('STANDARD_ADMIN')}
              className="text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <div className="text-[11px] font-bold text-white">Standard Admin</div>
              <div className="text-[10px] text-white/60">Edits queue for review</div>
            </button>
          </div>
        </div>

        {/* Login form card */}
        <div className="bg-[#0D2619] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@nkomazisez.gov.za"
                  required
                  className="w-full bg-[#081B12] border border-white/15 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#28B674] focus:ring-1 focus:ring-[#28B674] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                  Password
                </label>
                <Link
                  to="/admin/forgot-password"
                  className="text-[11px] text-[#F2AE37] hover:underline no-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#081B12] border border-white/15 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#28B674] focus:ring-1 focus:ring-[#28B674] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#28B674] hover:bg-[#22a166] text-[#023A23] font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#28B674]/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        </div>

        {/* Back to public site */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-white/60 hover:text-white no-underline transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
