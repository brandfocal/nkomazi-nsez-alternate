import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Menu, X, MapPin } from 'lucide-react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';

const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
  <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
  <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891ZM10.0017 1.66797C7.73884 1.66797 7.45558 1.67774 6.56673 1.71681C5.68114 1.75588 5.0723 1.89913 4.54485 2.10425C3.99462 2.31914 3.52903 2.6024 3.0667 3.06798C2.60111 3.53031 2.31786 3.9959 2.10297 4.54288C1.89785 5.07358 1.75459 5.67917 1.71552 6.56476C1.67645 7.45686 1.66669 7.74012 1.66669 10.0029C1.66669 12.2657 1.67645 12.549 1.71552 13.4378C1.75459 14.3234 1.89785 14.9323 2.10297 15.4597C2.31786 16.01 2.60111 16.4756 3.0667 16.9379C3.52903 17.4002 3.99462 17.6867 4.5416 17.8984C5.0723 18.1035 5.67789 18.2467 6.56348 18.2858C7.45232 18.3249 7.73558 18.3346 9.99839 18.3346C12.2612 18.3346 12.5445 18.3249 13.4333 18.2858C14.3189 18.2467 14.9277 18.1035 15.4552 17.8984C16.0022 17.6867 16.4678 17.4002 16.9301 16.9379C17.3924 16.4756 17.6789 16.01 17.8906 15.463C18.0957 14.9323 18.2389 14.3267 18.278 13.4411C18.3171 12.5523 18.3268 12.269 18.3268 10.0062C18.3268 7.74338 18.3171 7.46012 18.278 6.57127C18.2389 5.68568 18.0957 5.07684 17.8906 4.54939C17.6854 3.9959 17.4022 3.53031 16.9366 3.06798C16.4743 2.60565 16.0087 2.31914 15.4617 2.10751C14.931 1.90239 14.3254 1.75913 13.4398 1.72006C12.5477 1.67774 12.2645 1.66797 10.0017 1.66797Z" />
  <path d="M10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215ZM10.0016 12.7802C8.46815 12.7802 7.22441 11.5364 7.22441 10.0029C7.22441 8.46943 8.46943 7.2257 10.0016 7.2257C11.5352 7.2257 12.7789 8.46943 12.7789 10.0029C12.7789 11.5364 11.5352 12.7802 10.0016 12.7802Z" />
  <circle cx="14.4524" cy="5.55216" r="1" />
</svg>;

const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
  <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008C12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" />
</svg>;

const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
  <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" />
</svg>;

const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 18" fill="currentColor">
  <path d="M15.5996 0.666626H1.39716C0.716817 0.666626 0.166687 1.20374 0.166687 1.8678V16.1289C0.166687 16.7929 0.716817 17.3333 1.39716 17.3333H15.5996C16.28 17.3333 16.8334 16.7929 16.8334 16.1321V1.8678C16.8334 1.20374 16.28 0.666626 15.5996 0.666626ZM5.11135 14.8691H2.63739V6.91337H5.11135V14.8691ZM3.87437 5.82939C3.0801 5.82939 2.43882 5.18811 2.43882 4.39709C2.43882 3.60608 3.0801 2.9648 3.87437 2.9648C4.66539 2.9648 5.30666 3.60608 5.30666 4.39709C5.30666 5.18486 4.66539 5.82939 3.87437 5.82939ZM14.3692 14.8691H11.8985V11.0019C11.8985 10.0807 11.8822 8.89254 10.6127 8.89254C9.32684 8.89254 9.13153 9.8984 9.13153 10.9368V14.8691H6.66408V6.91337H9.03387V8.00061H9.06643C9.3952 7.37561 10.2025 6.7148 11.4037 6.7148C13.9069 6.7148 14.3692 8.36194 14.3692 10.5039V14.8691Z" />
</svg>;

const SOCIAL_LINKS = [
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/nkomazisez/' },
  { Icon: FacebookIcon, label: 'Facebook', href: 'https://web.facebook.com/people/Nkomazi-SEZ/61586568002498/' },
  { Icon: YouTubeIcon, label: 'YouTube', href: 'https://www.youtube.com/@NkomaziSEZ' },
  { Icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/company/nkomazi-special-economic-zone/' }
];

const OrangeButton = ({
  label,
  fullWidthMobile = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidthMobile?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <motion.a
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
    <div className={`flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidthMobile ? 'flex-1 sm:flex-none' : ''}`} style={{
      fontFamily: BODY_FONT,
      background: '#E8521A'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-white rounded-r-lg flex-shrink-0" style={{
      background: '#E8521A'
    }}>
      <ArrowUpRightIcon />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{
      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)'
    }} />
  </motion.a>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const OFFICE_CARDS = [{
  id: 'komatipoort',
  title: 'Komatipoort Site',
  address: 'Komatipoort, Mpumalanga, South Africa',
  map: '/komatipoort-site.jpg'
}, {
  id: 'mbombela',
  title: 'Mbombela HQ',
  address: 'Mbombela (Nelspruit), Mpumalanga, South Africa',
  map: '/Mbombela-HQ.jpg'
}];
const HERO_STATS = [{
  value: 50,
  suffix: ' Billion',
  prefix: 'R',
  label: 'Projected Investment'
}, {
  value: 45000,
  suffix: '',
  label: 'Jobs to be Created'
}, {
  value: 14,
  suffix: '+',
  label: 'Registered Investors'
}] as {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}[];

// ─── Utility Hooks ────────────────────────────────────────────────────────────

const useCountUp = (target: number, inView: boolean, duration: number = 1.8) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step); else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
};

// ─── Utility Components ───────────────────────────────────────────────────────

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
    y: 28
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.6,
    delay,
    ease: [0.22, 1, 0.36, 1]
  }} className={className}>
    {children}
  </motion.div>;
};
const AnimatedHeading = ({
  children,
  className,
  style,
  as: Tag = 'h2'
}: {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3';
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-60px'
  });
  const words = children.split(' ');
  return <Tag ref={ref} className={className} style={{
    ...style,
    fontFamily: HEADING_FONT,
    overflow: 'hidden'
  }}>
    {words.map((word, i) => <span key={`${word}-${i}`} style={{
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      marginRight: '0.22em'
    }}>
      <motion.span style={{
        display: 'inline-block'
      }} initial={{
        y: '110%',
        opacity: 0
      }} animate={inView ? {
        y: '0%',
        opacity: 1
      } : {}} transition={{
        duration: 0.55,
        delay: i * 0.065,
        ease: [0.22, 1, 0.36, 1]
      }}>
        {word}
      </motion.span>
    </span>)}
  </Tag>;
};

// ─── Buttons ──────────────────────────────────────────────────────────────────

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
    <div className={`flex items-center justify-center px-5 bg-[#1fac67] text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidthMobile ? 'flex-1 sm:flex-none' : ''}`} style={{
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
    <div className={`flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidthMobile ? 'flex-1 sm:flex-none' : ''}`} style={{
      fontFamily: BODY_FONT,
      background: '#E8521A'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-white rounded-r-lg flex-shrink-0" style={{
      background: '#E8521A'
    }}>
      <ArrowUpRightIcon />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{
      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)'
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
    <div className={`flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidthMobile ? 'flex-1 sm:flex-none' : ''}`} style={{
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

// ─── Subtitle Pill ────────────────────────────────────────────────────────────

const SubtitlePill = ({
  children
}: {
  children: React.ReactNode;
}) => <motion.span initial={{
  opacity: 0,
  y: 8
}} animate={{
  opacity: 1,
  y: 0
}} transition={{
  duration: 0.4,
  ease: 'easeOut'
}} className="inline-block text-xs rounded-full px-3 py-2 leading-[21px] tracking-[0.06em] uppercase text-white" style={{
  fontFamily: BODY_FONT,
  background: '#1fac67'
}}>
    {children}
  </motion.span>;

// ─── Hero Stat Item ───────────────────────────────────────────────────────────

const HeroStatItem = ({
  stat,
  inView
}: {
  stat: {
    value: number;
    suffix: string;
    label: string;
    prefix?: string;
  };
  inView: boolean;
}) => {
  const isDecimal = stat.value % 1 !== 0;
  const intTarget = isDecimal ? Math.round(stat.value * 10) : stat.value;
  const count = useCountUp(intTarget, inView, 2.0);
  const displayCount = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();
  return <div className="flex flex-col gap-0.5 min-w-0">
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 700,
      fontSize: 'clamp(16px, 2.5vw, 20px)',
      color: '#ffffff',
      lineHeight: '1.1'
    }}>
      {stat.prefix && <span>{stat.prefix}</span>}
      <span>{displayCount}</span>
      <span>{stat.suffix}</span>
    </span>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: '10px',
      color: 'rgba(255,255,255,0.8)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: '1.4'
    }}>
      {stat.label}
    </span>
  </div>;
};

// ─── Hero Section ─────────────────────────────────────────────────────────────

const CONTACT_HERO_IMAGE = '/get-in-touch.jpg';
const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRowRef, {
    once: true,
    margin: '-40px'
  });
  const {
    scrollY
  } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  return <section ref={heroRef} className="relative flex flex-col justify-end rounded-2xl sm:rounded-3xl mx-1.5 sm:mx-2.5 overflow-hidden" style={{
    minHeight: '100svh',
    height: 'calc(100svh - 36px)',
    maxHeight: 'calc(100svh - 36px)'
  }}>
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
          backgroundImage: `url("${CONTACT_HERO_IMAGE}")`,
          backgroundPosition: 'center -5%',
          backgroundSize: 'cover'
        }} />
      </motion.div>
    </div>

    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to bottom, rgba(8,22,14,0.82) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)',
      zIndex: 1
    }} />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)',
      zIndex: 1
    }} />

    {/* Hero content */}
    <motion.div className="relative w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20" style={{
      paddingBottom: 'clamp(28px, 5vh, 56px)',
      opacity,
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
        <div className="flex flex-col gap-0 flex-none w-full lg:w-[50%]">
          <div className="flex items-center gap-3 mb-3 sm:mb-4" style={{
            fontFamily: BODY_FONT,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.1em'
          }}>
            <span>Home</span>
            <ChevronRight size={12} />
            <span style={{ color: GOLD }}>Contact Us</span>
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
            }}>Get in Touch.</span>
            <span style={{
              color: '#FFFFFF',
              display: 'block'
            }}>{"We're Here to Help."}</span>
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
          }} className="hidden md:block" style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '10px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            Connecting with Nkomazi Special Economic Zone is simple. Select the office location or query desk that best fits your requirements.
          </motion.p>
        </div>

        <motion.div className="flex flex-col gap-0 w-full lg:w-[50%] flex-none" style={{
          background: 'rgba(5, 18, 10, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: 'clamp(16px, 3vw, 28px)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div ref={statsRowRef} className="flex flex-row items-center flex-wrap gap-y-3" style={{
            gap: 'clamp(12px, 2.5vw, 20px)',
            marginBottom: 'clamp(12px, 2vw, 20px)'
          }}>
            {HERO_STATS.map((stat, i) => <div key={stat.label} className="flex flex-row items-center" style={{
              gap: 'clamp(12px, 2.5vw, 20px)'
            }}>
              <HeroStatItem stat={stat} inView={statsInView} />
              {i < HERO_STATS.length - 1 && <div style={{
                width: '1px',
                height: '32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                flexShrink: 0
              }} />}
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
            delay: 0.65,
            ease: 'easeOut'
          }} style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(12px, 1.2vw, 13px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '10px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            Nkomazi SEZ (NSEZ) is positioned as a gateway for regional and international investment, offering world-class infrastructure, investor-focused incentives, and access to key trade corridors connecting South Africa to the African continent.
          </motion.p>

          <motion.p initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.72,
            ease: 'easeOut'
          }} style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(12px, 1.2vw, 13px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '16px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            Our dedicated team is ready to assist you with enquiries, site visits, application guidance, and investment facilitation support.
          </motion.p>

          <motion.div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3" initial={{
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
            <GoldButton label="Send an Enquiry" fullWidthMobile href="#enquiry" />
            <GhostButton label="View Our Offices" fullWidthMobile href="#offices" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>

    {/* Scroll indicator */}
    <motion.div className="absolute z-10 flex flex-col items-center hidden sm:flex" style={{
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

// ─── Contact Split Section ────────────────────────────────────────────────────

const ContactSplit = () => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return <section id="enquiry" className="py-16 md:py-24 lg:py-32 bg-white">
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-20">

        {/* Details Side — shown first on mobile */}
        <div className="lg:col-span-4 lg:order-2">
          <FadeUp delay={0.15}>
            <div className="bg-[#1D4D35] rounded-2xl p-8 sm:p-10 md:p-12 text-white h-full flex flex-col">
              <h3 className="font-bold uppercase mb-2" style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(24px, 3vw, 32px)',
                color: '#C8A84B'
              }}>
                Contact Details
              </h3>
              <p className="text-sm text-white/50 mb-8 sm:mb-10" style={{
                fontFamily: BODY_FONT
              }}>
                Our team is ready to assist you.
              </p>

              <div className="space-y-7 sm:space-y-9 flex-grow">
                <div>
                  <p className="text-[11px] uppercase font-semibold tracking-[0.1em] mb-2" style={{
                    fontFamily: BODY_FONT,
                    color: 'rgba(255,255,255,0.45)'
                  }}>
                    Investment Enquiries
                  </p>
                  <a href="mailto:invest@nsez.gov.za" className="font-bold transition-colors no-underline break-all" style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    color: '#ffffff'
                  }} onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#C8A84B';
                  }} onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                  }}>
                    invest@nsez.gov.za
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-semibold tracking-[0.1em] mb-2" style={{
                    fontFamily: BODY_FONT,
                    color: 'rgba(255,255,255,0.45)'
                  }}>
                    General Enquiries
                  </p>
                  <a href="mailto:info@nsez.gov.za" className="font-bold transition-colors no-underline break-all" style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    color: '#ffffff'
                  }} onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#C8A84B';
                  }} onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                  }}>
                    info@nsez.gov.za
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <p className="text-[11px] uppercase font-semibold tracking-[0.1em] mb-2" style={{
                      fontFamily: BODY_FONT,
                      color: 'rgba(255,255,255,0.45)'
                    }}>
                      Komatipoort Office
                    </p>
                    <p className="text-sm text-white/75" style={{
                      fontFamily: BODY_FONT
                    }}>
                      Komatipoort, Mpumalanga, South Africa
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-semibold tracking-[0.1em] mb-2" style={{
                      fontFamily: BODY_FONT,
                      color: 'rgba(255,255,255,0.45)'
                    }}>
                      Mbombela Office
                    </p>
                    <p className="text-sm text-white/75" style={{
                      fontFamily: BODY_FONT
                    }}>
                      Mbombela, Mpumalanga, South Africa
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 flex-wrap">
                  {SOCIAL_LINKS.map(({
                    Icon,
                    label,
                    href
                  }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex items-center justify-center min-w-[44px] min-h-[44px] sm:w-9 sm:h-9" style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s'
                  }} onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = '#C8A84B';
                    el.style.color = '#C8A84B';
                  }} onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'rgba(255,255,255,0.2)';
                    el.style.color = 'rgba(255,255,255,0.65)';
                  }}>
                      <Icon />
                    </a>)}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Form Side — 60% on desktop */}
        <div className="lg:col-span-6 lg:order-1">
          <FadeUp>
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-100" style={{
              boxShadow: '0 20px 50px rgba(0,0,0,0.06)'
            }}>
              <h3 className="font-bold uppercase mb-2 text-[#1D4D35]" style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(24px, 3vw, 32px)'
              }}>
                Send Us a Message
              </h3>
              <p className="text-sm text-gray-400 mb-6 sm:mb-8" style={{
                fontFamily: BODY_FONT
              }}>
                Fill in the form below and a member of the NSEZ investment team will respond within 2 business days.
              </p>

              {submitted ? <motion.div initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} className="bg-[#1D4D35]/5 p-6 sm:p-8 rounded-xl border border-[#1D4D35]/10 text-center">
                <div className="w-14 h-14 bg-[#1fac67] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRightIcon />
                </div>
                <h4 className="text-2xl font-bold text-[#1D4D35] mb-2 uppercase" style={{
                  fontFamily: HEADING_FONT
                }}>
                  Thank you for your enquiry
                </h4>
                <p className="text-gray-500 text-sm" style={{
                  fontFamily: BODY_FONT
                }}>
                  A member of the NSEZ investment team will be in touch within 2 business days.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-[#1D4D35] text-sm font-medium underline hover:text-[#1fac67] transition-colors min-h-[44px]" style={{
                  fontFamily: BODY_FONT
                }}>
                  Send another message
                </button>
              </motion.div> : <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase font-semibold text-gray-400 tracking-[0.08em]" style={{
                      fontFamily: BODY_FONT
                    }}>
                      Name
                    </label>
                    <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all" style={{
                      fontFamily: BODY_FONT,
                      minHeight: '44px'
                    }} onFocus={e => {
                      e.currentTarget.style.borderColor = '#1fac67';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,172,103,0.08)';
                    }} onBlur={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase font-semibold text-gray-400 tracking-[0.08em]" style={{
                      fontFamily: BODY_FONT
                    }}>
                      Surname
                    </label>
                    <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all" style={{
                      fontFamily: BODY_FONT,
                      minHeight: '44px'
                    }} onFocus={e => {
                      e.currentTarget.style.borderColor = '#1fac67';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,172,103,0.08)';
                    }} onBlur={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase font-semibold text-gray-400 tracking-[0.08em]" style={{
                      fontFamily: BODY_FONT
                    }}>
                      Email
                    </label>
                    <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all" style={{
                      fontFamily: BODY_FONT,
                      minHeight: '44px'
                    }} onFocus={e => {
                      e.currentTarget.style.borderColor = '#1fac67';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,172,103,0.08)';
                    }} onBlur={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] uppercase font-semibold text-gray-400 tracking-[0.08em]" style={{
                      fontFamily: BODY_FONT
                    }}>
                      Organisation
                    </label>
                    <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all" style={{
                      fontFamily: BODY_FONT,
                      minHeight: '44px'
                    }} onFocus={e => {
                      e.currentTarget.style.borderColor = '#1fac67';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,172,103,0.08)';
                    }} onBlur={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase font-semibold text-gray-400 tracking-[0.08em]" style={{
                    fontFamily: BODY_FONT
                  }}>
                    Message
                  </label>
                  <textarea required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all resize-none" style={{
                    fontFamily: BODY_FONT
                  }} onFocus={e => {
                    e.currentTarget.style.borderColor = '#1fac67';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,172,103,0.08)';
                  }} onBlur={e => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }} />
                </div>
                <div className="space-y-3 pt-2">
                  <motion.button type="submit" className="group flex h-[44px] items-stretch relative overflow-hidden rounded-lg w-full sm:w-auto" whileHover={{
                    y: -2,
                    scale: 1.015
                  }} whileTap={{
                    scale: 0.97
                  }} transition={{
                    duration: 0.2,
                    ease: 'easeOut'
                  }}>
                    <div className="flex-1 sm:flex-none flex items-center justify-center px-8 bg-[#E8521A] text-white text-[15px] font-medium tracking-[0.01em] rounded-l-lg" style={{
                      fontFamily: BODY_FONT
                    }}>
                      Send Message
                    </div>
                    <div className="flex items-center justify-center w-[44px] bg-[#E8521A] text-white rounded-r-lg flex-shrink-0">
                      <ArrowRightIcon />
                    </div>
                    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)'
                    }} />
                  </motion.button>
                  <p className="text-[11px] text-gray-400 leading-relaxed" style={{
                    fontFamily: BODY_FONT
                  }}>
                    Your information will be handled in accordance with NSEZ privacy policy and used solely to respond to your investment enquiry.
                  </p>
                </div>
              </form>}
            </div>
          </FadeUp>
        </div>

      </div>
    </div>
  </section>;
};

// ─── Office Locations Section ─────────────────────────────────────────────────

const OfficeLocations = () => <section id="offices" className="py-16 sm:py-20 md:py-24" style={{
  background: '#FAFAF8'
}}>
  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mb-10 sm:mb-14">
      <FadeUp>
        <SubtitlePill>Our Offices</SubtitlePill>
      </FadeUp>
      <FadeUp delay={0.1}>
        <AnimatedHeading as="h2" style={{
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: 700,
          color: '#1D4D35',
          lineHeight: '1.1',
          marginTop: '12px',
          marginBottom: 0,
          letterSpacing: '-0.5px'
        }}>
          Where to Find Us
        </AnimatedHeading>
      </FadeUp>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {OFFICE_CARDS.map((office, idx) => <FadeUp key={office.id} delay={idx * 0.15}>
        <div className="bg-white rounded-2xl overflow-hidden group" style={{
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
        }}>
          <div className="h-48 sm:h-56 md:h-60 overflow-hidden" style={{
            position: 'relative'
          }}>
            <img src={office.map} alt={office.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 transition-colors" style={{
              background: 'rgba(0,0,0,0.18)'
            }} />
            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5">
              <div className="flex items-center justify-center rounded-full bg-white text-[#1D4D35]" style={{
                width: '40px',
                height: '40px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <MapPin size={18} />
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
            <div className="min-w-0">
              <h4 className="font-bold uppercase text-[#1D4D35] mb-1" style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(18px, 2.5vw, 24px)'
              }}>
                {office.title}
              </h4>
              <p className="text-sm text-gray-400" style={{
                fontFamily: BODY_FONT
              }}>
                {office.address}
              </p>
            </div>
            <div className="flex-shrink-0">
              <OrangeButton label="Get Directions" fullWidthMobile />
            </div>
          </div>
        </div>
      </FadeUp>)}
    </div>
  </div>
</section>;

// ─── Investment Callout ───────────────────────────────────────────────────────

const InvestmentCallout = () => <section style={{
  background: '#F8F7F0',
  paddingTop: 'clamp(40px, 8vw, 96px)',
  paddingBottom: 'clamp(40px, 8vw, 96px)',
  position: 'relative',
  overflow: 'hidden'
}}>
  {/* Ghost watermark */}
  <div aria-hidden="true" style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
    overflow: 'hidden',
    zIndex: 0
  }}>
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: 'clamp(60px, 18vw, 300px)',
      color: 'rgba(17,17,17,0.03)',
      lineHeight: 1,
      letterSpacing: '-0.04em'
    }}>
      CONNECT
    </span>
  </div>

  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8" style={{
    position: 'relative',
    zIndex: 1
  }}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

      {/* Left column */}
      <FadeUp>
        <div className="flex gap-5 sm:gap-8 items-start">
          {/* Vertical gold accent */}
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
              minHeight: '80px',
              marginTop: '6px'
            }} />
          </div>
          <div className="min-w-0">
            <div style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 700,
              color: '#e87326',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              Investment Gateway
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
              For Investment Enquiries
            </h2>
            <p style={{
              fontFamily: BODY_FONT,
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'rgba(17,17,17,0.65)',
              lineHeight: '1.8',
              margin: 0,
              maxWidth: '400px'
            }}>
              Contact our dedicated investment facilitation team to discuss opportunities site availability incentives and the NSEZ application process.
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
              <GreenButton label="Explore Investment Opportunities" fullWidthMobile href="/investor-hub" />
              <motion.a href="#" onClick={e => e.preventDefault()} className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg w-full sm:w-auto" whileHover={{
                y: -2,
                scale: 1.015
              }} whileTap={{
                scale: 0.97
              }} transition={{
                duration: 0.2,
                ease: 'easeOut'
              }}>
                <div className="flex-1 sm:flex-none flex items-center justify-center px-5 overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
                  fontFamily: BODY_FONT,
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#111111',
                  background: 'transparent',
                  border: '1.5px solid rgba(17,17,17,0.25)',
                  borderRight: 'none'
                }}>
                  Contact Our Team
                </div>
                <div className="flex items-center justify-center w-[44px] rounded-r-lg flex-shrink-0" style={{
                  color: '#111111',
                  background: 'transparent',
                  border: '1.5px solid rgba(17,17,17,0.25)',
                  borderLeft: 'none'
                }}>
                  <ArrowRightIcon />
                </div>
              </motion.a>
            </div>
          </div>

          <div style={{
            height: '1px',
            background: 'rgba(17,17,17,0.1)',
            margin: '8px 0'
          }} />

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <a href="mailto:invest@nsez.gov.za" className="break-all" style={{
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
            <a href="mailto:info@nsez.gov.za" className="break-all" style={{
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

export const ContactPage = () => {
  return <div className="w-full bg-white selection:bg-[#C8A84B] selection:text-[#1D4D35] overflow-x-hidden">
    <NSEZNavbar />
    {/* Spacer for navbar top banner */}
    <div style={{ height: '36px' }} />
    <main>
      <Hero />
      <ContactSplit />
      <OfficeLocations />
      <InvestmentCallout />
    </main>
    <NSEZFooterSection />
  </div>;
};
