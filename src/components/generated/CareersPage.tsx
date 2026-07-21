import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Mail, MapPin, Calendar, Briefcase, Info, ArrowUpRight } from 'lucide-react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_SECTORS = ['Agro-processing & Agriculture', 'Manufacturing', 'Green Economy', 'Logistics & Warehousing'];
const NAV_SIMPLE_LINKS = ['About Nkomazi SEZ', 'Invest', 'MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];
const CAREER_CATEGORIES = [{
  id: 'all',
  label: 'All Positions'
}, {
  id: 'vacancy',
  label: 'Vacancies'
}, {
  id: 'learnership',
  label: 'Learnerships'
}, {
  id: 'graduate',
  label: 'Graduate Programmes'
}, {
  id: 'internship',
  label: 'Internships'
}];
const JOB_LISTINGS = [{
  id: 'j1',
  title: 'Investment Facilitation Officer',
  category: 'Vacancy',
  department: 'Investment Department',
  location: 'Komatipoort',
  closingDate: '31 July 2026',
  description: 'We are seeking a proactive Investment Facilitation Officer to support new investors in navigating the regulatory landscape and establishing operations within the zone.',
  type: 'Full-time'
}, {
  id: 'j2',
  title: 'Graduate Infrastructure Planner',
  category: 'Graduate Programme',
  department: 'Infrastructure Department',
  location: 'Mbombela',
  closingDate: '15 August 2026',
  description: 'Join our infrastructure team as a Graduate Planner. You will assist in the design and implementation of sustainable industrial infrastructure projects.',
  type: 'Graduate'
}, {
  id: 'j3',
  title: 'Business Administration Learnership NQF 4',
  category: 'Learnership',
  department: 'Corporate Services',
  location: 'Komatipoort',
  closingDate: '31 July 2026',
  description: 'An opportunity for young South Africans to gain practical experience and a formal qualification in business administration within a dynamic economic environment.',
  type: 'Learnership'
}, {
  id: 'j4',
  title: 'Marketing and Communications Intern',
  category: 'Internship',
  department: 'Marketing Department',
  location: 'Mbombela',
  closingDate: '20 July 2026',
  description: 'Support our marketing team in digital content creation, stakeholder relations, and event coordination for the Nkomazi Special Economic Zone.',
  type: 'Internship'
}];

// ─── Hero Stats ───────────────────────────────────────────────────────────────
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
}];

// ─── Social Links ─────────────────────────────────────────────────────────────
interface SocialLinkItem {
  Icon: React.FC;
  label: string;
  href: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Users = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>;
const WHY_WORK_CARDS = [{
  id: 'ww1',
  icon: Users,
  title: 'Meaningful Impact',
  description: 'Be part of a team creating real economic change and industrial development across Mpumalanga.',
  image: '/meaningful-impact.jpg'
}, {
  id: 'ww2',
  icon: Briefcase,
  title: 'Growth Opportunities',
  description: 'Nkomazi SEZ offers a dynamic environment where your career can grow alongside a rapidly developing economic zone.',
  image: '/community-development.jpg'
}, {
  id: 'ww3',
  icon: Info,
  title: 'Collaborative Culture',
  description: 'Work alongside government, investors, and community stakeholders in a purpose-driven organisation.',
  image: '/collaborative-culture.jpg'
}];
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
  <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
  <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
  <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891ZM10.0017 1.66797C7.73884 1.66797 7.45558 1.67774 6.56673 1.71681C5.68114 1.75588 5.0723 1.89913 4.54485 2.10425C3.99462 2.31914 3.52903 2.6024 3.0667 3.06798C2.60111 3.53031 2.31786 3.9959 2.10297 4.54288C1.89785 5.07358 1.75459 5.67917 1.71552 6.56476C1.67645 7.45686 1.66669 7.74012 1.66669 10.0029C1.66669 12.2657 1.67645 12.549 1.71552 13.4378C1.75459 14.3234 1.89785 14.9323 2.10297 15.4597C2.31786 16.01 2.60111 16.4756 3.0667 16.9379C3.52903 17.4002 3.99462 17.6867 4.5416 17.8984C5.0723 18.1035 5.67789 18.2467 6.56348 18.2858C7.45232 18.3249 7.73558 18.3346 9.99839 18.3346C12.2612 18.3346 12.5445 18.3249 13.4333 18.2858C14.3189 18.2467 14.9277 18.1035 15.4552 17.8984C16.0022 17.6867 16.4678 17.4002 16.9301 16.9379C17.3924 16.4756 17.6789 16.01 17.8906 15.463C18.0957 14.9323 18.2389 14.3267 18.278 13.4411C18.3171 12.5523 18.3268 12.269 18.3268 10.0062C18.3268 7.74338 18.3171 7.46012 18.278 6.57127C18.2389 5.68568 18.0957 5.07684 17.8906 4.54939C17.6854 3.9959 17.4022 3.53031 16.9366 3.06798C16.4743 2.60565 16.0087 2.31914 15.4617 2.10751C14.931 1.90239 14.3254 1.75913 13.4398 1.72006C12.5477 1.67774 12.2645 1.66797 10.0017 1.66797Z" fill="currentColor" />
  <path d="M10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215ZM10.0016 12.7802C8.46815 12.7802 7.22441 11.5364 7.22441 10.0029C7.22441 8.46943 8.46815 7.2257 10.0016 7.2257C11.5352 7.2257 12.7789 8.46943 12.7789 10.0029C12.7789 11.5364 11.5352 12.7802 10.0016 12.7802Z" fill="currentColor" />
  <path d="M15.4519 5.55216C15.4519 6.10566 15.0026 6.55171 14.4524 6.55171C13.8989 6.55171 13.4528 6.1024 13.4528 5.55216C13.4528 4.99867 13.9022 4.55262 14.4524 4.55262C15.0026 4.55262 15.4519 5.00192 15.4519 5.55216Z" fill="currentColor" />
</svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
  <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008C12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" fill="currentColor" />
</svg>;
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
  <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" fill="currentColor" />
</svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 18" fill="none">
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
const SOCIAL_ITEMS = SOCIAL_LINKS;

// ─── useCountUp hook ──────────────────────────────────────────────────────────
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



// ─── Buttons ──────────────────────────────────────────────────────────────────

const GreenButton = ({
  label,
  fullWidth = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidth?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a href={href} onClick={e => {
  if (href === '#') {
    e.preventDefault();
  }
  if (onClick) onClick(e);
}} className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidth ? 'w-full' : ''}`} whileHover={{
  y: -2,
  scale: 1.015
}} whileTap={{
  scale: 0.97
}} transition={{
  duration: 0.2,
  ease: 'easeOut'
}}>
    <div className={`flex items-center justify-center px-5 bg-[#1fac67] text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidth ? 'flex-1' : ''}`} style={{
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
  fullWidth = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidth?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a href={href} onClick={e => {
  if (href === '#') {
    e.preventDefault();
  }
  if (onClick) onClick(e);
}} className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidth ? 'w-full' : ''}`} whileHover={{
  y: -2,
  scale: 1.015
}} whileTap={{
  scale: 0.97
}} transition={{
  duration: 0.2,
  ease: 'easeOut'
}}>
    <div className={`flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidth ? 'flex-1' : ''}`} style={{
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
  fullWidth = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidth?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a href={href} onClick={e => {
  if (href === '#') {
    e.preventDefault();
  }
  if (onClick) onClick(e);
}} className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidth ? 'w-full' : ''}`} whileHover={{
  y: -2,
  scale: 1.015
}} whileTap={{
  scale: 0.97
}} transition={{
  duration: 0.2,
  ease: 'easeOut'
}}>
    <div className={`flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidth ? 'flex-1' : ''}`} style={{
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
const GhostButtonDark = ({
  label,
  fullWidth = false,
  href = '#',
  onClick
}: {
  label: string;
  fullWidth?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => <motion.a href={href} onClick={e => {
  if (href === '#') {
    e.preventDefault();
  }
  if (onClick) onClick(e);
}} className={`group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg ${fullWidth ? 'w-full' : ''}`} whileHover={{
  y: -2,
  scale: 1.015
}} whileTap={{
  scale: 0.97
}} transition={{
  duration: 0.2,
  ease: 'easeOut'
}}>
    <div className={`flex items-center justify-center px-5 text-[#111111] text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em] ${fullWidth ? 'flex-1' : ''}`} style={{
      fontFamily: BODY_FONT,
      background: 'transparent',
      border: '1.5px solid rgba(17,17,17,0.25)',
      borderRight: 'none'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-[#111111] rounded-r-lg flex-shrink-0" style={{
      background: 'transparent',
      border: '1.5px solid rgba(17,17,17,0.25)',
      borderLeft: 'none'
    }}>
      <ArrowRightIcon />
    </div>
  </motion.a>;

// ─── FadeUp ───────────────────────────────────────────────────────────────────

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

// ─── Animated Heading ─────────────────────────────────────────────────────────

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
      fontSize: 'clamp(16px, 2vw, 20px)',
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

const PageHero = () => {
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
  return <section ref={heroRef} className="relative flex flex-col justify-end rounded-2xl sm:rounded-3xl mx-1.5 sm:mx-2.5 mt-9 overflow-hidden" style={{
    minHeight: '100svh',
    height: 'calc(100svh - 36px)',
    maxHeight: 'calc(100svh - 36px)'
  }}>
    {/* Background */}
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
          backgroundImage: `url("/nsez-banner20.jpg")`,
          backgroundPosition: 'center -20%',
          backgroundSize: 'cover'
        }} />
      </motion.div>
    </div>
    {/* Gradients */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to bottom, rgba(8,22,14,0.82) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)',
      zIndex: 1
    }} />
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)',
      zIndex: 1
    }} />

    {/* Ghost watermark — hidden on small screens */}
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
        {/* Left: headline + subtext */}
        <div className="flex flex-col gap-0 flex-none w-full lg:w-[50%]">
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
            fontSize: 'clamp(34px, 7vw, 80px)',
            lineHeight: '1.05',
            letterSpacing: '-1px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0
          }}>
            <span style={{
              color: '#5DBB3A',
              display: 'block'
            }}>Shape Your Future.</span>
            <span style={{
              color: '#FFFFFF',
              display: 'block'
            }}>Careers at Nkomazi SEZ.</span>
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
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 0,
            marginTop: '14px',
            fontWeight: 500,
            maxWidth: '560px'
          }}>
            Join the team building Mpumalanga's most ambitious industrial development — a zone designed to create thousands of jobs and drive lasting economic transformation across Southern Africa.
          </motion.p>
        </div>

        {/* Right: stats card */}
        <div className="flex flex-col gap-0 w-full lg:w-[50%] flex-none" style={{
          background: 'rgba(5, 18, 10, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: 'clamp(16px, 3vw, 28px)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div ref={statsRowRef} className="flex flex-row items-center flex-wrap gap-3 sm:gap-5" style={{
            marginBottom: '16px'
          }}>
            {HERO_STATS.map((stat, i) => <div key={stat.label} className="flex flex-row items-center gap-3 sm:gap-5">
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
          }} className="hidden sm:block" style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '10px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            Nkomazi SEZ is driving economic transformation in Mpumalanga and the broader Southern African region. We are actively seeking passionate individuals to join our growing team across investment facilitation, infrastructure, operations, and more.
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
          }} className="hidden sm:block" style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '16px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            Whether you are a recent graduate, an experienced professional, or looking for a learnership opportunity — Nkomazi SEZ offers a meaningful career with real impact.
          </motion.p>

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
            <GoldButton label="View Open Positions" href="#opportunities" />
            <GhostButton label="Learn About Nkomazi SEZ" href="/about-us" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>

    {/* Scroll hint */}
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

// ─── Why Work at NSEZ ─────────────────────────────────────────────────────────

const WhyWorkAtNSEZ = () => <section className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-12">
  <div className="max-w-[1440px] mx-auto">
    <div className="text-center mb-12 sm:mb-16">
      <FadeUp>
        <span className="inline-block text-xs rounded-full px-3 py-2 leading-[21px] tracking-[0.06em] uppercase mb-5 text-white" style={{
          fontFamily: BODY_FONT,
          background: '#1fac67'
        }}>
          Why Nkomazi SEZ
        </span>
      </FadeUp>
      <AnimatedHeading className="text-[32px] sm:text-[40px] lg:text-[52px] text-[#1D4D35] uppercase text-center mb-4" style={{
        lineHeight: 1.05
      }}>
        Why Work at Nkomazi SEZ
      </AnimatedHeading>
      <div style={{
        height: '2px',
        background: 'rgba(200,168,75,0.6)',
        width: '64px',
        margin: '0 auto'
      }} />
    </div>

    {/* 1-col mobile → 2-col tablet → 3-col desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {WHY_WORK_CARDS.map((card, idx) => {
        const IconComp = card.icon;
        return <FadeUp key={card.id} delay={idx * 0.15} className="group">
          <div className="bg-[#FAFAF8] rounded-2xl border border-gray-100 hover:border-[#1fac67]/30 transition-all duration-300 h-full flex flex-col hover:shadow-xl hover:shadow-green-900/5 overflow-hidden">
            {/* Top image — fixed aspect ratio container */}
            <div className="w-full overflow-hidden" style={{
              height: '200px',
              flexShrink: 0
            }}>
              <img src={card.image} alt={card.title} className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-700" />
            </div>
            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1D4D35] rounded-xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">
                <IconComp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-[22px] sm:text-[24px] font-bold text-[#1D4D35] uppercase mb-3 sm:mb-4" style={{
                fontFamily: HEADING_FONT
              }}>
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-[14px] sm:text-[15px]" style={{
                fontFamily: BODY_FONT
              }}>
                {card.description}
              </p>
            </div>
          </div>
        </FadeUp>;
      })}
    </div>
  </div>
</section>;

// ─── Careers Section ──────────────────────────────────────────────────────────

const CareersSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredJobs = activeCategory === 'all' ? JOB_LISTINGS : JOB_LISTINGS.filter(job => {
    if (activeCategory === 'vacancy') return job.category === 'Vacancy';
    if (activeCategory === 'learnership') return job.category === 'Learnership';
    if (activeCategory === 'graduate') return job.category === 'Graduate Programme';
    if (activeCategory === 'internship') return job.category === 'Internship';
    return true;
  });
  return <section className="py-16 sm:py-24 bg-[#FAFAF8] px-4 sm:px-6 lg:px-12" id="opportunities">
    <div className="max-w-[1440px] mx-auto">
      <div className="text-center mb-10 sm:mb-12">
        <AnimatedHeading className="text-[32px] sm:text-[40px] lg:text-[52px] text-[#1D4D35] uppercase text-center mb-4" style={{
          lineHeight: 1.05
        }}>
          Open Positions
        </AnimatedHeading>
        <div style={{
          height: '2px',
          background: 'rgba(200,168,75,0.6)',
          width: '64px',
          margin: '0 auto 32px'
        }} />
      </div>

      {/* Filter pills — horizontal scroll on mobile */}
      <div className="flex overflow-x-auto gap-2 mb-10 sm:mb-12 pb-2 sm:flex-wrap sm:justify-center scrollbar-none" style={{
        WebkitOverflowScrolling: 'touch'
      }}>
        {CAREER_CATEGORIES.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 px-5 sm:px-6 py-2.5 rounded-full text-[12px] sm:text-[13px] font-medium tracking-[0.04em] uppercase transition-all duration-300 border min-h-[44px] ${activeCategory === cat.id ? 'bg-[#1D4D35] text-white border-[#1D4D35] shadow-lg shadow-green-900/20' : 'bg-white text-gray-500 border-gray-200 hover:border-[#1D4D35]/30'}`} style={{
          fontFamily: BODY_FONT
        }}>
          {cat.label}
        </button>)}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <AnimatePresence mode="wait">
          {filteredJobs.length > 0 ? <motion.div key={activeCategory} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.4
          }} className="space-y-4 sm:space-y-6">
            {filteredJobs.map(job => <div key={job.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 hover:shadow-lg hover:border-[#1fac67]/20 transition-all duration-300">
              <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-widest" style={{
                    fontFamily: BODY_FONT,
                    background: 'rgba(200,168,75,0.12)',
                    color: '#C8A84B'
                  }}>
                    {job.category}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1" style={{
                    fontFamily: BODY_FONT
                  }}>
                    <Briefcase size={14} />
                    <span>{job.department}</span>
                  </span>
                </div>
                <h4 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#1D4D35] uppercase leading-tight" style={{
                  fontFamily: HEADING_FONT
                }}>
                  {job.title}
                </h4>
                <p className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed" style={{
                  fontFamily: BODY_FONT
                }}>
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-4 sm:gap-6 pt-1">
                  <div className="flex items-center gap-2 text-gray-500 text-sm" style={{
                    fontFamily: BODY_FONT
                  }}>
                    <MapPin size={16} className="text-[#1fac67] flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm" style={{
                    fontFamily: BODY_FONT
                  }}>
                    <Calendar size={16} className="text-[#1fac67] flex-shrink-0" />
                    <span>
                      <span>Closing: </span>
                      <strong className="text-gray-700">{job.closingDate}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <GreenButton label="Apply Now" fullWidth href="#register" />
              </div>
            </div>)}
          </motion.div> : <motion.div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-dashed border-gray-200" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }}>
            <Info size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-base sm:text-lg" style={{
              fontFamily: BODY_FONT
            }}>
              No active listings in this category at the moment.
            </p>
          </motion.div>}
        </AnimatePresence>
      </div>
    </div>
  </section>;
};

// ─── Learnerships Band ────────────────────────────────────────────────────────

const LearnershipsBand = () => <section className="bg-[#1D4D35] text-white relative overflow-hidden" style={{
  paddingTop: 'clamp(56px, 8vw, 112px)',
  paddingBottom: 'clamp(56px, 8vw, 112px)'
}}>
  {/* Ghost watermark */}
  <div aria-hidden="true" className="hidden sm:block" style={{
    position: 'absolute',
    top: 0,
    right: 0,
    pointerEvents: 'none',
    userSelect: 'none',
    overflow: 'hidden',
    maxWidth: '70%'
  }}>
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: 'clamp(60px, 18vw, 260px)',
      color: 'rgba(255,255,255,0.03)',
      lineHeight: 1,
      letterSpacing: '-0.04em',
      whiteSpace: 'nowrap',
      display: 'block'
    }}>
      LEARNERSHIPS
    </span>
  </div>

  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 relative" style={{
    zIndex: 1
  }}>
    <div className="text-center">
      <FadeUp>
        <span className="inline-block rounded-full px-4 py-1.5 text-white text-[12px] font-semibold uppercase tracking-widest mb-5 sm:mb-6" style={{
          fontFamily: BODY_FONT,
          background: '#E8521A'
        }}>
          Opportunities for Young Talent
        </span>
      </FadeUp>
      <AnimatedHeading className="text-[32px] sm:text-[48px] lg:text-[60px] text-white uppercase text-center mb-4" style={{
        lineHeight: 1.0
      }}>
        Learnerships and Graduate Programmes
      </AnimatedHeading>
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #C8A84B, transparent)',
        width: '64px',
        margin: '0 auto 20px'
      }} />
      <FadeUp delay={0.2}>
        <p className="text-center mx-auto" style={{
          fontFamily: BODY_FONT,
          fontSize: 'clamp(14px, 1.5vw, 16px)',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.8,
          maxWidth: '560px'
        }}>
          Nkomazi SEZ is committed to developing young talent through structured learnerships, graduate placements, and internships aligned with our priority sectors.
        </p>
      </FadeUp>
    </div>
  </div>
</section>;

// ─── Register Interest CTA ────────────────────────────────────────────────────

const RegisterInterestCTA = () => {
  const [email, setEmail] = useState('');
  return <section id="register" style={{
    background: '#F8F7F0',
    paddingTop: 'clamp(48px, 8vw, 96px)',
    paddingBottom: 'clamp(48px, 8vw, 96px)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Ghost watermark — hidden on small screens to avoid overflow */}
    <div aria-hidden="true" className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none select-none overflow-hidden">
      <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(60px, 22vw, 300px)',
        color: 'rgba(17,17,17,0.03)',
        lineHeight: 1,
        letterSpacing: '-0.04em'
      }}>
        CAREERS
      </span>
    </div>

    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 relative" style={{
      zIndex: 1
    }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left column */}
        <FadeUp>
          <div className="flex gap-5 sm:gap-8 items-start">
            {/* Gold vertical accent */}
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
                color: '#E8521A',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}>
                Careers Gateway
              </div>
              <h2 style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(32px, 6vw, 80px)',
                fontWeight: 700,
                color: '#111111',
                textTransform: 'uppercase',
                letterSpacing: '-1px',
                lineHeight: 1.05,
                margin: 0,
                marginBottom: '20px'
              }}>
                Don't See Your Role?
              </h2>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                color: 'rgba(17,17,17,0.65)',
                lineHeight: '1.8',
                margin: 0,
                maxWidth: '400px'
              }}>
                Register your interest and our HR team will reach out when a suitable opportunity opens up. We are always growing.
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
                Register Your Interest
              </p>
              {/* Email input */}
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Mail size={18} />
                </div>
                <input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full focus:outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  fontSize: '14px',
                  paddingLeft: '44px',
                  paddingRight: '20px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  background: '#ffffff',
                  border: '1px solid rgba(17,17,17,0.12)',
                  borderRadius: '12px',
                  color: '#111111',
                  minHeight: '52px'
                }} />
              </div>
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button type="button" className="flex items-center justify-center gap-2 text-white font-semibold rounded-xl px-6 py-3.5 text-[14px] tracking-[0.01em] min-h-[44px]" style={{
                  fontFamily: BODY_FONT,
                  background: '#E8521A',
                  border: 'none',
                  cursor: 'pointer'
                }} whileHover={{
                  y: -2,
                  scale: 1.015
                }} whileTap={{
                  scale: 0.97
                }}>
                  <span>Register Interest</span>
                  <ArrowUpRight size={16} />
                </motion.button>
                <GhostButtonDark label="View Open Positions" href="#opportunities" />
              </div>
            </div>

            <div style={{
              height: '1px',
              background: 'rgba(17,17,17,0.1)',
              margin: '4px 0'
            }} />

            {/* Contact row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <a href="mailto:careers@nsez.gov.za" style={{
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
                careers@nsez.gov.za
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
                transition: 'opacity 0.2s'
              }} onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75';
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
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

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => <footer style={{
  background: '#0F3024'
}}>
  {/* Top bar */}
  <div style={{
    background: '#0F3024',
    borderBottom: '1px solid rgba(201,168,76,0.25)'
  }}>
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
      <div style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(24px, 4vw, 42px)',
        color: '#ffffff',
        letterSpacing: '-0.5px'
      }}>
        NKOMAZI SEZ
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <span style={{
          fontFamily: HEADING_FONT,
          fontWeight: 700,
          fontSize: 'clamp(18px, 3vw, 32px)',
          color: '#ffffff',
          letterSpacing: '-0.3px'
        }}>
          Ready to Invest?
        </span>
        <motion.a href="#" onClick={e => e.preventDefault()} whileHover={{
          scale: 1.04
        }} whileTap={{
          scale: 0.97
        }} style={{
          fontFamily: BODY_FONT,
          fontSize: '13px',
          fontWeight: 600,
          color: '#ffffff',
          border: '1.5px solid rgba(255,255,255,0.6)',
          borderRadius: '6px',
          padding: '10px 22px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.2s, background 0.2s',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center'
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C9A84C';
          (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)';
          (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
        }}>
          Contact Our Investment Team
        </motion.a>
      </div>
    </div>
  </div>

  <div style={{
    height: '2px',
    background: '#C9A84C',
    opacity: 0.85
  }} />

  {/* Main footer grid */}
  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
      {/* Brand col */}
      <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-5 sm:gap-6">
        <div style={{
          fontFamily: HEADING_FONT,
          fontWeight: 900,
          fontSize: '32px',
          color: '#ffffff',
          letterSpacing: '-0.5px',
          lineHeight: 1
        }}>
          NKOMAZI SEZ
        </div>
        <p style={{
          fontFamily: BODY_FONT,
          fontSize: '13px',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.75,
          margin: 0
        }}>
          Nkomazi Special Economic Zone (Nkomazi SEZ) is an entity of the Mpumalanga Department of Economic Development and Tourism (DEDT), established to drive sustainable industrialisation, attract regional and international investment, and create lasting economic transformation for the people of Mpumalanga and South Africa.
        </p>
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {SOCIAL_LINKS.map(({
            Icon,
            label,
            href
          }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s, background 0.2s'
          }} onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = '#C9A84C';
            el.style.color = '#C9A84C';
          }} onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = 'rgba(255,255,255,0.25)';
            el.style.color = 'rgba(255,255,255,0.7)';
          }}>
              <Icon />
            </a>)}
        </div>
      </div>

      {/* Nav links */}
      <div className="lg:col-span-4 grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <span style={{
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            fontSize: '13px',
            color: '#C9A84C',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const
          }}>
            Explore
          </span>
          <div className="flex flex-col gap-2.5">
            {['About Nkomazi SEZ', 'Why Invest', 'Priority Sectors', 'Investor Hub'].map(link => <a key={link} href="#" onClick={e => e.preventDefault()} style={{
              fontFamily: BODY_FONT,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }} onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
            }}>
              {link}
            </a>)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span style={{
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            fontSize: '13px',
            color: '#C9A84C',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const
          }}>
            Connect
          </span>
          <div className="flex flex-col gap-2.5">
            {['Investment Process', 'Resources', 'Partners', 'Contact'].map(link => <a key={link} href="#" onClick={e => e.preventDefault()} style={{
              fontFamily: BODY_FONT,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }} onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
            }}>
              {link}
            </a>)}
          </div>
        </div>
      </div>

      {/* Contact col */}
      <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-4">
        <span style={{
          fontFamily: HEADING_FONT,
          fontWeight: 700,
          fontSize: '13px',
          color: '#C9A84C',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const
        }}>
          Get in Touch
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
          <div className="flex flex-col gap-1">
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const
            }}>Investment Enquiries</span>
            <a href="mailto:invest@nsez.gov.za" style={{
              fontFamily: BODY_FONT,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none'
            }} onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)';
            }}>
              invest@nsez.gov.za
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const
            }}>General Enquiries</span>
            <a href="mailto:info@nsez.gov.za" style={{
              fontFamily: BODY_FONT,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none'
            }} onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)';
            }}>
              info@nsez.gov.za
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const
            }}>Komatipoort Office</span>
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.65)'
            }}>Komatipoort, Mpumalanga</span>
          </div>
          <div className="flex flex-col gap-1">
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const
            }}>Mbombela Office</span>
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.65)'
            }}>Mbombela, Mpumalanga</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom bar */}
  <div style={{
    borderTop: '1px solid rgba(255,255,255,0.1)'
  }}>
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p style={{
        fontFamily: BODY_FONT,
        fontSize: '12px',
        color: 'rgba(255,255,255,0.4)',
        margin: 0,
        textAlign: 'center'
      }}>
        <span>© 2026 Nkomazi Special Economic Zone. All rights reserved.</span>
      </p>
      <div style={{
        display: 'flex',
        gap: '20px'
      }}>
        {(['Privacy Policy', 'Terms of Use'] as string[]).map(l => <a key={l} href="#" onClick={e => e.preventDefault()} style={{
          fontFamily: BODY_FONT,
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)';
        }}>
          {l}
        </a>)}
      </div>
    </div>
  </div>
</footer>;

export const CareersPage = () => <div className="min-h-screen bg-white overflow-x-hidden w-full" style={{
  fontFamily: BODY_FONT,
  color: '#1D4D35'
}}>
  <NSEZNavbar />
  <main style={{ paddingTop: '36px' }}>
    <PageHero />
    <WhyWorkAtNSEZ />
    <CareersSection />
    <LearnershipsBand />
    <RegisterInterestCTA />
  </main>
  <NSEZFooterSection />
</div>;