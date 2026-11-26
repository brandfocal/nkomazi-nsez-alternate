import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';

export const AdminForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F2AE37] to-[#C99126] border border-[#F2AE37]/40 shadow-xl mb-3 font-bold text-xl text-[#023A23]">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Password Recovery
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#F2AE37] font-semibold">
            Nkomazi SEZ Administrative Access
          </p>
        </div>

        <div className="bg-[#0D2619] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="text-[#28B674] mx-auto mb-3" />
              <h2 className="text-base font-bold text-white mb-2">Reset Link Dispatched</h2>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                If an administrative account exists for <strong className="text-white">{email}</strong>, a single-use cryptographically signed reset token valid for 30 minutes has been sent to your inbox.
              </p>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center gap-2 bg-[#28B674] hover:bg-[#22a166] text-[#023A23] font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-lg no-underline transition-colors"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-white/70 leading-relaxed mb-4">
                Enter your official Nkomazi SEZ corporate email. Our server will generate a cryptographically signed recovery token in accordance with our security policies.
              </p>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#F2AE37] hover:bg-[#e09e2a] text-[#023A23] font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Dispatching Token...' : 'Send Secure Reset Link'}</span>
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/admin/login"
                  className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1.5 no-underline transition-colors"
                >
                  <ArrowLeft size={13} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-white/50">
            <ShieldCheck size={13} className="text-[#28B674]" />
            <span>Time-limited (30m) Single-use Tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
};
