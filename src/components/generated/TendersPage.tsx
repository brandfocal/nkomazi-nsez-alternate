import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronRight, Search, Calendar } from 'lucide-react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';

// --- Constants & Styling ---
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";
const PRIMARY_GREEN = "#1D4D35";
const ACCENT_GREEN = "#1fac67";
const GOLD = "#C9A84C";
const ORANGE = "#E8521A";

// --- Types ---
type OpportunityCategory = 'Tender' | 'RFQ' | 'Partnership' | 'Leasing' | 'EOI';
interface Opportunity {
  id: string;
  category: OpportunityCategory;
  title: string;
  description: string;
  closingDate: string;
  status: 'Open' | 'Closed' | 'Closing Soon';
}
interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
interface SocialLinkItem {
  Icon: React.FC;
  label: string;
  href: string;
}

// --- Mock Data ---
const OPPORTUNITIES: Opportunity[] = [{
  id: '1',
  category: 'Tender',
  title: 'Civil Infrastructure Works Phase 1',
  description: 'Invitation to tender for civil engineering and earthworks for Nkomazi SEZ Phase 1 infrastructure including internal roads and bulk services.',
  closingDate: '31 July 2026',
  status: 'Open'
}, {
  id: '2',
  category: 'RFQ',
  title: 'Security Services Supply',
  description: 'Request for quotation for on-site security services at the Komatipoort site to ensure 24/7 protection of assets and personnel.',
  closingDate: '15 July 2026',
  status: 'Closing Soon'
}, {
  id: '3',
  category: 'Partnership',
  title: 'Agro-processing Investment Partnership',
  description: 'Seeking strategic partners in the agro-processing value chain for co-investment and operations within the designated industrial zone.',
  closingDate: 'Open',
  status: 'Open'
}, {
  id: '4',
  category: 'Leasing',
  title: 'Industrial Land Leasing',
  description: 'Industrial-zoned land parcels available for long-term lease within the SEZ footprint. Various sizes available from 0.5ha to 10ha.',
  closingDate: 'Open',
  status: 'Open'
}, {
  id: '5',
  category: 'EOI',
  title: 'Renewable Energy Developer',
  description: 'Expression of interest from renewable energy developers for on-site generation projects including solar and biomass solutions.',
  closingDate: '30 August 2026',
  status: 'Open'
}, {
  id: '6',
  category: 'Tender',
  title: 'Consulting Services Environmental Impact Assessment',
  description: 'Tender for qualified environmental consultants to conduct a comprehensive EIA for Phase 2 development areas of the Nkomazi SEZ.',
  closingDate: '20 July 2026',
  status: 'Closing Soon'
}];
const STATS: StatItem[] = [{
  value: 6,
  suffix: '+',
  label: 'Active Tenders'
}, {
  value: 3,
  suffix: '',
  label: 'Priority Sectors'
}, {
  value: 10,
  suffix: 'ha+',
  label: 'Land Available'
}];
const CATEGORIES: {
  label: string;
  value: OpportunityCategory | 'All';
}[] = [{
  label: 'All',
  value: 'All'
}, {
  label: 'Tenders',
  value: 'Tender'
}, {
  label: 'RFQs',
  value: 'RFQ'
}, {
  label: 'Partnerships',
  value: 'Partnership'
}, {
  label: 'Leasing',
  value: 'Leasing'
}, {
  label: 'Expressions of Interest',
  value: 'EOI'
}];

// --- Footer Data ---
const EXPLORE_LINKS = ['About Nkomazi SEZ', 'Why Invest', 'Priority Sectors', 'Investor Hub'];
const CONNECT_LINKS = ['Investment Process', 'Resources', 'Partners', 'Contact'];
const NAV_SECTORS = ['Agro-processing', 'Manufacturing', 'Green Economy', 'Logistics and Warehousing'];
const NAV_SIMPLE_LINKS = ['About Nkomazi SEZ', 'Invest', 'Sectors', 'MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];

// --- Icons ---
const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
    <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
    <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891Z" fill="currentColor" />
    <path d="M10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215Z" fill="currentColor" />
  </svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008C12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" fill="currentColor" />
  </svg>;
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" fill="currentColor" />
  </svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 18" fill="none">
    <path d="M15.5996 0.666626H1.39716C0.716817 0.666626 0.166687 1.20374 0.166687 1.8678V16.1289C0.166687 16.7929 0.716817 17.3333 1.39716 17.3333H15.5996C16.28 17.3333 16.8334 16.7929 16.8334 16.1321V1.8678C16.8334 1.20374 16.28 0.666626 15.5996 0.666626ZM5.11135 14.8691H2.63739V6.91337H5.11135V14.8691ZM3.87437 5.82939C3.0801 5.82939 2.43882 5.18811 2.43882 4.39709C2.43882 3.60608 3.0801 2.9648 3.87437 2.9648C4.66539 2.9648 5.30666 3.60608 5.30666 4.39709C5.30666 5.18486 4.66539 5.82939 3.87437 5.82939ZM14.3692 14.8691H11.8985V11.0019C11.8985 10.0807 11.8822 8.89254 10.6127 8.89254C9.32684 8.89254 9.13153 9.8984 9.13153 10.9368V14.8691H6.66408V6.91337H9.03387V8.00061H9.06643C9.3952 7.37561 10.2025 6.7148 11.4037 6.7148C13.9069 6.7148 14.3692 8.36194 14.3692 10.5039V14.8691Z" fill="currentColor" />
  </svg>;
const SOCIAL_LINKS: SocialLinkItem[] = [{
  Icon: InstagramIcon,
  label: 'Instagram',
  href: 'https://www.instagram.com/nkomazisez/'
}, {
  Icon: FacebookIcon,
  label: 'Facebook',
  href: 'https://web.facebook.com/people/Nkomazi-SEZ/61586568002498/'
}, {
  Icon: YouTubeIcon,
  label: 'YouTube',
  href: 'https://www.youtube.com/@NkomaziSEZ'
}, {
  Icon: LinkedInIcon,
  label: 'LinkedIn',
  href: 'https://www.linkedin.com/company/nkomazi-special-economic-zone/'
}];

// --- Button Components ---
const GoldButton = ({
  label,
  fullWidthMobile = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidthMobile?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a
  href={href}
  onClick={e => {
    if (onClick) {
      onClick(e);
    } else if (href === '#') {
      e.preventDefault();
    }
  }}
  className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidthMobile ? 'w-full sm:w-auto' : ''}`}
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.2,
    ease: 'easeOut'
  }}
>
    <div className="flex items-center justify-center flex-1 px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
    fontFamily: BODY_FONT,
    background: ORANGE
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-white rounded-r-lg flex-shrink-0" style={{
    background: ORANGE
  }}>
      <ArrowUpRightIcon />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{
    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)'
  }} />
  </motion.a>;

const GhostButtonDark = ({
  label,
  fullWidthMobile = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidthMobile?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a
  href={href}
  onClick={e => {
    if (onClick) {
      onClick(e);
    } else if (href === '#') {
      e.preventDefault();
    }
  }}
  className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidthMobile ? 'w-full sm:w-auto' : ''}`}
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.2,
    ease: 'easeOut'
  }}
>
    <div className="flex items-center justify-center flex-1 px-5 overflow-hidden rounded-l-lg tracking-[0.01em] text-[15px] font-medium" style={{
    fontFamily: BODY_FONT,
    color: '#111111',
    background: 'transparent',
    border: '1.5px solid rgba(17,17,17,0.55)',
    borderRight: 'none'
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] rounded-r-lg flex-shrink-0" style={{
    color: '#111111',
    background: 'transparent',
    border: '1.5px solid rgba(17,17,17,0.55)',
    borderLeft: 'none'
  }}>
      <ArrowRightIcon />
    </div>
  </motion.a>;

const GreenButton = ({
  label,
  fullWidthMobile = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidthMobile?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a
  href={href}
  onClick={e => {
    if (onClick) {
      onClick(e);
    } else if (href === '#') {
      e.preventDefault();
    }
  }}
  className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidthMobile ? 'w-full sm:w-auto' : ''}`}
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.2,
    ease: 'easeOut'
  }}
>
    <div className="flex items-center justify-center flex-1 px-5 bg-[#1fac67] text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
    fontFamily: BODY_FONT
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] bg-[#1fac67] text-white rounded-r-lg flex-shrink-0">
      <ArrowRightIcon />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{
    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)'
  }} />
  </motion.a>;

const GhostButton = ({
  label,
  fullWidthMobile = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidthMobile?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a
  href={href}
  onClick={e => {
    if (onClick) {
      onClick(e);
    } else if (href === '#') {
      e.preventDefault();
    }
  }}
  className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidthMobile ? 'w-full sm:w-auto' : ''}`}
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.2,
    ease: 'easeOut'
  }}
>
    <div className="flex items-center justify-center flex-1 px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
    fontFamily: BODY_FONT,
    background: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.55)',
    borderRight: 'none'
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-white rounded-r-lg flex-shrink-0" style={{
    background: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.55)',
    borderLeft: 'none'
  }}>
      <ArrowRightIcon />
    </div>
  </motion.a>;

// --- FadeUp ---
const FadeUp = ({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-50px'
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 24
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.5,
    delay,
    ease: [0.22, 1, 0.36, 1]
  }} className={className}>
      {children}
    </motion.div>;
};

// --- Gold Dash Underline ---
const GoldDash = () => <div style={{
  width: '40px',
  height: '3px',
  background: GOLD,
  borderRadius: '2px',
  marginBottom: '12px'
}} />;

// --- Eyebrow label ---
const Eyebrow = ({
  children,
  light = false
}: {
  children: React.ReactNode;
  light?: boolean;
}) => <p style={{
  fontFamily: BODY_FONT,
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: light ? 'rgba(255,255,255,0.7)' : ACCENT_GREEN,
  margin: '0 0 10px 0'
}}>
    {children}
  </p>;

// --- Count-Up Stat ---
const CountUpStat = ({
  stat,
  delay
}: {
  stat: StatItem;
  delay: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-30px'
  });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const increment = stat.value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, stat.value]);
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 16
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.5,
    delay,
    ease: 'easeOut'
  }} className="flex flex-col">
      <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 700,
      fontSize: '20px',
      color: '#ffffff',
      lineHeight: 1.1,
      letterSpacing: '-0.3px'
    }}>
        {count}
        {stat.suffix}
      </span>
      <span style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      color: 'rgba(255,255,255,0.8)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginTop: '4px',
      lineHeight: 1.4
    }}>
        {stat.label}
      </span>
    </motion.div>;
};
// --- Floating Orb ---
const FloatingOrb = ({
  size,
  color,
  x,
  y,
  delay
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
}) => <motion.div style={{
  position: 'absolute',
  left: x,
  top: y,
  width: size,
  height: size,
  borderRadius: '50%',
  background: color,
  filter: 'blur(60px)',
  pointerEvents: 'none'
}} animate={{
  y: [0, -20, 0],
  opacity: [0.7, 1, 0.7]
}} transition={{
  duration: 7 + delay,
  ease: 'easeInOut',
  repeat: Infinity,
  delay
}} aria-hidden="true" />;

// --- Hero Section ---
const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const {
    scrollY
  } = useScroll();
  const scrollOpacityVal = useTransform(scrollY, [0, 500], [1, 0]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const opacityVal = isMobile ? 1 : scrollOpacityVal;
  const HERO_BG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85';
  return <section ref={heroRef} className="relative flex flex-col justify-end rounded-2xl sm:rounded-3xl mx-1.5 sm:mx-2.5 min-h-[580px] sm:min-h-[100svh] sm:h-[calc(100svh-36px)] sm:max-h-[calc(100svh-36px)] overflow-hidden">
      {/* Background image with parallax */}
      <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden'
    }}>
        <motion.div style={{
        position: 'absolute',
        inset: '-18% 0 0 0',
        y: bgY
      }}>
          <div className="absolute inset-0" style={{
          backgroundImage: `url("${HERO_BG}")`,
          backgroundPosition: 'center 40%',
          backgroundSize: 'cover'
        }} />
        </motion.div>
      </div>

      {/* Floating orbs */}
      <FloatingOrb size={320} color="rgba(93,187,58,0.10)" x="8%" y="20%" delay={0} />
      <FloatingOrb size={240} color="rgba(200,168,75,0.07)" x="72%" y="15%" delay={2.5} />
      <FloatingOrb size={180} color="rgba(93,187,58,0.07)" x="55%" y="55%" delay={1.2} />

      {/* Top dark overlay */}
      <div className="absolute inset-0" style={{
      background: 'linear-gradient(to bottom, rgba(8,22,14,0.82) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)',
      zIndex: 1
    }} />
      {/* Bottom dark overlay */}
      <div className="absolute inset-0" style={{
      background: 'linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)',
      zIndex: 1
    }} />

      {/* Decorative watermark — hidden on small screens to avoid overflow */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{
      zIndex: 0
    }}>
        <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(100px,16vw,220px)',
        color: 'rgba(255,255,255,0.04)',
        lineHeight: 1,
        userSelect: 'none',
        letterSpacing: '-0.04em'
      }}>TENDERS</span>
      </div>

      {/* Hero content */}
      <motion.div className="relative w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-32 sm:pt-0" style={{
      paddingBottom: 'clamp(28px, 5vh, 56px)',
      opacity: opacityVal,
      zIndex: 2
    }}>
        <motion.div className="w-full flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-8" initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1.0,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}>
          {/* Left column */}
          <div className="flex flex-col gap-0 flex-none w-full lg:w-[50%]">
            <div className="flex items-center gap-3 mb-3 sm:mb-4" style={{
            fontFamily: BODY_FONT,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.1em'
          }}>
              <span>Home</span>
              <ChevronRight size={12} />
              <span style={{
              color: GOLD
            }}>Tenders</span>
            </div>

            <motion.h1 initial={{
            opacity: 0,
            y: 14
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            fontFamily: HEADING_FONT,
            fontSize: 'clamp(32px, 6vw, 80px)',
            lineHeight: '1.05',
            letterSpacing: '-1px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0
          }}>
              <span style={{
              color: '#5DBB3A',
              display: 'block'
            }}>Partner with Us.</span>
              <span style={{
              color: '#FFFFFF',
              display: 'block'
            }}>Tenders &amp; Procurement.</span>
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.48,
            ease: 'easeOut'
          }} style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(13px, 1.5vw, 16px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 0,
            marginTop: '14px',
            fontWeight: 500,
            maxWidth: '520px'
          }}>
              Tenders, partnerships, leasing and investment opportunities within the Nkomazi Special Economic Zone.
            </motion.p>
          </div>

          {/* Right column — glassmorphism panel */}
          <div className="flex flex-col gap-0 w-full lg:w-[50%] flex-none" style={{
          background: 'rgba(5, 18, 10, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: 'clamp(16px, 3vw, 28px)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
            {/* Stats row */}
            <div ref={statsRowRef} className="grid grid-cols-3 sm:grid-cols-3" style={{
            gap: '12px',
            marginBottom: '16px'
          }}>
              {STATS.map((stat, i) => <div key={stat.label} className="flex flex-col" style={{
              paddingLeft: i > 0 ? '12px' : '0',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none'
            }}>
                  <CountUpStat stat={stat} delay={0.6 + i * 0.1} />
                </div>)}
            </div>

            <motion.p initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.55,
            ease: 'easeOut'
          }} className="hidden sm:block" style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '10px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
              Nkomazi SEZ is positioned as a gateway for regional and international investment, offering world-class
              infrastructure, investor-focused incentives, and access to key trade corridors connecting South Africa to the
              African continent.
            </motion.p>
            <motion.p initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.65,
            ease: 'easeOut'
          }} className="hidden sm:block" style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '16px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
              Explore current active tenders, RFQs, partnership calls, and leasing opportunities. Join us in building
              Mpumalanga's economic future.
            </motion.p>

            {/* Gold thin rule above CTAs */}
            <div style={{
            height: '1px',
            background: `rgba(201,168,76,0.3)`,
            marginBottom: '16px'
          }} />

            <motion.div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3" initial={{
            opacity: 0,
            y: 16
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.75,
            ease: 'easeOut'
          }}>
              <GoldButton label="View Opportunities" fullWidthMobile href="#opportunities" />
              <GhostButton label="Contact Investment Team" fullWidthMobile href="/contact" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div className="absolute z-10 flex flex-col items-center" style={{
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)'
    }} initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.6,
      duration: 0.6
    }}>
        <span style={{
        fontFamily: BODY_FONT,
        fontSize: '11px',
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '6px',
        whiteSpace: 'nowrap'
      }}>
          Scroll to explore
        </span>
        <motion.svg width="16" height="10" viewBox="0 0 16 10" fill="none" animate={{
        y: [0, 6]
      }} transition={{
        duration: 1.4,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse'
      }}>
          <path d="M1 1L8 8L15 1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>;
};

// --- Category Colors ---
const getCategoryColor = (cat: OpportunityCategory) => {
  switch (cat) {
    case 'Tender':
      return PRIMARY_GREEN;
    case 'RFQ':
      return '#1A3320';
    case 'Partnership':
      return GOLD;
    case 'Leasing':
      return ORANGE;
    case 'EOI':
      return '#1A2744';
    default:
      return PRIMARY_GREEN;
  }
};

// --- Opportunity Card ---
const OpportunityCard = ({
  item,
  index
}: {
  item: Opportunity;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-30px'
  });
  const [hovered, setHovered] = useState(false);
  const statusStyles = {
    Open: {
      bg: 'rgba(31,172,103,0.12)',
      text: '#1fac67'
    },
    'Closing Soon': {
      bg: 'rgba(232,82,26,0.12)',
      text: '#E8521A'
    },
    Closed: {
      bg: 'rgba(0,0,0,0.08)',
      text: '#888888'
    }
  };
  const ss = statusStyles[item.status];
  const catColor = getCategoryColor(item.category);
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 24
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.5,
    delay: index * 0.08,
    ease: 'easeOut'
  }} whileHover={{
    scale: 1.005
  }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
    background: '#FAFAF8',
    border: '1px solid rgba(29,77,53,0.1)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.09)' : '0 4px 24px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease',
    position: 'relative'
  }}>
      {/* Left vertical accent bar */}
      <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      background: hovered ? catColor : `linear-gradient(to bottom, ${catColor}, transparent)`,
      transition: 'background 0.2s ease'
    }} />

      {/* Card body */}
      <div className="p-5 sm:p-7" style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      paddingLeft: 'clamp(24px, 3vw, 32px)'
    }}>
        {/* Status + category row */}
        <div className="flex items-center justify-between" style={{
        marginBottom: '12px'
      }}>
          <span style={{
          fontFamily: BODY_FONT,
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '4px 10px',
          borderRadius: '99px',
          background: ss.bg,
          color: ss.text,
          whiteSpace: 'nowrap'
        }}>
            {item.status}
          </span>
          <span style={{
          fontFamily: HEADING_FONT,
          fontWeight: 700,
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '3px 10px',
          borderRadius: '99px',
          background: catColor + '22',
          color: catColor,
          whiteSpace: 'nowrap'
        }}>
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl lg:text-2xl" style={{
        fontFamily: HEADING_FONT,
        fontWeight: 700,
        color: '#0F3024',
        margin: '0 0 10px 0',
        lineHeight: 1.15,
        letterSpacing: '-0.3px'
      }}>
          {item.title}
        </h3>

        {/* Description */}
        <p style={{
        fontFamily: BODY_FONT,
        fontSize: '13px',
        color: '#5a6474',
        margin: 0,
        lineHeight: 1.75,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1
      }}>
          {item.description}
        </p>

        {/* Card footer */}
        <div style={{
        borderTop: '1px solid rgba(29,77,53,0.08)',
        paddingTop: '16px',
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
          <div className="flex items-center gap-2">
            <Calendar size={13} style={{
            color: GOLD,
            flexShrink: 0
          }} />
            <span style={{
            fontFamily: BODY_FONT,
            fontSize: '12px',
            color: '#667',
            letterSpacing: '0.03em'
          }}>
              {item.closingDate}
            </span>
          </div>
          <motion.a href="#" onClick={e => e.preventDefault()} className="flex items-center gap-2 no-underline" style={{
          fontFamily: BODY_FONT,
          fontSize: '11px',
          fontWeight: 700,
          color: ACCENT_GREEN,
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }} whileHover={{
          x: 2
        }} transition={{
          duration: 0.15
        }}>
            <span>View Details</span>
            <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: hovered ? '#1fac67' : 'rgba(29,77,53,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s ease'
          }}>
              <ArrowRightIcon />
            </div>
          </motion.a>
        </div>
      </div>
    </motion.div>;
};


// --- FilterBar ---
const FilterBar = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery
}: {
  activeFilter: OpportunityCategory | 'All';
  setActiveFilter: (v: OpportunityCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) => {
  const [focused, setFocused] = useState(false);
  return <section className="sticky top-[36px] z-[900] bg-white border-y border-black/5 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3 sm:py-4">
          {/* Pill tabs — horizontally scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
            {CATEGORIES.map(cat => <button key={cat.label} onClick={() => setActiveFilter(cat.value)} style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            fontWeight: activeFilter === cat.value ? 600 : 500,
            padding: '8px 16px',
            borderRadius: '99px',
            background: activeFilter === cat.value ? PRIMARY_GREEN : 'transparent',
            color: activeFilter === cat.value ? '#ffffff' : PRIMARY_GREEN,
            border: activeFilter === cat.value ? '1px solid transparent' : `1px solid rgba(29,77,53,0.2)`,
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            minHeight: '44px'
          }}>
                {cat.label}
              </button>)}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <input type="text" placeholder="Search tenders..." className="w-full h-11 rounded-xl pl-11 pr-4 outline-none transition-all" style={{
            fontFamily: BODY_FONT,
            fontSize: '14px',
            background: '#F7F6F2',
            border: focused ? `2px solid ${ACCENT_GREEN}` : '2px solid transparent',
            color: '#111111',
            transition: 'border-color 0.2s ease, background 0.2s ease'
          }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" size={17} style={{
            color: focused ? ACCENT_GREEN : '#9ca3af'
          }} />
          </div>
        </div>
      </div>
    </section>;
};

// --- Connect With Us Section ---
const ConnectSection = () => {
  return <section style={{
    background: '#F8F7F0',
    position: 'relative',
    overflow: 'hidden'
  }} className="py-12 sm:py-16 lg:py-24">
      {/* Ghost watermark — hidden on mobile */}
      <div aria-hidden="true" className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none select-none overflow-hidden">
        <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(80px, 22vw, 300px)',
        color: 'rgba(17,17,17,0.03)',
        lineHeight: 1,
        letterSpacing: '-0.04em'
      }}>
          CONNECT
        </span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8" style={{
      position: 'relative',
      zIndex: 1
    }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left column */}
          <FadeUp>
            <div className="flex gap-5 sm:gap-8 items-start">
              {/* Vertical gold decorative line */}
              <div className="flex-shrink-0 flex flex-col items-center" style={{
              paddingTop: '6px'
            }}>
                <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#C8A84B',
                flexShrink: 0
              }} />
                <div style={{
                width: '1px',
                flex: 1,
                background: 'linear-gradient(to bottom, #C8A84B, rgba(200,168,75,0))',
                minHeight: '100px',
                marginTop: '6px'
              }} />
              </div>
              <div>
                <div style={{
                fontFamily: BODY_FONT,
                fontSize: '11px',
                fontWeight: 700,
                color: '#e87326',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                  Connect With Nkomazi SEZ
                </div>
                <h2 style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(28px, 5vw, 80px)',
                fontWeight: 700,
                color: '#111111',
                textTransform: 'uppercase',
                letterSpacing: '-1px',
                lineHeight: 1.05,
                margin: 0,
                marginBottom: '20px'
              }}>
                  Connect With Us
                </h2>
                <p style={{
                fontFamily: BODY_FONT,
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                color: 'rgba(17,17,17,0.65)',
                lineHeight: '1.8',
                margin: 0,
                maxWidth: '400px'
              }}>
                  Connect with our investment facilitation team and take the first step toward establishing your business in
                  Nkomazi SEZ.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Right column */}
          <FadeUp delay={0.15}>
            <div className="flex flex-col gap-5">
              <div>
                <p style={{
                fontFamily: BODY_FONT,
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(17,17,17,0.4)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '0 0 16px'
              }}>
                  Take the first step
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <GoldButton label="Contact Our Investment Team" fullWidthMobile href="/contact" />
                  <GhostButtonDark label="Download Investment Guide" fullWidthMobile href="/contact" />
                </div>
              </div>

              <div style={{
              height: '1px',
              background: 'rgba(17,17,17,0.1)',
              margin: '8px 0'
            }} />

              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <a href="mailto:invest@nsez.gov.za" style={{
                fontFamily: BODY_FONT,
                fontSize: '14px',
                color: '#C8A84B',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'opacity 0.2s'
              }} onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75';
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
              }}>
                  invest@nsez.gov.za
                </a>
                <span style={{
                color: 'rgba(17,17,17,0.2)',
                fontSize: '12px'
              }}>—</span>
                <a href="mailto:info@nsez.gov.za" style={{
                fontFamily: BODY_FONT,
                fontSize: '14px',
                color: 'rgba(17,17,17,0.5)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }} onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(17,17,17,0.8)';
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(17,17,17,0.5)';
              }}>
                  info@nsez.gov.za
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>;
};

export const TendersPage = () => {
  const [activeFilter, setActiveFilter] = useState<OpportunityCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES.filter(item => {
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);
  return <div className="min-h-screen bg-white text-[#111111] overflow-x-hidden">
      <NSEZNavbar />

      {/* Spacer for navbar top banner */}
      <div style={{ height: '36px' }} />

      {/* Hero Section */}
      <Hero />

      {/* Filter Bar */}
      <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Results & Grid */}
      <section id="opportunities" className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <FadeUp className="mb-8 sm:mb-10">
            <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
              <div>
                <Eyebrow>Current Listings</Eyebrow>
                <GoldDash />
                <div className="flex flex-wrap items-center gap-3">
                  <h2 style={{
                  fontFamily: HEADING_FONT,
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 3vw, 38px)',
                  color: '#0F3024',
                  margin: 0,
                  letterSpacing: '-0.5px'
                }}>
                    Active Tenders
                  </h2>
                  <span style={{
                  fontFamily: BODY_FONT,
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#888',
                  paddingTop: '4px'
                }}>
                    {filteredOpportunities.length} result{filteredOpportunities.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                {activeFilter !== 'All' && <button onClick={() => setActiveFilter('All')} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] hover:underline" style={{
                fontFamily: BODY_FONT,
                color: GOLD
              }}>
                    <span>Clear Filters</span>
                    <X size={10} />
                  </button>}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{
                fontFamily: BODY_FONT,
                color: '#888'
              }}>
                  <span>Sort:</span>
                  <select className="bg-transparent border-none outline-none font-bold cursor-pointer" style={{
                  color: '#0F3024'
                }}>
                    <option>Newest First</option>
                    <option>Closing Soon</option>
                    <option>Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Opportunities card grid */}
          {filteredOpportunities.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {filteredOpportunities.map((opp, index) => <OpportunityCard key={opp.id} item={opp} index={index} />)}
              </AnimatePresence>
            </div> : <div className="py-24 sm:py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-black/[0.03] flex items-center justify-center mb-6">
                <Search size={32} className="text-black/20" />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-2" style={{
            fontFamily: HEADING_FONT
          }}>
                No matching opportunities
              </h3>
              <p className="text-black/40 text-sm max-w-xs" style={{
            fontFamily: BODY_FONT
          }}>
                We couldn't find any opportunities matching your current search and filters.
              </p>
              <button onClick={() => {
            setActiveFilter('All');
            setSearchQuery('');
          }} className="mt-8 px-8 py-3 text-white rounded-lg font-bold uppercase tracking-widest text-[11px] min-h-[44px]" style={{
            fontFamily: BODY_FONT,
            background: PRIMARY_GREEN
          }}>
                Reset All Filters
              </button>
            </div>}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden" style={{
      background: '#0F3024'
    }}>
        {/* Ghost watermark — hidden on mobile */}
        <div aria-hidden="true" className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none select-none overflow-hidden" style={{
        zIndex: 0
      }}>
          <span style={{
          fontFamily: HEADING_FONT,
          fontWeight: 900,
          fontSize: 'clamp(80px, 22vw, 300px)',
          color: 'rgba(255,255,255,0.025)',
          lineHeight: 1,
          letterSpacing: '-0.04em'
        }}>
            INFORM
          </span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <Eyebrow light={true}>Stay Informed</Eyebrow>
              <GoldDash />
              <h2 className="font-bold uppercase leading-none mt-2 mb-4 sm:mb-6" style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(28px, 4vw, 56px)',
              color: '#ffffff'
            }}>
                Stay Updated
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{
              fontFamily: BODY_FONT,
              color: 'rgba(255,255,255,0.7)'
            }}>
                Subscribe to receive the latest opportunities, tenders and news from Nkomazi SEZ directly to your inbox.
              </p>
            </div>
            <div className="w-full max-w-lg">
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-2 border border-white/10 rounded-2xl" style={{
              background: 'rgba(255,255,255,0.08)'
            }} onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your Email Address" className="w-full flex-grow h-14 px-4 sm:px-6 rounded-xl font-medium outline-none transition-all" style={{
                fontFamily: BODY_FONT,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'rgba(255,255,255,0.9)'
              }} required />
                <button type="submit" className="w-full sm:w-auto h-14 px-8 sm:px-10 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:opacity-90 transition-opacity" style={{
                fontFamily: BODY_FONT,
                background: ORANGE
              }}>
                  Subscribe
                </button>
              </form>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-center lg:text-left" style={{
              fontFamily: BODY_FONT,
              color: 'rgba(255,255,255,0.35)'
            }}>
                By subscribing you agree to our privacy policy and terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NSEZFooterSection />
    </div>;
};