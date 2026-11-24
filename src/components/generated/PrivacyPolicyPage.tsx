import React from 'react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';
import { ShieldCheck, ChevronRight, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HEADING_FONT = "'Poppins', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

export const PrivacyPolicyPage: React.FC = () => {
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
            <span className="text-[#F2AE37]">Privacy Policy</span>
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
            <span style={{ color: '#28B674' }}>Privacy</span>{' '}
            <span style={{ color: '#ffffff' }}>Policy &amp; Data Protection</span>
          </h1>
          <p
            style={{
              fontFamily: BODY_FONT,
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '680px',
              margin: 0
            }}
          >
            The Mpumalanga Nkomazi Special Economic Zone is committed to protecting your personal data and ensuring compliance with the Protection of Personal Information Act (POPIA), Act 4 of 2013.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAFAF8] border border-black/5 rounded-2xl p-6 sm:p-10 mb-12 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-[#28B674] w-6 h-6" />
              <h3 style={{ fontFamily: HEADING_FONT, fontSize: '24px', fontWeight: 700, margin: 0, textTransform: 'uppercase', color: '#0F3024' }}>
                Statutory Notice (POPIA Compliance)
              </h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed m-0">
              This policy explains how the Mpumalanga Nkomazi SEZ collects, stores, processes, and protects personal information submitted through our investor portals, procurement tenders, career applications, and whistleblower channels. Formal policy revisions are managed through the Office of the Information Officer.
            </p>
          </div>

          <div className="space-y-10 text-neutral-700">
            <div>
              <h2 style={{ fontFamily: HEADING_FONT, fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: '#0F3024', marginBottom: '12px' }}>
                1. Information We Collect
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                When you interact with our website or submit inquiries, we may process:
              </p>
              <ul className="space-y-2 text-sm text-neutral-600 list-disc pl-5">
                <li>Contact information (e.g. name, email address, corporate entity, phone number).</li>
                <li>Investor application details, land allocation requests, and lease documentation.</li>
                <li>Procurement submissions, vendor registration data, and tender compliance records.</li>
                <li>Technical logs, IP addresses, and browsing statistics collected via essential cookies.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: HEADING_FONT, fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: '#0F3024', marginBottom: '12px' }}>
                2. Purpose of Processing
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                Personal information is used solely for legitimate business operations of the Special Economic Zone:
              </p>
              <ul className="space-y-2 text-sm text-neutral-600 list-disc pl-5">
                <li>Facilitating investor due diligence, customs corridor coordination, and land leases.</li>
                <li>Processing public procurement bids and statutory governance verifications.</li>
                <li>Communicating SEZ developments, media statements, and public stakeholder notices.</li>
                <li>Protecting institutional integrity via protected whistleblower reporting channels.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: HEADING_FONT, fontSize: '28px', fontWeight: 700, textTransform: 'uppercase', color: '#0F3024', marginBottom: '12px' }}>
                3. Your Rights as a Data Subject
              </h2>
              <p className="text-sm leading-relaxed">
                Under POPIA, you have the right to request access to your personal records, request corrections or updates, and object to processing where applicable. Inquiries should be addressed to{' '}
                <a href="mailto:info@nkomazisez.gov.za" className="text-[#28B674] font-semibold underline">
                  info@nkomazisez.gov.za
                </a>.
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

