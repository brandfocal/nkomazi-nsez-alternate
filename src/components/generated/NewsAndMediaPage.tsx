import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronRight, Play, Facebook, ArrowRight, ExternalLink, Calendar, Camera, FileText, Filter, Maximize2 } from 'lucide-react';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';

// ─── STYLING CONSTANTS ─────────────────────────────────────────────────────────
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── MOCK DATA ──────────────────────────────────────────────────────────────────

const NAV_LEFT_LINKS = ['About Nkomazi SEZ', 'Invest'];
const NAV_RIGHT_LINKS = ['MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];
const NAV_SECTORS = ['Agro-processing', 'Manufacturing', 'Green Economy', 'Logistics and Warehousing'];
const TABS = ["All", "News Articles", "Press Releases", "Media Statements", "Events", "Photo Gallery", "Videos"];
const NEWS_ARTICLES = [{
  id: 1,
  category: "Featured Article",
  title: "Nkomazi SEZ Occupies One of the Most Strategically Important Economic Positions in South Africa",
  excerpt: "An in-depth look at how the Nkomazi Special Economic Zone is positioned along the Maputo Development Corridor to drive SADC trade and regional industrial growth.",
  date: "Mpumalanga 247",
  image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800&q=80",
  link: "https://mpumalanga247.co.za/nkomazi-sez-occupies-one-of-the-most-strategically-important-economic-positions-in-south-africa/#more"
}, {
  id: 2,
  category: "Video Highlights",
  title: "Nkomazi SEZ Special Broadcast & Milestone Presentation",
  excerpt: "Watch our corporate video and progress update presentation showing development milestones and active construction sites.",
  date: "Google Drive Video",
  image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  link: "https://drive.google.com/file/d/1r3hwIbZZWhrRRm8BerFep7uFmAKBXs4R/view?usp=sharing"
}, {
  id: 3,
  category: "Video Coverage",
  title: "Nkomazi SEZ Executive Showcase on Facebook",
  excerpt: "A social media video feature covering the Mozambique Investment Summit (MIS) highlights, stakeholder agreements, and corridor benefits.",
  date: "Facebook Watch",
  image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&q=80",
  link: "https://www.facebook.com/share/v/18va3hETPo/"
}];
const GALLERY_IMAGES = [
  "001BMP_1417.JPG", "001BMP_1436.JPG", "001BMP_1437.JPG", "001BMP_1469.JPG",
  "001BMP_1470.JPG", "001BMP_1471.JPG", "001BMP_1477.JPG", "001BMP_1511.JPG",
  "001BMP_1512.JPG", "001BMP_1544.JPG", "001BMP_1546.JPG", "001BMP_1547.JPG",
  "001BMP_1548.JPG", "001BMP_1563.JPG", "001BMP_1583.JPG", "001BMP_1586.JPG",
  "001BMP_1394.JPG", "001BMP_1395.JPG", "001BMP_1396.JPG", "001BMP_1399.JPG",
  "001BMP_1402.JPG", "001BMP_1403.JPG", "001BMP_1405.JPG", "001BMP_1406.JPG",
  "001BMP_1407.JPG", "001BMP_1408.JPG", "001BMP_1409.JPG", "001BMP_1410.JPG",
  "001BMP_1412.JPG", "001BMP_1413.JPG", "001BMP_1414.JPG", "001BMP_1415.JPG",
  "001BMP_1416.JPG", "001BMP_1418.JPG", "001BMP_1423.JPG", "001BMP_1424.JPG",
  "001BMP_1425.JPG", "001BMP_1426.JPG", "001BMP_1427.JPG", "001BMP_1428.JPG",
  "001BMP_1429.JPG", "001BMP_1430.JPG", "001BMP_1433.JPG", "001BMP_1434.JPG",
  "001BMP_1435.JPG", "001BMP_1438.JPG", "001BMP_1439.JPG", "001BMP_1440.JPG",
  "001BMP_1441.JPG", "001BMP_1442.JPG", "001BMP_1443.JPG", "001BMP_1444.JPG",
  "001BMP_1445.JPG", "001BMP_1446.JPG", "001BMP_1447.JPG", "001BMP_1448.JPG",
  "001BMP_1449.JPG", "001BMP_1450.JPG", "001BMP_1451.JPG", "001BMP_1452.JPG",
  "001BMP_1454.JPG", "001BMP_1455.JPG", "001BMP_1456.JPG", "001BMP_1457.JPG",
  "001BMP_1458.JPG", "001BMP_1461.JPG", "001BMP_1462.JPG", "001BMP_1464.JPG",
  "001BMP_1466.JPG", "001BMP_1468.JPG", "001BMP_1472.JPG", "001BMP_1473.JPG",
  "001BMP_1475.JPG", "001BMP_1476.JPG", "001BMP_1478.JPG", "001BMP_1479.JPG",
  "001BMP_1480.JPG", "001BMP_1481.JPG", "001BMP_1482.JPG", "001BMP_1483.JPG",
  "001BMP_1484.JPG", "001BMP_1485.JPG", "001BMP_1486.JPG", "001BMP_1488.JPG"
].map((filename, index) => ({
  id: index + 1,
  title: "",
  url: `/nsez-photo-download-1of1/GALLERY/${filename}`,
  aspectClass: index % 4 === 0 ? "aspect-[16/9]" : index % 4 === 1 ? "aspect-[4/3]" : index % 4 === 2 ? "aspect-[3/4]" : "aspect-[1/1]"
}));
const PRESS_RELEASES = [{
  date: "10 April 2024",
  title: "Media Statement: Progress Update on Nkomazi SEZ Industrial Land Allocation",
  type: "Media Statement"
}, {
  date: "28 March 2024",
  title: "Press Release: Nkomazi SEZ Partners with Provincial DEDT for Green Economy Forum",
  type: "Press Release"
}, {
  date: "15 March 2024",
  title: "Media Advisory: Upcoming Stakeholder Relations Session at MIS Summit",
  type: "Media Advisory"
}];
const SOCIAL_ICON_ITEMS = [{
  label: 'Facebook',
  href: 'https://web.facebook.com/people/Nkomazi-SEZ/61586568002498/'
}, {
  label: 'Twitter',
  href: '#'
}, {
  label: 'LinkedIn',
  href: 'https://www.linkedin.com/company/nkomazi-special-economic-zone/'
}, {
  label: 'Instagram',
  href: 'https://www.instagram.com/nkomazisez/'
}];
const FOOTER_EXPLORE_LINKS = ['About Nkomazi SEZ', 'Why Invest', 'Priority Sectors', 'Investor Hub'];
const FOOTER_QUICK_LINKS = ['Investment Process', 'Resources', 'Partners', 'Contact'];
const FOOTER_CONTACT_ITEMS = [{
  label: 'Investment Enquiries',
  value: 'invest@nsez.gov.za',
  href: 'mailto:invest@nsez.gov.za'
}, {
  label: 'General Enquiries',
  value: 'info@nsez.gov.za',
  href: 'mailto:info@nsez.gov.za'
}, {
  label: 'Phone',
  value: '+27 (0) 13 752 2440',
  href: 'tel:+27137522440'
}, {
  label: 'Komatipoort Office',
  value: 'Komatipoort, Mpumalanga',
  href: '#'
}];

// ─── ICON COMPONENTS ───────────────────────────────────────────────────────────

const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119Z" fill="currentColor" />
    <path d="M4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
    <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
    <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891ZM10.0017 1.66797C7.73884 1.66797 7.45558 1.67774 6.56673 1.71681C5.68114 1.75588 5.0723 1.89913 4.54485 2.10425C3.99462 2.31914 3.52903 2.6024 3.0667 3.06798C2.60111 3.53031 2.31786 3.9959 2.10297 4.54288C1.89785 5.07358 1.75459 5.67917 1.71552 6.56476C1.67645 7.45686 1.66669 7.74012 1.66669 10.0029C1.66669 12.2657 1.67645 12.549 1.71552 13.4378C1.75459 14.3234 1.89785 14.9323 2.10297 15.4597C2.31786 16.01 2.60111 16.4756 3.0667 16.9379C3.52903 17.4002 3.99462 17.6867 4.5416 17.8984C5.0723 18.1035 5.67789 18.2467 6.56348 18.2858C7.45232 18.3249 7.73558 18.3346 9.99839 18.3346C12.2612 18.3346 12.5445 18.3249 13.4333 18.2858C14.3189 18.2467 14.9277 18.1035 15.4552 17.8984C16.0022 17.6867 16.4678 17.4002 16.9301 16.9379C17.3924 16.4756 17.6789 16.01 17.8906 15.463C18.0957 14.9323 18.2389 14.3267 18.278 13.4411C18.3171 12.5523 18.3268 12.269 18.3268 10.0062C18.3268 7.74338 18.3171 7.46012 18.278 6.57127C18.2389 5.68568 18.0957 5.07684 17.8906 4.54939C17.6854 3.9959 17.4022 3.53031 16.9366 3.06798C16.4743 2.60565 16.0087 2.31914 15.4617 2.10751C14.931 1.90239 14.3254 1.75913 13.4398 1.72006C12.5477 1.67774 12.2645 1.66797 10.0017 1.66797Z" fill="currentColor" />
    <path d="M10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215ZM10.0016 12.7802C8.46815 12.7802 7.22441 11.5364 7.22441 10.0029C7.22441 8.46943 8.46815 7.2257 10.0016 7.2257C11.5352 7.2257 12.7789 8.46943 12.7789 10.0029C12.7789 11.5364 11.5352 12.7802 10.0016 12.7802Z" fill="currentColor" />
    <path d="M15.4519 5.55216C15.4519 6.10566 15.0026 6.55171 14.4524 6.55171C13.8989 6.55171 13.4528 6.1024 13.4528 5.55216C13.4528 4.99867 13.9022 4.55262 14.4524 4.55262C15.0026 4.55262 15.4519 5.00192 15.4519 5.55216Z" fill="currentColor" />
  </svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008C12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" fill="currentColor" />
  </svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
    <path d="M15.5996 0.666626H1.39716C0.716817 0.666626 0.166687 1.20374 0.166687 1.8678V16.1289C0.166687 16.7929 0.716817 17.3333 1.39716 17.3333H15.5996C16.28 17.3333 16.8334 16.7929 16.8334 16.1321V1.8678C16.8334 1.20374 16.28 0.666626 15.5996 0.666626ZM5.11135 14.8691H2.63739V6.91337H5.11135V14.8691ZM3.87437 5.82939C3.0801 5.82939 2.43882 5.18811 2.43882 4.39709C2.43882 3.60608 3.0801 2.9648 3.87437 2.9648C4.66539 2.9648 5.30666 3.60608 5.30666 4.39709C5.30666 5.18486 4.66539 5.82939 3.87437 5.82939ZM14.3692 14.8691H11.8985V11.0019C11.8985 10.0807 11.8822 8.89254 10.6127 8.89254C9.32684 8.89254 9.13153 9.8984 9.13153 10.9368V14.8691H6.66408V6.91337H9.03387V8.00061H9.06643C9.3952 7.37561 10.2025 6.7148 11.4037 6.7148C13.9069 6.7148 14.3692 8.36194 14.3692 10.5039V14.8691Z" fill="currentColor" />
  </svg>;
const TwitterXIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M14.7926 2.50012H17.3483L11.7649 8.88156L18.3333 17.5652H13.1903L9.16214 12.2986L4.55298 17.5652H1.99577L7.96774 10.7396L1.66666 2.50012H6.94022L10.5814 7.31401L14.7926 2.50012ZM13.8957 16.0356H15.3118L6.17074 3.94946H4.6511L13.8957 16.0356Z" fill="currentColor" />
  </svg>;
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" fill="currentColor" />
  </svg>;

// ─── SHARED BUTTON COMPONENTS ──────────────────────────────────────────────────

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
    <div className="flex items-center justify-center px-4 sm:px-5 text-white text-[14px] sm:text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
    fontFamily: BODY_FONT,
    background: '#e87326'
  }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-white rounded-r-lg flex-shrink-0" style={{
    background: '#e87326'
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
    <div className="flex items-center justify-center px-4 sm:px-5 text-white text-[14px] sm:text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
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

// ─── SHARED UTILITY COMPONENTS ─────────────────────────────────────────────────

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
}
const FadeUp = ({
  children,
  delay = 0
}: FadeUpProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-50px"
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
  }}>
      {children}
    </motion.div>;
};
interface SectionHeadingProps {
  children: string;
  light?: boolean;
  subtitle?: string;
}
const SectionHeading = ({
  children,
  light = false,
  subtitle
}: SectionHeadingProps) => <div className="mb-10 sm:mb-12">
    {subtitle && <motion.p initial={{
    opacity: 0,
    x: -10
  }} whileInView={{
    opacity: 1,
    x: 0
  }} viewport={{
    once: true
  }} className={`uppercase tracking-[0.18em] text-[11px] font-bold mb-3 ${light ? 'text-white/60' : 'text-[#1fac67]'}`} style={{
    fontFamily: BODY_FONT
  }}>
        {subtitle}
      </motion.p>}
    <motion.h2 initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} className={`text-3xl sm:text-4xl md:text-5xl font-bold uppercase ${light ? 'text-white' : 'text-[#0F3024]'}`} style={{
    fontFamily: HEADING_FONT
  }}>
      {children}
    </motion.h2>
    <motion.div initial={{
    width: 0
  }} whileInView={{
    width: '40px'
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5,
    delay: 0.2
  }} className="mt-4" style={{
    height: '3px',
    background: '#C9A84C'
  }} />
  </div>;

// ─── SECTORS DROPDOWN ──────────────────────────────────────────────────────────

const SectorsDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1.5 text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 transition-all duration-300" style={{
      fontFamily: BODY_FONT
    }} aria-haspopup="true" aria-expanded={open}>
        <span>Sectors</span>
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

// ─── SOCIAL LINKS DATA ─────────────────────────────────────────────────────────

interface SocialLinkItem {
  Icon: React.FC;
  label: string;
  href: string;
}
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

// ─── HERO SECTION ──────────────────────────────────────────────────────────────

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const {
    scrollY
  } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0px', '-80px']);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  return <section ref={heroRef} className="relative flex flex-col justify-end rounded-2xl sm:rounded-3xl mx-1.5 sm:mx-2.5 overflow-hidden" style={{
    overflow: 'hidden',
    minHeight: '100svh',
    height: 'calc(100svh - 36px)',
    maxHeight: 'calc(100svh - 36px)'
  }}>
      {/* Parallax background */}
      <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden'
    }}>
        <motion.div style={{
        position: 'absolute',
        inset: '-10% 0 0 0',
        y: bgY
      }}>
          <div className="absolute inset-0" style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1800&q=85")`,
          backgroundPosition: 'center 55%',
          backgroundSize: 'cover'
        }} />
        </motion.div>
      </div>

      {/* Floating orbs */}
      <motion.div className="pointer-events-none select-none" style={{
      position: 'absolute',
      width: '320px',
      height: '320px',
      borderRadius: '50%',
      background: 'rgba(93,187,58,0.1)',
      filter: 'blur(60px)',
      top: '18%',
      left: '8%',
      zIndex: 1
    }} animate={{
      y: [0, -30, 0],
      x: [0, 18, 0]
    }} transition={{
      duration: 9,
      ease: 'easeInOut',
      repeat: Infinity
    }} aria-hidden="true" />
      <motion.div className="pointer-events-none select-none" style={{
      position: 'absolute',
      width: '240px',
      height: '240px',
      borderRadius: '50%',
      background: 'rgba(200,168,75,0.07)',
      filter: 'blur(50px)',
      top: '38%',
      right: '12%',
      zIndex: 1
    }} animate={{
      y: [0, 24, 0],
      x: [0, -14, 0]
    }} transition={{
      duration: 12,
      ease: 'easeInOut',
      repeat: Infinity,
      delay: 2
    }} aria-hidden="true" />

      {/* Gradients */}
      <div className="absolute inset-0" style={{
      background: 'linear-gradient(to bottom, rgba(8,22,14,0.82) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)',
      zIndex: 1
    }} />
      <div className="absolute inset-0" style={{
      background: 'linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)',
      zIndex: 1
    }} />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{
      zIndex: 0
    }}>
        <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(100px, 22vw, 360px)',
        color: 'rgba(255,255,255,0.05)',
        lineHeight: 1,
        userSelect: 'none',
        letterSpacing: '-0.04em'
      }}>
          MEDIA
        </span>
      </div>

      {/* Hero content */}
      <motion.div className="relative w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20" style={{
      paddingBottom: 'clamp(28px, 5vh, 56px)',
      opacity: heroOpacity,
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
            <motion.div className="flex items-center gap-2 text-white/60 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-widest" initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.25
          }} style={{
            fontFamily: BODY_FONT
          }}>
              <span>Home</span>
              <ChevronRight size={12} />
              <span className="text-[#C9A84C]">News and Media</span>
            </motion.div>

            <div>
              <motion.h1 initial={{
              opacity: 0,
              y: 14
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.55,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              fontFamily: HEADING_FONT,
              fontSize: 'clamp(40px, 8vw, 90px)',
              lineHeight: '1.0',
              letterSpacing: '-1px',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0
            }}>
                <span style={{
                color: '#5DBB3A',
                display: 'block'
              }}>News &amp;</span>
                <span style={{
                color: '#FFFFFF',
                display: 'block'
              }}>Media</span>
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
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 0,
              marginTop: '12px',
              fontWeight: 400,
              maxWidth: '440px'
            }}>
                The latest news, press releases, events and media from Nkomazi Special Economic Zone.
              </motion.p>
            </div>
          </div>

          {/* Right column — glassmorphism panel */}
          <motion.div className="flex flex-col gap-0 w-full lg:w-[50%] flex-none" style={{
          background: 'rgba(5, 18, 10, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '14px',
          padding: 'clamp(16px, 3vw, 28px)',
          border: '1px solid rgba(255,255,255,0.08)'
        }} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.5,
          ease: 'easeOut'
        }}>
            <p style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(12px, 1.5vw, 13px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '10px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
              Nkomazi SEZ continues to attract regional and global attention as a premier industrial investment destination along the Maputo Development Corridor.
            </p>
            <p style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(12px, 1.5vw, 13px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '16px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
              Stay informed with our latest press releases, featured stories, photo galleries and multimedia from our stakeholder relations and investment forums.
            </p>
            <div className="flex flex-row flex-wrap items-center gap-3">
              <GoldButton label="Explore Latest News" href="#news-section" />
              <GhostButton label="Press Enquiries" href="/contact" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — hidden on very small heights */}
      <motion.div className="hidden sm:flex absolute z-10 flex-col items-center" style={{
      bottom: '16px',
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
        fontSize: '10px',
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

// ─── EDITORIAL NEWS SECTION ────────────────────────────────────────────────────

const EditorialNewsSection = () => {
  return <section id="news-section" className="py-12 sm:py-16 lg:py-20" style={{
    background: '#FFFFFF'
  }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <SectionHeading subtitle="Latest Updates">News &amp; Articles</SectionHeading>

        {/* On mobile: stacked grid. On sm+: scrollable row */}
        <div className="block sm:hidden">
          <div className="flex flex-col gap-5">
            {NEWS_ARTICLES.map((article, idx) => <FadeUp key={article.id} delay={idx * 0.07}>
                <div className="group bg-white flex flex-col cursor-pointer transition-all duration-300" onClick={() => window.open(article.link, '_blank')} style={{
              border: '1px solid rgba(230,230,230,0.8)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}>
                  <div className="relative overflow-hidden flex-shrink-0" style={{
                aspectRatio: '16/9'
              }}>
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-white text-[9px] font-bold uppercase tracking-widest" style={{
                    fontFamily: HEADING_FONT,
                    background: 'rgba(29,77,53,0.9)',
                    backdropFilter: 'blur(8px)'
                  }}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={12} style={{
                    color: '#C9A84C',
                    flexShrink: 0
                  }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{
                    fontFamily: BODY_FONT,
                    color: 'rgba(15,48,36,0.45)'
                  }}>
                        {article.date}
                      </span>
                    </div>
                    <h4 className="font-bold uppercase leading-snug mb-2" style={{
                  fontFamily: HEADING_FONT,
                  fontWeight: 700,
                  fontSize: '17px',
                  color: '#0F3024'
                }}>
                      {article.title}
                    </h4>
                    <p className="mb-3 line-clamp-2" style={{
                  fontFamily: BODY_FONT,
                  fontSize: '13px',
                  lineHeight: '1.65',
                  color: '#777'
                }}>
                      {article.excerpt}
                    </p>
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold uppercase text-[11px] tracking-widest" style={{
                  fontFamily: BODY_FONT,
                  color: '#1fac67',
                  textDecoration: 'none'
                }} onClick={e => e.stopPropagation()}>
                      <span>Read More</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </FadeUp>)}
          </div>
        </div>

        {/* Tablet+: horizontal scroll row, Desktop: 3-col grid */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEWS_ARTICLES.map((article, idx) => <FadeUp key={article.id} delay={idx * 0.07}>
                <div className="group bg-white flex flex-col h-full cursor-pointer transition-all duration-300" onClick={() => window.open(article.link, '_blank')} style={{
              border: '1px solid rgba(230,230,230,0.8)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }} onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(31,172,103,0.2)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.09)';
            }} onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(230,230,230,0.8)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}>
                  <div className="relative overflow-hidden flex-shrink-0" style={{
                aspectRatio: '16/9'
              }}>
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-white text-[9px] font-bold uppercase tracking-widest" style={{
                    fontFamily: HEADING_FONT,
                    background: 'rgba(29,77,53,0.9)',
                    backdropFilter: 'blur(8px)'
                  }}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={12} style={{
                    color: '#C9A84C',
                    flexShrink: 0
                  }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{
                    fontFamily: BODY_FONT,
                    color: 'rgba(15,48,36,0.45)'
                  }}>
                        {article.date}
                      </span>
                    </div>
                    <h4 className="font-bold uppercase leading-snug mb-2 group-hover:text-[#1fac67] transition-colors duration-300" style={{
                  fontFamily: HEADING_FONT,
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#0F3024'
                }}>
                      {article.title}
                    </h4>
                    <p className="flex-1 mb-4 line-clamp-2" style={{
                  fontFamily: BODY_FONT,
                  fontSize: '13px',
                  lineHeight: '1.65',
                  color: '#777'
                }}>
                      {article.excerpt}
                    </p>
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold uppercase text-[11px] tracking-widest group-hover:gap-2.5 transition-all duration-300 mt-auto" style={{
                  fontFamily: BODY_FONT,
                  color: '#1fac67',
                  textDecoration: 'none'
                }} onClick={e => e.stopPropagation()}>
                      <span>Read More</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </FadeUp>)}
          </div>
        </div>

        {/* View All CTA */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <motion.a href="#" onClick={e => e.preventDefault()} className="inline-flex items-center gap-2" style={{
          fontFamily: BODY_FONT,
          fontSize: '13px',
          fontWeight: 700,
          color: '#ffffff',
          background: '#e87326',
          padding: '13px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          letterSpacing: '0.06em',
          textTransform: 'uppercase'
        }} whileHover={{
          y: -2,
          scale: 1.015
        }} whileTap={{
          scale: 0.97
        }} transition={{
          duration: 0.2,
          ease: 'easeOut'
        }}>
            <span>View All Articles</span>
            <ArrowRight size={15} />
          </motion.a>
        </div>
      </div>
    </section>;
};

// ─── PHOTO GALLERY SECTION ─────────────────────────────────────────────────────

const GallerySection = () => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const displayedImages = showAllPhotos ? GALLERY_IMAGES : GALLERY_IMAGES.slice(0, 16);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : displayedImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex(prev => (prev !== null && prev < displayedImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 overflow-hidden" style={{
        background: '#1D4D35'
      }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <SectionHeading light subtitle="Gallery">Photo Gallery</SectionHeading>
          <p className="text-white/60 -mt-6 sm:-mt-8 mb-8 sm:mb-12 max-w-xl sm:max-w-2xl" style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            lineHeight: '1.75'
          }}>
            Explore images from Nkomazi SEZ events, site visits, and stakeholder relations including the MIS Summit.
          </p>

          {/* Masonry grid with 4 columns on large screens */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4" style={{
            columnGap: '14px'
          }}>
            {displayedImages.map((img, idx) => (
              <motion.div
                key={img.id}
                className="group relative rounded-xl overflow-hidden mb-3 sm:mb-4 cursor-pointer break-inside-avoid"
                onClick={() => setActiveImageIndex(idx)}
                initial={{
                  opacity: 0,
                  scale: 0.93,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: 0.5,
                  delay: (idx % 16) * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div className={img.aspectClass}>
                  <img
                    src={img.url}
                    alt={`Gallery Image ${img.id}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ display: 'block' }}
                  />
                </div>
                {/* Modern Hover overlay without text labels */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-[#1fac67] shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => setShowAllPhotos(prev => !prev)}
              className="group flex items-center gap-3 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer border-0 bg-transparent"
              style={{
                fontFamily: BODY_FONT,
                color: 'rgba(255,255,255,0.75)',
                outline: 'none'
              }}
            >
              <Camera size={16} style={{ color: '#C9A84C' }} />
              <span>{showAllPhotos ? "Show Less" : "View Full Gallery"}</span>
              <ChevronRight size={14} className={`group-hover:translate-x-1 transition-transform ${showAllPhotos ? 'rotate-90' : ''}`} style={{ color: '#C9A84C' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox / Modal for photos */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 select-none"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-white/70 transition-colors z-[100000] bg-black/40 hover:bg-black/60 p-3 rounded-full border-0 outline-none cursor-pointer"
              onClick={() => setActiveImageIndex(null)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Navigation Left */}
            <button
              className="absolute left-4 sm:left-8 text-white hover:text-[#1fac67] transition-colors z-[100000] bg-black/40 hover:bg-black/60 p-3 rounded-full border-0 outline-none cursor-pointer"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[85vh] rounded-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={displayedImages[activeImageIndex].url}
                alt={`Expanded Gallery Image ${displayedImages[activeImageIndex].id}`}
                className="max-w-full max-h-[85vh] object-contain block mx-auto"
              />
            </motion.div>

            {/* Navigation Right */}
            <button
              className="absolute right-4 sm:right-8 text-white hover:text-[#1fac67] transition-colors z-[100000] bg-black/40 hover:bg-black/60 p-3 rounded-full border-0 outline-none cursor-pointer"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Counter Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 text-white/80 text-xs font-medium tracking-wider" style={{ fontFamily: BODY_FONT }}>
              {activeImageIndex + 1} / {displayedImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const FEATURED_VIDEOS = [
  {
    id: "sQTybYIGILM",
    title: "Forensic Investigation Passed in Nkomazi Local Municipality",
    excerpt: "SABC News report covering the Nkomazi Local Municipality Section 106 forensic investigation council resolution.",
    url: "https://www.youtube.com/watch?v=sQTybYIGILM",
    thumbnail: "https://img.youtube.com/vi/sQTybYIGILM/maxresdefault.jpg",
    runtime: "2:15",
    source: "SABC News"
  },
  {
    id: "j6SHvykV9w8",
    title: "Nkomazi SEZ Manufacturing & Industrialist Summit 2026",
    excerpt: "Key highlights and discussions from the Nkomazi Special Economic Zone Manufacturing & Industrialist Summit.",
    url: "https://www.youtube.com/watch?v=j6SHvykV9w8",
    thumbnail: "https://img.youtube.com/vi/j6SHvykV9w8/maxresdefault.jpg",
    runtime: "4:32",
    source: "Nkomazi SEZ Media"
  },
  {
    id: "KTeiTcbaDBA",
    title: "Nkomazi SEZ Stakeholder Relations Showcase & Progress",
    excerpt: "Watch the latest progress updates, active development sites, and investor opportunities within the economic zone.",
    url: "https://www.youtube.com/watch?v=KTeiTcbaDBA",
    thumbnail: "https://img.youtube.com/vi/KTeiTcbaDBA/maxresdefault.jpg",
    runtime: "3:10",
    source: "Nkomazi SEZ Media"
  },
  {
    id: "4HXdK1X2ojs",
    title: "Nkomazi SEZ: Unlocking New Opportunities for Investment",
    excerpt: "A video presentation highlighting strategic location benefits, infrastructure readiness, and priority sector opportunities.",
    url: "https://www.youtube.com/watch?v=4HXdK1X2ojs",
    thumbnail: "https://img.youtube.com/vi/4HXdK1X2ojs/maxresdefault.jpg",
    runtime: "5:20",
    source: "Nkomazi SEZ Media"
  }
];

const VideosSection = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24" style={{
        background: '#F7F6F2'
      }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <SectionHeading subtitle="Media Center">Featured Videos</SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {FEATURED_VIDEOS.map((video, idx) => (
              <FadeUp key={video.id} delay={idx * 0.1}>
                <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-video shadow-xl sm:shadow-2xl bg-[#081a12]">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-85 group-hover:scale-[1.03] transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors" />
                  
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 sm:gap-3 z-10">
                    <div className="bg-[#FF0000] px-2 py-1 rounded text-white text-[10px] font-bold tracking-wider uppercase">
                      YouTube
                    </div>
                    <div>
                      <p className="text-white/70 text-[10px] uppercase font-bold" style={{ fontFamily: BODY_FONT }}>
                        {video.source}
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
                    <motion.button onClick={() => setActiveVideoId(video.id)} whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.95
                    }} className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#1fac67] text-white flex items-center justify-center shadow-2xl cursor-pointer" aria-label={`Play ${video.title}`}>
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </motion.button>
                    <div className="mt-4 sm:mt-6 text-center">
                      <h4 className="text-white text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight mb-1 sm:mb-2 max-w-[90%] mx-auto leading-tight" style={{
                        fontFamily: HEADING_FONT
                      }}>
                        {video.title}
                      </h4>
                      <p className="text-white/80 text-[11px] sm:text-xs max-w-[85%] mx-auto leading-relaxed hidden sm:block mb-1" style={{
                        fontFamily: BODY_FONT
                      }}>
                        {video.excerpt}
                      </p>
                      <p className="text-[#C9A84C] text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{
                        fontFamily: BODY_FONT
                      }}>
                        Runtime: {video.runtime}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setActiveVideoId(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-white/70 transition-colors z-50 bg-black/40 hover:bg-black/60 p-2 rounded-full border-0 outline-none cursor-pointer"
                onClick={() => setActiveVideoId(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── PRESS RELEASES SECTION ────────────────────────────────────────────────────

const PressReleasesSection = () => <section className="py-16 sm:py-20 lg:py-24" style={{
  background: '#FFFFFF'
}}>
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
      <SectionHeading subtitle="Downloads">Press Releases &amp; Statements</SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {PRESS_RELEASES.map((release, idx) => <FadeUp key={`release-${release.date}`} delay={idx * 0.08}>
            <div className="group flex flex-col rounded-xl sm:rounded-2xl transition-all duration-300 h-full" style={{
          background: '#FFFFFF',
          border: '1px solid rgba(230,230,230,0.9)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)'
        }} onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(31,172,103,0.18)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 36px rgba(0,0,0,0.09)';
        }} onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(230,230,230,0.9)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)';
        }}>
              <div className="flex flex-col gap-4 p-5 sm:p-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 rounded-xl flex-shrink-0 group-hover:bg-[#1fac67] transition-colors duration-300" style={{
                background: 'rgba(31,172,103,0.08)',
                color: '#1fac67'
              }}>
                    <FileText size={18} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{
                  fontFamily: HEADING_FONT,
                  color: '#1fac67',
                  letterSpacing: '0.15em'
                }}>
                      {release.type}
                    </span>
                    <span className="w-1 h-1 rounded-full inline-block" style={{
                  background: '#C9A84C',
                  opacity: 0.6
                }} />
                    <span className="text-[11px]" style={{
                  fontFamily: BODY_FONT,
                  color: 'rgba(15,48,36,0.5)',
                  fontWeight: 500
                }}>
                      {release.date}
                    </span>
                  </div>
                </div>

                <h4 className="uppercase leading-snug group-hover:text-[#1fac67] transition-colors duration-300" style={{
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#0F3024'
            }}>
                  {release.title}
                </h4>

                <a href="#" onClick={e => e.preventDefault()} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors mt-auto" style={{
              fontFamily: BODY_FONT,
              color: '#C9A84C',
              textDecoration: 'none'
            }}>
                  <span>Read Statement</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </FadeUp>)}
      </div>

      <div className="mt-8 sm:mt-12 flex justify-center">
        <motion.a href="#" onClick={e => e.preventDefault()} className="inline-flex items-center gap-2" style={{
        fontFamily: BODY_FONT,
        fontSize: '13px',
        fontWeight: 700,
        color: '#ffffff',
        background: '#e87326',
        padding: '13px 28px',
        borderRadius: '8px',
        textDecoration: 'none',
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      }} whileHover={{
        y: -2,
        scale: 1.015
      }} whileTap={{
        scale: 0.97
      }} transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}>
          <span>Load More Releases</span>
          <ArrowRight size={15} />
        </motion.a>
      </div>
    </div>
  </section>;

// ─── NEWSLETTER CTA ────────────────────────────────────────────────────────────

const NewsletterSection = () => <section style={{
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
    overflow: 'hidden'
  }}>
      <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: 'clamp(60px, 22vw, 300px)',
      color: 'rgba(17,17,17,0.03)',
      lineHeight: 1,
      letterSpacing: '-0.04em'
    }}>
        MEDIA
      </span>
    </div>

    <div className="max-w-[1372px] mx-auto px-4 sm:px-6" style={{
    position: 'relative',
    zIndex: 1
  }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left column */}
        <FadeUp>
          <div className="flex gap-4 sm:gap-6 items-start">
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
            <div>
              <div style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 700,
              color: '#e87326',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}>
                Stay Connected
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
              marginBottom: '16px'
            }}>
                Newsletter
              </h2>
              <p style={{
              fontFamily: BODY_FONT,
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: 'rgba(17,17,17,0.65)',
              lineHeight: '1.8',
              margin: 0,
              maxWidth: '400px'
            }}>
                Subscribe to Nkomazi SEZ updates, news and media releases delivered directly to your inbox.
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
              margin: '0 0 12px'
            }}>
                Join our mailing list
              </p>
              {/* Email input + subscribe — stacked on mobile, inline on sm+ */}
              <div className="flex flex-col sm:flex-row w-full">
                <input type="email" placeholder="Your email address" aria-label="Email address for newsletter" className="flex-1 min-w-0 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none" style={{
                fontFamily: BODY_FONT,
                fontSize: '14px',
                padding: '13px 16px',
                border: '1px solid rgba(17,17,17,0.15)',
                borderBottom: 'none',
                background: '#FFFFFF',
                color: '#111111',
                outline: 'none'
              }} />
                <button className="rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none" style={{
                fontFamily: BODY_FONT,
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF',
                background: '#e87326',
                border: 'none',
                padding: '13px 20px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                transition: 'opacity 0.2s'
              }} onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }}>
                  Subscribe
                </button>
              </div>
            </div>

            <div style={{
            height: '1px',
            background: 'rgba(17,17,17,0.1)'
          }} />

            {/* Social links row */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span style={{
              fontFamily: BODY_FONT,
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(17,17,17,0.4)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}>
                Follow us
              </span>
              {SOCIAL_ICON_ITEMS.map(({
              label,
              href
            }) => {
              const IconComponent = label === 'Facebook' ? FacebookIcon : label === 'LinkedIn' ? LinkedInIcon : label === 'Instagram' ? InstagramIcon : TwitterXIcon;
              return <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(17,17,17,0.4)',
                transition: 'color 0.2s'
              }} onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#111111';
              }} onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(17,17,17,0.4)';
              }}>
                    <IconComponent />
                  </a>;
            })}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>;

// ─── MAIN PAGE COMPONENT ───────────────────────────────────────────────────────

export const NewsAndMediaPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  useEffect(() => {
    const existingLink = document.querySelector('link[data-nsez-fonts]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap';
      link.setAttribute('data-nsez-fonts', 'true');
      document.head.appendChild(link);
    }
  }, []);
  return <div className="bg-white min-h-screen text-[#333]" style={{
    fontFamily: BODY_FONT
  }}>

      <NSEZNavbar />

      {/* Spacer for navbar top banner */}
      <div style={{
      height: '36px'
    }} />

      {/* ─── 1. PAGE HERO ─── */}
      <HeroSection />

      {/* ─── 2. CONTENT TYPE FILTER TABS ─── */}
      <section className="sticky top-[36px] z-[90] bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
          <div className="flex items-center overflow-x-auto gap-1.5 sm:gap-2 py-3 sm:py-4" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        } as React.CSSProperties}>
            <Filter size={16} className="text-[#1D4D35] mr-1 sm:mr-2 flex-shrink-0" />
            {TABS.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className="whitespace-nowrap px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all duration-200 flex-shrink-0" style={{
            fontFamily: BODY_FONT,
            background: activeTab === tab ? '#1D4D35' : 'transparent',
            color: activeTab === tab ? '#ffffff' : 'rgba(29,77,53,0.55)',
            border: `1px solid ${activeTab === tab ? '#1D4D35' : 'rgba(29,77,53,0.2)'}`,
            boxShadow: activeTab === tab ? '0 4px 14px rgba(29,77,53,0.25)' : 'none'
          }}>
                {tab}
              </button>)}
          </div>
        </div>
      </section>

      {/* ─── 3. EDITORIAL NEWS SECTION ─── */}
      <EditorialNewsSection />

      {/* ─── 4. PHOTO GALLERY SECTION ─── */}
      <GallerySection />

      {/* ─── 5. VIDEOS SECTION ─── */}
      <VideosSection />

      {/* ─── 6. PRESS RELEASES SECTION ─── */}
      <PressReleasesSection />

      {/* ─── 7. NEWSLETTER CTA ─── */}
      <NewsletterSection />

      <NSEZFooterSection />

    </div>;
};