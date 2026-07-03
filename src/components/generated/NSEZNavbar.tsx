import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";



const SOCIAL_LINKS = [
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891ZM10.0017 1.66797C7.73884 1.66797 7.45558 1.67774 6.56673 1.71681C5.68114 1.75588 5.0723 1.89913 4.54485 2.10425C3.99462 2.31914 3.52903 2.6024 3.0667 3.06798C2.60111 3.53031 2.31786 3.9959 2.10297 4.54288C1.89785 5.07358 1.75459 5.67917 1.71552 6.56476C1.67645 7.45686 1.66669 7.74012 1.66669 10.0029C1.66669 12.2657 1.67645 12.549 1.71552 13.4378C1.75459 14.3234 1.89785 14.9323 2.10297 15.4597C2.31786 16.01 2.60111 16.4756 3.0667 16.9379C3.52903 17.4002 3.99462 17.6867 4.5416 17.8984C5.0723 18.1035 5.67789 18.2467 6.56348 18.2858C7.45232 18.3249 7.73558 18.3346 9.99839 18.3346C12.2612 18.3346 12.5445 18.3249 13.4333 18.2858C14.3189 18.2467 14.9277 18.1035 15.4552 17.8984C16.0022 17.6867 16.4678 17.4002 16.9301 16.9379C17.3924 16.4756 17.6789 16.01 17.8906 15.463C18.0957 14.9323 18.2389 14.3267 18.278 13.4411C18.3171 12.5523 18.3268 12.269 18.3268 10.0062C18.3268 7.74338 18.3171 7.46012 18.278 6.57127C18.2389 5.68568 18.0957 5.07684 17.8906 4.54939C17.6854 3.9959 17.4022 3.53031 16.9366 3.06798C16.4743 2.60565 16.0087 2.31914 15.4617 2.10751C14.931 1.90239 14.3254 1.75913 13.4398 1.72006C12.5477 1.67774 12.2645 1.66797 10.0017 1.66797Z" />
        <path d="M10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215ZM10.0016 12.7802C8.46815 12.7802 7.22441 11.5364 7.22441 10.0029C7.22441 8.46943 8.46943 7.2257 10.0016 7.2257C11.5352 7.2257 12.7789 8.46943 12.7789 10.0029C12.7789 11.5364 11.5352 12.7802 10.0016 12.7802Z" />
        <circle cx="14.4524" cy="5.55216" r="1" />
      </svg>
    ),
    label: 'Instagram',
    href: 'https://www.instagram.com/nkomazisez/'
  },
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008C12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" />
      </svg>
    ),
    label: 'Facebook',
    href: 'https://web.facebook.com/people/Nkomazi-SEZ/61586568002498/'
  },
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" />
      </svg>
    ),
    label: 'YouTube',
    href: 'https://www.youtube.com/@NkomaziSEZ'
  },
  {
    Icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 18" fill="currentColor">
        <path d="M15.5996 0.666626H1.39716C0.716817 0.666626 0.166687 1.20374 0.166687 1.8678V16.1289C0.166687 16.7929 0.716817 17.3333 1.39716 17.3333H15.5996C16.28 17.3333 16.8334 16.7929 16.8334 16.1321V1.8678C16.8334 1.20374 16.28 0.666626 15.5996 0.666626ZM5.11135 14.8691H2.63739V6.91337H5.11135V14.8691ZM3.87437 5.82939C3.0801 5.82939 2.43882 5.18811 2.43882 4.39709C2.43882 3.60608 3.0801 2.9648 3.87437 2.9648C4.66539 2.9648 5.30666 3.60608 5.30666 4.39709C5.30666 5.18486 4.66539 5.82939 3.87437 5.82939ZM14.3692 14.8691H11.8985V11.0019C11.8985 10.0807 11.8822 8.89254 10.6127 8.89254C9.32684 8.89254 9.13153 9.8984 9.13153 10.9368V14.8691H6.66408V6.91337H9.03387V8.00061H9.06643C9.3952 7.37561 10.2025 6.7148 11.4037 6.7148C13.9069 6.7148 14.3692 8.36194 14.3692 10.5039V14.8691Z" />
      </svg>
    ),
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/nkomazi-special-economic-zone/'
  }
];

const ArrowUpRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
    <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
    <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GreenButton = ({ label, href = '/contact' }: { label: string; href?: string }) => (
  <motion.a
    href={href}
    className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg"
    whileHover={{ y: -2, scale: 1.015 }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    <div className="flex items-center justify-center px-5 bg-[#1fac67] text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{ fontFamily: BODY_FONT }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] bg-[#1fac67] text-white rounded-r-lg flex-shrink-0">
      <ArrowRightIcon />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)' }} />
  </motion.a>
);



export function NSEZNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (href: string) => {
    if (href === '/') {
      return currentPath === '/' || currentPath === '/homev2';
    }
    if (href.startsWith('/#')) {
      return currentPath === '/';
    }
    return currentPath === href;
  };

  const navLinks = [
    { label: 'About Us', href: '/about-us' },
    { label: 'Investor Hub', href: '/investor-hub' },
    { label: 'Sectors', href: '/sectors' },
    { label: 'MSME Hub', href: '/enterprise-hub' },
    { label: 'Tenders', href: '/tenders' },
    { label: 'News & Media', href: '/news-media' },
    { label: 'Stakeholder Relations', href: '/stakeholder-engagement' },
    { label: 'Careers', href: '/careers' }
  ];

  return (
    <>
      {/* Top Banner */}
      <div
        className="fixed top-0 left-0 right-0 z-[10000] flex items-center justify-between px-4 sm:px-6"
        style={{
          height: '36px',
          background: '#FAFAF8',
          borderBottom: '1px solid #E5E5E5'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href="mailto:invest@nsez.gov.za" style={{ fontFamily: BODY_FONT, fontSize: '11px', color: '#1D4D35', textDecoration: 'none', letterSpacing: '0.04em' }}>
            invest@nsez.gov.za
          </a>
          <span style={{ color: '#1D4D35', opacity: 0.35, fontSize: '11px' }}>|</span>
          <a href="mailto:info@nsez.gov.za" style={{ fontFamily: BODY_FONT, fontSize: '11px', color: '#1D4D35', textDecoration: 'none', letterSpacing: '0.04em' }}>
            info@nsez.gov.za
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {SOCIAL_LINKS.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1D4D35',
                transition: 'color 0.2s',
                width: '16px',
                height: '16px',
                opacity: 0.75
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75'; }}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav
        className="fixed left-0 right-0 z-[9999] px-4 sm:px-6"
        style={{
          top: '36px',
          paddingTop: scrolled ? '0px' : '20px',
          transition: 'padding 0.35s ease'
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: scrolled ? 1 : 0,
            background: 'rgba(10, 24, 16, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: scrolled ? '0 1px 0 rgba(200,168,75,0.15)' : 'none',
            transition: 'background 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.4), transparent)',
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0.35s ease'
          }}
        />
        <div className="relative flex justify-center">
          <div
            className="flex items-center justify-between w-full max-w-[1372px]"
            style={{
              paddingTop: scrolled ? '14px' : '0px',
              paddingBottom: scrolled ? '14px' : '0px',
              transition: 'padding 0.35s ease'
            }}
          >
            <a href="/" className="flex-shrink-0 flex items-center no-underline">
              <img
                src="/NSEZ-logo-png-wh.png"
                alt="Nkomazi SEZ"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </a>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-0 backdrop-blur-[26px] bg-white/10 border border-white/20 rounded-xl p-[4.6px]">
              {navLinks.map(link => {
                const active = isActive(link.href);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 transition-all duration-300 no-underline tracking-[0.01em]"
                    style={{
                      fontFamily: BODY_FONT,
                      borderBottom: `2px solid ${active ? '#C8A84C' : 'transparent'}`,
                      color: active ? '#C8A84C' : '#ffffff',
                      transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#C8A84C'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = active ? '#C8A84C' : 'transparent'; }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <GreenButton label="Get In Touch" href="/contact" />
              </div>
              <button
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[#1fac67] text-white flex-shrink-0 border-none cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="relative lg:hidden mt-2 rounded-2xl bg-[#26b573]/95 backdrop-blur-md overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-2">
                {navLinks.map(l => {
                  const active = isActive(l.href);
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 no-underline"
                      style={{
                        fontFamily: BODY_FONT,
                        color: active ? '#C8A84C' : '#ffffff',
                        background: active ? 'rgba(200, 168, 76, 0.1)' : 'transparent'
                      }}
                    >
                      {l.label}
                    </a>
                  );
                })}

                <div className="pt-2">
                  <GreenButton label="Get In Touch" href="/contact" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}