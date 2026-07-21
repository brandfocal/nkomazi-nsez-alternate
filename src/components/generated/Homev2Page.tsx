import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { Menu, X, ChevronRight, Calendar } from 'lucide-react';
import { InvestmentCorridors } from './InvestmentCorridors';
import { NSEZNavbar } from './NSEZNavbar';
import { NSEZFooterSection } from './NSEZFooterSection';
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_SECTORS = ['Agro-processing & Agriculture', 'Manufacturing', 'Green Economy', 'Logistics & Warehousing'];
const NAV_SIMPLE_LINKS = ['About Nkomazi SEZ', 'Invest', 'Sectors', 'MSME Hub', 'Tenders', 'News and Media', 'Stakeholder Relations', 'Careers', 'Contact Us'];
const PARTNER_LOGOS = [
  '/partners/dp-world.png',
  '/partners/dtic.png',
  '/partners/economic-development-tourism.png',
  '/partners/ehlanzeni-district-municipality.png',
  '/partners/nkomazi-local-municipality.png'
];

// ─── Investment Journey Steps ─────────────────────────────────────────────────
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
const SECTOR_BOTTOM_COLORS = ['#1D4D35', '#1A2744', '#1A3320', '#2C1A0E'] as string[];
const SEZ_SECTORS = [{
  id: 'agro',
  label: '01',
  title: 'Agro-processing and Agriculture',
  desc: "Leverage the region's strong agricultural base through value-added processing and export opportunities.",
  items: ["Leverage Nkomazi's strong agricultural base.", 'Value-added processing and export opportunities.', 'Cold chain infrastructure and SADC market access.'],
  image: '/agro-processing.jpg',
  bgImage: '/agro-processing.jpg',
  tag: 'Agro-processing'
}, {
  id: 'mfg',
  label: '02',
  title: 'Manufacturing',
  desc: 'Access strategic industrial opportunities supported by infrastructure and logistics connectivity.',
  items: ['Strategic industrial opportunities in a designated SEZ.', 'Supported by world-class infrastructure.', 'Proximity to regional logistics corridors and export markets.'],
  image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=85',
  bgImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1800&q=85',

  tag: 'Manufacturing'
}, {
  id: 'green',
  label: '03',
  title: 'Green Economy',
  desc: 'Explore opportunities in renewable energy, sustainable production and environmentally responsible industrial growth.',
  items: ['Renewable energy and sustainable production zones.', 'Environmentally responsible industrial growth.', 'Circular economy and green transition investment.'],
  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&q=85',
  bgImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85',

  tag: 'Green Economy'
}, {
  id: 'log',
  label: '04',
  title: 'Logistics and Warehousing',
  desc: 'Take advantage of strategic positioning near regional trade routes and export markets.',
  items: ['Strategic positioning near regional trade routes.', 'Access to Maputo Development Corridor export markets.', 'Warehousing and intermodal freight connectivity.'],
  image: '/warehousing.jpg',
  bgImage: '/warehousing.jpg',
  bgPosition: 'center 20%',
  tag: 'Logistics'
}] as {
  id: string;
  label: string;
  title: string;
  desc: string;
  items: string[];
  image: string;
  bgImage: string;
  bgPosition?: string;
  tag: string;
}[];
const INVEST_STEPS = [{
  step: '01',
  title: 'Submit an Enquiry',
  desc: 'Connect with the Nkomazi SEZ investment team to discuss your business and investment interests.',
  image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80',
  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
}, {
  step: '02',
  title: 'Opportunity Assessment',
  desc: 'Identify suitable opportunities and sites aligned to your sector and investment scale.',
  image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
}, {
  step: '03',
  title: 'Investor Support',
  desc: 'Receive dedicated assistance with approvals, incentives and onboarding requirements.',
  image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
}, {
  step: '04',
  title: 'Establish and Grow',
  desc: 'Launch and scale your operation within the Nkomazi SEZ ecosystem with ongoing support.',
  image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&q=80',
  icon: 'M13 10V3L4 14h7v7l9-11h-7z'
}] as {
  step: string;
  title: string;
  desc: string;
  image: string;
  icon: string;
}[];

// ─── Why Invest cards (6 cards) ───────────────────────────────────────────────
const ENTERPRISE_HUB_CARDS = [{
  id: 'loc',
  number: '01',
  title: 'Strategic Location',
  desc: 'Positioned along the Maputo Development Corridor, Nkomazi SEZ provides investors with direct access to South Africa, Mozambique, Eswatini and broader SADC markets.',
  bgImage: '/nsez-smme3.jpg'
}, {
  id: 'incentives',
  number: '02',
  title: 'Investor Incentives',
  desc: 'Access to Special Economic Zone incentives, government support programmes, customs-controlled areas and investment facilitation services.',
  bgImage: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=800&q=80'
}, {
  id: 'infra',
  number: '03',
  title: 'Infrastructure Ready',
  desc: 'Nkomazi SEZ is developing responsive infrastructure that supports industrial growth, logistics operations and large-scale manufacturing investment.',
  bgImage: '/nsez-smme2.jpg'
}, {
  id: 'sector',
  number: '04',
  title: 'Sector Opportunities',
  desc: 'Investment opportunities exist across agro-processing, manufacturing, logistics, warehousing, nutraceuticals and the green economy.',
  bgImage: '/nsez-smme.jpg'
}, {
  id: 'gov',
  number: '05',
  title: 'Government Backing',
  desc: 'Supported by the Mpumalanga Provincial Government, DEDT and DTIC.',
  bgImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'
}, {
  id: 'growth',
  number: '06',
  title: 'Sustainable Growth',
  desc: 'Focused on long-term industrialisation, economic transformation and inclusive participation.',
  bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
}] as {
  id: string;
  number: string;
  title: string;
  desc: string;
  bgImage: string;
}[];
const ENTERPRISE_CARD_BOTTOM_COLORS = ['#0F1923', '#1D4D35', '#1A2744', '#0F1923', '#1D4D35', '#1A2744'] as string[];
const INVESTOR_STORIES = [{
  id: 's1',
  quote: "Establishing our agro-processing facility in Nkomazi SEZ was the best investment decision we've made. The infrastructure, incentives, and hands-on support exceeded every expectation.",
  name: 'Thandi Mokoena',
  role: 'CEO',
  company: 'Greenfield Produce Ltd',
  image: '/nsez-investor.jpg',
  bgImage: '/nsez-investor.jpg',
  sector: 'Agro-processing'
}, {
  id: 's2',
  quote: "The single-window permit desk saved us months of bureaucracy. We were operational within 60 days of signing — unmatched in any other African SEZ we evaluated.",
  name: 'David Ferreira',
  role: 'MD',
  company: 'Moz-Cargo Logistics',
  image: '/nsez-smme.jpg',
  bgImage: '/nsez-smme.jpg',
  sector: 'Logistics'
}, {
  id: 's3',
  quote: "The N4 corridor access and tax incentives made Nkomazi SEZ an obvious choice. Our manufacturing costs dropped 22% compared to our Johannesburg facility.",
  name: 'Priya Naidoo',
  role: 'COO',
  company: 'Precision Parts SA',
  image: '/nsez-investor3.jpg',
  bgImage: '/nsez-investor3.jpg',
  sector: 'Manufacturing'
}] as {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string;
  bgImage: string;
  sector: string;
}[];
const FAQS = [{
  q: 'What tax incentives are available to SEZ investors?',
  a: 'Qualifying companies benefit from a reduced 15% corporate tax rate, VAT exemptions on goods and services within the zone, and customs duty rebates on imported capital equipment.'
}, {
  q: 'How large are the available land parcels?',
  a: 'Industrial plots range from 0.5 ha to 50+ ha. We also offer fully constructed factory shells from 500 m² for immediate occupation, subject to availability.'
}, {
  q: 'What utilities and infrastructure are provided?',
  a: 'The SEZ provides bulk water, sanitation, electricity (Eskom feed + solar backup), fibre-optic connectivity, and paved internal roads to every plot.'
}, {
  q: 'Is there support for work permit applications?',
  a: 'Yes. The Nkomazi SEZ one-stop-shop facilitates critical skills visas, work permits, and environmental authorisations on behalf of registered investors.'
}] as {
  q: string;
  a: string;
}[];
const FOOTER_LINKS = {
  'Nkomazi SEZ': ['About Nkomazi SEZ', 'Why Invest', 'Priority Sectors', 'Investor Hub'],
  'Resources': ['Investment Process', 'Resources', 'Partners', 'Contact']
};
const EH_METRICS = [{
  value: 'R50 Billion',
  label: 'Projected\nInvestment'
}, {
  value: '45,000',
  label: 'Jobs to be\nCreated'
}, {
  value: '14+',
  label: 'Registered\nInvestors'
}, {
  value: '2028',
  label: 'Infrastructure\nCompletion'
}];
const GoldDivider = () => <div style={{
  height: '1px',
  background: 'rgba(200,168,75,0.25)',
  width: '100%'
}} />;

// ─── Icons ─────────────────────────────────────────────────────────────────────

const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
  <path d="M6.87891 4.75781H13.2429V11.1218" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.58844 6.47511C2.29705 6.47511 2.06083 6.71132 2.06083 7.00271C2.06083 7.2941 2.29705 7.53032 2.58844 7.53032V7.00271V6.47511ZM2.58844 7.00271V7.53032H11.0301V7.00271V6.47511H2.58844V7.00271Z" fill="currentColor" />
  <path d="M7.86448 3.83709L11.0301 7.00271L7.86448 10.1683" stroke="currentColor" strokeWidth="1.05521" strokeLinecap="round" strokeLinejoin="round" />
</svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M14.7926 2.50012H17.3483L11.7649 8.88156L18.3333 17.5652H13.1903L9.16214 12.2986L4.55298 17.5652H1.99577L7.96774 10.7396L1.66666 2.50012H6.94022L10.5814 7.31401L14.7926 2.50012ZM13.8957 16.0356H15.3118L6.17074 3.94946H4.6511L13.8957 16.0356Z" fill="currentColor" />
</svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M10.0017 3.16891C12.2286 3.16891 12.4924 3.17868 13.3682 3.21775C14.1822 3.25356 14.6217 3.39031 14.9147 3.50427C15.3022 3.65403 15.5822 3.83636 15.8719 4.12613C16.165 4.41916 16.344 4.6959 16.4938 5.08335C16.6078 5.37638 16.7445 5.81917 16.7803 6.62988C16.8194 7.50895 16.8292 7.77268 16.8292 9.99642C16.8292 12.2234 16.8194 12.4871 16.7803 13.363C16.7445 14.1769 16.6078 14.6165 16.4938 14.9095C16.344 15.2969 16.1617 15.5769 15.8719 15.8667C15.5789 16.1597 15.3022 16.3388 14.9147 16.4886C14.6217 16.6025 14.1789 16.7393 13.3682 16.7751C12.4891 16.8142 12.2254 16.8239 10.0017 16.8239C7.77465 16.8239 7.51093 16.8142 6.63511 16.7751C5.82115 16.7393 5.38161 16.6025 5.08858 16.4886C4.70113 16.3388 4.42113 16.1565 4.13136 15.8667C3.83834 15.5737 3.65926 15.2969 3.5095 14.9095C3.39554 14.6165 3.2588 14.1737 3.22298 13.363C3.18391 12.4839 3.17414 12.2202 3.17414 9.99642C3.17414 7.76942 3.18391 7.5057 3.22298 6.62988C3.2588 5.81591 3.39554 5.37638 3.5095 5.08335C3.65926 4.6959 3.84159 4.4159 4.13136 4.12613C4.42439 3.83311 4.70113 3.65403 5.08858 3.50427C5.38161 3.39031 5.8244 3.25356 6.63511 3.21775C7.51093 3.17868 7.77465 3.16891 10.0017 3.16891ZM10.0017 1.66797C7.73884 1.66797 7.45558 1.67774 6.56673 1.71681C5.68114 1.75588 5.0723 1.89913 4.54485 2.10425C3.99462 2.31914 3.52903 2.6024 3.0667 3.06798C2.60111 3.53031 2.31786 3.9959 2.10297 4.54288C1.89785 5.07358 1.75459 5.67917 1.71552 6.56476C1.67645 7.45686 1.66669 7.74012 1.66669 10.0029C1.66669 12.2657 1.67645 12.549 1.71552 13.4378C1.75459 14.3234 1.89785 14.9323 2.10297 15.4597C2.31786 16.01 2.60111 16.4756 3.0667 16.9379C3.52903 17.4002 3.99462 17.6867 4.5416 17.8984C5.0723 18.1035 5.67789 18.2467 6.56348 18.2858C7.45232 18.3249 7.73558 18.3346 9.99839 18.3346C12.2612 18.3346 12.5445 18.3249 13.4333 18.2858C14.3189 18.2467 14.9277 18.1035 15.4552 17.8984C16.0022 17.6867 16.4678 17.4002 16.9301 16.9379C17.3924 16.4756 17.6789 16.01 17.8906 15.463C18.0957 14.9323 18.2389 14.3267 18.278 13.4411C18.3171 12.5523 18.3268 12.269 18.3268 10.0062C18.3268 7.74338 18.3171 7.46012 18.278 6.57127C18.2389 5.68568 18.0957 5.07684 17.8906 4.54939C17.6854 3.9959 17.4022 3.53031 16.9366 3.06798C16.4743 2.60565 16.0087 2.31914 15.4617 2.10751C14.931 1.90239 14.3254 1.75913 13.4398 1.72006C12.5477 1.67774 12.2645 1.66797 10.0017 1.66797Z" fill="currentColor" />
  <path d="M10.0016 5.7215C7.63791 5.7215 5.72021 7.63919 5.72021 10.0029C5.72021 12.3667 7.63791 14.2844 10.0016 14.2844C12.3654 14.2844 14.2831 12.3667 14.2831 10.0029C14.2831 7.63919 12.3654 5.7215 10.0016 5.7215ZM10.0016 12.7802C8.46815 12.7802 7.22441 11.5364 7.22441 10.0029C7.22441 8.46943 8.46815 7.2257 10.0016 7.2257C11.5352 7.2257 12.7789 8.46943 12.7789 10.0029C12.7789 11.5364 11.5352 12.7802 10.0016 12.7802Z" fill="currentColor" />
  <path d="M15.4519 5.55216C15.4519 6.10566 15.0026 6.55171 14.4524 6.55171C13.8989 6.55171 13.4528 6.1024 13.4528 5.55216C13.4528 4.99867 13.9022 4.55262 14.4524 4.55262C15.0026 4.55262 15.4519 5.00192 15.4519 5.55216Z" fill="currentColor" />
</svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
  <path d="M15.5996 0.666626H1.39716C0.716817 0.666626 0.166687 1.20374 0.166687 1.8678V16.1289C0.166687 16.7929 0.716817 17.3333 1.39716 17.3333H15.5996C16.28 17.3333 16.8334 16.7929 16.8334 16.1321V1.8678C16.8334 1.20374 16.28 0.666626 15.5996 0.666626ZM5.11135 14.8691H2.63739V6.91337H5.11135V14.8691ZM3.87437 5.82939C3.0801 5.82939 2.43882 5.18811 2.43882 4.39709C2.43882 3.60608 3.0801 2.9648 3.87437 2.9648C4.66539 2.9648 5.30666 3.60608 5.30666 4.39709C5.30666 5.18486 4.66539 5.82939 3.87437 5.82939ZM14.3692 14.8691H11.8985V11.0019C11.8985 10.0807 11.8822 8.89254 10.6127 8.89254C9.32684 8.89254 9.13153 9.8984 9.13153 10.9368V14.8691H6.66408V6.91337H9.03387V8.00061H9.06643C9.3952 7.37561 10.2025 6.7148 11.4037 6.7148C13.9069 6.7148 14.3692 8.36194 14.3692 10.5039V14.8691Z" fill="currentColor" />
</svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M18.3334 10.0001C18.3334 5.39758 14.6025 1.66675 10.0001 1.66675C5.39758 1.66675 1.66675 5.39758 1.66675 10.0001C1.66675 14.1584 4.72508 17.6001 8.75008 18.2334V12.5001H6.66675V10.0001H8.75008V8.16675C8.75008 6.10842 9.94175 5.00008 11.8192 5.00008C12.7184 5.00008 13.6609 5.16675 13.6609 5.16675V7.18758H12.6217C11.6001 7.18758 11.2501 7.80008 11.2501 8.42925V10.0001H13.5684L13.1734 12.5001H11.2501V18.2334C15.2751 17.6001 18.3334 14.1584 18.3334 10.0001Z" fill="currentColor" />
</svg>;
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" fill="currentColor" />
</svg>;

// ─── Social Links & Top Banner ────────────────────────────────────────────────

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

// ─── Subtitle pill ────────────────────────────────────────────────────────────

const Subtitle = ({
  children,
  light = false
}: {
  children: React.ReactNode;
  light?: boolean;
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
  ease: 'easeOut'
}} className="inline-block text-xs rounded-full px-3 py-2 leading-[21px] tracking-[0.06em] uppercase" style={{
  fontFamily: BODY_FONT,
  background: light ? 'rgba(255,255,255,0.12)' : '#1fac67',
  color: light ? 'rgba(255,255,255,0.85)' : '#ffffff'
}}>
    {children}
  </motion.span>;

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

// ─── Animated Section Heading ─────────────────────────────────────────────────

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

// ─── Count-up hook ────────────────────────────────────────────────────────────

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

// ─── Nav dropdown ─────────────────────────────────────────────────────────────

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

// ─── Sticky Navbar ────────────────────────────────────────────────────────────

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
          {desktopLinks.slice(0, 4).map(link => link === 'Sectors' ? <SectorsHoverDropdown key={link} /> : <a key={link} href="#" onClick={e => e.preventDefault()} className="text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 transition-all duration-300 no-underline tracking-[0.01em]" style={{
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
          {desktopLinks.slice(4).map(link => <a key={link} href="#" onClick={e => e.preventDefault()} className="text-white text-[15px] font-medium rounded-lg px-3 py-2.5 hover:bg-white/10 transition-all duration-300 no-underline tracking-[0.01em]" style={{
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

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
  return <div className="flex flex-col gap-0.5">
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 700,
      fontSize: '20px',
      color: '#ffffff',
      lineHeight: '1.1'
    }}>
      {stat.prefix && <span>{stat.prefix}</span>}
      <span>{displayCount}</span>
      <span>{stat.suffix}</span>
    </span>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      color: 'rgba(255,255,255,0.8)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: '1.4'
    }}>
      {stat.label}
    </span>
  </div>;
};
const STATIC_HERO_IMAGE = '/komatipoort-site.jpg';
const STATIC_HERO_HEADLINE_GREEN = 'Invest in Opportunity.';
const STATIC_HERO_HEADLINE_GOLD = 'Invest in Nkomazi SEZ.';
const STATIC_HERO_SUB = 'A strategically positioned Special Economic Zone in the heart of Mpumalanga, driving agro-processing, manufacturing, logistics, and green economy investment in Mpumalanga, South Africa.';
const STATIC_HERO_BODY = 'Nkomazi SEZ is positioned as a gateway for regional and international investment, offering world-class infrastructure, investor-focused incentives, and access to key trade corridors connecting South Africa to the African continent and global markets.';
const STATIC_HERO_CTA_PRIMARY = 'Explore Investment Opportunities';
const STATIC_HERO_CTA_SECONDARY = 'Speak to the Investment Team';
const VideoHero = () => {
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
          backgroundImage: `url("${STATIC_HERO_IMAGE}")`,
          backgroundPosition: 'center 55%',
          backgroundSize: 'cover'
        }} />
      </motion.div>
    </div>

    {/* Gradient overlays for readability */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to bottom, rgba(8,22,14,0.82) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)',
      zIndex: 1
    }} />

    {/* Bottom dark overlay for content legibility */}
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
        fontSize: 'clamp(120px, 24vw, 360px)',
        color: 'rgba(255,255,255,0.035)',
        lineHeight: 1,
        userSelect: 'none',
        letterSpacing: '-0.04em'
      }}>
        NKOMAZI SEZ
      </span>
    </div>

    {/* Main hero content */}
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
            <span style={{ color: GOLD }}>Overview</span>
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
            fontSize: 'clamp(36px, 6vw, 80px)',
            lineHeight: '1.05',
            letterSpacing: '-1px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0
          }}>
            <span style={{
              color: '#5DBB3A',
              display: 'block'
            }}>{STATIC_HERO_HEADLINE_GREEN}</span>
            <span style={{
              color: '#FFFFFF',
              display: 'block'
            }}>Invest in Nkomazi SEZ.</span>
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
            fontSize: 'clamp(13px, 1.6vw, 15px)',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: 0,
            marginTop: '14px',
            fontWeight: 500,
            maxWidth: '560px'
          }}>
            {STATIC_HERO_SUB}
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
          <div ref={statsRowRef} className="flex flex-row items-center" style={{
            gap: '20px',
            marginBottom: '20px'
          }}>
            {HERO_STATS.map((stat, i) => <div key={stat.label} className="flex flex-row items-center" style={{
              gap: '20px'
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
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '10px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            {STATIC_HERO_BODY}
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
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '16px',
            marginTop: 0,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            Whether you\'re expanding into regional markets, establishing a manufacturing base, or exploring sustainable industrial opportunities, Nkomazi SEZ is your gateway to growth on the African continent.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-3" initial={{
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
            <GoldButton label={STATIC_HERO_CTA_PRIMARY} href="/investor-hub" />
            <GhostButton label={STATIC_HERO_CTA_SECONDARY} href="/contact" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>

    {/* Animated scroll indicator bottom-centre */}
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

// ─── FAQ item ─────────────────────────────────────────────────────────────────

const FaqItem = ({
  num,
  question,
  answer,
  isLast,
  index
}: {
  num: number;
  question: string;
  answer: string;
  isLast: boolean;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-40px'
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 28
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.55,
    delay: index * 0.1,
    ease: [0.22, 1, 0.36, 1]
  }} className={`${!isLast ? 'border-b border-[rgba(0,0,0,0.08)]' : ''}`}>
    <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-start gap-4 sm:gap-5 py-5 sm:py-6 px-4 sm:px-5 group cursor-pointer bg-transparent border-0 outline-none" style={{
      fontFamily: BODY_FONT
    }} aria-expanded={open}>
      <motion.div animate={{
        backgroundColor: open ? '#1fac67' : '#EEF3EF',
        rotate: open ? 45 : 0
      }} transition={{
        duration: 0.25,
        ease: 'easeOut'
      }} className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5">
        <motion.span animate={{
          color: open ? '#ffffff' : '#1fac67'
        }} transition={{
          duration: 0.25
        }} className="text-xl font-light leading-none select-none" style={{
          fontFamily: HEADING_FONT
        }}>
          {open ? '+' : String(num)}
        </motion.span>
      </motion.div>
      <div className="flex-1 flex flex-col gap-0">
        <h3 className="text-[#111111] font-semibold leading-[1.3] tracking-[-0.3px] m-0 group-hover:text-[#1fac67] transition-colors duration-200 text-[18px] sm:text-[22px]" style={{
          fontFamily: HEADING_FONT
        }}>
          {question}
        </h3>
        <AnimatePresence initial={false}>
          {open && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            overflow: 'hidden'
          }}>
            <p className="text-[#111111]/70 text-[15px] sm:text-base leading-[1.75] mt-3 mb-0" style={{
              fontFamily: BODY_FONT,
              fontWeight: 400
            }}>
              {answer}
            </p>
          </motion.div>}
        </AnimatePresence>
      </div>
      <motion.div animate={{
        rotate: open ? 135 : 0
      }} transition={{
        duration: 0.25,
        ease: 'easeOut'
      }} className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#1fac67] mt-0.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </button>
  </motion.div>;
};

// ─── Stats Strip ──────────────────────────────────────────────────────────────

const STATS_STRIP_DATA = [{
  value: 50,
  prefix: 'R',
  suffix: ' Billion',
  label: 'Projected Investment'
}, {
  value: 45000,
  prefix: '',
  suffix: '',
  label: 'Jobs to be Created'
}, {
  value: 14,
  prefix: '',
  suffix: '+',
  label: 'Registered Investors'
}, {
  value: 2028,
  prefix: '',
  suffix: '',
  label: 'Infrastructure Completion'
}] as {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
}[];
const StatsStripItem = ({
  stat,
  inView
}: {
  stat: {
    value: number;
    prefix: string;
    suffix: string;
    label: string;
  };
  inView: boolean;
}) => {
  const count = useCountUp(stat.value, inView, 2.0);
  return <div className="flex flex-col items-center gap-2 px-8 py-4">
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 300,
      fontSize: 'clamp(40px, 5vw, 52px)',
      lineHeight: '1',
      color: '#C8A84B',
      letterSpacing: '-2px'
    }}>
      {stat.prefix}{count.toLocaleString()}{stat.suffix}
    </span>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      color: 'rgba(17,17,17,0.5)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      lineHeight: '1.4',
      textAlign: 'center'
    }}>
      {stat.label}
    </span>
  </div>;
};
const StatsStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-40px'
  });
  return <section className="py-[80px] sm:py-[120px]" style={{
    background: '#FFFFFF'
  }}>
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16">
      <FadeUp delay={0} className="flex flex-col items-center gap-3 text-center">
        <Subtitle light={false}>Zone at a Glance</Subtitle>
        <AnimatedHeading className="font-light m-0 text-4xl sm:text-5xl mt-4 mb-4" style={{
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#111111'
        }}>
          Building a Platform for Industrial Growth
        </AnimatedHeading>
        <div className="max-w-[760px] mx-auto text-center" style={{
          fontFamily: BODY_FONT
        }}>
          <span style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(17,17,17,0.65)',
            display: 'block',
            lineHeight: '1.75'
          }}>
            Nkomazi SEZ is creating a platform for industrial growth, investment attraction and sustainable economic development across Mpumalanga and the Southern African region.
          </span>
        </div>
      </FadeUp>

      <div ref={ref}>
        <FadeUp delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
            {STATS_STRIP_DATA.map((stat, i) => <div key={stat.label} className="flex flex-row items-center">
              <StatsStripItem stat={stat} inView={inView} />
              {i < STATS_STRIP_DATA.length - 1 && <div style={{
                width: '1px',
                height: '48px',
                background: 'rgba(17,17,17,0.12)',
                flexShrink: 0
              }} />}
            </div>)}
          </div>
        </FadeUp>
      </div>
    </div>
  </section>;
};

// ─── Zone Overview ────────────────────────────────────────────────────────────

const ZONE_STATS_NEW = [{
  value: 'R50 Billion',
  label: 'Projected Investment'
}, {
  value: '45,000',
  label: 'Jobs to be Created'
}, {
  value: '14+',
  label: 'Registered Investors'
}];
const ZoneOverview = () => <section style={{
  background: '#F8F7F0',
  paddingBottom: '100px'
}}>
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '600px'
  }} className="flex-col lg:flex-row">
    <FadeUp delay={0}>
      <div style={{
        background: '#F8F7F0',
        padding: 'clamp(60px,8vw,120px) clamp(40px,5vw,80px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '600px'
      }}>
        <span style={{
          fontFamily: BODY_FONT,
          fontSize: '11px',
          fontWeight: 700,
          color: '#e87326',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          display: 'block',
          marginBottom: '16px'
        }}>
          NKOMAZI SEZ AT A GLANCE
        </span>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          marginBottom: '28px'
        }}>
          <div style={{
            height: '2px',
            background: 'rgba(15,36,25,0.2)',
            width: '32px'
          }} />
          <div style={{
            height: '1px',
            background: 'rgba(15,36,25,0.2)',
            width: '14px'
          }} />
        </div>
        <h2 style={{
          fontFamily: HEADING_FONT,
          fontSize: 'clamp(40px,6vw,72px)',
          fontWeight: 700,
          color: '#111111',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: '0 0 24px 0'
        }}>
          A Platform for Industrial Growth
        </h2>
        <p style={{
          margin: '0 0 24px 0',
          fontFamily: BODY_FONT
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 500,
            color: '#111111',
            display: 'block',
            marginBottom: '8px'
          }}>
            Nkomazi SEZ is creating a platform for industrial growth, investment attraction and sustainable economic development.
          </span>
          <span style={{
            fontSize: '15px',
            color: 'rgba(17,17,17,0.6)',
            lineHeight: 1.8,
            display: 'block'
          }}>
            Across Mpumalanga and the Southern African region, Nkomazi SEZ offers world-class infrastructure, investor-focused incentives, and access to key trade corridors connecting South Africa to the African continent and global markets.
          </span>
        </p>
        <div style={{
          marginBottom: '32px'
        }}>
          {ZONE_STATS_NEW.map((stat, i) => <div key={stat.label} style={{
            borderTop: i === 0 ? '1px solid rgba(17,17,17,0.08)' : undefined,
            borderBottom: '1px solid rgba(17,17,17,0.08)',
            paddingTop: '16px',
            paddingBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              fontSize: '32px',
              color: '#e87326'
            }}>{stat.value}</span>
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: '12px',
              color: 'rgba(17,17,17,0.5)',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em'
            }}>
              {stat.label}
            </span>
          </div>)}
        </div>
        <GoldButton label="Explore Investment Opportunities" href="/investor-hub" />
      </div>
    </FadeUp>

    <FadeUp delay={0.15}>
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '600px',
        backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(15,36,25,0.6) 0%, transparent 60%)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '32px',
          right: '32px',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            color: '#ffffff',
            margin: '0 0 10px 0',
            lineHeight: 1.6
          }}>
            On the Maputo Development Corridor — connecting South Africa, Mozambique, Eswatini and broader SADC markets.
          </p>
          <span style={{
            background: '#e87326',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '999px',
            display: 'inline-block'
          }}>
            Komatipoort, Mpumalanga · 2028 Infrastructure Completion
          </span>
        </div>
      </div>
    </FadeUp>
  </div>
</section>;

// ─── Enterprise Hub Section (Why Invest — 6 cards) ────────────────────────────

const EnterpriseHubSection = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  return <section className="py-[80px] mx-1.5 sm:mx-2.5 mb-2.5">
    <div className="relative rounded-3xl py-14 sm:py-20 px-4 sm:px-6" style={{
      background: '#EDF3EE'
    }}>
      <div className="relative max-w-[1372px] mx-auto flex flex-col gap-10 sm:gap-14" style={{
        zIndex: 1
      }}>
        <div className="flex flex-col items-start gap-4 max-w-[640px]">
          <span style={{
            fontFamily: BODY_FONT,
            fontSize: '11px',
            fontWeight: 700,
            color: '#C9A84C',
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            display: 'block'
          }}>WHY NKOMAZI SEZ</span>
          <FadeUp delay={0}>
            <h2 style={{
              margin: 0,
              lineHeight: 1.0
            }}>
              <span style={{
                fontFamily: HEADING_FONT,
                fontWeight: 400,
                fontSize: 'clamp(32px, 4vw, 48px)',
                color: '#1D4D35',
                display: 'block',
                letterSpacing: '-0.5px'
              }}>The Case for</span>
              <span style={{
                fontFamily: HEADING_FONT,
                fontWeight: 900,
                fontSize: 'clamp(52px, 7vw, 72px)',
                color: '#1D4D35',
                display: 'block',
                letterSpacing: '-2px',
                lineHeight: 0.95
              }}>Investing Here</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{
              fontFamily: BODY_FONT,
              fontSize: '18px',
              fontWeight: 600,
              color: '#1D4D35',
              margin: 0,
              maxWidth: '480px',
              lineHeight: 1.55
            }}>
              Six compelling reasons why leading investors, manufacturers and agro-processors are choosing Nkomazi SEZ as their base for African growth.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.2}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 0,
            marginBottom: '48px'
          }}>
            {EH_METRICS.map((metric, i) => <React.Fragment key={metric.value}>
              <div style={{
                flex: 1,
                paddingRight: i < EH_METRICS.length - 1 ? '32px' : 0
              }}>
                <div style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: 200,
                  color: '#C8A84B',
                  letterSpacing: '-0.03em',
                  lineHeight: 1
                }}>
                  {metric.value}
                </div>
                <div style={{
                  fontFamily: BODY_FONT,
                  fontSize: '13px',
                  color: 'rgba(17,17,17,0.55)',
                  marginTop: '8px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }}>
                  {metric.label}
                </div>
              </div>
              {i < EH_METRICS.length - 1 && <div style={{
                width: '1px',
                background: 'rgba(17,17,17,0.12)',
                alignSelf: 'stretch',
                margin: '0 32px 0 0'
              }} />}
            </React.Fragment>)}
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENTERPRISE_HUB_CARDS.map((b, i) => <motion.div key={b.id} initial={{
            opacity: 0,
            y: 32
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.55,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }} onHoverStart={() => setHovered(b.id)} onHoverEnd={() => setHovered(null)} className="relative overflow-hidden rounded-2xl cursor-default" style={{
            minHeight: '400px'
          }}>
            <motion.div className="absolute inset-0" animate={{
              scale: hovered === b.id ? 1.07 : 1
            }} transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              backgroundImage: `url("${b.bgImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 25%'
            }} />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 30%, ${ENTERPRISE_CARD_BOTTOM_COLORS[i]}CC 65%, ${ENTERPRISE_CARD_BOTTOM_COLORS[i]} 85%)`
            }} />
            <motion.div className="absolute inset-0" animate={{
              opacity: hovered === b.id ? 1 : 0
            }} transition={{
              duration: 0.4
            }} style={{
              background: 'linear-gradient(135deg, rgba(200,168,75,0.15) 0%, transparent 60%)'
            }} />
            <motion.div className="absolute top-0 left-0 right-0 h-[2px]" animate={{
              scaleX: hovered === b.id ? 1 : 0,
              opacity: hovered === b.id ? 1 : 0
            }} transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              background: '#C8A84B',
              transformOrigin: 'left'
            }} />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8" style={{
              minHeight: '400px'
            }}>
              <div className="flex flex-col gap-3">
                <span className="text-[#C8A84B] font-light" style={{
                  fontFamily: HEADING_FONT,
                  fontSize: 'clamp(44px, 6vw, 64px)',
                  lineHeight: '1',
                  letterSpacing: '-2px'
                }}>
                  {b.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-semibold text-xl leading-tight m-0" style={{
                    fontFamily: HEADING_FONT,
                    letterSpacing: '-0.3px'
                  }}>
                    {b.title}
                  </h3>
                  <motion.p className="text-white/65 text-[13px] leading-[1.65] m-0" style={{
                    fontFamily: BODY_FONT
                  }} animate={{
                    opacity: hovered === b.id ? 1 : 0.7,
                    y: hovered === b.id ? 0 : 4
                  }} transition={{
                    duration: 0.3
                  }}>
                    {b.desc}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>)}
        </div>

        <FadeUp delay={0.2}>
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-px" style={{
              background: 'rgba(200,168,75,0.3)'
            }} />
            <p className="text-[#111111]/40 text-[13px] tracking-[0.08em] uppercase text-center m-0" style={{
              fontFamily: BODY_FONT
            }}>
              Ready to grow within the zone?
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <GoldButton label="Explore Investment Opportunities" href="/investor-hub" />
              <motion.a href="/contact" className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg" whileHover={{
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
                  border: '2px solid #111111',
                  borderRight: 'none',
                  color: '#111111',
                  background: 'transparent'
                }}>
                  Speak to the Investment Team
                </div>
                <div className="flex items-center justify-center w-[44px] rounded-r-lg flex-shrink-0" style={{
                  border: '2px solid #111111',
                  borderLeft: 'none',
                  color: '#111111',
                  background: 'transparent'
                }}>
                  <ArrowUpRightIcon />
                </div>
              </motion.a>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>;
};

// ─── Key Sectors ──────────────────────────────────────────────────────────────

const KeySectors = ({
  activeSector,
  setActiveSector
}: {
  activeSector: number;
  setActiveSector: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [userClicked, setUserClicked] = useState(false);
  useEffect(() => {
    if (userClicked) return;
    const t = setInterval(() => setActiveSector(i => (i + 1) % SEZ_SECTORS.length), 6000);
    return () => clearInterval(t);
  }, [userClicked, setActiveSector]);
  useEffect(() => {
    if (!userClicked) return;
    const t = setTimeout(() => setUserClicked(false), 18000);
    return () => clearTimeout(t);
  }, [userClicked]);
  const activeBottomColor = SECTOR_BOTTOM_COLORS[activeSector];
  return <section className="mx-1.5 sm:mx-2.5 mb-2.5" style={{
    borderTop: '2px solid #E8521A',
    background: '#F5F0E8'
  }}>
    <style>{`@keyframes fillBar { from { width: 0% } to { width: 100% } }`}</style>

    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-0">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-10">
        <div className="flex flex-col items-start gap-3">
          <Subtitle>Priority Sectors</Subtitle>
          <AnimatedHeading className="font-light m-0 text-[32px] sm:text-[40px] lg:text-[52px]" style={{
            lineHeight: '1.1',
            letterSpacing: '-1px',
            color: '#1D4D35'
          }}>
            Sectors strengthening regional value chains
          </AnimatedHeading>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEZ_SECTORS.map((s, i) => <motion.button key={s.id} onClick={() => {
            setActiveSector(i);
            setUserClicked(true);
          }} className="relative px-4 sm:px-5 py-2.5 rounded-full text-[13px] font-medium tracking-[0.04em] overflow-hidden flex flex-col gap-0" style={{
            fontFamily: BODY_FONT,
            border: `1px solid ${activeSector === i ? '#1D4D35' : 'rgba(0,0,0,0.15)'}`,
            color: activeSector === i ? '#ffffff' : '#555',
            background: activeSector === i ? '#1D4D35' : 'rgba(0,0,0,0.04)'
          }} whileTap={{
            scale: 0.96
          }} transition={{
            duration: 0.2
          }}>
            <span>{s.tag}</span>
            <div style={{
              height: '2px',
              background: '#C8A84B',
              animation: activeSector === i && !userClicked ? 'fillBar 6s linear forwards' : 'none',
              transformOrigin: 'left',
              width: activeSector === i && !userClicked ? undefined : '0%'
            }} />
          </motion.button>)}
        </div>
      </div>
    </div>

    <div className="relative overflow-hidden" style={{
      minHeight: '560px'
    }}>
      {SEZ_SECTORS.map((s, i) => <motion.div key={s.id} className="absolute inset-0" animate={{
        opacity: activeSector === i ? 1 : 0
      }} transition={{
        duration: 0.8,
        ease: 'easeInOut'
      }} style={{
        backgroundImage: `url("${s.bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: s.bgPosition || 'center'
      }} />)}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 40%, ${activeBottomColor}CC 70%, ${activeBottomColor} 90%)`
      }} />

      <div className="relative z-10 max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8" style={{
        minHeight: '560px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '48px'
      }}>
        <AnimatePresence mode="wait">
          {SEZ_SECTORS.map((svc, i) => i === activeSector ? <motion.div key={svc.id} initial={{
            opacity: 0,
            y: 24
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -16
          }} transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1]
          }} style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'flex-end',
            width: '100%'
          }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                fontFamily: HEADING_FONT,
                fontWeight: 900,
                fontSize: 'clamp(80px, 12vw, 140px)',
                color: '#e87326',
                opacity: 0.15,
                position: 'absolute',
                top: 0,
                left: '-8px',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none'
              }}>
                {svc.label}
              </div>
              <div style={{
                paddingTop: '16px'
              }}>
                <span style={{
                  background: 'rgba(232,115,38,0.85)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontFamily: BODY_FONT,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const
                }}>
                  {svc.tag}
                </span>
              </div>
              <h3 style={{
                fontFamily: HEADING_FONT,
                fontSize: 'clamp(28px,4vw,48px)',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.1
              }}>
                {svc.title}
              </h3>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: '560px'
              }}>
                {svc.desc}
              </p>
              <div style={{
                marginTop: '24px'
              }}>
                <GoldButton label="Explore This Sector" href="/sectors" />
              </div>
            </div>
          </motion.div> : null)}
        </AnimatePresence>
      </div>
    </div>
  </section>;
};

// ─── Voices Section ───────────────────────────────────────────────────────────

const VoicesSection = () => {
  const [active, setActive] = useState(0);
  const [quoteScale, setQuoteScale] = useState(1);
  const handleDotClick = useCallback((i: number) => {
    setQuoteScale(0.9);
    setTimeout(() => {
      setQuoteScale(1);
      setActive(i);
    }, 300);
  }, []);
  return <section style={{
    background: '#0F2D1A',
    padding: '100px 0',
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Radial vignette edges */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
      background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,15,10,0.6) 100%)',
      zIndex: 1
    }} />

    {/* Background giant quote mark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{
      zIndex: 0
    }}>
      <motion.span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: 'clamp(200px,30vw,380px)',
        color: 'rgba(255,255,255,0.04)',
        lineHeight: 1,
        userSelect: 'none'
      }} animate={{
        scale: quoteScale
      }} transition={{
        duration: 0.3
      }}>
        {'"'}
      </motion.span>
    </div>

    <div className="relative" style={{
      maxWidth: '1372px',
      margin: '0 auto',
      paddingLeft: '24px',
      paddingRight: '24px',
      zIndex: 2
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '56px'
      }}>
        <span style={{
          fontFamily: BODY_FONT,
          fontSize: '11px',
          fontWeight: 700,
          color: '#C9A84C',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          display: 'inline-block'
        }}>
          VOICES FROM THE ZONE
        </span>
        <AnimatedHeading style={{
          fontFamily: HEADING_FONT,
          fontSize: 'clamp(32px,5vw,60px)',
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          marginTop: '8px'
        }}>
          What Our Partners Say
        </AnimatedHeading>
      </div>

      {/* Testimonial carousel */}
      <AnimatePresence mode="wait">
        {INVESTOR_STORIES.map((story, i) => i === active ? <motion.div key={story.id} initial={{
          opacity: 0,
          y: 24
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -16
        }} transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }} className="max-w-[800px] mx-auto text-center">
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.85)',
            fontStyle: 'italic',
            margin: '0 0 32px 0'
          }}>
            {`"${story.quote}"`}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px'
          }}>
            <img src={story.image} alt={story.name} style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(201,168,76,0.4)'
            }} loading="lazy" />
            <div style={{
              textAlign: 'left'
            }}>
              <div style={{
                fontFamily: BODY_FONT,
                fontWeight: 700,
                fontSize: '15px',
                color: '#ffffff'
              }}>{story.name}</div>
              <div style={{
                fontFamily: BODY_FONT,
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)'
              }}>{story.role}, {story.company}</div>
            </div>
            <span style={{
              background: 'rgba(201,168,76,0.15)',
              color: '#C9A84C',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '999px',
              fontFamily: BODY_FONT
            }}>
              {story.sector}
            </span>
          </div>
        </motion.div> : null)}
      </AnimatePresence>

      {/* Dot navigation */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '48px'
      }}>
        {INVESTOR_STORIES.map((story, i) => <div key={`voice-dot-${story.id}`} onClick={() => handleDotClick(i)} style={{
          cursor: 'pointer',
          height: '8px',
          width: active === i ? '28px' : '8px',
          borderRadius: '99px',
          background: active === i ? '#C9A84C' : 'rgba(255,255,255,0.25)',
          transition: 'width 0.3s ease'
        }} />)}
      </div>
    </div>
  </section>;
};

// ─── Community Portal Snippet (Investment Journey — 4 steps) ──────────────────

const COMMUNITY_STATS = [{
  num: '2028',
  numericVal: 2028,
  label: 'INFRASTRUCTURE COMPLETION',
  display: (n: number) => `${n}`
}, {
  num: '14+',
  numericVal: 14,
  label: 'REGISTERED INVESTORS',
  display: (n: number) => `${n}+`
}, {
  num: 'R50bn',
  numericVal: 50,
  label: 'PROJECTED INVESTMENT (ZAR)',
  display: (n: number) => `R${n}bn`
}] as {
  num: string;
  numericVal: number;
  label: string;
  display: (n: number) => string;
}[];
const CommunityStatItem = ({
  stat,
  inView
}: {
  stat: {
    num: string;
    numericVal: number;
    label: string;
    display: (n: number) => string;
  };
  inView: boolean;
}) => {
  const count = useCountUp(stat.numericVal, inView, 1.8);
  return <div className="flex flex-col items-center gap-2 px-8 py-4">
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 300,
      fontSize: 'clamp(40px, 5vw, 52px)',
      lineHeight: '1',
      color: '#C8A84B',
      letterSpacing: '-2px'
    }}>
      {stat.display(count)}
    </span>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: '11px',
      color: 'rgba(17,17,17,0.5)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      lineHeight: '1.4',
      textAlign: 'center'
    }}>
      {stat.label}
    </span>
  </div>;
};
const CommunityPortalSnippet = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, {
    once: true,
    margin: '-40px'
  });
  return <section className="py-[80px] sm:py-[120px]" style={{
    background: '#FFFFFF'
  }}>
    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16">
      <FadeUp delay={0} className="flex flex-col items-center gap-3 text-center">
        <Subtitle light={false}>THE INVESTMENT JOURNEY</Subtitle>
        <AnimatedHeading className="font-light m-0 text-4xl sm:text-5xl mt-4 mb-4" style={{
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#111111'
        }}>
          Your Path to Investing in Nkomazi SEZ
        </AnimatedHeading>
        <div className="max-w-[680px] mx-auto text-center" style={{
          fontFamily: BODY_FONT
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'rgba(17,17,17,0.85)',
            display: 'block',
            marginBottom: '8px'
          }}>
            All investment proposals follow a structured 8-step evaluation and approval process, organised across three clear stages.
          </span>
          <span style={{
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(17,17,17,0.6)',
            display: 'block'
          }}>
            This ensures every investment is properly assessed, supported, and positioned for long-term success within the zone.
          </span>
        </div>
      </FadeUp>

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
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = stage.hoverBg;
                    e.currentTarget.style.borderColor = stage.borderColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
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
                          color: '#111111',
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
                          color: 'rgba(17,17,17,0.6)',
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

      <div ref={statsRef}>
        <FadeUp delay={0.2}>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: '11px',
            color: 'rgba(17,17,17,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Zone at a Glance
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
            {COMMUNITY_STATS.map((stat, i) => <div key={stat.label} className="flex flex-row items-center">
              <CommunityStatItem stat={stat} inView={statsInView} />
              {i < COMMUNITY_STATS.length - 1 && <div style={{
                width: '1px',
                height: '48px',
                background: 'rgba(17,17,17,0.12)',
                flexShrink: 0
              }} />}
            </div>)}
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.3}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <GoldButton label="Start Your Investment Journey" href="/investor-hub" />
          <GreenButton label="Contact Our Investment Team" href="/contact" />
        </div>
      </FadeUp>
    </div>
  </section>;
};

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

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

// ─── Back to Top Button ───────────────────────────────────────────────────────

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

// ─── About Us ─────────────────────────────────────────────────────────────────

const ABOUT_STAT_PILLS = [{
  value: '2028',
  display: '2028',
  label: 'Infrastructure Completion',
  isCountUp: false
}, {
  value: 'Maputo Corridor',
  display: 'Maputo Corridor',
  label: 'Strategic Access',
  isCountUp: false
}, {
  value: 'SADC',
  display: 'SADC',
  label: 'Market Access',
  isCountUp: false
}];
const AboutStatPill = ({
  pill,
  sectionInView
}: {
  pill: {
    value: string;
    display: string;
    label: string;
    isCountUp: boolean;
  };
  sectionInView: boolean;
}) => {
  const pillRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!sectionInView || hasAnimated || !pill.isCountUp) return;
    setHasAnimated(true);
    const target = parseInt(pill.value.replace(/[^0-9]/g, ''), 10);
    const duration = 1800;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step); else setCount(target);
    };
    requestAnimationFrame(step);
  }, [sectionInView, hasAnimated, pill.isCountUp, pill.value]);
  const displayValue = pill.isCountUp ? count.toLocaleString() + ' ha' : pill.display;
  return <div ref={pillRef} style={{
    background: 'rgba(29,77,53,0.08)',
    border: '1px solid rgba(29,77,53,0.15)',
    borderRadius: '999px',
    padding: '8px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    minWidth: '90px'
  }}>
    <span style={{
      fontFamily: BODY_FONT,
      fontWeight: 700,
      fontSize: '16px',
      color: '#1D4D35',
      lineHeight: 1.2
    }}>
      {displayValue}
    </span>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#1D4D35',
      opacity: 0.6,
      lineHeight: 1.4,
      marginTop: '2px'
    }}>
      {pill.label}
    </span>
  </div>;
};
const ABOUT_HIGHLIGHT_CARDS = [{
  id: 'loc',
  title: 'Strategic Location',
  body: 'Positioned along the Maputo Development Corridor, with direct access to South Africa, Mozambique, Eswatini and broader SADC markets.',
  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
}, {
  id: 'incentives',
  title: 'Investor Incentives',
  body: 'Access to SEZ incentives, government support programmes, customs-controlled areas and investment facilitation services.',
  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
}, {
  id: 'infra',
  title: 'Infrastructure Ready',
  body: 'Nkomazi SEZ is developing responsive infrastructure that supports industrial growth, logistics operations and large-scale manufacturing investment.',
  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
}, {
  id: 'gov',
  title: 'Government Backing',
  body: 'Supported by the Mpumalanga Provincial Government, DEDT and DTIC, under the Special Economic Zones Act.',
  icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8521A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="M12 8v4l3 3" />
  </svg>
}];
const AboutUs = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: '-80px'
  });
  return <section id="sec-about" ref={ref} style={{
    backgroundColor: '#F8F7F0',
    backgroundImage: 'radial-gradient(circle, rgba(29,77,53,0.07) 1.5px, transparent 1.5px)',
    backgroundSize: '24px 24px',
    borderTop: '3px solid #E8521A',
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: 'clamp(48px, 6vw, 96px)',
    paddingRight: 'clamp(48px, 6vw, 96px)'
  }}>
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '40px'
      }}>
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=85" alt="Aerial landscape of Nkomazi SEZ region, Komatipoort" style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          display: 'block'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(15,36,25,0.7) 75%, #0F2419 100%)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '28px',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '999px',
          paddingLeft: '14px',
          paddingRight: '14px',
          paddingTop: '6px',
          paddingBottom: '6px',
          color: 'white',
          fontSize: '11px',
          fontWeight: 500,
          fontFamily: BODY_FONT,
          whiteSpace: 'nowrap'
        }}>
          <span>Komatipoort, Mpumalanga · 8km from Mozambique Border</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        <div className="w-full lg:w-[55%] flex flex-col gap-6">
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}>
            <span style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#E8521A',
              marginBottom: '14px',
              fontFamily: BODY_FONT
            }}>
              About Us
            </span>
            <h2 style={{
              margin: 0
            }}>
              <span style={{
                fontFamily: HEADING_FONT,
                fontWeight: 500,
                fontSize: 'clamp(32px, 3.8vw, 52px)',
                color: '#1D4D35',
                display: 'block',
                lineHeight: 1.0
              }}>
                Africa's Gateway
              </span>
              <span style={{
                fontFamily: HEADING_FONT,
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: 'clamp(38px, 4.8vw, 64px)',
                color: '#E8521A',
                display: 'block',
                lineHeight: 1.0,
                marginTop: '-4px'
              }}>
                to Investment.
              </span>
            </h2>
          </motion.div>

          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.55,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}>
            <p style={{
              fontFamily: BODY_FONT,
              margin: 0
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: 500,
                color: 'rgba(17,17,17,0.85)',
                display: 'block',
                marginBottom: '8px'
              }}>
                Nkomazi SEZ is a government-designated Special Economic Zone in Komatipoort, Mpumalanga — strategically positioned along the Maputo Development Corridor.
              </span>
              <span style={{
                fontSize: '15px',
                fontWeight: 400,
                color: 'rgba(17,17,17,0.6)',
                display: 'block'
              }}>
                Offering world-class infrastructure, investor-focused incentives, and access to key trade corridors connecting South Africa to Mozambique, Eswatini, and the broader SADC region.
              </span>
            </p>
          </motion.div>

          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.55,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }} className="flex flex-wrap gap-3">
            {ABOUT_STAT_PILLS.map(pill => <AboutStatPill key={pill.value} pill={pill} sectionInView={inView} />)}
          </motion.div>

          <motion.div initial={{
            opacity: 0,
            y: 16
          }} animate={inView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.5,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}>
            <motion.a href="/about" onClick={e => e.preventDefault()} className="inline-flex items-center gap-2 no-underline" style={{
              background: '#E8521A',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '14px',
              paddingLeft: '28px',
              paddingRight: '28px',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '6px',
              fontFamily: BODY_FONT,
              letterSpacing: '0.01em'
            }} whileHover={{
              y: -1
            }} whileTap={{
              scale: 0.97
            }} transition={{
              duration: 0.2
            }}>
              <span>Discover Our Story</span>
              <ChevronRight size={16} />
            </motion.a>
          </motion.div>
        </div>

        <div className="w-full lg:w-[45%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ABOUT_HIGHLIGHT_CARDS.map((card, i) => <motion.div key={card.id} initial={{
              opacity: 0,
              y: 24
            }} animate={inView ? {
              opacity: 1,
              y: 0
            } : {}} transition={{
              duration: 0.55,
              delay: 0.15 + i * 0.08,
              ease: [0.22, 1, 0.36, 1]
            }} style={{
              background: 'rgba(29,77,53,0.06)',
              border: '1px solid rgba(29,77,53,0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{
                marginBottom: '10px'
              }}>{card.icon}</div>
              <h3 style={{
                fontFamily: BODY_FONT,
                fontWeight: 700,
                fontSize: '14px',
                color: '#1D4D35',
                margin: '0 0 6px 0',
                lineHeight: 1.3
              }}>
                {card.title}
              </h3>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: '13px',
                color: 'rgba(29,77,53,0.65)',
                lineHeight: 1.5,
                margin: 0
              }}>
                {card.body}
              </p>
            </motion.div>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
};

// ─── Active Tenders Section ───────────────────────────────────────────────────

type OpportunityCategory = 'Tender' | 'RFQ' | 'Partnership' | 'Leasing' | 'EOI';
interface Opportunity {
  id: string;
  category: OpportunityCategory;
  title: string;
  description: string;
  closingDate: string;
  status: 'Open' | 'Closed' | 'Closing Soon';
}

const OPPORTUNITIES_SUBSET: Opportunity[] = [{
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
}];

const getCategoryColor = (cat: OpportunityCategory) => {
  switch (cat) {
    case 'Tender':
      return '#1D4D35';
    case 'RFQ':
      return '#1A3320';
    case 'Partnership':
      return '#C9A84C';
    case 'Leasing':
      return '#E8521A';
    case 'EOI':
      return '#1A2744';
    default:
      return '#1D4D35';
  }
};

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
            color: '#C9A84C',
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
        <a href="/tenders" className="flex items-center gap-2 no-underline" style={{
          fontFamily: BODY_FONT,
          fontSize: '11px',
          fontWeight: 700,
          color: '#1fac67',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
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
            transition: 'background 0.2s ease',
            color: hovered ? '#ffffff' : 'inherit'
          }}>
            <ArrowRightIcon />
          </div>
        </a>
      </div>
    </div>
  </motion.div>;
};

const ActiveTendersSection = () => {
  return <section id="sec-tenders" className="py-[80px] mx-1.5 sm:mx-2.5 mb-2.5">
    <div className="relative rounded-3xl py-14 sm:py-20 px-4 sm:px-6" style={{
      background: '#EDF3EE'
    }}>
      <div className="max-w-[1372px] mx-auto flex flex-col gap-12 sm:gap-16 relative z-10">
        <FadeUp delay={0} className="flex flex-col items-center gap-3 text-center">
          <Subtitle light={false}>Procurement &amp; Investment</Subtitle>
          <AnimatedHeading className="font-light m-0 text-4xl sm:text-5xl mt-4 mb-4" style={{
            lineHeight: '1.1',
            letterSpacing: '-1px',
            color: '#111111'
          }}>
            Current Active Opportunities
          </AnimatedHeading>
          <div className="max-w-[680px] mx-auto text-center" style={{
            fontFamily: BODY_FONT
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: 500,
              color: 'rgba(17,17,17,0.85)',
              display: 'block',
              marginBottom: '8px'
            }}>
              Explore active tenders, RFQs, and strategic partnership calls within the zone.
            </span>
            <span style={{
              fontSize: '15px',
              fontWeight: 400,
              color: 'rgba(17,17,17,0.6)',
              display: 'block'
            }}>
              Join us in building Mpumalanga's economic future. Partner with the Nkomazi Special Economic Zone.
            </span>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OPPORTUNITIES_SUBSET.map((opp, index) => <OpportunityCard key={opp.id} item={opp} index={index} />)}
        </div>

        <FadeUp delay={0.2} className="flex justify-center mt-4">
          <motion.a href="/tenders" className="group flex h-[44px] items-stretch no-underline relative overflow-hidden rounded-lg" whileHover={{
            y: -2,
            scale: 1.015
          }} whileTap={{
            scale: 0.97
          }} transition={{
            duration: 0.2,
            ease: 'easeOut'
          }}>
            <div className="flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
              fontFamily: BODY_FONT,
              background: '#E8521A'
            }}>
              View All Tenders
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
        </FadeUp>
      </div>
    </div>
  </section>;
};

// ─── Page component ───────────────────────────────────────────────────────────

export function Homev2Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSector, setActiveSector] = useState(0);
  void INVEST_STEPS;
  return <div className="w-full bg-white overflow-x-hidden" style={{
    fontFamily: BODY_FONT
  }}>
    <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@300;400;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap');
`}</style>
    <ScrollProgressBar />
    <BackToTop />
    <NSEZNavbar />

    {/* Hero — extra top padding to account for banner + nav */}
    <div id="sec-hero" style={{
      paddingTop: '36px'
    }}>
      <VideoHero />
    </div>

    {/* Partner Marquee */}
    <section id="sec-partners" className="py-[80px] sm:py-[120px] pb-[80px] sm:pb-[100px] flex flex-col items-center gap-6 overflow-hidden">
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
          background: 'linear-gradient(90deg, #fff, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, #fff)'
        }} />
      </div>
    </section>

    <GoldDivider />

    {/* About Us */}
    <div id="sec-about" style={{
      display: 'none'
    }}>
      <AboutUs />
    </div>

    {/* Zone Overview — REMOVED (first NSEZ At a Glance instance) */}

    {/* Key Sectors */}
    <div id="sec-sectors">
      <KeySectors activeSector={activeSector} setActiveSector={setActiveSector} />
    </div>

    <GoldDivider />

    {/* Why Invest — 6 cards */}
    <div id="sec-benefits">
      <EnterpriseHubSection />
    </div>

    {/* Regional Map */}
    <div id="sec-map">
      <InvestmentCorridors />
    </div>

    {/* Investment Journey */}
    <div id="sec-journey">
      <CommunityPortalSnippet />
    </div>

    <GoldDivider />

    {/* Active Tenders Section */}
    <ActiveTendersSection />

    <GoldDivider />

    {/* Voices Section */}
    <div id="sec-testimonials">
      <VoicesSection />
    </div>

    <GoldDivider />

    {/* FAQs */}
    <section id="sec-faq" className="py-[80px] sm:py-[120px]" style={{
      background: '#F8F7F0'
    }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:gap-10 overflow-hidden">
          <div className="flex flex-col items-center gap-3 text-center">
            <Subtitle>FAQs</Subtitle>
            <AnimatedHeading className="text-[#111111] font-light m-0 text-[32px] sm:text-[40px] lg:text-[52px]" style={{
              lineHeight: '1.1',
              letterSpacing: '-1px'
            }}>
              Questions? Glad you asked
            </AnimatedHeading>
          </div>
          <div className="border border-[rgba(0,0,0,0.08)] rounded-2xl overflow-hidden">
            {FAQS.map((faq, i) => <FaqItem key={faq.q} num={i + 1} question={faq.q} answer={faq.a} isLast={i === FAQS.length - 1} index={i} />)}
          </div>
          <FadeUp delay={0.3}>
            <div style={{
              textAlign: 'center',
              marginTop: '48px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(17,17,17,0.1)'
            }}>
              <p style={{
                fontFamily: BODY_FONT,
                fontSize: '15px',
                color: 'rgba(17,17,17,0.55)',
                marginBottom: '16px'
              }}>Still have questions?</p>
              <motion.a href="/contact" style={{
                fontFamily: BODY_FONT,
                fontSize: '15px',
                fontWeight: 600,
                color: '#111111',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderBottom: '1.5px solid #C8A84B',
                paddingBottom: '2px'
              }} whileHover={{
                gap: '10px'
              }} transition={{
                duration: 0.2
              }}>
                <span>Contact the Investment Desk</span>
                <ArrowRightIcon />
              </motion.a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>

    {/* Contact CTA */}
    <section id="sec-cta" className="relative flex flex-col justify-end overflow-hidden rounded-3xl mx-1.5 sm:mx-2.5 mb-2.5" style={{
      minHeight: '620px'
    }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'url("/manufacturing4.jpg")',
        backgroundPosition: 'center 40%',
        backgroundSize: 'cover'
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(15,36,25,0.75) 65%, #0F2419 90%)'
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg, transparent 40%, rgba(200,168,75,0.04) 60%, transparent 80%)'
      }} />

      <div className="relative z-10 max-w-[1372px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pb-12 sm:pb-16">
        <div className="flex flex-col gap-6 sm:gap-7 items-start max-w-full sm:max-w-[780px]">
          <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            ease: 'easeOut'
          }} className="flex items-center gap-3">
            <div className="w-8 h-px bg-[#C8A84B]" />
            <span className="text-[#C8A84B] text-xs font-medium tracking-[0.16em] uppercase" style={{
              fontFamily: BODY_FONT
            }}>
              Ready to Invest?
            </span>
          </motion.div>
          <AnimatedHeading className="text-white font-light m-0 text-[32px] sm:text-[40px] lg:text-[52px]" style={{
            lineHeight: '1.06',
            letterSpacing: '-1px'
          }}>
            Speak to our investment team and discover opportunities within the Nkomazi Special Economic Zone.
          </AnimatedHeading>
          <FadeUp delay={0.3} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
            <GreenButton label="Contact Our Investment Team" href="/contact" />
          </FadeUp>
        </div>

      </div>
    </section>

    <NSEZFooterSection />
  </div>;
};