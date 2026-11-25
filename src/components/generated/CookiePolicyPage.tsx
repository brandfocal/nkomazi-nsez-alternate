import React from 'react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';
import { Cookie, ChevronRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const HEADING_FONT = "'Poppins', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#111111] overflow-x-hidden" style={{ fontFamily: BODY_FONT }}>
      <NSEZNavbar />
      <div style={{ height: '36px' }} />

      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0A1C13 0%, #0F3024 100%)',
          paddingTop: 'clamp(64px, 10vw, 120px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          position: 'relative'
        }}
      >
        <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-white/50 tracking-wider uppercase">
            <Link to="/" className="text-white/60 hover:text-white no-underline">Home</Link>
            <ChevronRight size={12} className="text-[#F2AE37]" />
            <span className="text-[#F2AE37]">Cookie Policy</span>
          </div>

          <h1
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-1px',
              color: '#ffffff',
              margin: '0 0 16px 0',
              textTransform: 'uppercase'
            }}
          >
            <span style={{ color: '#28B674' }}>Cookie</span>{' '}
            <span style={{ color: '#ffffff' }}>Policy</span>
          </h1>
          <p
            style={{
              fontFamily: BODY_FONT,
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 500,
              maxWidth: '680px',
              margin: 0
            }}
          >
            Learn how the Mpumalanga Nkomazi Special Economic Zone utilizes cookies and local storage to guarantee portal reliability, security, and performance.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAFAF8] border border-black/5 rounded-2xl p-6 sm:p-10 mb-12 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="text-[#F2AE37] w-6 h-6" />
              <h3 style={{ fontFamily: HEADING_FONT, fontSize: '24px', fontWeight: 700, margin: 0, textTransform: 'uppercase', color: '#0F3024' }}>
                Cookie Usage Summary
              </h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed m-0">
              Cookies are small data files placed on your browser or device when you browse websites. We use strictly necessary cookies for core portal navigation and optional analytical telemetry to help us measure investor engagement.
            </p>
          </div>

          <div className="space-y-10 text-neutral-700">
            <div>
              <h2 style={{ fontFamily: HEADING_FONT, fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: '#0F3024', marginBottom: '12px' }}>
                1. Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-neutral-200">
                  <h4 className="font-semibold text-sm text-[#0F3024] mb-1">Strictly Necessary Cookies</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed m-0">
                    Essential for website security, user authentication, and persistent session state. These cannot be disabled without affecting site operation.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200">
                  <h4 className="font-semibold text-sm text-[#0F3024] mb-1">Performance &amp; Analytics Cookies</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed m-0">
                    Enable us to assess page traffic patterns, popular tender categories, and download metrics to refine our public information delivery.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: HEADING_FONT, fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: '#0F3024', marginBottom: '12px' }}>
                2. Managing Your Preferences
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                You can change or reset your consent choices at any time via the Cookie Consent Banner or through your web browser settings. Rejecting non-essential cookies will not prevent you from viewing tender listings, investor guidelines, or contacting our team.
              </p>
            </div>

            <div className="pt-6 border-t border-black/10">
              <span className="text-xs text-neutral-400">
                Last updated: November 2026 · Mpumalanga Nkomazi Special Economic Zone
              </span>
            </div>
          </div>
        </div>
      </section>

      <NSEZFooterSection />
    </div>
  );
};

