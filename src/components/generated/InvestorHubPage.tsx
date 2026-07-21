import React, { useState, useEffect, useRef } from 'react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';

import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { MapPin, Globe, Zap, ShieldCheck, Wheat, Factory, Truck, FlaskConical, Sun, Menu, X, ChevronRight, ArrowDownToLine } from 'lucide-react';

// ─── Fonts ────────────────────────────────────────────────────────────────────
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";
const GOLD = "#C9A84C";

// ─── Easing ───────────────────────────────────────────────────────────────────
const EASE_NATURAL = [0.22, 1, 0.36, 1] as const;

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_SECTORS = ['Agro-processing & Agriculture', 'Manufacturing', 'Green Economy', 'Logistics & Warehousing'];
const NAV_SIMPLE_LINKS = ['About Nkomazi SEZ', 'Invest', 'Sectors', 'MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];
interface FeatureItem {
  title: string;
  description: string;
  Icon: React.ElementType;
  image: string;
}
interface StepItem {
  number: string;
  title: string;
  description: string;
}
interface OpportunityItem {
  title: string;
  Icon: React.ElementType;
  image: string;
  description: string;
}
interface ResourceItem {
  title: string;
  description?: string;
  href: string;
  index: string;
}
interface SocialLinkItem {
  Icon: React.FC;
  label: string;
  href: string;
}
const FEATURES: FeatureItem[] = [{
  title: 'Strategic Advantage',
  description: 'Located along the Maputo Development Corridor, providing direct access to regional and international markets.',
  Icon: MapPin,
  image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1000&q=85'
}, {
  title: 'Export Gateway',
  description: 'Access to the Port of Maputo, regional border posts and multimodal transport networks. Nkomazi SEZ sits at the crossroads of the Maputo Corridor and key SADC trade routes - enabling seamless movement of goods to Mozambique, sub-Saharan Africa, and Indian Ocean ports. Your business starts with a built-in regional reach.',
  Icon: Globe,
  image: '/nsez-banner21.jpg'
}, {
  title: 'Priority Sector Opportunities',
  description: 'We have identified high-growth, high-impact sectors aligned with regional strengths and national development priorities - agro-processing, manufacturing, logistics, warehousing, and renewable energy. Each sector presents deep, undercapitalised investment potential.',
  Icon: Zap,
  image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'
}, {
  title: 'Government Partnership',
  description: 'Backed by Mpumalanga Provincial Government, the Department of Economic Development and Tourism (DEDT) and Mpumalanga Economic Growth Agency (MEGA), and national government structures. Public sector backing provides investor confidence, policy stability, and access to development finance partners',
  Icon: ShieldCheck,
  image: '/001BMP_1448.JPG'
}];
interface JourneyStep {
  number: string;
  title: string;
  description: string;
}
interface JourneyStage {
  name: string;
  color: string;
  badgeBg: string;
  hoverBg: string;
  borderColor: string;
  steps: JourneyStep[];
}
const INVESTMENT_STAGES: JourneyStage[] = [
  {
    name: "STAGE 1: Investor Enquiries",
    color: "#C8A84B", // Gold
    badgeBg: "rgba(200, 168, 75, 0.12)",
    hoverBg: "rgba(200, 168, 75, 0.08)",
    borderColor: "rgba(200, 168, 75, 0.4)",
    steps: [
      {
        number: "Step 1",
        title: "Referral or Approached Investor",
        description: "The journey begins when an investor approaches Nkomazi SEZ directly, is referred through a partner, or is proactively engaged by the Nkomazi SEZ investment team."
      },
      {
        number: "Step 2",
        title: "Initiation Meeting",
        description: "A first formal engagement to introduce Nkomazi SEZ, understand the investor's business and objectives, and explore potential alignment with the zone's sectors and opportunities."
      },
      {
        number: "Step 3",
        title: "Investor Pre-Screening Meeting",
        description: "A focused assessment of the investment proposal to evaluate viability, sector fit, and readiness before progressing to formal evaluation."
      }
    ]
  },
  {
    name: "STAGE 2: Investor Facilitation",
    color: "#1fac67", // Green
    badgeBg: "rgba(31, 172, 103, 0.12)",
    hoverBg: "rgba(31, 172, 103, 0.08)",
    borderColor: "rgba(31, 172, 103, 0.4)",
    steps: [
      {
        number: "Step 4",
        title: "Multi-Stakeholder Evaluation",
        description: "The proposal is reviewed collaboratively by relevant stakeholders to assess its strategic, economic, and developmental value to Nkomazi SEZ and the region."
      },
      {
        number: "Step 5",
        title: "SEZ Legal Unit Due Diligence",
        description: "Nkomazi SEZ's legal unit conducts thorough due diligence to verify compliance, mitigate risk, and ensure the proposal meets all regulatory and governance requirements."
      }
    ]
  },
  {
    name: "STAGE 3: Investor Approval",
    color: "#e87326", // Orange
    badgeBg: "rgba(232, 115, 38, 0.12)",
    hoverBg: "rgba(232, 115, 38, 0.08)",
    borderColor: "rgba(232, 115, 38, 0.4)",
    steps: [
      {
        number: "Step 6",
        title: "SEZ EXCO Recommendation",
        description: "The SEZ Executive Committee reviews the evaluated proposal and makes a formal recommendation for consideration by the Board."
      },
      {
        number: "Step 7",
        title: "SEZ Board Approval / Rejection",
        description: "The Nkomazi SEZ Board takes the final decision to approve or decline the investment proposal based on the full evaluation and recommendation."
      },
      {
        number: "Step 8",
        title: "Appeal / Investment Facilitation & Aftercare",
        description: "Approved investors move into facilitation and aftercare, receiving ongoing support to establish and grow. Where applicable, an appeal process is available for proposals that were not approved."
      }
    ]
  }
];
const OPPORTUNITIES: OpportunityItem[] = [{
  title: 'Agro-processing',
  Icon: Wheat,
  image: '/agro-processing.jpg',
  description: 'World-class agro-processing facilities with access to fertile Lowveld farmland, subtropical crops and export-grade logistics infrastructure.'
}, {
  title: 'Manufacturing',
  Icon: Factory,
  image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1400&q=85',
  description: 'Custom-built manufacturing platforms with direct access to SADC markets, preferential duty structures and competitive utility costs.'
}, {
  title: 'Logistics & Warehousing',
  Icon: Truck,
  image: '/warehousing.jpg',
  description: 'Strategic freight and warehousing hub positioned at the intersection of the Maputo Corridor and the N4 trade route.'
}, {
  title: 'Nutraceuticals',
  Icon: FlaskConical,
  image: '/Neutraceuticals.jpg',
  description: 'High-value nutraceutical and pharmaceutical processing leveraging regional botanical resources and regulatory support.'
}, {
  title: 'Renewable Energy',
  Icon: Sun,
  image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1400&q=85',
  description: 'Solar, biomass and hybrid energy projects within a policy-backed green economy framework with grid connection support.'
}];
const RESOURCES: ResourceItem[] = [{
  index: '01',
  title: 'Investment Prospectus',
  href: '#'
}, {
  index: '02',
  title: 'Investor Guide',
  description: 'Step-by-step guidance on the Nkomazi SEZ application process, compliance requirements, and operational standards for investors and tenants.',
  href: '#'
}, {
  index: '03',
  title: 'Incentives Guide',
  description: 'Detailed information on the SEZ incentive framework, tax benefits, customs advantages, and how to qualify and apply.',
  href: '#'
}, {
  index: '04',
  title: 'FAQs',
  description: 'Answers to the most common questions from investors about Nkomazi SEZ processes, eligibility, timelines, and operational requirements.',
  href: '#'
}, {
  index: '05',
  title: 'Application Forms',
  href: '#'
}];

// ─── Social Icons ─────────────────────────────────────────────────────────────
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

// ─── Custom SVG Icons ─────────────────────────────────────────────────────────
const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
  <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
  <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
</svg>;

// ─── Utility Components ───────────────────────────────────────────────────────
const GoldDivider = () => <div style={{
  height: '1px',
  background: 'rgba(200,168,75,0.4)',
  width: '100%'
}} />;
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
    y: 32
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.7,
    delay,
    ease: EASE_NATURAL
  }} className={className}>
    {children}
  </motion.div>;
};
const AnimatedHeading = ({
  eyebrow,
  heading,
  eyebrowColor = '#C9A84C',
  headingColor = '#ffffff',
  delay = 0
}: {
  eyebrow: string;
  heading: string;
  eyebrowColor?: string;
  headingColor?: string;
  delay?: number;
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
    duration: 0.7,
    delay,
    ease: EASE_NATURAL
  }}>
    <div style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: eyebrowColor,
      marginBottom: '14px'
    }}>
      {eyebrow}
    </div>
    <h2 style={{
      fontFamily: HEADING_FONT,
      fontSize: 'clamp(32px, 5vw, 72px)',
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-1px',
      color: headingColor,
      margin: 0,
      textTransform: 'uppercase'
    }}>
      {heading}
    </h2>
  </motion.div>;
};

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
  className="group flex h-[46px] items-stretch no-underline relative overflow-hidden rounded-lg"
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.25,
    ease: EASE_NATURAL
  }}
>
    <div className="flex items-center justify-center px-5 text-white overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      fontSize: '15px',
      fontWeight: 500,
      background: '#1fac67'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[46px] text-white rounded-r-lg flex-shrink-0" style={{
      background: '#1fac67'
    }}>
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
  className="group flex h-[46px] items-stretch no-underline relative overflow-hidden rounded-lg"
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.25,
    ease: EASE_NATURAL
  }}
>
    <div className="flex items-center justify-center px-5 text-white overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      fontSize: '15px',
      fontWeight: 500,
      background: '#E8521A'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[46px] text-white rounded-r-lg flex-shrink-0" style={{
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
  className="group flex h-[46px] items-stretch no-underline relative overflow-hidden rounded-lg"
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.25,
    ease: EASE_NATURAL
  }}
>
    <div className="flex items-center justify-center px-5 text-white overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      fontSize: '15px',
      fontWeight: 500,
      background: 'transparent',
      border: '1.5px solid rgba(255,255,255,0.55)',
      borderRight: 'none'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[46px] text-white rounded-r-lg flex-shrink-0" style={{
      background: 'transparent',
      border: '1.5px solid rgba(255,255,255,0.55)',
      borderLeft: 'none'
    }}>
      <ArrowRightIcon />
    </div>
  </motion.a>;

const GhostButtonDark = ({
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
  className="group flex h-[46px] items-stretch no-underline relative overflow-hidden rounded-lg"
  whileHover={{
    y: -2,
    scale: 1.015
  }}
  whileTap={{
    scale: 0.97
  }}
  transition={{
    duration: 0.25,
    ease: EASE_NATURAL
  }}
>
    <div className="flex items-center justify-center px-5 overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      fontSize: '15px',
      fontWeight: 500,
      color: '#111111',
      background: 'transparent',
      border: '1.5px solid rgba(17,17,17,0.55)',
      borderRight: 'none'
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[46px] rounded-r-lg flex-shrink-0" style={{
      color: '#111111',
      background: 'transparent',
      border: '1.5px solid rgba(17,17,17,0.55)',
      borderLeft: 'none'
    }}>
      <ArrowRightIcon />
    </div>
  </motion.a>;



// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const {
    scrollY
  } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);
  const scrollOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const contentOpacity = isMobile ? 1 : scrollOpacity;
  const scrollProgress = useTransform(scrollY, [0, 600], [0, 100]);
  const springProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30
  });
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
          backgroundImage: 'url("https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1800&q=85")',
          backgroundPosition: 'center 55%',
          backgroundSize: 'cover'
        }} />
      </motion.div>
    </div>

    {/* Diagonal line pattern overlay */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
      zIndex: 0,
      backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 28px, rgba(255,255,255,0.028) 28px, rgba(255,255,255,0.028) 29px)`
    }} />

    {/* Top dark overlay */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to bottom, rgba(8,22,14,0.85) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)',
      zIndex: 1
    }} />
    {/* Bottom dark overlay */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)',
      zIndex: 1
    }} />

    {/* Ghost NSEZ watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{
      zIndex: 0
    }}>
      <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(120px, 28vw, 380px)',
        color: 'rgba(255,255,255,0.03)',
        lineHeight: 1,
        userSelect: 'none',
        letterSpacing: '-0.04em'
      }}>
        NKOMAZI SEZ
      </span>
    </div>

    {/* Main hero content */}
    <motion.div className="relative w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-32 sm:pt-0" style={{
      bottom: 'clamp(40px, 7vh, 72px)',
      opacity: contentOpacity,
      zIndex: 2
    }}>
      {/* Breadcrumb */}
      <motion.div initial={{
        opacity: 0,
        y: 8
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4,
        delay: 0.15,
        ease: 'easeOut'
      }} className="flex items-center gap-3 mb-3 sm:mb-4" style={{
        fontFamily: BODY_FONT,
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.1em'
      }}>
        <span>Home</span>
        <ChevronRight size={12} />
        <span style={{
          color: GOLD
        }}>Investor Hub</span>
      </motion.div>

      {/* Main heading */}
      <div style={{
        overflow: 'hidden',
        lineHeight: 1.05,
        marginBottom: '20px',
        maxWidth: '900px'
      }}>
        <motion.h1 initial={{
          y: '105%',
          opacity: 0
        }} animate={{
          y: '0%',
          opacity: 1
        }} transition={{
          duration: 0.8,
          delay: 0.25,
          ease: EASE_NATURAL
        }} style={{
          fontFamily: HEADING_FONT,
          fontSize: 'clamp(32px, 6vw, 80px)',
          lineHeight: 1.05,
          letterSpacing: '-1px',
          fontWeight: 700,
          color: '#ffffff',
          textTransform: 'uppercase',
          margin: 0
        }}>
          Why Invest in Nkomazi SEZ
        </motion.h1>
      </div>

      <motion.p initial={{
        opacity: 0,
        y: 14
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.55,
        ease: 'easeOut'
      }} style={{
        fontFamily: BODY_FONT,
        fontSize: 'clamp(13px, 1.5vw, 15px)',
        lineHeight: '1.8',
        color: 'rgba(255,255,255,0.68)',
        margin: 0,
        marginBottom: '28px',
        fontWeight: 300,
        maxWidth: '500px'
      }}>
        A strategically positioned Special Economic Zone in the heart of Mpumalanga, driving investment, industrialisation and sustainable economic growth.
      </motion.p>

      <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.70,
        ease: 'easeOut'
      }} className="flex flex-wrap gap-3">
        <GoldButton label="Explore Investment Opportunities" href="/sectors" />
        <GhostButton label="Speak to Our Team" href="/contact" />
      </motion.div>
    </motion.div>

    {/* Scroll progress bar */}
    <div className="absolute bottom-0 left-0 right-0" style={{
      height: '2px',
      background: 'rgba(200,168,75,0.12)',
      zIndex: 10
    }}>
      <motion.div style={{
        height: '100%',
        background: 'linear-gradient(90deg, #C8A84B, #E8B84B)',
        width: springProgress.get() + '%',
        originX: 0
      }} animate={{
        width: `${Math.min(springProgress.get(), 100)}%`
      }} />
    </div>
  </section>;
};

// ─── Why Invest Section ───────────────────────────────────────────────────────
const WhyInvestSection = () => {
  return <section style={{
    background: '#FAFAF8',
    paddingTop: 'clamp(48px, 8vw, 96px)',
    paddingBottom: 'clamp(48px, 8vw, 96px)'
  }}>
    <GoldDivider />
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-6 sm:gap-4">
        <AnimatedHeading eyebrow="Investment Case" heading="Why Invest in Nkomazi SEZ" eyebrowColor="#e87326" headingColor="#111111" />
        <FadeUp delay={0.1}>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#667',
            maxWidth: '340px',
            margin: 0
          }}>
            A convergence of location, policy, and sector opportunity unlike anything else in southern Africa.
          </p>
        </FadeUp>
      </div>

      {/* Responsive grid: 1-col mobile → 2-col tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {FEATURES.map((feature, idx) => <FadeUp key={feature.title} delay={idx * 0.08}>
          <div style={{
            borderRadius: '14px',
            overflow: 'hidden',
            position: 'relative',
            height: 'clamp(240px, 30vw, 320px)',
            cursor: 'default',
            borderLeft: '3px solid transparent',
            transition: 'border-left-color 0.25s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            transformOrigin: 'center center',
            width: '100%'
          }} className="group" onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderLeftColor = '#C8A84B';
            el.style.transform = 'scale(1.03)';
          }} onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderLeftColor = 'transparent';
            el.style.transform = 'scale(1)';
          }}>
            {/* Background image */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("${feature.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
            }} className="group-hover:scale-[1.04]" />
            {/* Dark gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
            }} />
            {/* Content at bottom */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 'clamp(20px, 3vw, 32px) clamp(20px, 3vw, 36px)'
            }}>
              <h3 style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(20px, 2.5vw, 26px)',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                marginBottom: '8px',
                letterSpacing: '-0.3px',
                lineHeight: 1.05
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: 'clamp(12px, 1.2vw, 13px)',
                lineHeight: '1.8',
                color: 'rgba(255,255,255,0.82)',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          </div>
        </FadeUp>)}
      </div>
    </div>
  </section>;
};

// ─── Investment Journey Section ───────────────────────────────────────────────
const JourneySection = () => {
  return <section style={{
    background: '#0A1810',
    paddingTop: 'clamp(48px, 8vw, 96px)',
    paddingBottom: 'clamp(48px, 8vw, 96px)'
  }}>
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
        <AnimatedHeading eyebrow="Evaluation & Approval Process" heading="Your Path to Investing in Nkomazi SEZ" eyebrowColor="#C9A84C" headingColor="#ffffff" />
        <FadeUp delay={0.1}>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '14px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: 0
          }}>
            All investment proposals follow a structured 8-step evaluation and approval process, organised across three clear stages. This ensures every investment is properly assessed, supported, and positioned for long-term success within the zone.
          </p>
        </FadeUp>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {INVESTMENT_STAGES.map((stage, stageIdx) => (
          <FadeUp key={stage.name} delay={stageIdx * 0.1} className="flex flex-col">
            {/* Stage Header */}
            <div
              className="mb-6 pb-4 border-b"
              style={{
                borderColor: stage.borderColor
              }}
            >
              <h3
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: '24px',
                  fontWeight: 700,
                  color: stage.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: 0,
                }}
              >
                {stage.name}
              </h3>
            </div>

            {/* Steps inside Stage */}
            <div className="flex flex-col gap-4 flex-1">
              {stage.steps.map((step) => (
                <div
                  key={step.number}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = stage.hoverBg;
                    e.currentTarget.style.borderColor = stage.borderColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                  className="group"
                >
                  <div className="flex items-start gap-4">
                    {/* Step Badge */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: stage.badgeBg,
                        border: `1.5px solid ${stage.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: HEADING_FONT,
                          fontWeight: 900,
                          fontSize: '14px',
                          color: stage.color,
                          lineHeight: 1,
                        }}
                      >
                        {step.number.replace('Step ', '')}
                      </span>
                    </div>

                    {/* Step Text */}
                    <div className="flex-1">
                      <h4
                        style={{
                          fontFamily: HEADING_FONT,
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#ffffff',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.1px',
                          marginBottom: '6px',
                        }}
                      >
                        {step.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: '13px',
                          lineHeight: '1.7',
                          color: 'rgba(255,255,255,0.6)',
                          margin: 0,
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>;
};

// ─── Opportunities Section ─────────────────────────────────────────────────────
const OpportunitiesSection = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  return <section style={{
    background: '#ffffff',
    paddingTop: 'clamp(48px, 8vw, 96px)',
    paddingBottom: 'clamp(48px, 8vw, 96px)'
  }}>
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-6 sm:gap-4">
        <AnimatedHeading eyebrow="Priority Sectors" heading="Investment Opportunities" eyebrowColor="#e87326" headingColor="#111111" />
        <FadeUp delay={0.1}>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#667',
            maxWidth: '320px',
            margin: 0
          }}>
            Five high-potential sectors aligned with regional strengths and national development priorities.
          </p>
        </FadeUp>
      </div>
    </div>

    {/* Desktop: horizontal accordion (full row) */}
    <div className="hidden lg:flex px-4 sm:px-6 lg:px-8 max-w-[1372px] mx-auto gap-3 w-full" style={{
      height: 'clamp(380px, 35vw, 480px)'
    }}>
      {OPPORTUNITIES.map((opp, idx) => {
        const isExpanded = hoveredIdx === idx;
        return <div key={opp.title} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)} style={{
          flex: isExpanded ? 4 : 1,
          transition: 'flex 0.4s ease',
          borderRadius: '14px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          minWidth: 0
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${opp.image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.55s ease'
          }} />
          {/* Dark overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.25) 100%)'
          }} />

          {/* Collapsed: rotated title */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isExpanded ? 0 : 1,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none'
          }}>
            <span style={{
              fontFamily: HEADING_FONT,
              fontSize: '15px',
              fontWeight: 700,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              whiteSpace: 'nowrap'
            }}>
              {opp.title}
            </span>
          </div>

          {/* Expanded content */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '28px 28px',
            opacity: isExpanded ? 1 : 0,
            transition: 'opacity 0.3s ease 0.1s',
            pointerEvents: isExpanded ? 'auto' : 'none'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(200,168,75,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <opp.Icon style={{
                color: '#ffffff',
                width: '18px',
                height: '18px'
              }} />
            </div>
            <h4 style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(22px, 2.5vw, 28px)',
              fontWeight: 700,
              color: '#ffffff',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '10px',
              lineHeight: 1.05
            }}>
              {opp.title}
            </h4>
            <p style={{
              fontFamily: BODY_FONT,
              fontSize: '13px',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.78)',
              margin: 0,
              marginBottom: '18px'
            }}>
              {opp.description}
            </p>
            <div className="flex items-center gap-2" style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              <span>Explore Sector</span>
              <ArrowRightIcon />
            </div>
          </div>

          {/* Sector label in expanded top */}
          <div style={{
            position: 'absolute',
            top: '22px',
            left: '28px',
            opacity: isExpanded ? 1 : 0,
            transition: 'opacity 0.3s ease 0.1s'
          }}>
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Sector
            </span>
          </div>
        </div>;
      })}
    </div>

    {/* Tablet: 2-column grid */}
    <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3 px-4 sm:px-6 max-w-[1372px] mx-auto mt-2">
      {OPPORTUNITIES.map(opp => <a key={opp.title} href="#" onClick={e => e.preventDefault()} className="group block no-underline" style={{
        borderRadius: '14px',
        overflow: 'hidden',
        height: '300px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${opp.image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.45s ease'
        }} className="group-hover:scale-[1.04]" />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 100%)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(200,168,75,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <opp.Icon style={{
              color: '#ffffff',
              width: '16px',
              height: '16px'
            }} />
          </div>
          <h4 style={{
            fontFamily: HEADING_FONT,
            fontSize: '22px',
            fontWeight: 700,
            color: '#ffffff',
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: '6px'
          }}>
            {opp.title}
          </h4>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '12px',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.75)',
            margin: 0
          }}>
            {opp.description}
          </p>
        </div>
      </a>)}
    </div>

    {/* Mobile: single-column */}
    <div className="flex flex-col gap-3 sm:hidden px-4 mt-2">
      {OPPORTUNITIES.map(opp => <a key={opp.title} href="#" onClick={e => e.preventDefault()} className="group block no-underline" style={{
        borderRadius: '14px',
        overflow: 'hidden',
        height: '220px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${opp.image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 100%)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px'
        }}>
          <h4 style={{
            fontFamily: HEADING_FONT,
            fontSize: '22px',
            fontWeight: 700,
            color: '#ffffff',
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: '6px'
          }}>
            {opp.title}
          </h4>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '12px',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.75)',
            margin: 0
          }}>
            {opp.description}
          </p>
        </div>
      </a>)}
    </div>
  </section>;
};

// ─── Resources Section ────────────────────────────────────────────────────────
const ResourcesSection = () => {
  return <section style={{
    background: '#FAFAF8',
    paddingTop: 'clamp(48px, 8vw, 96px)',
    paddingBottom: 'clamp(48px, 8vw, 96px)'
  }}>
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-16 gap-6 sm:gap-4">
        <AnimatedHeading eyebrow="Downloads & Guides" heading="Investor Resources" eyebrowColor="#e87326" headingColor="#111111" />
        <FadeUp delay={0.1}>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#667',
            maxWidth: '320px',
            margin: 0
          }}>
            A library of investor-focused documents designed to support informed decision-making at every stage.
          </p>
        </FadeUp>
      </div>

      <div className="flex flex-col">
        {RESOURCES.map((resource, idx) => <FadeUp key={resource.title} delay={idx * 0.07}>
          <div style={{
            borderTop: idx === 0 ? '1px solid rgba(29,77,53,0.12)' : 'none',
            borderBottom: '1px solid rgba(29,77,53,0.12)'
          }}>
            <a href={resource.href} onClick={e => e.preventDefault()} className="group no-underline py-6 sm:py-8 gap-4 sm:gap-8" style={{
              color: 'inherit',
              display: 'flex',
              alignItems: 'flex-start',
              borderRadius: '8px',
              transition: 'background 0.2s ease'
            }} onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,168,75,0.08)';
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            }}>
              {/* Index number */}
              <div style={{
                fontFamily: HEADING_FONT,
                fontWeight: 900,
                fontSize: 'clamp(32px, 5vw, 64px)',
                color: 'rgba(200,168,75,0.18)',
                lineHeight: 1,
                flexShrink: 0,
                width: 'clamp(52px, 6vw, 80px)',
                transition: 'color 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
              }} className="group-hover:[color:rgba(200,168,75,0.38)]">
                {resource.index}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 min-w-0">
                <h3 style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 'clamp(18px, 2.8vw, 32px)',
                  fontWeight: 700,
                  color: '#1D4D35',
                  textTransform: 'uppercase',
                  margin: 0,
                  marginBottom: resource.description ? '8px' : 0,
                  letterSpacing: '-0.3px',
                  lineHeight: 1.1,
                  transition: 'color 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
                }} className="group-hover:[color:#1fac67]">
                  {resource.title}
                </h3>
                {resource.description && <p style={{
                  fontFamily: BODY_FONT,
                  fontSize: '13px',
                  lineHeight: '1.75',
                  color: '#667',
                  margin: 0,
                  maxWidth: '560px'
                }}>
                  {resource.description}
                </p>}
              </div>

              {/* Download icon */}
              <div className="flex-shrink-0 flex items-center justify-center self-center" style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1.5px solid rgba(29,77,53,0.18)',
                color: '#1D4D35',
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
              }} onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#1fac67';
                el.style.color = '#1fac67';
                el.style.background = 'rgba(31,172,103,0.06)';
              }} onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(29,77,53,0.18)';
                el.style.color = '#1D4D35';
                el.style.background = 'transparent';
              }}>
                <ArrowDownToLine size={16} style={{
                  display: 'block'
                }} />
              </div>
            </a>
          </div>
        </FadeUp>)}
      </div>
    </div>
  </section>;
};

// ─── CTA Section ─────────────────────────────────────────────────────────────
const CTASection = () => {
  return <section style={{
    background: '#F8F7F0',
    paddingTop: 'clamp(48px, 8vw, 96px)',
    paddingBottom: 'clamp(48px, 8vw, 96px)',
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
      overflow: 'hidden'
    }}>
      <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(80px, 22vw, 300px)',
        color: 'rgba(17,17,17,0.03)',
        lineHeight: 1,
        letterSpacing: '-0.04em'
      }}>
        INVEST
      </span>
    </div>

    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8" style={{
      position: 'relative',
      zIndex: 1
    }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left column */}
        <FadeUp>
          <div className="flex gap-6 sm:gap-8 items-start">
            {/* Vertical gold line */}
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
                Investment Gateway
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
                marginBottom: '20px'
              }}>
                Investment Gateway
              </h2>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: 'clamp(13px, 1.5vw, 15px)',
                color: 'rgba(17,17,17,0.65)',
                lineHeight: '1.8',
                margin: 0,
                maxWidth: '400px'
              }}>
                Connect with our investment facilitation team and take the first step toward establishing your business in Nkomazi SEZ.
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
                <GoldButton label="Explore Investment Opportunities" href="/sectors" />
                <GhostButtonDark label="Contact Our Team" href="/contact" />
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



// ─── Hero Scroll Bar ──────────────────────────────────────────────────────────
const HeroScrollBar = () => {
  const {
    scrollY
  } = useScroll();
  const [heroHeight, setHeroHeight] = useState(0);
  const progressWidth = useTransform(scrollY, [0, heroHeight || 800], [0, 100]);
  const springWidth = useSpring(progressWidth, {
    stiffness: 120,
    damping: 30
  });
  useEffect(() => {
    const updateHeight = () => setHeroHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  return <div style={{
    height: '2px',
    background: 'rgba(200,168,75,0.12)',
    width: '100%'
  }}>
    <motion.div style={{
      height: '100%',
      background: 'linear-gradient(90deg, #C8A84B, #f0c860)',
      scaleX: springWidth,
      originX: 0,
      transformOrigin: 'left'
    }} />
  </div>;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export function InvestorHubPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const _mv = useMotionValue(0);
  void _mv;
  return <div className="w-full min-h-screen bg-white overflow-x-hidden" style={{
    fontFamily: BODY_FONT
  }}>
    <NSEZNavbar />

    <div style={{
      paddingTop: '36px'
    }}>
      <Hero />
    </div>

    <HeroScrollBar />
    <WhyInvestSection />
    <GoldDivider />
    <JourneySection />
    <GoldDivider />
    <OpportunitiesSection />
    <GoldDivider />
    <ResourcesSection />
    <CTASection />
    <NSEZFooterSection />
  </div>;
};