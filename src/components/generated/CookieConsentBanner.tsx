import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const HEADING_FONT = "'Poppins', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

export const CookieConsentBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('nsez_cookie_consent');
      if (!consent) {
        // Show after a gentle 800ms delay so page content loads first
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // LocalStorage might be disabled in private mode
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('nsez_cookie_consent', 'accepted');
    } catch (e) {}
    setIsOpen(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem('nsez_cookie_consent', 'rejected');
    } catch (e) {}
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-[460px] z-[99999]"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-2xl border"
            style={{
              background: 'rgba(11, 28, 19, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'rgba(242, 174, 55, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Ambient subtle glow */}
            <div
              className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(40, 182, 116,0.2) 0%, transparent 70%)'
              }}
            />

            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(242, 174, 55, 0.15)',
                    border: '1px solid rgba(242, 174, 55, 0.35)',
                    color: '#F2AE37'
                  }}
                >
                  <Cookie size={18} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: HEADING_FONT,
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.02em',
                      margin: 0,
                      textTransform: 'uppercase'
                    }}
                  >
                    Cookie &amp; Privacy Preferences
                  </h4>
                  <span
                    style={{
                      fontFamily: BODY_FONT,
                      fontSize: '11px',
                      color: '#F2AE37',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Mpumalanga Nkomazi SEZ
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReject}
                className="text-white/40 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content text */}
            <p
              style={{
                fontFamily: BODY_FONT,
                fontSize: '13px',
                lineHeight: '1.65',
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '0 0 16px 0'
              }}
            >
              We use cookies to enhance your experience, analyze web traffic, and support investor services in accordance with South Africa&apos;s POPIA regulations. Review our{' '}
              <Link
                to="/privacy-policy"
                className="underline hover:text-white transition-colors font-medium"
                style={{ color: '#F2AE37' }}
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                to="/cookie-policy"
                className="underline hover:text-white transition-colors font-medium"
                style={{ color: '#F2AE37' }}
              >
                Cookie Policy
              </Link>.
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer text-white shadow-md"
                style={{
                  fontFamily: BODY_FONT,
                  background: '#28B674',
                  border: '1px solid #28B674'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#189657'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#28B674'; }}
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer text-white/80 hover:text-white"
                style={{
                  fontFamily: BODY_FONT,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.18)'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.06)'; }}
              >
                Reject Non-Essential
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

