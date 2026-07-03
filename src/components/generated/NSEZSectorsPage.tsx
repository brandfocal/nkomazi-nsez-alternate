import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Sprout, Factory, Truck, Zap, FlaskConical, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';

// ─── Font Constants ────────────────────────────────────────────────────────────
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── Data ──────────────────────────────────────────────────────────────────────

const NAV_SECTORS = ['Agro-processing', 'Manufacturing', 'Green Economy', 'Logistics and Warehousing'];
const NAV_LEFT_LINKS = ['About Nkomazi SEZ', 'Invest'];
const NAV_RIGHT_LINKS = ['MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];
const NAV_ALL_LINKS = ['About Nkomazi SEZ', 'Invest', 'Sectors', 'MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];
const SOCIAL_ICON_ITEMS = [{
  label: 'Instagram',
  href: 'https://www.instagram.com/nkomazisez/',
  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 20 20" fill="none">
    <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891ZM10.0017 1.66797C7.73884 1.66797 7.45558 1.67774 6.56673 1.71681C5.68114 1.75588 5.0723 1.89913 4.54485 2.10425C3.99462 2.31914 3.52903 2.6024 3.0667 3.06798C2.60111 3.53031 2.31786 3.9959 2.10297 4.54288C1.89785 5.07358 1.75459 5.67917 1.71552 6.56476C1.67645 7.45686 1.66669 7.74012 1.66669 10.0029C1.66669 12.2657 1.67645 12.549 1.71552 13.4378C1.75459 14.3234 1.89785 14.9323 2.10297 15.4597C2.31786 16.01 2.60111 16.4756 3.0667 16.9379C3.52903 17.4002 3.99462 17.6867 4.5416 17.8984C5.0723 18.1035 5.67789 18.2467 6.56348 18.2858C7.45232 18.3249 7.73558 18.3346 9.99839 18.3346C12.2612 18.3346 12.5445 18.3249 13.4333 18.2858C14.3189 18.2467 14.9277 18.1035 15.4552 17.8984C16.0022 17.6867 16.4678 17.4002 16.9301 16.9379C17.3924 16.4756 17.6789 16.01 17.8906 15.463C18.0957 14.9323 18.2389 14.3267 18.278 13.4411C18.3171 12.5523 18.3268 12.269 18.3268 10.0062C18.3268 7.74338 18.3171 7.46012 18.278 6.57127C18.2389 5.68568 18.0957 5.07684 17.8906 4.54939C17.6854 3.9959 17.4022 3.53031 16.9366 3.06798C16.4743 2.60565 16.0087 2.31914 15.4617 2.10751C14.931 1.90239 14.3254 1.75913 13.4398 1.72006C12.5477 1.67774 12.2645 1.66797 10.0017 1.66797Z" fill="currentColor" />
    <path d="M10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215ZM10.0016 12.7802C8.46815 12.7802 7.22441 11.5364 7.22441 10.0029C7.22441 8.46943 8.46815 7.2257 10.0016 7.2257C11.5352 7.2257 12.7789 8.46943 12.7789 10.0029C12.7789 11.5364 11.5352 12.7802 10.0016 12.7802Z" fill="currentColor" />
    <path d="M15.4519 5.55216C15.4519 6.10566 15.0026 6.55171 14.4524 6.55171C13.8989 6.55171 13.4528 6.1024 13.4528 5.55216C13.4528 4.99867 13.9022 4.55262 14.4524 4.55262C15.0026 4.55262 15.4519 5.00192 15.4519 5.55216Z" fill="currentColor" />
  </svg>
}, {
  label: 'Facebook',
  href: 'https://web.facebook.com/people/Nkomazi-SEZ/61586568002498/',
  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 20 20" fill="none">
    <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008 12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" fill="currentColor" />
  </svg>
}, {
  label: 'YouTube',
  href: 'https://www.youtube.com/@NkomaziSEZ',
  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 20 20" fill="none">
    <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841 10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" fill="currentColor" />
  </svg>
}, {
  label: 'LinkedIn',
  href: 'https://www.linkedin.com/company/nkomazi-special-economic-zone/',
  Icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 17 18" fill="none">
    <path d="M15.5996 0.666626H1.39716C0.716817 0.666626 0.166687 1.20374 0.166687 1.8678V16.1289C0.166687 16.7929 0.716817 17.3333 1.39716 17.3333H15.5996C16.28 17.3333 16.8334 16.7929 16.8334 16.1321V1.8678C16.8334 1.20374 16.28 0.666626 15.5996 0.666626ZM5.11135 14.8691H2.63739V6.91337H5.11135V14.8691ZM3.87437 5.82939C3.0801 5.82939 2.43882 5.18811 2.43882 4.39709C2.43882 3.60608 3.0801 2.9648 3.87437 2.9648C4.66539 2.9648 5.30666 3.60608 5.30666 4.39709C5.30666 5.18486 4.66539 5.82939 3.87437 5.82939ZM14.3692 14.8691H11.8985V11.0019C11.8985 10.0807 11.8822 8.89254 10.6127 8.89254C9.32684 8.89254 9.13153 9.8984 9.13153 10.9368V14.8691H6.66408V6.91337H9.03387V8.00061H9.06643C9.3952 7.37561 10.2025 6.7148 11.4037 6.7148C13.9069 6.7148 14.3692 8.36194 14.3692 10.5039V14.8691Z" fill="currentColor" />
  </svg>
}];
const SECTORS = [{
  id: '01',
  title: 'Agro-processing and Agriculture',
  description: "Mpumalanga's agricultural output, from subtropical fruits and vegetables to livestock and grain, creates a natural supply chain advantage for value-added agro-processing. Leverage Mpumalanga's strong agricultural base, climate advantages and proximity to export routes through value-added agro-processing, cold chain logistics and food manufacturing opportunities.",
  details: [{
    label: 'Sector Overview',
    content: "Capitalizing on the region's diverse micro-climates and rich soil."
  }, {
    label: 'Value Chain Opportunities',
    content: 'Processing hubs, packaging facilities, and quality control labs.'
  }, {
    label: 'Investment Opportunities',
    content: 'Subtropical fruit export, grain milling, and livestock processing.'
  }, {
    label: 'Supporting Infrastructure',
    content: 'Dedicated cold storage facilities and high-speed rail links.'
  }],
  image: '/agro-processing.jpg',
  icon: Sprout,
  color: '#1fac67'
}, {
  id: '02',
  title: 'Manufacturing',
  description: 'Access strategic industrial development opportunities supported by serviced land, utilities infrastructure, logistics connectivity and a growing regional supply chain. From light manufacturing to specialised industrial production, Nkomazi SEZ provides a competitive base for building for Africa.',
  details: [{
    label: 'Sector Overview',
    content: 'High-growth manufacturing zone with world-class utilities.'
  }, {
    label: 'Value Chain Opportunities',
    content: 'Component assembly, textile manufacturing, and heavy industry.'
  }, {
    label: 'Investment Opportunities',
    content: 'Greenfield industrial developments and specialized production plants.'
  }, {
    label: 'Supporting Infrastructure',
    content: 'Reliable industrial power grid and specialized water treatment.'
  }],
  image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=2000&auto=format&fit=crop',
  icon: Factory,
  color: '#E8521A'
}, {
  id: '03',
  title: 'Logistics and Warehousing',
  description: "Benefit from Nkomazi SEZ's position on the Maputo Corridor, with customs facilitation, warehousing opportunities and direct access to the Port of Maputo and SADC markets. Proximity to the Maputo Corridor, one of the busiest freight routes in Southern Africa, positions Nkomazi SEZ as a natural logistics and distribution hub.",
  details: [{
    label: 'Sector Overview',
    content: 'Strategic gateway to Southern African markets.'
  }, {
    label: 'Value Chain Opportunities',
    content: 'Intermodal transport, freight forwarding, and customs agency services.'
  }, {
    label: 'Investment Opportunities',
    content: 'Grade A warehousing, container terminals, and distribution centers.'
  }, {
    label: 'Supporting Infrastructure',
    content: 'Integrated customs systems and 24/7 security monitored transport lanes.'
  }],
  image: '/warehousing.jpg',
  icon: Truck,
  color: '#C9A84C'
}, {
  id: '04',
  title: 'Green Economy',
  description: "Explore investment opportunities in renewable energy generation, green hydrogen, energy storage and sustainable industrial infrastructure aligned with South Africa's energy transition agenda. Nkomazi SEZ actively supports green economy investment as part of its long-term industrial vision.",
  details: [{
    label: 'Sector Overview',
    content: 'A future-proofed industrial ecosystem focused on sustainability.'
  }, {
    label: 'Value Chain Opportunities',
    content: 'Solar PV manufacturing, EV battery assembly, and waste-to-energy.'
  }, {
    label: 'Investment Opportunities',
    content: 'Private microgrids and large-scale renewable utility projects.'
  }, {
    label: 'Supporting Infrastructure',
    content: 'EV charging networks and specialized green hydrogen storage pipelines.'
  }],
  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2000&auto=format&fit=crop',
  icon: Zap,
  color: '#1fac67'
}, {
  id: '05',
  title: 'Nutraceuticals',
  description: "A high-growth emerging sector leveraging Mpumalanga's agricultural abundance to produce health-focused, value-added products for regional and export markets. Nkomazi SEZ provides the research and production environment needed to lead in this high-value global market.",
  details: [{
    label: 'Sector Overview',
    content: 'Combining biotech innovation with traditional agricultural strength.'
  }, {
    label: 'Value Chain Opportunities',
    content: 'Extraction labs, pharmaceutical-grade packaging, and R&D facilities.'
  }, {
    label: 'Investment Opportunities',
    content: 'Supplements, functional foods, and medicinal plant extracts.'
  }, {
    label: 'Supporting Infrastructure',
    content: 'Incubators for biotech startups and clean-room production facilities.'
  }],
  image: '/Neutraceuticals.jpg',
  icon: FlaskConical,
  color: '#E8521A'
}];
const FOOTER_EXPLORE_LINKS = [{
  label: 'About Nkomazi SEZ',
  href: '#'
}, {
  label: 'Why Invest',
  href: '#'
}, {
  label: 'Priority Sectors',
  href: '#'
}, {
  label: 'Investor Hub',
  href: '#'
}];
const FOOTER_QUICK_LINKS = [{
  label: 'Investment Process',
  href: '#'
}, {
  label: 'Resources',
  href: '#'
}, {
  label: 'Partners',
  href: '#'
}, {
  label: 'Contact',
  href: '#'
}];
const HERO_PARTICLES = [{
  id: 'p1',
  size: 6,
  x: 12,
  delay: 0,
  duration: 14,
  color: 'rgba(93,187,58,0.12)'
}, {
  id: 'p2',
  size: 4,
  x: 28,
  delay: 2.5,
  duration: 18,
  color: 'rgba(200,168,75,0.08)'
}, {
  id: 'p3',
  size: 8,
  x: 45,
  delay: 1.2,
  duration: 16,
  color: 'rgba(93,187,58,0.10)'
}, {
  id: 'p4',
  size: 5,
  x: 62,
  delay: 3.8,
  duration: 20,
  color: 'rgba(200,168,75,0.07)'
}, {
  id: 'p5',
  size: 7,
  x: 78,
  delay: 0.8,
  duration: 15,
  color: 'rgba(93,187,58,0.09)'
}, {
  id: 'p6',
  size: 4,
  x: 88,
  delay: 4.5,
  duration: 17,
  color: 'rgba(200,168,75,0.10)'
}, {
  id: 'p7',
  size: 6,
  x: 20,
  delay: 6.0,
  duration: 19,
  color: 'rgba(93,187,58,0.08)'
}, {
  id: 'p8',
  size: 5,
  x: 55,
  delay: 7.2,
  duration: 13,
  color: 'rgba(200,168,75,0.09)'
}, {
  id: 'p9',
  size: 8,
  x: 70,
  delay: 2.0,
  duration: 21,
  color: 'rgba(93,187,58,0.11)'
}, {
  id: 'p10',
  size: 4,
  x: 35,
  delay: 5.5,
  duration: 16,
  color: 'rgba(200,168,75,0.08)'
}];
const HERO_STATS = [{
  label: 'Priority Sectors',
  value: 5,
  suffix: '',
  prefix: ''
}, {
  label: 'Investment Pipeline',
  value: 20,
  suffix: 'B+',
  prefix: 'ZAR '
}, {
  label: 'Estimated Jobs',
  value: 15,
  suffix: 'k+',
  prefix: ''
}, {
  label: 'Ha Available Land',
  value: 800,
  suffix: '+',
  prefix: ''
}];

// ─── Icon Components ────────────────────────────────────────────────────────────

const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
  <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
  <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
</svg>;

// ─── Button Components ─────────────────────────────────────────────────────────

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
  onMouseEnter={e => {
    const el = e.currentTarget as HTMLAnchorElement;
    const left = el.querySelector('.ghost-dark-left') as HTMLDivElement;
    const right = el.querySelector('.ghost-dark-right') as HTMLDivElement;
    if (left) {
      left.style.borderColor = '#C8A84B';
      left.style.color = '#C8A84B';
    }
    if (right) {
      right.style.borderColor = '#C8A84B';
      right.style.color = '#C8A84B';
    }
  }}
  onMouseLeave={e => {
    const el = e.currentTarget as HTMLAnchorElement;
    const left = el.querySelector('.ghost-dark-left') as HTMLDivElement;
    const right = el.querySelector('.ghost-dark-right') as HTMLDivElement;
    if (left) {
      left.style.borderColor = 'rgba(17,17,17,0.25)';
      left.style.color = '#111111';
    }
    if (right) {
      right.style.borderColor = 'rgba(17,17,17,0.25)';
      right.style.color = '#111111';
    }
  }}
>
    <div className="ghost-dark-left flex items-center justify-center px-5 overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      fontSize: '15px',
      fontWeight: 500,
      color: '#111111',
      background: 'transparent',
      border: '1.5px solid rgba(17,17,17,0.25)',
      borderRight: 'none',
      transition: 'border-color 0.2s, color 0.2s'
    }}>
      {label}
    </div>
    <div className="ghost-dark-right flex items-center justify-center w-[44px] rounded-r-lg flex-shrink-0" style={{
      color: '#111111',
      background: 'transparent',
      border: '1.5px solid rgba(17,17,17,0.25)',
      borderLeft: 'none',
      transition: 'border-color 0.2s, color 0.2s'
    }}>
      <ArrowRightIcon />
    </div>
  </motion.a>;

// ─── FadeUp helper ─────────────────────────────────────────────────────────────

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
    duration: 0.55,
    delay,
    ease: 'easeOut'
  }} className={className}>
    {children}
  </motion.div>;
};

// ─── Section Heading Component ─────────────────────────────────────────────────

const SectionHeading = ({
  eyebrow,
  title,
  light = false
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
}) => <div className="flex flex-col gap-3 mb-12">
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.18em',
      textTransform: 'uppercase' as const,
      color: '#1fac67'
    }}>{eyebrow}</span>
    <div>
      <h2 style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(28px, 4vw, 48px)',
        color: light ? '#ffffff' : '#1D4D35',
        letterSpacing: '-0.5px',
        lineHeight: 1.05,
        margin: 0
      }}>{title}</h2>
      <div style={{
        width: '40px',
        height: '3px',
        background: '#C9A84C',
        marginTop: '10px',
        borderRadius: '2px'
      }} />
    </div>
  </div>;

// ─── Count-up hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step); else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

// ─── Hero Particles Layer ──────────────────────────────────────────────────────

const HeroParticles = () => <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{
  zIndex: 1
}}>
  {HERO_PARTICLES.map(p => <motion.div key={p.id} style={{
    position: 'absolute',
    left: `${p.x}%`,
    bottom: '-20px',
    width: `${p.size}px`,
    height: `${p.size}px`,
    borderRadius: '50%',
    background: p.color
  }} animate={{
    y: [0, -(800 + Math.random() * 200)],
    opacity: [0, 0.8, 0.6, 0]
  }} transition={{
    duration: p.duration,
    delay: p.delay,
    repeat: Infinity,
    ease: 'linear'
  }} />)}
</div>;

// ─── Stat item with count-up ───────────────────────────────────────────────────

const HeroStatItem = ({
  stat,
  inView
}: {
  stat: typeof HERO_STATS[number];
  inView: boolean;
}) => {
  const count = useCountUp(stat.value, inView, 1600);
  return <div className="flex flex-col gap-0.5" style={{
    borderLeft: '3px solid #C9A84C',
    paddingLeft: '14px'
  }}>
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: 'clamp(20px, 2.5vw, 30px)',
      color: '#1D4D35',
      lineHeight: 1.1,
      letterSpacing: '-0.5px'
    }}>
      <span>{stat.prefix}</span>
      <span>{count}</span>
      <span>{stat.suffix}</span>
    </span>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: '10px',
      color: 'rgba(29,77,53,0.55)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const
    }}>{stat.label}</span>
  </div>;
};

// ─── Hero Stats Bar ────────────────────────────────────────────────────────────

const HeroStatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true
  });
  return <div ref={ref} style={{
    background: '#FFFFFF'
  }} className="px-4 sm:px-6 lg:px-10 py-5 sm:py-6">
    <div className="max-w-[1372px] mx-auto">
      {/* Mobile/tablet: 2×2 grid. Desktop: single row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:flex lg:flex-nowrap lg:items-center">
        {HERO_STATS.map((stat, i) => <React.Fragment key={stat.label}>
          <div className="flex-1 min-w-0">
            <HeroStatItem stat={stat} inView={inView} />
          </div>
          {i < HERO_STATS.length - 1 && <div className="hidden lg:block w-px self-stretch mx-6" style={{
            background: 'rgba(29,77,53,0.12)'
          }} />}
        </React.Fragment>)}
      </div>
    </div>
  </div>;
};

// ─── Hero ──────────────────────────────────────────────────────────────────────

const SectorsHero = () => {
  const {
    scrollY
  } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0px', '-80px']);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  return <section className="relative flex flex-col justify-end rounded-3xl mx-1.5 sm:mx-2.5" style={{
    overflow: 'hidden',
    /* On mobile: auto height with padding. On desktop: full viewport */
    minHeight: '580px'
  }}>
    {/* Tailwind can't do 100svh in inline style portably, so we use a style tag approach via className */}
    <style>{`
        @media (min-width: 1024px) {
          .hero-section-inner { height: calc(100svh - 36px); max-height: calc(100svh - 36px); }
        }
        @media (max-width: 1023px) {
          .hero-section-inner { padding-top: 110px; padding-bottom: 40px; min-height: 520px; }
        }
      `}</style>
    <div className="hero-section-inner w-full flex flex-col justify-end">

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
            backgroundImage: "url('/agro-processing-4.jpg')",
            backgroundPosition: 'center 40%',
            backgroundSize: 'cover'
          }} />
        </motion.div>
      </div>

      <HeroParticles />

      {/* Top gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(8,22,14,0.82) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)',
        zIndex: 1
      }} />

      {/* Bottom overlay */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)',
        zIndex: 1
      }} />

      {/* Decorative watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{
        zIndex: 0
      }}>
        <span style={{
          fontFamily: HEADING_FONT,
          fontWeight: 900,
          fontSize: 'clamp(80px, 28vw, 360px)',
          color: 'rgba(255,255,255,0.05)',
          lineHeight: 1,
          userSelect: 'none',
          letterSpacing: '-0.04em'
        }}>SECTORS</span>
      </div>

      {/* Main hero content */}
      <motion.div className="w-full flex flex-col relative" style={{
        bottom: 0,
        opacity,
        zIndex: 2
      }} initial={{
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
        {/* Hero text block */}
        <div className="px-4 sm:px-6 lg:px-[clamp(24px,5vw,80px)] pb-6 sm:pb-8 lg:pb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-16">
            {/* Left column */}
            <div className="flex flex-col gap-0 flex-1 min-w-0">
              <motion.div className="flex items-center gap-2 mb-3 sm:mb-4" initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.5,
                delay: 0.3
              }} style={{
                fontFamily: BODY_FONT,
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)'
              }}>
                <span>Home</span>
                <ChevronRight size={12} />
                <span style={{
                  color: 'rgba(255,255,255,0.9)'
                }}>Sectors</span>
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
                fontSize: 'clamp(32px, 8vw, 80px)',
                lineHeight: '1.05',
                letterSpacing: '-1px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}>
                <span style={{
                  color: '#5DBB3A',
                  display: 'block'
                }}>Priority</span>
                <span style={{
                  color: '#FFFFFF',
                  display: 'block'
                }}>Sectors</span>
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
                fontSize: 'clamp(13px, 1.8vw, 14px)',
                lineHeight: '1.8',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: 0,
                marginTop: '14px',
                fontWeight: 400,
                maxWidth: '520px'
              }}>
                Five high-potential sectors where Mpumalanga's competitive advantages, strategic infrastructure, and global market access converge to create exceptional investment conditions.
              </motion.p>
            </div>

            {/* Right glass card */}
            <motion.div className="flex flex-col gap-4 w-full lg:max-w-md" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.55,
              ease: 'easeOut'
            }} style={{
              background: 'rgba(5, 18, 10, 0.55)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: 'clamp(16px, 3vw, 28px) clamp(18px, 3vw, 28px)',
              border: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0
            }}>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: '13px',
                lineHeight: '1.8',
                color: 'rgba(255,255,255,0.85)',
                margin: 0
              }}>
                Nkomazi SEZ has identified five priority sectors where the intersection of regional advantage, infrastructure, and market demand creates exceptional conditions for investment and growth.
              </p>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: '13px',
                lineHeight: '1.8',
                color: 'rgba(255,255,255,0.65)',
                margin: 0
              }}>
                From agro-processing to green economy, each sector offers a distinct pathway to growth supported by world-class facilities and government-backed incentives.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <GoldButton label="Explore Sectors" href="#sectors-list" />
                <GhostButton label="Speak to Us" href="/contact" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator — desktop only */}
      <motion.div className="hidden lg:flex absolute z-10 flex-col items-center" style={{
        bottom: '32px',
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

    </div>
  </section>;
};

// ─── Sector Strip ──────────────────────────────────────────────────────────────

const SectorStrip = ({
  sector,
  index,
  bgColor
}: {
  sector: typeof SECTORS[number];
  index: number;
  bgColor: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-80px'
  });
  const isEven = index % 2 === 0;
  return <div ref={ref} style={{
    background: bgColor,
    borderTop: '1px solid rgba(200,168,75,0.2)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Watermark number */}
    <div className="absolute pointer-events-none select-none hidden lg:block" aria-hidden="true" style={{
      top: '50%',
      [isEven ? 'right' : 'left']: '-20px',
      transform: 'translateY(-50%)',
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: '160px',
      color: 'rgba(255,255,255,0.04)',
      lineHeight: 1,
      letterSpacing: '-4px',
      zIndex: 0
    }}>
      {sector.id}
    </div>

    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-[clamp(24px,5vw,80px)]" style={{
      paddingTop: 'clamp(32px, 5vw, 72px)',
      paddingBottom: 'clamp(32px, 5vw, 72px)'
    }}>
      {/* On mobile: always stack (flex-col). On lg+: alternate row direction */}
      <div className={cn('flex flex-col gap-8 lg:gap-0', isEven ? 'lg:flex-row' : 'lg:flex-row-reverse')} style={{
        position: 'relative',
        zIndex: 1
      }}>
        {/* Image */}
        <motion.div initial={{
          opacity: 0,
          x: isEven ? -40 : 40
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {
          opacity: 0,
          x: isEven ? -40 : 40
        }} transition={{
          duration: 0.5,
          ease: 'easeOut'
        }} className="w-full lg:w-[48%] flex-shrink-0">
          <div className="overflow-hidden rounded-2xl" style={{
            aspectRatio: '16/9',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)'
          }}>
            <motion.img src={sector.image} alt={sector.title} className="object-cover w-full h-full block" whileHover={{
              scale: 1.04
            }} transition={{
              duration: 0.7,
              ease: 'easeOut'
            }} />
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="hidden lg:block lg:w-[4%] flex-shrink-0" />

        {/* Content */}
        <motion.div initial={{
          opacity: 0,
          x: isEven ? 40 : -40
        }} animate={isInView ? {
          opacity: 1,
          x: 0
        } : {
          opacity: 0,
          x: isEven ? 40 : -40
        }} transition={{
          duration: 0.5,
          ease: 'easeOut',
          delay: 0.08
        }} className="flex flex-col gap-5 w-full lg:w-[48%]">
          {/* Icon badge + heading */}
          <div className="flex flex-col gap-4">
            <motion.div animate={isInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 16
            }} transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: 0.16
            }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(29,77,53,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <sector.icon size={18} style={{
                    color: sector.color
                  }} />
                </div>
                <span style={{
                  fontFamily: BODY_FONT,
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase' as const,
                  color: '#1fac67'
                }}>
                  Sector {sector.id}
                </span>
              </div>
              <h2 style={{
                fontFamily: HEADING_FONT,
                fontWeight: 700,
                fontSize: 'clamp(22px, 3.5vw, 40px)',
                color: '#1D4D35',
                letterSpacing: '-0.5px',
                lineHeight: 1.05,
                margin: 0,
                wordBreak: 'break-word'
              }}>
                {sector.title}
              </h2>
              <div style={{
                width: '40px',
                height: '3px',
                background: '#C9A84C',
                marginTop: '10px',
                borderRadius: '2px'
              }} />
            </motion.div>

            <motion.p animate={isInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 16
            }} transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: 0.24
            }} style={{
              fontFamily: BODY_FONT,
              fontSize: 'clamp(13px, 1.5vw, 14px)',
              lineHeight: 1.7,
              color: '#4A5568',
              margin: 0
            }}>
              {sector.description}
            </motion.p>
          </div>

        </motion.div>
      </div>
    </div>
  </div>;
};

// ─── Intro Overview Section ────────────────────────────────────────────────────

const IntroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-60px'
  });
  const items = [{
    value: '5',
    label: 'Core Sectors'
  }, {
    value: 'ZAR 20B+',
    label: 'Potential Pipeline'
  }, {
    value: '15k+',
    label: 'Est. Jobs'
  }];
  return <section ref={ref} className="py-10 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-12" style={{
    background: '#FFFFFF'
  }}>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <motion.div className="lg:col-span-7" animate={isInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 24
        }} transition={{
          duration: 0.5,
          ease: 'easeOut'
        }}>
          <SectionHeading eyebrow="Investment Overview" title="Driving Industrial Transformation through Strategic Focus" />
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 sm:mb-12" style={{
            fontFamily: BODY_FONT
          }}>
            The Nkomazi Special Economic Zone is purposefully designed to leverage its location on the Maputo Development Corridor.
            Our strategy focuses on industries that benefit most from our logistics connectivity, serviced land,
            and proximity to both the South African heartland and international export gateways.
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-8">
            {items.map((item, i) => <motion.div key={item.label} className="flex flex-col" animate={isInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 16
            }} transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: 0.08 * (i + 1)
            }}>
              <span style={{
                fontFamily: HEADING_FONT,
                fontWeight: 900,
                fontSize: 'clamp(24px, 3vw, 36px)',
                color: '#1D4D35',
                letterSpacing: '-1px'
              }}>{item.value}</span>
              <span style={{
                fontFamily: HEADING_FONT,
                fontSize: '13px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: '#9CA3AF'
              }}>{item.label}</span>
            </motion.div>)}
          </div>
        </motion.div>

        {/* Right column — image */}
        <motion.div className="lg:col-span-5 relative" animate={isInView ? {
          opacity: 1,
          x: 0
        } : {
          opacity: 0,
          x: 40
        }} transition={{
          duration: 0.5,
          ease: 'easeOut',
          delay: 0.1
        }}>
          <div className="overflow-hidden rounded-2xl" style={{
            aspectRatio: '4/3',
            boxShadow: '0 20px 60px rgba(0,0,0,0.10)'
          }}>
            <img src="/Nkomazi-SEZ.jpg" alt="Aerial view of industrial special economic zone" className="w-full h-full object-cover block" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>;
};

// ─── CTA Section ──────────────────────────────────────────────────────────────

const CTASection = () => <section style={{
  background: '#F8F7F0',
  position: 'relative',
  overflow: 'hidden'
}} className="py-12 sm:py-16 lg:py-24">
  {/* Ghost watermark */}
  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: 'clamp(60px, 22vw, 300px)',
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
              textTransform: 'uppercase' as const,
              marginBottom: '16px'
            }}>
              Investment Gateway
            </div>
            <h2 style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(28px, 8vw, 80px)',
              fontWeight: 700,
              color: '#111111',
              textTransform: 'uppercase' as const,
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
              textTransform: 'uppercase' as const,
              margin: '0 0 16px'
            }}>
              Take the first step
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <GoldButton label="Explore Investment Opportunities" href="/investor-hub" />
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

// ─── Main Component ─────────────────────────────────────────────────────────────

export const SectorsPage = () => {
  const sectorBgs = ['#FFFFFF', '#F7F6F2', '#FFFFFF', '#F7F6F2', '#FFFFFF'];
  return <div className="min-h-screen text-slate-800 overflow-x-hidden selection:bg-[#1D4D35] selection:text-white" style={{
    fontFamily: BODY_FONT,
    background: '#F7F6F2'
  }}>
    <NSEZNavbar />

    {/* HERO */}
    <div>
      <SectorsHero />
    </div>

    {/* HERO STATS BAR */}
    <HeroStatsBar />

    {/* Diagonal clip transition */}
    <div style={{
      height: '60px',
      background: '#FFFFFF',
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 60%)',
      marginTop: '-1px'
    }} />

    {/* INTRO OVERVIEW SECTION */}
    <IntroSection />

    {/* SECTOR STRIPS */}
    <div id="sectors-list">
      {SECTORS.map((sector, index) => <SectorStrip key={sector.id} sector={sector} index={index} bgColor={sectorBgs[index]} />)}
    </div>

    {/* CONTACT CTA SECTION */}
    <CTASection />

    <NSEZFooterSection />
  </div>;
};
export default SectorsPage;