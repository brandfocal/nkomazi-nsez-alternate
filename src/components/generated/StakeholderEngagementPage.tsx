import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SocialLinkItem {
  Icon: React.FC;
  label: string;
  href: string;
}
interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}
interface HeroStatData {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
  <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
  <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
  <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891ZM10.0017 1.66797C7.73884 1.66797 7.45558 1.67774 6.56673 1.71681C5.68114 1.75588 5.0723 1.89913 4.54485 2.10425C3.99462 2.31914 3.52903 2.6024 3.0667 3.06798C2.60111 3.53031 2.31786 3.9959 2.10297 4.54288C1.89785 5.07358 1.75459 5.67917 1.71552 6.56476C1.67645 7.45686 1.66669 7.74012 1.66669 10.0029C1.66669 12.2657 1.67645 12.549 1.71552 13.4378C1.75459 14.3234 1.89785 14.9323 2.10297 15.4597C2.31786 16.01 2.60111 16.4756 3.0667 16.9379C3.52903 17.4002 3.99462 17.6867 4.5416 17.8984C5.0723 18.1035 5.67789 18.2467 6.56348 18.2858C7.45232 18.3249 7.73558 18.3346 9.99839 18.3346C12.2612 18.3346 12.5445 18.3249 13.4333 18.2858C14.3189 18.2467 14.9277 18.1035 15.4552 17.8984C16.0022 17.6867 16.4678 17.4002 16.9301 16.9379C17.3924 16.4756 17.6789 16.01 17.8906 15.463C18.0957 14.9323 18.2389 14.3267 18.278 13.4411C18.3171 12.5523 18.3268 12.269 18.3268 10.0062C18.3268 7.74338 18.3171 7.46012 18.278 6.57127C18.2389 5.68568 18.0957 5.07684 17.8906 4.54939C17.6854 3.9959 17.4022 3.53031 16.9366 3.06798C16.4743 2.60565 16.0087 2.31914 15.4617 2.10751C14.931 1.90239 14.3254 1.75913 13.4398 1.72006C12.5477 1.67774 12.2645 1.66797 10.0017 1.66797ZM10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215ZM10.0016 12.7802C8.46815 12.7802 7.22441 11.5364 7.22441 10.0029C7.22441 8.46943 8.46815 7.2257 10.0016 7.2257C11.5352 7.2257 12.7789 8.46943 12.7789 10.0029C12.7789 11.5364 11.5352 12.7802 10.0016 12.7802Z" fill="currentColor" />
  <path d="M15.4519 5.55216C15.4519 6.10566 15.0026 6.55171 14.4524 6.55171C13.8989 6.55171 13.4528 6.1024 13.4528 5.55216C13.4528 4.99867 13.9022 4.55262 14.4524 4.55262C15.0026 4.55262 15.4519 5.00192 15.4519 5.55216Z" fill="currentColor" />
</svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
  <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008 12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" fill="currentColor" />
</svg>;
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
  <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" fill="currentColor" />
</svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 18" fill="none">
  <path d="M15.5996 0.666626H1.39716C0.716817 0.666626 0.166687 1.20374 0.166687 1.8678V16.1289C0.166687 16.7929 0.716817 17.3333 1.39716 17.3333H15.5996C16.28 17.3333 16.8334 16.7929 16.8334 16.1321V1.8678C16.8334 1.20374 16.28 0.666626 15.5996 0.666626ZM5.11135 14.8691H2.63739V6.91337H5.11135V14.8691ZM3.87437 5.82939C3.0801 5.82939 2.43882 5.18811 2.43882 4.39709C2.43882 3.60608 3.0801 2.9648 3.87437 2.9648C4.66539 2.9648 5.30666 3.60608 5.30666 4.39709C5.30666 5.18486 4.66539 5.82939 3.87437 5.82939ZM14.3692 14.8691H11.8985V11.0019C11.8985 10.0807 11.8822 8.89254 10.6127 8.89254C9.32684 8.89254 9.13153 9.8984 9.13153 10.9368V14.8691H6.66408V6.91337H9.03387V8.00061H9.06643C9.3952 7.37561 10.2025 6.7148 11.4037 6.7148C13.9069 6.7148 14.3692 8.36194 14.3692 10.5039V14.8691Z" fill="currentColor" />
</svg>;

// ─── Data ──────────────────────────────────────────────────────────────────────

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
const NAV_SECTORS = ['Agro-processing & Agriculture', 'Manufacturing', 'Green Economy', 'Logistics & Warehousing'];
const NAV_SIMPLE_LINKS = ['About Nkomazi SEZ', 'Invest', 'MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];

const IMPACT_STATS: StatItem[] = [{
  id: 'communities',
  value: 12,
  suffix: '+',
  label: 'Communities Supported'
}, {
  id: 'youth',
  value: 500,
  suffix: '+',
  label: 'Youth Beneficiaries'
}, {
  id: 'skills',
  value: 8,
  suffix: '',
  label: 'Skills Programmes'
}, {
  id: 'engagements',
  value: 30,
  suffix: '+',
  label: 'Stakeholder Relations'
}];
const HERO_STATS: HeroStatData[] = [{
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
}];
const FOOTER_EXPLORE_LINKS = ['About Nkomazi SEZ', 'Why Invest', 'Priority Sectors', 'Investor Hub'];
const FOOTER_CONNECT_LINKS = ['Investment Process', 'Resources', 'Partners', 'Contact'];
const FOOTER_LEGAL_LINKS = ['Privacy Policy', 'Terms of Use'];

// ─── Buttons ──────────────────────────────────────────────────────────────────

const GreenButton = ({
  label,
  href = '#',
  onClick
}: {
  label: string;
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
  className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg"
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
    <div className="flex items-center justify-center px-5 bg-[#1fac67] text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
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
  href = '#',
  onClick
}: {
  label: string;
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
  className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg"
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
    <div className="flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      background: '#C8A84B'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-white rounded-r-lg flex-shrink-0" style={{
      background: '#C8A84B'
    }}>
      <ArrowUpRightIcon />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{
      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)'
    }} />
  </motion.a>;

const OrangeButton = ({
  label,
  href = '#',
  onClick
}: {
  label: string;
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
  className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg"
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
    <div className="flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
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
  href = '#',
  onClick
}: {
  label: string;
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
  className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg"
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
    <div className="flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
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

// ─── FadeUp ───────────────────────────────────────────────────────────────────

const FadeUp = ({
  children,
  delay = 0,
  className = '',
  style
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
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
  }} className={className} style={style}>
    {children}
  </motion.div>;
};

// ─── AnimatedHeading ──────────────────────────────────────────────────────────

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

// ─── CountUp ──────────────────────────────────────────────────────────────────

const useCountUp = (target: number, inView: boolean, duration = 1.8) => {
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

// ─── HeroStatItem ─────────────────────────────────────────────────────────────

const HeroStatItem = ({
  stat,
  inView
}: {
  stat: HeroStatData;
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
      fontSize: 'clamp(15px, 1.8vw, 20px)',
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
      color: 'rgba(255,255,255,0.75)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: '1.4'
    }}>
      {stat.label}
    </span>
  </div>;
};

// ─── ScrollProgressBar ────────────────────────────────────────────────────────

const ScrollProgressBar = () => {
  const {
    scrollYProgress
  } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });
  return <motion.div className="fixed top-0 left-0 right-0 z-[99999] h-[2px] origin-left" style={{
    scaleX,
    background: 'linear-gradient(90deg, #E8521A, #f07040, #E8521A)'
  }} />;
};

// ─── BackToTop ────────────────────────────────────────────────────────────────

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <AnimatePresence>
    {visible && <motion.button aria-label="Back to top" initial={{
      opacity: 0,
      y: 24,
      scale: 0.85
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} exit={{
      opacity: 0,
      y: 16,
      scale: 0.85
    }} transition={{
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1]
    }} whileTap={{
      scale: 0.92
    }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} onClick={() => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })} className="fixed bottom-8 right-6 sm:right-8 z-[9998] w-12 h-12 rounded-full flex items-center justify-center" style={{
      background: hovered ? '#C8A84B' : '#26b573',
      border: `1.5px solid ${hovered ? '#C8A84B' : 'rgba(200,168,75,0.35)'}`,
      boxShadow: hovered ? '0 8px 32px rgba(200,168,75,0.35)' : '0 4px 20px rgba(0,0,0,0.35)',
      transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s'
    }}>
      <motion.svg width="16" height="16" viewBox="0 0 16 16" fill="none" animate={{
        y: hovered ? -2 : 0
      }} transition={{
        duration: 0.2
      }}>
        <path d="M8 12V4M4 7l4-4 4 4" stroke={hovered ? '#111111' : '#C8A84B'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.button>}
  </AnimatePresence>;
};

// ─── TopBanner ────────────────────────────────────────────────────────────────

const TopBanner = () => <div className="fixed top-0 left-0 right-0 z-[10000] flex items-center justify-between px-4 sm:px-6" style={{
  height: '36px',
  background: '#FAFAF8',
  borderBottom: '1px solid #E5E5E5'
}}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}>
    <a href="mailto:invest@nsez.gov.za" style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      color: '#1D4D35',
      textDecoration: 'none',
      letterSpacing: '0.04em'
    }}>
      invest@nsez.gov.za
    </a>
    <span style={{
      color: '#1D4D35',
      opacity: 0.35,
      fontSize: '11px'
    }}>|</span>
    <a href="mailto:info@nsez.gov.za" style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      color: '#1D4D35',
      textDecoration: 'none',
      letterSpacing: '0.04em'
    }}>
      info@nsez.gov.za
    </a>
  </div>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  }}>
    {SOCIAL_LINKS.map(({
      Icon,
      label,
      href
    }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1D4D35',
      transition: 'color 0.2s',
      width: '16px',
      height: '16px',
      opacity: 0.75
    }} onMouseEnter={e => {
      (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
    }} onMouseLeave={e => {
      (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75';
    }}>
        <Icon />
      </a>)}
  </div>
</div>;

// ─── SectorsHoverDropdown ─────────────────────────────────────────────────────

const SectorsHoverDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <button className="flex items-center gap-1.5 text-white text-[15px] font-medium rounded-lg px-3 py-2.5 tracking-[0.01em] hover:bg-white/10 transition-all duration-300" style={{
      fontFamily: BODY_FONT,
      borderBottom: '2px solid transparent',
      transition: 'background 0.2s ease, border-color 0.2s ease'
    }} onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'rgba(200,168,75,0.6)';
    }} onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
    }} aria-haspopup="true" aria-expanded={open}>
      Sectors
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 11 6" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
        <path d="M9.63082 1.26563L6.37082 4.52563C5.98582 4.91063 5.35582 4.91063 4.97082 4.52563L1.71082 1.26562" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
    <AnimatePresence>
      {open && <motion.div initial={{
        opacity: 0,
        y: -8,
        scale: 0.97
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: -8,
        scale: 0.97
      }} transition={{
        duration: 0.18,
        ease: 'easeOut'
      }} className="absolute top-full left-0 mt-2 z-[999]" style={{
        minWidth: '240px'
      }}>
        <div className="bg-[#1fac67] rounded-[8px] p-2.5 flex flex-col gap-0.5" style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
        }}>
          {NAV_SECTORS.map(item => <a key={item} href="#" onClick={e => e.preventDefault()} className="block text-white text-[14px] font-medium rounded-lg px-3 py-2 transition-all duration-200 whitespace-nowrap no-underline tracking-[0.01em]" style={{
            fontFamily: BODY_FONT
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#E8521A';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
          }}>
            {item}
          </a>)}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
};

// ─── StickyNav ────────────────────────────────────────────────────────────────

const StickyNav = ({
  mobileMenuOpen,
  setMobileMenuOpen
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const desktopLinks = ['About Nkomazi SEZ', 'Invest', 'MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];
  return <nav className="fixed left-0 right-0 z-[9999] px-4 sm:px-6" style={{
    top: '36px',
    paddingTop: scrolled ? '0px' : '20px',
    transition: 'padding 0.35s ease'
  }}>
    <div className="absolute inset-0" style={{
      opacity: scrolled ? 1 : 0,
      background: 'rgba(10, 24, 16, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: scrolled ? '0 1px 0 rgba(200,168,75,0.15)' : 'none',
      transition: 'background 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease'
    }} />
    <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{
      background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.4), transparent)',
      opacity: scrolled ? 1 : 0,
      transition: 'opacity 0.35s ease'
    }} />
    <div className="relative flex justify-center">
      <div className="flex items-center justify-between w-full max-w-[1372px]" style={{
        paddingTop: scrolled ? '14px' : '0px',
        paddingBottom: scrolled ? '14px' : '0px',
        transition: 'padding 0.35s ease'
      }}>
        <a href="#" onClick={e => e.preventDefault()} className="flex-shrink-0 flex items-center no-underline">
          <img src="https://cdn.prod.website-files.com/6891d538bffa36dd46a28858/6891d538bffa36dd46a28873_nkomazi-sez-logo.png" alt="Nkomazi SEZ" className="h-8 sm:h-10 w-auto object-contain" style={{
            filter: 'brightness(0) invert(1)'
          }} />
        </a>

        <div className="hidden lg:flex items-center gap-0 backdrop-blur-[26px] bg-white/10 border border-white/20 rounded-xl p-[4.6px]">
          {desktopLinks.slice(0, 3).map(link => <a key={link} href="#" onClick={e => e.preventDefault()} className="text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 transition-all duration-300 no-underline tracking-[0.01em]" style={{
            fontFamily: BODY_FONT,
            borderBottom: '2px solid transparent',
            transition: 'background 0.2s ease, border-color 0.2s ease'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(200,168,75,0.6)';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent';
          }}>
            {link}
          </a>)}
          <SectorsHoverDropdown />
          {desktopLinks.slice(3).map(link => <a key={link} href="#" onClick={e => e.preventDefault()} className="text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 transition-all duration-300 no-underline tracking-[0.01em]" style={{
            fontFamily: BODY_FONT,
            borderBottom: '2px solid transparent',
            transition: 'background 0.2s ease, border-color 0.2s ease'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(200,168,75,0.6)';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent';
          }}>
            {link}
          </a>)}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <GreenButton label="Invest Now" />
          </div>
          <button className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[#1fac67] text-white flex-shrink-0" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </div>

    <AnimatePresence>
      {mobileMenuOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.25
      }} className="relative lg:hidden mt-2 rounded-2xl bg-[#26b573]/95 backdrop-blur-md overflow-hidden">
        <div className="p-4 flex flex-col gap-2">
          {NAV_SIMPLE_LINKS.map(l => <a key={l} href="#" onClick={e => {
            e.preventDefault();
            setMobileMenuOpen(false);
          }} className="text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 no-underline" style={{
            fontFamily: BODY_FONT
          }}>
            {l}
          </a>)}
          <div className="border-t border-white/10 pt-2 mt-1">
            <p className="text-white/40 text-xs font-semibold px-3 pb-1 uppercase tracking-widest" style={{
              fontFamily: BODY_FONT
            }}>Sectors</p>
            {NAV_SECTORS.map(s => <a key={s} href="#" onClick={e => {
              e.preventDefault();
              setMobileMenuOpen(false);
            }} className="block text-white/80 text-sm rounded-lg px-3 py-2 hover:bg-white/10 no-underline" style={{
              fontFamily: BODY_FONT
            }}>
              {s}
            </a>)}
          </div>
          <div className="pt-2">
            <GreenButton label="Invest Now" />
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </nav>;
};

// ─── EyebrowLabel ─────────────────────────────────────────────────────────────

const EyebrowLabel = ({
  label,
  dark = false
}: {
  label: string;
  dark?: boolean;
}) => <div style={{
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "16px"
}}>
    <div style={{
      width: "1px",
      height: "14px",
      background: "#5DBB3A",
      flexShrink: 0
    }} />
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.12em",
      color: dark ? "rgba(255,255,255,0.7)" : "#5DBB3A"
    }}>
      {label}
    </span>
  </div>;

// ─── Hero ─────────────────────────────────────────────────────────────────────

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
  return <section ref={heroRef} className="relative flex flex-col justify-end rounded-2xl sm:rounded-3xl mx-1.5 sm:mx-2.5" style={{
    overflow: 'hidden',
    height: 'calc(100vh - 36px)',
    maxHeight: 'calc(100vh - 36px)',
    minHeight: '580px'
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
          backgroundImage: `url("/001BMP_1570.JPG")`,
          backgroundPosition: 'center 55%',
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

    <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{
      zIndex: 0
    }}>
      <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(120px, 28vw, 360px)',
        color: 'rgba(255,255,255,0.035)',
        lineHeight: 1,
        userSelect: 'none',
        letterSpacing: '-0.04em'
      }}>
        NKOMAZI SEZ
      </span>
    </div>

    <motion.div className="absolute left-0 right-0 px-4 sm:px-8 lg:px-[clamp(48px,5vw,80px)]" style={{
      bottom: '40px',
      opacity,
      zIndex: 2
    }}>
      <motion.div className="w-full flex flex-col lg:flex-row lg:items-end gap-5 sm:gap-6 lg:gap-0" initial={{
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
        <div className="flex flex-col gap-0 flex-1 min-w-0" style={{
          flexBasis: '55%',
          flexShrink: 1
        }}>
          <motion.div initial={{
            opacity: 0,
            y: 14
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.28,
            ease: [0.22, 1, 0.36, 1]
          }}>
            <EyebrowLabel label="Stakeholder Relations" />
          </motion.div>

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
            fontSize: 'clamp(32px, 5.5vw, 80px)',
            lineHeight: '1.05',
            letterSpacing: '-0.5px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0
          }}>
            <span style={{
              color: '#5DBB3A',
              display: 'block'
            }}>Built on People.</span>
            <span style={{
              color: '#FFFFFF',
              display: 'block'
            }}>Rooted in Nkomazi.</span>
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
          }} className="hidden sm:block" style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(12px, 1.4vw, 14px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 0,
            marginTop: '12px',
            fontWeight: 500,
            maxWidth: '520px'
          }}>
            Nkomazi SEZ is committed to inclusive economic growth and community development across the Nkomazi Local Municipality and the broader Ehlanzeni District.
          </motion.p>
        </div>

        <div className="hidden lg:block flex-shrink-0" style={{
          width: '1px',
          alignSelf: 'stretch',
          backgroundColor: 'rgba(255,255,255,0.15)',
          marginLeft: '36px',
          marginRight: '36px'
        }} />

        <div ref={statsRowRef} className="flex flex-col gap-0 w-full lg:w-auto" style={{
          flexShrink: 1,
          flexBasis: '45%',
          minWidth: 0,
          maxWidth: '100%',
          background: 'rgba(5, 18, 10, 0.60)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRadius: '14px',
          padding: 'clamp(14px, 2.5vw, 22px) clamp(14px, 2.5vw, 26px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="flex flex-row items-center flex-nowrap gap-x-3 sm:gap-x-5 mb-3 sm:mb-4">
            {HERO_STATS.map((stat, i) => <div key={stat.label} className="flex flex-row items-center gap-3 sm:gap-4 flex-shrink-0">
              <HeroStatItem stat={stat} inView={statsInView} />
              {i < HERO_STATS.length - 1 && <div style={{
                width: '1px',
                height: '30px',
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
            fontSize: 'clamp(11px, 1.1vw, 13px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '6px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            The Nkomazi SEZ is driving inclusive economic growth by investing in the communities at the heart of the zone — supporting skills development, youth empowerment, and stakeholder partnerships.
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
          }} className="hidden md:block" style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(11px, 1.1vw, 13px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '12px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            Whether you're a community organisation, government partner, or resident of the Nkomazi region, discover how Nkomazi SEZ is building a future that works for everyone.
          </motion.p>

          <motion.div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-0" initial={{
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
            <OrangeButton label="Explore Stakeholder Relations" href="#impact" />
            <GhostButton label="Get Involved" href="/contact" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>

    <motion.div className="absolute z-10 flex flex-col items-center" style={{
      bottom: '14px',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none'
    }} initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.6,
      duration: 0.6
    }}>
      <span className="hidden sm:block" style={{
        fontFamily: BODY_FONT,
        fontSize: '11px',
        color: 'rgba(255,255,255,0.4)',
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


// ─── ImpactStatsStrip — Redesigned to match Stakeholder Relations Gateway style ───────────

const StatCounter = ({
  stat
}: {
  stat: StatItem;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-40px'
  });
  const count = useCountUp(stat.value, inView, 2.0);
  return <div ref={ref} className="flex flex-col gap-3 p-6 rounded-2xl" style={{
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 1px 20px rgba(0,0,0,0.2)'
  }}>
    <div style={{
      width: '32px',
      height: '3px',
      background: '#1fac67',
      borderRadius: '2px'
    }} />
    <div style={{
      fontFamily: HEADING_FONT,
      fontWeight: 700,
      fontSize: 'clamp(44px, 5.5vw, 68px)',
      color: '#ffffff',
      lineHeight: 1,
      letterSpacing: '-2px'
    }}>
      <span>{count}</span>
      <span style={{
        color: '#C8A84B'
      }}>{stat.suffix}</span>
    </div>
    <p style={{
      fontFamily: BODY_FONT,
      fontSize: '12px',
      fontWeight: 600,
      color: 'rgba(255,255,255,0.45)',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      lineHeight: 1.4
    }}>
      {stat.label}
    </p>
  </div>;
};
const ImpactStatsStrip = () => <section id="impact" style={{
  background: '#0a180f',
  paddingTop: 'clamp(48px, 8vw, 96px)',
  paddingBottom: 'clamp(48px, 8vw, 96px)',
  position: 'relative',
  overflow: 'hidden'
}}>
  {/* Watermark */}
  <div aria-hidden="true" className="hidden sm:flex absolute inset-0 items-center justify-end pointer-events-none select-none overflow-hidden" style={{
    paddingRight: '0px'
  }}>
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: 'clamp(80px, 18vw, 240px)',
      color: 'rgba(255,255,255,0.03)',
      lineHeight: 1,
      letterSpacing: '-0.04em',
      whiteSpace: 'nowrap'
    }}>
      IMPACT
    </span>
  </div>

  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8" style={{
    position: 'relative',
    zIndex: 1
  }}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
      {/* Left: headline + body */}
      <FadeUp>
        <div className="flex gap-5 sm:gap-8 items-start">
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
          <div>
            <div style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 700,
              color: '#1fac67',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              Impact at a Glance
            </div>
            <h2 style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 700,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '-1px',
              lineHeight: 1.05,
              margin: 0,
              marginBottom: '18px'
            }}>
              Measurable Impact Across Nkomazi
            </h2>
            <p style={{
              fontFamily: BODY_FONT,
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: '1.8',
              margin: '0',
              maxWidth: '420px'
            }}>
              Numbers that reflect our commitment to building a lasting legacy for the people of Nkomazi.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Right: stat cards grid */}
      <FadeUp delay={0.12}>
        <div className="grid grid-cols-2 gap-4">
          {IMPACT_STATS.map(stat => <StatCounter key={stat.id} stat={stat} />)}
        </div>
      </FadeUp>
    </div>
  </div>
</section>;

// ─── ContactCTA ───────────────────────────────────────────────────────────────

const ContactCTA = () => <section style={{
  background: '#F8F7F0',
  paddingTop: 'clamp(48px, 8vw, 96px)',
  paddingBottom: 'clamp(48px, 8vw, 96px)',
  position: 'relative',
  overflow: 'hidden'
}}>
  <div aria-hidden="true" className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none select-none overflow-hidden">
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: 'clamp(80px, 22vw, 300px)',
      color: 'rgba(17,17,17,0.03)',
      lineHeight: 1,
      letterSpacing: '-0.04em',
      whiteSpace: 'nowrap'
    }}>STAKEHOLDER RELATIONS</span>
  </div>

  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8" style={{
    position: 'relative',
    zIndex: 1
  }}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
      <FadeUp>
        <div className="flex gap-5 sm:gap-8 items-start">
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
          <div>
            <div style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 700,
              color: '#E8521A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
              Stakeholder Relations Gateway
            </div>
            <h2 style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 700,
              color: '#111111',
              textTransform: 'uppercase',
              letterSpacing: '-1px',
              lineHeight: 1.05,
              margin: 0,
              marginBottom: '18px'
            }}>
              Get Involved
            </h2>
            <p style={{
              fontFamily: BODY_FONT,
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'rgba(17,17,17,0.65)',
              lineHeight: '1.8',
              margin: 0,
              maxWidth: '420px'
            }}>
              Connect with our stakeholder relations team and learn how your organisation can partner with Nkomazi SEZ.
            </p>
          </div>
        </div>
      </FadeUp>

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
              margin: '0 0 14px'
            }}>
              Get in touch
            </p>
            <div className="flex flex-row flex-wrap items-center gap-3">
              <OrangeButton label="Contact Us" href="/contact" />
              <motion.a href="/about-us" className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg" whileHover={{
                y: -2,
                scale: 1.015
              }} whileTap={{
                scale: 0.97
              }} transition={{
                duration: 0.2,
                ease: 'easeOut'
              }}>
                <div className="flex items-center justify-center px-5 text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
                  fontFamily: BODY_FONT,
                  background: 'transparent',
                  border: '1.5px solid rgba(17,17,17,0.25)',
                  borderRight: 'none',
                  color: '#111111'
                }}>
                  Learn More
                </div>
                <div className="flex items-center justify-center w-[44px] rounded-r-lg flex-shrink-0" style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(17,17,17,0.25)',
                  borderLeft: 'none',
                  color: '#111111'
                }}>
                  <ArrowRightIcon />
                </div>
              </motion.a>
            </div>
          </div>

          <div style={{
            height: '1px',
            background: 'rgba(17,17,17,0.1)',
            margin: '4px 0'
          }} />

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="mailto:community@nsez.gov.za" style={{
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
              community@nsez.gov.za
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export const StakeholderEngagementPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="min-h-screen bg-white overflow-x-hidden" style={{
    fontFamily: BODY_FONT
  }}>
    <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@300;400;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap');
`}</style>
    <ScrollProgressBar />
    <BackToTop />
    <NSEZNavbar />
    <main style={{ paddingTop: '36px' }}>
      <Hero />
      <ImpactStatsStrip />
      <ContactCTA />
    </main>
    <NSEZFooterSection />
  </div>;
};