import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { Menu, X, Check, ArrowRight } from "lucide-react";
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';


// ─── Font constants ────────────────────────────────────────────────────────────
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── Color tokens ──────────────────────────────────────────────────────────────
const GREEN = "#162E20";
const GREEN_MID = "#1D4D35";
const BRIGHT_GREEN = "#1a9e5e";
const EMERALD_GLOW = "#22c778";
const GOLD = "#B8963A";
const GOLD_LIGHT = "#D4AB52";
const DARK = "#080F0A";
const SURFACE = "#F6F7F4";
const SURFACE_WARM = "#EEEEE8";

// ─── Data ──────────────────────────────────────────────────────────────────────
const NAV_SECTORS = ["Agro-processing & Agriculture", "Manufacturing", "Green Economy", "Logistics & Warehousing"];
const NAV_LINKS = ["About Nkomazi SEZ", "Invest", "MSME Hub", "Tenders", "News and Media", "Stakeholder Relations", "Careers", "Contact Us"];
interface MSMEProgrammeCard {
  id: string;
  number: string;
  title: string;
  description: string;
  bgImage: string;
  bottomColor: string;
}
const MSME_PROGRAMME_CARDS: MSMEProgrammeCard[] = [{
  id: "supplier",
  number: "01",
  title: "Supplier Registration",
  description: "Register your business to participate in Nkomazi SEZ supply chains and be considered for procurement and service opportunities within the zone.",
  bgImage: "/enterprise-development3.jpg",
  bottomColor: "#162E20"
}, {
  id: "training",
  number: "02",
  title: "Training and Capacity Building",
  description: "Participate in skills development and capacity building programmes designed to improve competitiveness, operational standards and market readiness.",
  bgImage: "/enterprise-development2.jpg",
  bottomColor: "#1E1008"
}];
interface ProcessStep {
  id: string;
  step: string;
  title: string;
  desc: string;
  image: string;
}
const PROCESS_STEPS: ProcessStep[] = [{
  id: "register",
  step: "01",
  title: "Register",
  desc: "Submit your business details through the Nkomazi SEZ MSME registration portal to join our supplier network.",
  image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1000&q=90"
}, {
  id: "verify",
  step: "02",
  title: "Verify",
  desc: "Our team reviews your application and verifies your business compliance and capability documentation.",
  image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=90"
}, {
  id: "participate",
  step: "03",
  title: "Participate",
  desc: "Access procurement opportunities, training programmes and enterprise development support within the zone.",
  image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=90"
}, {
  id: "grow",
  step: "04",
  title: "Grow",
  desc: "Scale your business through sustained support, funding access and integration into the Nkomazi SEZ industrial ecosystem.",
  image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=1000&q=90"
}];
interface MetricItem {
  value: string;
  label: string;
  detail: string;
}
const MSME_METRICS: MetricItem[] = [{
  value: "2,400+",
  label: "Registered MSMEs",
  detail: "Active in the network"
}, {
  value: "R180M+",
  label: "Funding Facilitated",
  detail: "Across all programmes"
}, {
  value: "12",
  label: "Active Programmes",
  detail: "Currently running"
}];
const PARTNER_LOGOS = [
  '/partners/dp-world.png',
  '/partners/dtic.png',
  '/partners/economic-development-tourism.png',
  '/partners/ehlanzeni-district-municipality.png',
  '/partners/nkomazi-local-municipality.png'
];
const BUSINESS_TYPES = ["Pty Ltd", "CC", "Sole Proprietor", "Partnership", "Co-operative", "NPO / Trust", "Other"];
const EMPLOYEE_RANGES = ["1-5", "6-10", "11-20", "21-50", "51-200", "200+"];
const PROVINCES = ["Mpumalanga", "Gauteng", "Limpopo", "KZN", "Western Cape", "Eastern Cape", "North West", "Free State", "Northern Cape"];
interface SocialLinkItem {
  Icon: React.FC;
  label: string;
  href: string;
}

// ─── Custom SVG Icons ──────────────────────────────────────────────────────────
const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
    <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const ArrowRightIconSvg = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
    <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
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
  label: "Instagram",
  href: "https://www.instagram.com/nkomazisez/"
}, {
  Icon: FacebookIcon,
  label: "Facebook",
  href: "https://web.facebook.com/people/Nkomazi-SEZ/61586568002498/"
}, {
  Icon: YouTubeIcon,
  label: "YouTube",
  href: "https://www.youtube.com/@NkomaziSEZ"
}, {
  Icon: LinkedInIcon,
  label: "LinkedIn",
  href: "https://www.linkedin.com/company/nkomazi-special-economic-zone/"
}];

// ─── Gold Divider ──────────────────────────────────────────────────────────────
const GoldDivider = ({
  subtle = false
}: {
  subtle?: boolean;
}) => <div style={{
  height: "1px",
  background: subtle ? "linear-gradient(90deg, transparent 0%, rgba(184,150,58,0.18) 30%, rgba(184,150,58,0.35) 50%, rgba(184,150,58,0.18) 70%, transparent 100%)" : "linear-gradient(90deg, transparent 0%, rgba(184,150,58,0.12) 10%, rgba(184,150,58,0.45) 50%, rgba(184,150,58,0.12) 90%, transparent 100%)",
  width: "100%"
}} />;

// ─── Section Tag ───────────────────────────────────────────────────────────────
const SectionTag = ({
  children,
  light = false,
  dark = false
}: {
  children: React.ReactNode;
  light?: boolean;
  dark?: boolean;
}) => <motion.span initial={{
  opacity: 0,
  y: 8
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true
}} transition={{
  duration: 0.4,
  ease: "easeOut"
}} className="inline-block text-xs rounded-full px-3 py-2 leading-[21px] tracking-[0.06em] uppercase" style={{
  fontFamily: BODY_FONT,
  background: light ? 'rgba(255,255,255,0.12)' : '#1fac67',
  color: light ? 'rgba(255,255,255,0.85)' : '#ffffff'
}}>
    {children}
  </motion.span>;

// ─── AnimatedHeading ───────────────────────────────────────────────────────────
const AnimatedHeading = ({
  children,
  className,
  style,
  as: Tag = "h2"
}: {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3";
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px"
  });
  const words = children.split(" ");
  return <Tag ref={ref} className={className} style={{
    ...style,
    fontFamily: HEADING_FONT,
    fontWeight: 700,
    overflow: "hidden"
  }}>
      {words.map((word, i) => <span key={`${word}-${i}`} style={{
      display: "inline-block",
      overflow: "hidden",
      verticalAlign: "bottom",
      marginRight: "0.2em"
    }}>
          <motion.span style={{
        display: "inline-block"
      }} initial={{
        y: "110%",
        opacity: 0
      }} animate={inView ? {
        y: "0%",
        opacity: 1
      } : {}} transition={{
        duration: 0.6,
        delay: i * 0.06,
        ease: [0.16, 1, 0.3, 1]
      }}>
            {word}
          </motion.span>
        </span>)}
    </Tag>;
};

// ─── FadeUp ────────────────────────────────────────────────────────────────────
const FadeUp = ({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-50px"
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 32
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.65,
    delay,
    ease: [0.16, 1, 0.3, 1]
  }} className={className}>
      {children}
    </motion.div>;
};

// ─── Buttons ───────────────────────────────────────────────────────────────────
const GreenButton = ({
  label,
  large = false,
  href = '#',
  onClick
}: {
  label: string;
  large?: boolean;
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
  className="group flex items-stretch no-underline relative overflow-hidden"
  style={{
    height: large ? "52px" : "46px",
    borderRadius: "6px"
  }}
  whileHover={{
    y: -2,
    scale: 1.012
  }}
  whileTap={{
    scale: 0.975
  }}
  transition={{
    duration: 0.18,
    ease: "easeOut"
  }}
>
    <div className="flex items-center justify-center px-5 text-white overflow-hidden tracking-[0.06em] uppercase rounded-l-[6px]" style={{
    fontFamily: BODY_FONT,
    background: `linear-gradient(135deg, ${BRIGHT_GREEN} 0%, #158a50 100%)`,
    letterSpacing: "0.06em",
    fontSize: large ? "13px" : "12px",
    fontWeight: 600
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center flex-shrink-0 text-white rounded-r-[6px]" style={{
    width: large ? "50px" : "46px",
    background: `linear-gradient(135deg, #158a50 0%, #0f6e3f 100%)`
  }}>
      <ArrowRightIconSvg />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-600 ease-in-out" style={{
    background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.14) 50%, transparent 75%)"
  }} />
  </motion.a>;

const GoldButton = ({
  label,
  large = false,
  height,
  href = '#',
  onClick
}: {
  label: string;
  large?: boolean;
  height?: number;
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
  className="group flex items-stretch no-underline relative overflow-hidden"
  style={{
    height: `${height ?? (large ? 46 : 44)}px`,
    borderRadius: "8px"
  }}
  whileHover={{
    y: -2,
    scale: 1.012
  }}
  whileTap={{
    scale: 0.975
  }}
  transition={{
    duration: 0.18,
    ease: "easeOut"
  }}
>
    <div className="flex items-center justify-center px-5 text-white overflow-hidden rounded-l-[8px] tracking-[0.06em] uppercase" style={{
    fontFamily: BODY_FONT,
    fontWeight: 600,
    fontSize: large ? "13px" : "12px",
    background: `linear-gradient(135deg, #E8521A 0%, #c43d10 100%)`
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center flex-shrink-0 text-white rounded-r-[8px]" style={{
    width: large ? "46px" : "44px",
    background: `linear-gradient(135deg, #c43d10 0%, #a83210 100%)`
  }}>
      <ArrowRightIconSvg />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-600 ease-in-out" style={{
    background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.18) 50%, transparent 75%)"
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
  className="group flex items-stretch no-underline relative overflow-hidden"
  style={{
    height: "44px",
    borderRadius: "8px"
  }}
  whileHover={{
    y: -2,
    scale: 1.012
  }}
  whileTap={{
    scale: 0.975
  }}
  transition={{
    duration: 0.18,
    ease: "easeOut"
  }}
>
    <div className="flex items-center justify-center px-5 text-white overflow-hidden rounded-l-[8px] tracking-[0.06em] uppercase" style={{
    fontFamily: BODY_FONT,
    fontWeight: 600,
    fontSize: "12px",
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.55)",
    borderRight: "none"
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center flex-shrink-0 text-white rounded-r-[8px]" style={{
    width: "44px",
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.55)",
    borderLeft: "none"
  }}>
      <ArrowRightIconSvg />
    </div>
  </motion.a>;

const GhostButtonDark = ({
  label,
  height = 46,
  href = '#',
  onClick
}: {
  label: string;
  height?: number;
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
  className="group flex items-stretch no-underline relative overflow-hidden"
  style={{
    height: `${height}px`,
    borderRadius: "8px"
  }}
  whileHover={{
    y: -2,
    scale: 1.012
  }}
  whileTap={{
    scale: 0.975
  }}
  transition={{
    duration: 0.18,
    ease: "easeOut"
  }}
>
    <div className="flex items-center justify-center px-5 overflow-hidden rounded-l-[8px] tracking-[0.06em] uppercase" style={{
    fontFamily: BODY_FONT,
    fontWeight: 600,
    fontSize: "12px",
    color: "#111111",
    background: "transparent",
    border: "1.5px solid rgba(17,17,17,0.55)",
    borderRight: "none"
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center flex-shrink-0 rounded-r-[8px]" style={{
    width: `${height}px`,
    color: "#111111",
    background: "transparent",
    border: "1.5px solid rgba(17,17,17,0.55)",
    borderLeft: "none"
  }}>
      <ArrowRightIconSvg />
    </div>
  </motion.a>;

// ─── Hero ──────────────────────────────────────────────────────────────────────
const HERO_IMAGE = "/enterprise-development.jpg";
const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const {
    scrollY
  } = useScroll();
  const rawBgY = useTransform(scrollY, [0, 600], [0, 110]);
  const bgY = useSpring(rawBgY, {
    stiffness: 75,
    damping: 22
  });
  const opacityOut = useTransform(scrollY, [0, 480], [1, 0]);
  return <section ref={heroRef} className="relative flex flex-col justify-end rounded-3xl mx-1.5 sm:mx-2.5" style={{
    overflow: "hidden",
    height: "calc(100vh - 36px)",
    minHeight: "500px"
  }}>
      {/* Background */}
      <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden"
    }}>
        <motion.div style={{
        position: "absolute",
        inset: "-25% 0 -25% 0",
        y: bgY
      }}>
          <div className="absolute inset-0" style={{
          backgroundImage: `url("${HERO_IMAGE}")`,
          backgroundPosition: "center top",
          backgroundSize: "cover"
        }} />
        </motion.div>
      </div>

      {/* Vignettes */}
      <div className="absolute inset-0" style={{
      background: "linear-gradient(to bottom, rgba(6,16,10,0.78) 0%, rgba(6,16,10,0.3) 22%, transparent 42%)",
      zIndex: 1
    }} />
      <div className="absolute inset-0" style={{
      background: "linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)",
      zIndex: 1
    }} />
      <div className="absolute inset-0" style={{
      background: "linear-gradient(105deg, rgba(4,11,7,0.55) 0%, transparent 55%)",
      zIndex: 1
    }} />

      {/* Ghost watermark — hidden on small screens to reduce visual clutter */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-end pointer-events-none select-none overflow-hidden pr-8 md:pr-12" aria-hidden="true" style={{
      zIndex: 1
    }}>
        <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: "clamp(100px, 24vw, 320px)",
        color: "rgba(255,255,255,0.028)",
        lineHeight: 1,
        userSelect: "none",
        letterSpacing: "-0.05em"
      }}>
          NKOMAZI SEZ
        </span>
      </div>

      {/* Hero content */}
      <motion.div className="absolute left-0 right-0 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20" style={{
      bottom: "clamp(40px, 6vh, 80px)",
      opacity: opacityOut,
      zIndex: 2
    }}>
        <AnimatedHeading as="h1" style={{
        fontSize: "clamp(28px, 6vw, 80px)",
        lineHeight: 1.05,
        letterSpacing: "-1px",
        fontWeight: 700,
        color: "#ffffff",
        margin: "0 0 2px 0",
        textTransform: "uppercase"
      }}>
          Empowering
        </AnimatedHeading>
        <AnimatedHeading as="h1" style={{
        fontSize: "clamp(28px, 6vw, 80px)",
        lineHeight: 1.05,
        letterSpacing: "-1px",
        fontWeight: 700,
        color: EMERALD_GLOW,
        margin: "0 0 20px 0",
        textTransform: "uppercase"
      }}>
          Local Enterprise.
        </AnimatedHeading>

        <motion.p initial={{
        opacity: 0,
        y: 18
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.52,
        duration: 0.55,
        ease: "easeOut"
      }} style={{
        fontFamily: BODY_FONT,
        fontSize: "clamp(13px, 1.5vw, 15px)",
        lineHeight: 1.75,
        color: "rgba(255,255,255,0.7)",
        margin: "0 0 28px 0",
        maxWidth: "520px",
        fontWeight: 400
      }}>
          Supporting local enterprise and supplier participation within the Nkomazi Special Economic Zone.
        </motion.p>

        {/* CTA buttons — stack on mobile, side by side on sm+ */}
        <motion.div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3" initial={{
        opacity: 0,
        y: 14
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.64,
        duration: 0.5,
        ease: "easeOut"
      }}>
          <GoldButton label="Join Our Database" href="#registration" />
          <GhostButton label="Learn About Our Programmes" href="#programmes" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div className="absolute z-10 flex flex-col items-center" style={{
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)"
    }} initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.5,
      duration: 0.6
    }}>
        <span style={{
        fontFamily: BODY_FONT,
        fontSize: "9px",
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: "8px",
        whiteSpace: "nowrap"
      }}>
          Scroll to explore
        </span>
        <motion.svg width="14" height="8" viewBox="0 0 14 8" fill="none" animate={{
        y: [0, 5]
      }} transition={{
        duration: 1.4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}>
          <path d="M1 1L7 7L13 1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>;
};

// ─── Metrics Strip ─────────────────────────────────────────────────────────────
const MetricsStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-50px"
  });
  return <section ref={ref} style={{
    background: `linear-gradient(135deg, ${GREEN} 0%, #1a3d28 50%, #0f2419 100%)`
  }}>
      <div style={{
      height: "1px",
      background: `linear-gradient(90deg, transparent, rgba(184,150,58,0.4), transparent)`
    }} />
      <div className="max-w-[1372px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* 2-col on mobile, 3-col on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
          {MSME_METRICS.map((metric, idx) => <div key={metric.value} className="flex flex-col md:flex-row items-center w-full">
              <motion.div className="flex flex-col items-center text-center px-4 sm:px-8 py-8 md:py-0 w-full" initial={{
            opacity: 0,
            y: 28
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.65,
            delay: idx * 0.12,
            ease: [0.16, 1, 0.3, 1]
          }}>
                <span style={{
              fontFamily: HEADING_FONT,
              fontWeight: 900,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-2px"
            }}>
                  {metric.value}
                </span>
                <span style={{
              fontFamily: BODY_FONT,
              fontSize: "11px",
              fontWeight: 600,
              color: GOLD_LIGHT,
              marginTop: "8px",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
                  {metric.label}
                </span>
                <span style={{
              fontFamily: BODY_FONT,
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              marginTop: "4px",
              letterSpacing: "0.02em"
            }}>
                  {metric.detail}
                </span>
              </motion.div>
              {/* Divider — show between cells on md+ only */}
              {idx < MSME_METRICS.length - 1 && <div className="hidden md:flex flex-col items-center px-2" style={{
            height: "80px",
            justifyContent: "center"
          }}>
                  <div style={{
              width: "1px",
              height: "100%",
              background: `linear-gradient(to bottom, transparent, rgba(184,150,58,0.35), transparent)`
            }} />
                </div>}
            </div>)}
        </div>
      </div>
      <div style={{
      height: "1px",
      background: `linear-gradient(90deg, transparent, rgba(184,150,58,0.4), transparent)`
    }} />
    </section>;
};

// ─── MSME Programmes ────────────────────────────────────────────────────────────
const MSMEProgrammes = () => <section id="programmes" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12" style={{
  background: "#ffffff"
}}>
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <SectionTag>What We Offer</SectionTag>
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12 sm:mb-16 lg:mb-20">
        <AnimatedHeading className="uppercase" style={{
        fontSize: "clamp(32px, 5.5vw, 68px)",
        lineHeight: "0.92",
        letterSpacing: "-2px",
        color: GREEN,
        margin: 0
      }}>
          MSME Programmes
        </AnimatedHeading>
        <FadeUp delay={0.15}>
          <p className="max-w-md" style={{
          fontFamily: BODY_FONT,
          color: "rgba(22,46,32,0.55)",
          lineHeight: 1.8,
          fontSize: "14px",
          fontWeight: 400
        }}>
            Explore our specialized support initiatives designed to empower local businesses and facilitate their integration into the Nkomazi SEZ industrial ecosystem.
          </p>
        </FadeUp>
      </div>

      {/* 1-col mobile, 2-col tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MSME_PROGRAMME_CARDS.map((card, idx) => <FadeUp key={card.id} delay={idx * 0.07}>
            <div className="group relative overflow-hidden cursor-pointer w-full" style={{
          minHeight: "340px",
          background: card.bottomColor,
          borderRadius: "12px"
        }} onMouseEnter={e => {
          const img = (e.currentTarget as HTMLDivElement).querySelector(".card-image") as HTMLDivElement | null;
          if (img) img.style.transform = "scale(1.04)";
        }} onMouseLeave={e => {
          const img = (e.currentTarget as HTMLDivElement).querySelector(".card-image") as HTMLDivElement | null;
          if (img) img.style.transform = "scale(1)";
        }}>
              <div className="card-image absolute inset-0 transition-transform duration-700 ease-out" style={{
            backgroundImage: `url("${card.bgImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transformOrigin: "center"
          }} />
              <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.15) 68%, transparent 100%)"
          }} />
              <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 50%)"
          }} />

              <div className="relative h-full flex flex-col justify-end p-6 sm:p-9" style={{
            minHeight: "340px"
          }}>
                <div className="absolute top-5 left-5 sm:top-7 sm:left-7">
                  <span style={{
                fontFamily: BODY_FONT,
                fontWeight: 700,
                fontSize: "10px",
                color: GOLD_LIGHT,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                background: "rgba(184,150,58,0.12)",
                border: `1px solid rgba(184,150,58,0.3)`,
                padding: "4px 9px",
                borderRadius: "3px"
              }}>
                    {card.number}
                  </span>
                </div>
                <div className="absolute top-5 right-5 sm:top-7 sm:right-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRightIcon />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: `linear-gradient(90deg, ${GOLD}, transparent)`
            }} />

                <h3 className="uppercase mb-3" style={{
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              color: "#ffffff",
              fontSize: "clamp(20px, 2.8vw, 30px)",
              letterSpacing: "-0.5px",
              lineHeight: 1
            }}>
                  {card.title}
                </h3>
                <p style={{
              fontFamily: BODY_FONT,
              color: "rgba(255,255,255,0.7)",
              fontSize: "13px",
              maxWidth: "400px",
              lineHeight: 1.75,
              fontWeight: 400
            }}>
                  {card.description}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <a href="#registration" className="inline-flex items-center gap-2 transition-all" style={{
                fontFamily: BODY_FONT,
                color: GOLD_LIGHT,
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none"
              }}>
                    <span>Learn More</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>)}
      </div>
    </div>
  </section>;

// ─── Partner Logos ─────────────────────────────────────────────────────────────
const PartnerLogos = () => <section id="sec-partners" className="py-[80px] sm:py-[120px] pb-[80px] sm:pb-[100px] flex flex-col items-center gap-6 overflow-hidden" style={{ background: SURFACE }}>
    <GoldDivider />
    <FadeUp>
      <p className="text-[#111111] text-xl sm:text-2xl leading-[1.4] m-0 text-center font-light px-4" style={{
      fontFamily: HEADING_FONT,
      letterSpacing: '-0.5px'
    }}>
        Nkomazi SEZ — your gateway to growth on the African continent
      </p>
    </FadeUp>
    <p style={{
    fontFamily: BODY_FONT,
    fontSize: '13px',
    color: 'rgba(17,17,17,0.45)',
    textAlign: 'center',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '24px',
    margin: 0
  }}>
      Supported by institutions committed to sustainable economic development
    </p>
    <div className="relative w-full overflow-hidden group">
      <motion.div className="flex gap-[60px] sm:gap-[110px] items-center group-hover:[animation-play-state:paused]" animate={{
      x: [0, -1800]
    }} transition={{
      repeat: Infinity,
      duration: 70,
      ease: 'linear'
    }} style={{
      width: 'max-content',
      mixBlendMode: 'multiply'
    }}>
        {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => <img key={`logo-${i}`} src={src} alt="Partner Logo" className="block flex-shrink-0 h-16" style={{
        maxWidth: '220px',
        mixBlendMode: 'multiply'
      }} />)}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0" style={{
      background: `linear-gradient(90deg, ${SURFACE}, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, ${SURFACE})`
    }} />
    </div>
    <GoldDivider />
  </section>;

// ─── How To Join ───────────────────────────────────────────────────────────────
const HowToJoin = () => <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12" style={{
  background: "#F6F7F4"
}}>
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <SectionTag dark>How to Join</SectionTag>
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12 sm:mb-16 lg:mb-20">
        <AnimatedHeading className="uppercase" style={{
        fontSize: "clamp(28px, 5.5vw, 68px)",
        lineHeight: "0.92",
        letterSpacing: "-1.5px",
        color: "#111111",
        margin: 0
      }}>
          Your Path to Participation
        </AnimatedHeading>
        <FadeUp delay={0.12}>
          <p className="max-w-md" style={{
          fontFamily: BODY_FONT,
          color: "rgba(17,17,17,0.65)",
          lineHeight: 1.8,
          fontSize: "14px",
          fontWeight: 400
        }}>
            A clear, supported process to help your business access the full range of Nkomazi SEZ MSME opportunities.
          </p>
        </FadeUp>
      </div>

      {/* 1-col mobile, 2-col sm, 4-col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROCESS_STEPS.map((step, idx) => <FadeUp key={step.id} delay={idx * 0.08}>
            <div className="group relative overflow-hidden w-full" style={{
          minHeight: "320px",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "12px",
          border: "1px solid rgba(17,17,17,0.08)"
        }} onMouseEnter={e => {
          const img = (e.currentTarget as HTMLDivElement).querySelector(".step-image") as HTMLDivElement | null;
          if (img) img.style.transform = "scale(1.06)";
        }} onMouseLeave={e => {
          const img = (e.currentTarget as HTMLDivElement).querySelector(".step-image") as HTMLDivElement | null;
          if (img) img.style.transform = "scale(1)";
        }}>
              <div className="step-image absolute inset-0 transition-transform duration-700 ease-out" style={{
            backgroundImage: `url("${step.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
            transformOrigin: "center"
          }} />
              <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(4,11,7,0.96) 0%, rgba(4,11,7,0.72) 45%, rgba(4,11,7,0.25) 100%)"
          }} />

              {/* Ghost step number */}
              <div className="absolute top-4 right-5 pointer-events-none select-none" aria-hidden="true">
                <span style={{
              fontFamily: HEADING_FONT,
              fontWeight: 900,
              fontSize: "72px",
              color: "rgba(255,255,255,0.04)",
              lineHeight: 1,
              letterSpacing: "-2px"
            }}>
                  {step.step}
                </span>
              </div>

              <div className="relative flex flex-col justify-end h-full p-6 sm:p-7" style={{
            minHeight: "320px"
          }}>
                <span style={{
              display: "inline-block",
              fontFamily: BODY_FONT,
              fontWeight: 700,
              fontSize: "9px",
              color: "#E8521A",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "rgba(232,82,26,0.12)",
              border: "1px solid rgba(232,82,26,0.3)",
              padding: "4px 9px",
              borderRadius: "3px",
              marginBottom: "12px",
              width: "fit-content"
            }}>
                  Step {step.step}
                </span>
                <h3 className="uppercase mb-3" style={{
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              color: "#ffffff",
              fontSize: "24px",
              letterSpacing: "-0.5px",
              lineHeight: 1
            }}>
                  {step.title}
                </h3>
                <p style={{
              fontFamily: BODY_FONT,
              fontSize: "13px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.75,
              fontWeight: 400
            }}>
                  {step.desc}
                </p>
              </div>
            </div>
          </FadeUp>)}
      </div>
    </div>
  </section>;

// ─── Registration Form ─────────────────────────────────────────────────────────
const RegistrationForm = () => <section id="registration" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12" style={{
  background: `linear-gradient(160deg, ${GREEN} 0%, #0f2419 40%, #162e20 100%)`
}}>
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-12 sm:mb-16">
        <div className="mb-6">
          <SectionTag light>Join the Network</SectionTag>
        </div>
        <AnimatedHeading className="uppercase" style={{
        fontSize: "clamp(32px, 6vw, 76px)",
        lineHeight: "0.92",
        letterSpacing: "-2px",
        color: "#ffffff",
        margin: "0 0 20px 0"
      }}>
          Register Your Business
        </AnimatedHeading>
        <FadeUp delay={0.1}>
          <p style={{
          fontFamily: BODY_FONT,
          fontSize: "15px",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.75,
          fontWeight: 400
        }}>
            Join the Nkomazi SEZ supplier network and unlock new growth opportunities.
          </p>
        </FadeUp>
      </div>

      <FadeUp delay={0.12}>
        <div className="rounded-2xl p-6 sm:p-8 md:p-12 w-full" style={{
        background: "#ffffff",
        boxShadow: "0 48px 96px rgba(0,0,0,0.35), 0 0 0 1px rgba(184,150,58,0.1)"
      }}>
          <form className="space-y-10 sm:space-y-12" onSubmit={e => e.preventDefault()}>
            {/* Personal Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-5" style={{
              borderBottom: `1px solid rgba(22,46,32,0.08)`
            }}>
                <div className="w-7 h-7 text-white rounded flex items-center justify-center flex-shrink-0" style={{
                background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_MID} 100%)`,
                fontFamily: BODY_FONT,
                fontSize: "11px",
                fontWeight: 700
              }}>
                  1
                </div>
                <h4 className="uppercase" style={{
                fontFamily: HEADING_FONT,
                fontWeight: 700,
                color: GREEN,
                fontSize: "20px",
                letterSpacing: "-0.3px",
                margin: 0
              }}>
                  Personal Details
                </h4>
              </div>
              {/* Always 1 col, md 2 col */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    First Name *
                  </label>
                  <input type="text" required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLInputElement).style.background = "#fff";
                  (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLInputElement).style.background = SURFACE;
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }} />
                </div>
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Surname *
                  </label>
                  <input type="text" required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLInputElement).style.background = "#fff";
                  (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLInputElement).style.background = SURFACE;
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }} />
                </div>
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Job Title / Role
                  </label>
                  <input type="text" className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLInputElement).style.background = "#fff";
                  (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLInputElement).style.background = SURFACE;
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }} />
                </div>
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Email Address *
                  </label>
                  <input type="email" required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLInputElement).style.background = "#fff";
                  (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLInputElement).style.background = SURFACE;
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Contact Number *
                  </label>
                  <input type="tel" required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLInputElement).style.background = "#fff";
                  (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLInputElement).style.background = SURFACE;
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }} />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-5" style={{
              borderBottom: `1px solid rgba(22,46,32,0.08)`
            }}>
                <div className="w-7 h-7 text-white rounded flex items-center justify-center flex-shrink-0" style={{
                background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_MID} 100%)`,
                fontFamily: BODY_FONT,
                fontSize: "11px",
                fontWeight: 700
              }}>
                  2
                </div>
                <h4 className="uppercase" style={{
                fontFamily: HEADING_FONT,
                fontWeight: 700,
                color: GREEN,
                fontSize: "20px",
                letterSpacing: "-0.3px",
                margin: 0
              }}>
                  Business Details
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Business / Trading Name *
                  </label>
                  <input type="text" required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLInputElement).style.background = "#fff";
                  (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLInputElement).style.background = SURFACE;
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }} />
                </div>
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Business Type *
                  </label>
                  <select required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all appearance-none" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLSelectElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLSelectElement).style.background = "#fff";
                  (e.target as HTMLSelectElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLSelectElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLSelectElement).style.background = SURFACE;
                  (e.target as HTMLSelectElement).style.boxShadow = "none";
                }}>
                    <option value="">Select Type</option>
                    {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Number of Employees
                  </label>
                  <select className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all appearance-none" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLSelectElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLSelectElement).style.background = "#fff";
                  (e.target as HTMLSelectElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLSelectElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLSelectElement).style.background = SURFACE;
                  (e.target as HTMLSelectElement).style.boxShadow = "none";
                }}>
                    <option value="">Select Range</option>
                    {EMPLOYEE_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Province *
                  </label>
                  <select required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all appearance-none" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLSelectElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLSelectElement).style.background = "#fff";
                  (e.target as HTMLSelectElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLSelectElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLSelectElement).style.background = SURFACE;
                  (e.target as HTMLSelectElement).style.boxShadow = "none";
                }}>
                    <option value="">Select Province</option>
                    {PROVINCES.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block" style={{
                  fontFamily: BODY_FONT,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: `${GREEN}80`,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                    Municipality *
                  </label>
                  <input type="text" required className="w-full px-4 sm:px-5 py-3 sm:py-4 outline-none transition-all" style={{
                  fontFamily: BODY_FONT,
                  color: GREEN,
                  background: SURFACE,
                  border: `1px solid ${SURFACE_WARM}`,
                  borderRadius: "8px",
                  fontSize: "14px"
                }} onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = `${GOLD}80`;
                  (e.target as HTMLInputElement).style.background = "#fff";
                  (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px ${GOLD}15`;
                }} onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = SURFACE_WARM;
                  (e.target as HTMLInputElement).style.background = SURFACE;
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }} />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div>
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-5" style={{
              borderBottom: `1px solid rgba(22,46,32,0.08)`
            }}>
                <div className="w-7 h-7 text-white rounded flex items-center justify-center flex-shrink-0" style={{
                background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_MID} 100%)`,
                fontFamily: BODY_FONT,
                fontSize: "11px",
                fontWeight: 700
              }}>
                  3
                </div>
                <h4 className="uppercase" style={{
                fontFamily: HEADING_FONT,
                fontWeight: 700,
                color: GREEN,
                fontSize: "20px",
                letterSpacing: "-0.3px",
                margin: 0
              }}>
                  Consent
                </h4>
              </div>
              <div className="space-y-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative pt-0.5 flex-shrink-0">
                    <input type="checkbox" required className="peer sr-only" />
                    <div className="w-5 h-5 border rounded flex items-center justify-center transition-all" style={{
                    borderColor: `rgba(22,46,32,0.2)`,
                    background: SURFACE
                  }}>
                      <Check size={12} style={{
                      color: GREEN
                    }} className="opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span style={{
                  fontFamily: BODY_FONT,
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: `rgba(22,46,32,0.65)`,
                  fontWeight: 400
                }}>
                    I confirm the information provided is accurate and complete.
                  </span>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative pt-0.5 flex-shrink-0">
                    <input type="checkbox" required className="peer sr-only" />
                    <div className="w-5 h-5 border rounded flex items-center justify-center transition-all" style={{
                    borderColor: `rgba(22,46,32,0.2)`,
                    background: SURFACE
                  }}>
                      <Check size={12} style={{
                      color: GREEN
                    }} className="opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span style={{
                  fontFamily: BODY_FONT,
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: `rgba(22,46,32,0.65)`,
                  fontWeight: 400
                }}>
                    I consent to Nkomazi SEZ storing my information in accordance with POPIA.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit — full width always */}
            <motion.button type="submit" whileHover={{
            scale: 1.008,
            y: -2
          }} whileTap={{
            scale: 0.995
          }} className="w-full text-white uppercase py-4 sm:py-5 flex items-center justify-center gap-3 relative overflow-hidden group" style={{
            fontFamily: HEADING_FONT,
            fontWeight: 700,
            fontSize: "clamp(14px, 2vw, 17px)",
            background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_MID} 50%, #1a3d28 100%)`,
            borderRadius: "10px",
            boxShadow: `0 16px 48px rgba(22,46,32,0.35), 0 0 0 1px rgba(184,150,58,0.12)`,
            letterSpacing: "0.12em"
          }}>
              <span>Submit Registration</span>
              <ArrowRight size={18} />
              <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-600 ease-in-out" style={{
              background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)"
            }} />
            </motion.button>
          </form>
        </div>
      </FadeUp>
    </div>
  </section>;

// ─── Contact CTA ───────────────────────────────────────────────────────────────
const ContactCTA = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px"
  });
  return <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 relative overflow-hidden" style={{
    background: "#ffffff"
  }}>
      {/* Decorative watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: "clamp(80px, 22vw, 320px)",
        color: "rgba(17,17,17,0.03)",
        lineHeight: 1,
        userSelect: "none",
        letterSpacing: "-0.04em"
      }}>
          MSME
        </span>
      </div>

      <div className="max-w-[1372px] mx-auto relative" style={{
      zIndex: 1
    }}>
        {/* Stack on mobile, 2-col on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left column */}
          <FadeUp>
            <div>
              <div className="flex items-start gap-4 mb-5">
                {/* Vertical accent — hidden on mobile, visible sm+ */}
                <div className="hidden sm:flex flex-col items-center flex-shrink-0" style={{
                marginTop: "2px"
              }}>
                  <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#C8A84B",
                  flexShrink: 0
                }} />
                  <div style={{
                  width: "1px",
                  minHeight: "100px",
                  marginTop: "6px",
                  background: "linear-gradient(to bottom, #C8A84B, transparent)"
                }} />
                </div>
                <div>
                  <p style={{
                  fontFamily: BODY_FONT,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#e87326",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 16px 0"
                }}>
                    Have Questions
                  </p>
                  <AnimatedHeading as="h2" className="uppercase" style={{
                  fontSize: "clamp(28px, 6vw, 80px)",
                  fontWeight: 700,
                  color: "#111111",
                  letterSpacing: "-1px",
                  lineHeight: 1.05,
                  margin: "0 0 20px 0"
                }}>
                    Talk to Our Team
                  </AnimatedHeading>
                  <p style={{
                  fontFamily: BODY_FONT,
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                  color: "rgba(17,17,17,0.65)",
                  lineHeight: 1.8,
                  maxWidth: "400px",
                  margin: 0
                }}>
                    Get in touch with our dedicated MSME support team today. We are here to help your business access the full range of Nkomazi SEZ opportunities and programmes.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Right column */}
          <FadeUp delay={0.12}>
            <div className="flex flex-col gap-5">
              <p style={{
              fontFamily: BODY_FONT,
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(17,17,17,0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0
            }}>
                Get in touch
              </p>
              {/* Stack vertically on mobile, row on sm+ */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <GoldButton label="Contact Our Team" height={46} href="/contact" />
                <GhostButtonDark label="Download MSME Guide" height={46} href="/contact" />
              </div>

              <div style={{
              height: "1px",
              background: "rgba(17,17,17,0.1)",
              margin: "8px 0"
            }} />

              {/* Contact emails — wrap naturally */}
              <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
                <a href="mailto:invest@nsez.gov.za" style={{
                fontFamily: BODY_FONT,
                fontSize: "14px",
                fontWeight: 500,
                color: "#C8A84B",
                textDecoration: "none",
                transition: "color 0.2s"
              }}>
                  invest@nsez.gov.za
                </a>
                <span style={{
                color: "rgba(17,17,17,0.2)",
                fontSize: "14px"
              }}>—</span>
                <a href="mailto:info@nsez.gov.za" style={{
                fontFamily: BODY_FONT,
                fontSize: "14px",
                color: "rgba(17,17,17,0.5)",
                textDecoration: "none",
                transition: "color 0.2s"
              }} onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,17,17,0.8)";
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(17,17,17,0.5)";
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

// ─── Main Export ───────────────────────────────────────────────────────────────
export function EnterpriseHubPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <div className="min-h-screen selection:bg-[#162E20] selection:text-white overflow-x-hidden" style={{
    fontFamily: BODY_FONT,
    background: "#ffffff"
  }}>
      <NSEZNavbar />
      <div style={{
      paddingTop: '36px'
    }}>
        <Hero />
      </div>
      <MetricsStrip />
      <GoldDivider />
      <MSMEProgrammes />
      <PartnerLogos />
      <GoldDivider />
      <HowToJoin />
      <GoldDivider subtle />
      <RegistrationForm />
      <GoldDivider />
      <ContactCTA />
      <GoldDivider />
      <NSEZFooterSection />
    </div>;
};