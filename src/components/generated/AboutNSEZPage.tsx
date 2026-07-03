import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Menu, X, MapPin } from "lucide-react";
import { NSEZNavbar } from "./NSEZNavbar";
import { NSEZFooterSection } from "./NSEZFooterSection";
import { NsezValuesSection } from "./NsezValuesSection";

// ─── Font constants ───────────────────────────────────────────────────────────
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";

// ─── Easing ───────────────────────────────────────────────────────────────────
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const EASE_V5 = [0.22, 1, 0.36, 1] as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_SECTORS = ["Agro-processing & Agriculture", "Manufacturing", "Green Economy", "Logistics & Warehousing"];
const NAV_SIMPLE_LINKS = ["About Nkomazi SEZ", "Invest", "Sectors", "MSME Hub", "Tenders", "News and Media", "Stakeholder Relations", "Careers", "Contact Us"];
const DESKTOP_NAV_LINKS = ["About Nkomazi SEZ", "Invest", "MSME Hub", "Tenders", "News and Media", "Stakeholder Relations", "Careers"];
interface ValueItem {
  letter: string;
  name: string;
  description: string;
}
const VALUES: ValueItem[] = [{
  letter: "I",
  name: "Integrity",
  description: "Doing the right thing, always — in every interaction, decision and commitment we make to our investors, communities and partners."
}, {
  letter: "N",
  name: "Nurture",
  description: "Developing talent, growing enterprises and cultivating potential within our communities and the organisations we work with."
}, {
  letter: "V",
  name: "Value",
  description: "Creating sustainable economic impact that benefits investors, workers and the region through long-term industrial growth."
}, {
  letter: "E",
  name: "Excellence",
  description: "Striving for the highest quality in service, infrastructure and investor support — setting the benchmark for SEZ performance."
}, {
  letter: "S",
  name: "Sustainability",
  description: "Balancing economic ambition with environmental responsibility to ensure lasting prosperity for future generations."
}, {
  letter: "T",
  name: "Transparency",
  description: "Openness in all our dealings, with clear accountability to government, investors, and the communities we serve."
}, {
  letter: "A",
  name: "Agility",
  description: "Adapting to changing markets, seizing new opportunities and responding swiftly to investor and developer needs."
}];
interface StatItem {
  target: number;
  suffix: string;
  prefix: string;
  label: string;
  decimals: number;
}
const STATS: StatItem[] = [{
  target: 50,
  suffix: "B+",
  prefix: "R",
  label: "Projected Investment Value",
  decimals: 0
}, {
  target: 45000,
  suffix: "+",
  prefix: "",
  label: "Jobs to be Created",
  decimals: 0
}, {
  target: 14,
  suffix: "+",
  prefix: "",
  label: "Registered Investors",
  decimals: 0
}, {
  target: 1600,
  suffix: " ha",
  prefix: "",
  label: "Total Development Area",
  decimals: 0
}];
interface LeaderItem {
  name: string;
  role: string;
  image: string;
  bio: string;
}
const LEADERSHIP: LeaderItem[] = [{
  name: "Mr. Sipho Ndlovu",
  role: "Chief Executive Officer",
  image: "https://i.pravatar.cc/400?img=11",
  bio: "Over 20 years experience in economic development and industrial policy across Southern Africa."
}, {
  name: "Ms. Thandi Mokoena",
  role: "Chief Operations Officer",
  image: "https://i.pravatar.cc/400?img=47",
  bio: "Strategic operational leader with deep expertise in SEZ management and investor facilitation."
}, {
  name: "Mr. David Ferreira",
  role: "Head of Investment Facilitation",
  image: "https://i.pravatar.cc/400?img=68",
  bio: "Drives investor acquisition and relations across SADC, guiding partners from enquiry to operation."
}];
interface LocationItem {
  name: string;
  description: string;
  address: string;
  image: string;
  bgPosition: string;
  tags: string[];
}
const LOCATIONS: LocationItem[] = [{
  name: "Komatipoort Site",
  description: "The primary development site situated at the N4 Maputo Development Corridor, offering direct access to regional trade routes and border crossings.",
  address: "Komatipoort, Mpumalanga",
  image: "/komatipoort-site.jpg",
  bgPosition: "center 40%",
  tags: ["Primary Site", "Industrial", "Logistics"]
}, {
  name: "Mbombela Head Quarters",
  description: "The administrative hub and provincial liaison office, co-ordinating investor services, government relations and stakeholder relations.",
  address: "Mbombela, Mpumalanga",
  image: "/Mbombela-HQ.jpg",
  bgPosition: "center 50%",
  tags: ["Administrative", "Liaison"]
}];
const FOOTER_EXPLORE_LINKS = ["About Nkomazi SEZ", "Why Invest", "Priority Sectors", "Investor Hub"];
const FOOTER_CONNECT_LINKS = ["Investment Process", "Resources", "Partners", "Contact"];
interface SocialLinkItem {
  Icon: React.FC;
  label: string;
  href: string;
}
const MISSION_CARDS = [{
  id: "vision",
  number: "01",
  heading: "Our Vision",
  body: "\"An Economic Growth Catalyst that supports industrial and regional development.\""
}, {
  id: "mission",
  number: "02",
  heading: "Our Mission",
  body: "To provide responsive infrastructure that supports a multisector industrial platform for investors in agro-processing, logistics, manufacturing and related industries."
}, {
  id: "mandate",
  number: "03",
  heading: "Our Mandate",
  body: "To attract and facilitate investment, develop industrial infrastructure, create jobs, and drive sustainable economic transformation across Mpumalanga and the SADC region."
}];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ArrowUpRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none">
  <path d="M4.22748 12.7119C3.93459 13.0048 3.93459 13.4796 4.22748 13.7725C4.52038 14.0654 4.99525 14.0654 5.28814 13.7725L4.75781 13.2422L4.22748 12.7119ZM4.75781 13.2422L5.28814 13.7725L13.7734 5.28724L13.2431 4.75691L12.7128 4.22658L4.22748 12.7119L4.75781 13.2422Z" fill="currentColor" />
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
const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
  <path d="M17.8417 5.87508C17.6409 5.12508 17.0584 4.53341 16.3167 4.33341C14.9667 3.95841 10.0001 3.95841 10.0001 3.95841C10.0001 3.95841 5.03341 3.95841 3.68341 4.33341C2.94175 4.53341 2.35841 5.12508 2.15841 5.87508C1.79175 7.22508 1.79175 10.0001 1.79175 10.0001C1.79175 10.0001 1.79175 12.7751 2.15841 14.1251C2.35841 14.8751 2.94175 15.4667 3.68341 15.6667C5.03341 16.0417 10.0001 16.0417 10.0001 16.0417C10.0001 16.0417 14.9667 16.0417 16.3167 15.6667C17.0584 15.4667 17.6409 14.8751 17.8417 14.1251C18.2084 12.7751 18.2084 10.0001 18.2084 10.0001C18.2084 10.0001 18.2084 7.22508 17.8417 5.87508ZM8.33341 12.5001V7.50008L12.7084 10.0001L8.33341 12.5001Z" fill="currentColor" />
</svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
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

// ─── CTA Buttons ──────────────────────────────────────────────────────────────

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
    ease: "easeOut"
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
      background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)"
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
    ease: "easeOut"
  }}
>
    <div className="flex items-center justify-center px-5 text-white text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      background: "#E8521A"
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] text-white rounded-r-lg flex-shrink-0" style={{
      background: "#E8521A"
    }}>
      <ArrowUpRightIcon />
    </div>
    <div className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 ease-in-out" style={{
      background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)"
    }} />
  </motion.a>;

// GhostButton — white border/text for dark backgrounds (default)
const GhostButton = ({
  label,
  light = false,
  href = '#',
  onClick
}: {
  label: string;
  light?: boolean;
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
    ease: "easeOut"
  }}
>
    <div className="flex items-center justify-center px-5 text-[15px] font-medium overflow-hidden rounded-l-lg tracking-[0.01em]" style={{
      fontFamily: BODY_FONT,
      background: "transparent",
      border: `1.5px solid ${light ? "rgba(29,77,53,0.6)" : "rgba(255,255,255,0.55)"}`,
      borderRight: "none",
      color: light ? "#1D4D35" : "#ffffff"
    }}>
      {label}
    </div>
    <div className="flex items-center justify-center w-[44px] rounded-r-lg flex-shrink-0" style={{
      background: "transparent",
      border: `1.5px solid ${light ? "rgba(29,77,53,0.6)" : "rgba(255,255,255,0.55)"}`,
      borderLeft: "none",
      color: light ? "#1D4D35" : "#ffffff"
    }}>
      <ArrowRightIcon />
    </div>
  </motion.a>;

// ─── useCountUp hook ──────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, isInView: boolean, decimals = 0) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isInView || startedRef.current) return;
    startedRef.current = true;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, target, duration, decimals]);
  return count;
}

// ─── GoldMicroDivider ─────────────────────────────────────────────────────────

const GoldMicroDivider = () => <div style={{
  height: "1px",
  background: "linear-gradient(90deg, transparent, rgba(200,168,75,0.35), transparent)",
  maxWidth: "480px",
  margin: "0 auto",
  width: "100%"
}} />;

// ─── GoldDivider (full-width section separator) ───────────────────────────────

const GoldDivider = () => <div style={{
  height: "1px",
  background: "linear-gradient(90deg, transparent, rgba(200,168,75,0.4) 20%, rgba(200,168,75,0.4) 80%, transparent)",
  width: "100%"
}} />;

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

// ─── SplitHeading — first word green, rest dark/white based on bg ─────────────

const SplitHeading = ({
  text,
  lightBg = false
}: {
  text: string;
  lightBg?: boolean;
}) => {
  const words = text.split(" ");
  const firstWord = words[0];
  const rest = words.slice(1).join(" ");
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px"
  });
  return <h2 ref={ref} style={{
    fontFamily: HEADING_FONT,
    fontWeight: 800,
    fontSize: "clamp(28px, 3.5vw, 44px)",
    letterSpacing: "-0.01em",
    lineHeight: 1.08,
    margin: 0
  }}>
    <motion.span initial={{
      opacity: 0,
      y: 30
    }} animate={inView ? {
      opacity: 1,
      y: 0
    } : {}} transition={{
      duration: 0.7,
      delay: 0,
      ease: EASE_PREMIUM
    }} style={{
      color: "#5DBB3A",
      display: "inline"
    }}>
      {firstWord}
    </motion.span>
    {rest && <motion.span initial={{
      opacity: 0,
      y: 30
    }} animate={inView ? {
      opacity: 1,
      y: 0
    } : {}} transition={{
      duration: 0.7,
      delay: 0.08,
      ease: EASE_PREMIUM
    }} style={{
      color: lightBg ? "#0D2B1E" : "#ffffff",
      display: "inline"
    }}>
      {" "}{rest}
    </motion.span>}
  </h2>;
};

// ─── SubtitlePill ─────────────────────────────────────────────────────────────

const SubtitlePill = ({
  label,
  dark = false
}: {
  label: string;
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
}} style={{
  fontFamily: BODY_FONT,
  display: "inline-flex",
  alignItems: "center",
  background: dark ? "rgba(201,168,76,0.12)" : "rgba(29,77,53,0.08)",
  border: `1px solid ${dark ? "rgba(201,168,76,0.35)" : "rgba(29,77,53,0.2)"}`,
  color: dark ? "#C9A84C" : "#1D4D35",
  borderRadius: "9999px",
  padding: "4px 14px",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  marginBottom: "16px"
}}>
    {label}
  </motion.span>;

// ─── AnimatedHeading (light-bg sections) ─────────────────────────────────────

const AnimatedHeading = ({
  text,
  style = {},
  className = ""
}: {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-80px"
  });
  const words = text.split(" ");
  return <h2 ref={ref} className={className} style={{
    fontFamily: HEADING_FONT,
    fontWeight: 800,
    ...style
  }}>
    {words.map((word, i) => <motion.span key={`${word}-${i}`} initial={{
      opacity: 0,
      y: 60
    }} animate={inView ? {
      opacity: 1,
      y: 0
    } : {}} transition={{
      duration: 0.7,
      delay: i * 0.08,
      ease: EASE_PREMIUM
    }} style={{
      display: "inline-block",
      marginRight: "0.28em"
    }}>
      {word}
    </motion.span>)}
  </h2>;
};

// ─── FadeUp ───────────────────────────────────────────────────────────────────

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
    margin: "-60px"
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 60
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.75,
    delay,
    ease: EASE_V5
  }} className={className}>
    {children}
  </motion.div>;
};

// ─── SectionWrapper ───────────────────────────────────────────────────────────

const SectionWrapper = ({
  children,
  className = "",
  style = {}
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px"
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 60
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.75,
    ease: EASE_V5
  }} className={className} style={style}>
    {children}
  </motion.div>;
};

// ─── Sectors dropdown ─────────────────────────────────────────────────────────

const SectorsHoverDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <button className="flex items-center gap-1.5 px-[14px] py-[7px] rounded-[9px] text-white/85 hover:bg-white/10 hover:text-white transition text-[14px] font-medium tracking-[0.01em]" style={{
      fontFamily: BODY_FONT
    }} aria-haspopup="true" aria-expanded={open}>
      <span>Sectors</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 11 6" fill="none" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
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
        ease: "easeOut"
      }} className="absolute top-full left-0 mt-2 z-[999]" style={{
        minWidth: "240px"
      }}>
        <div className="bg-[#1fac67] rounded-[8px] p-2.5 flex flex-col gap-0.5" style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
        }}>
          {NAV_SECTORS.map(item => <a key={item} href="#" onClick={e => e.preventDefault()} className="block text-white text-[14px] font-medium rounded-lg px-3 py-2 transition-all duration-200 whitespace-nowrap no-underline tracking-[0.01em]" style={{
            fontFamily: BODY_FONT
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#E8521A";
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
          }}>
            {item}
          </a>)}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
};

// ─── TopBanner ────────────────────────────────────────────────────────────────

const TopBanner = () => <div className="fixed top-0 left-0 right-0 z-[10000] flex items-center justify-between px-4 sm:px-6" style={{
  height: "36px",
  background: "#FAFAF8",
  borderBottom: "1px solid #E5E5E5"
}}>
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}>
    <a href="mailto:invest@nsez.gov.za" style={{
      fontFamily: BODY_FONT,
      fontSize: "11px",
      color: "#1D4D35",
      textDecoration: "none",
      letterSpacing: "0.04em"
    }}>invest@nsez.gov.za</a>
    <span style={{
      color: "#1D4D35",
      opacity: 0.35,
      fontSize: "11px"
    }}>|</span>
    <a href="mailto:info@nsez.gov.za" style={{
      fontFamily: BODY_FONT,
      fontSize: "11px",
      color: "#1D4D35",
      textDecoration: "none",
      letterSpacing: "0.04em"
    }}>info@nsez.gov.za</a>
  </div>
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "14px"
  }}>
    {SOCIAL_LINKS.map(({
      Icon,
      label,
      href
    }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#1D4D35",
      transition: "color 0.2s",
      width: "16px",
      height: "16px",
      opacity: 0.75
    }} onMouseEnter={e => {
      (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
    }} onMouseLeave={e => {
      (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75";
    }}>
        <Icon />
      </a>)}
  </div>
</div>;

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
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <nav className="fixed left-0 right-0 z-[9999] px-4 sm:px-6" style={{
    top: "36px",
    paddingTop: scrolled ? "0px" : "20px",
    transition: "padding 0.35s ease"
  }}>
    <div className="absolute inset-0" style={{
      opacity: scrolled ? 1 : 0,
      background: "rgba(10, 24, 16, 0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: scrolled ? "0 1px 0 rgba(200,168,75,0.2)" : "none",
      transition: "background 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease"
    }} />
    <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{
      background: "linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)",
      opacity: scrolled ? 1 : 0,
      transition: "opacity 0.35s ease"
    }} />
    <div className="relative flex justify-center">
      <div className="flex items-center justify-between w-full max-w-[1372px]" style={{
        paddingTop: scrolled ? "14px" : "0px",
        paddingBottom: scrolled ? "14px" : "0px",
        transition: "padding 0.35s ease"
      }}>
        <a href="#" onClick={e => e.preventDefault()} className="flex-shrink-0 flex items-center no-underline">
          <img src="https://cdn.prod.website-files.com/6891d538bffa36dd46a28858/6891d538bffa36dd46a28873_nkomazi-sez-logo.png" alt="Nkomazi SEZ" style={{
            height: "36px",
            width: "auto",
            objectFit: "contain",
            filter: "brightness(0) invert(1)"
          }} />
        </a>

        <div className="hidden lg:flex items-center backdrop-blur-[26px] bg-white/10 border border-white/20 rounded-xl p-[4.6px] gap-1">
          {DESKTOP_NAV_LINKS.slice(0, 3).map(link => <a key={link} href="#" onClick={e => e.preventDefault()} className="px-[14px] py-[7px] rounded-[9px] text-white/85 hover:bg-white/10 hover:text-white transition text-[14px] font-medium no-underline tracking-[0.01em]" style={{
            fontFamily: BODY_FONT
          }}>
            {link}
          </a>)}
          <SectorsHoverDropdown />
          {DESKTOP_NAV_LINKS.slice(3).map(link => <a key={link} href="#" onClick={e => e.preventDefault()} className="px-[14px] py-[7px] rounded-[9px] text-white/85 hover:bg-white/10 hover:text-white transition text-[14px] font-medium no-underline tracking-[0.01em]" style={{
            fontFamily: BODY_FONT
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
        height: "auto"
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
            }}>
              Sectors
            </p>
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

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const {
    scrollY
  } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "18%"]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  return <section ref={heroRef} className="relative flex flex-col justify-end rounded-3xl mx-1.5 sm:mx-2.5" style={{
    overflow: "hidden",
    height: "calc(100vh - 36px)",
    maxHeight: "calc(100vh - 36px)",
    minHeight: "580px"
  }}>
    <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      zIndex: 0
    }}>
      <motion.div style={{
        position: "absolute",
        inset: "-18% 0 0 0",
        y: bgY
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("/dp-world.jpg")`,
          backgroundPosition: "center 2%",
          backgroundSize: "cover"
        }} />
      </motion.div>
    </div>

    <div className="absolute inset-0" style={{
      background: "#081610",
      opacity: 0.3,
      zIndex: 1
    }} />
    <div className="absolute inset-0" style={{
      background: "linear-gradient(to bottom, rgba(8,22,14,0.82) 0%, rgba(8,22,14,0.45) 18%, rgba(8,22,14,0.1) 34%, transparent 48%)",
      zIndex: 2
    }} />
    <div className="absolute inset-0" style={{
      background: "linear-gradient(to top, rgba(3, 10, 6, 0.95) 0%, rgba(3, 10, 6, 0.80) 25%, rgba(3, 10, 6, 0.50) 50%, rgba(3, 10, 6, 0.15) 75%, transparent 100%)",
      zIndex: 2
    }} />

    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true" style={{
      zIndex: 1
    }}>
      <span style={{
        fontFamily: HEADING_FONT,
        fontWeight: 900,
        fontSize: "clamp(160px, 28vw, 360px)",
        color: "rgba(255,255,255,0.035)",
        lineHeight: 1,
        userSelect: "none",
        letterSpacing: "-0.04em"
      }}>
        NKOMAZI SEZ
      </span>
    </div>

    <motion.div className="absolute left-0 right-0" style={{
      bottom: "56px",
      paddingLeft: "clamp(48px, 5vw, 80px)",
      paddingRight: "clamp(48px, 5vw, 80px)",
      opacity,
      zIndex: 3
    }}>
      <motion.div className="flex flex-col" style={{
        maxWidth: "700px"
      }} initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1.0,
        delay: 0.2,
        ease: EASE_V5
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
          ease: EASE_V5
        }}>
          <EyebrowLabel label="About Nkomazi SEZ" />
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
          ease: EASE_V5
        }} style={{
          fontFamily: HEADING_FONT,
          fontSize: "clamp(38px, 6vw, 80px)",
          lineHeight: "1.05",
          letterSpacing: "-1px",
          fontWeight: 700,
          margin: 0
        }}>
          <span style={{
            color: "#5DBB3A",
            display: "block"
          }}>About</span>
          <span style={{
            color: "#ffffff",
            display: "block"
          }}>Nkomazi SEZ.</span>
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
          ease: "easeOut"
        }} style={{
          fontFamily: BODY_FONT,
          fontSize: "16px",
          lineHeight: "1.8",
          color: "rgba(255,255,255,0.82)",
          marginBottom: 0,
          marginTop: "20px",
          fontWeight: 400
        }}>
          A strategically positioned Special Economic Zone in the heart of Mpumalanga, driving agro-processing, manufacturing, logistics, and sustainable economic transformation in South Africa.
        </motion.p>

        <motion.div className="flex flex-row items-center gap-3 flex-wrap" initial={{
          opacity: 0,
          y: 16
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.60,
          ease: "easeOut"
        }} style={{
          marginTop: "28px"
        }}>
          <GreenButton label="Explore Our Story" href="#story" />
          <GhostButton label="Get in Touch" href="/contact" />
        </motion.div>
      </motion.div>
    </motion.div>
  </section>;
};

// ─── Who We Are Section ───────────────────────────────────────────────────────

const WhoWeAreSection = () => <section id="story" style={{
  background: "#F7F9F7",
  paddingTop: "clamp(72px,8vh,120px)",
  paddingBottom: "clamp(72px,8vh,120px)"
}}>
  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-20 items-center">
      <FadeUp>
        <SubtitlePill label="Our Story" />
        <AnimatedHeading text="Who We Are" style={{
          fontSize: "clamp(40px, 5vw, 68px)",
          textTransform: "uppercase",
          color: "#0D2B1E",
          letterSpacing: "-0.02em",
          lineHeight: 1.02,
          marginBottom: "2.25rem"
        }} />
        <div className="space-y-6" style={{
          fontFamily: BODY_FONT,
          fontSize: "16px",
          color: "#374840",
          lineHeight: "1.85"
        }}>
          <p>
            The Nkomazi Special Economic Zone (NSEZ) is a strategic industrial development initiative established to drive inclusive economic growth, industrialisation and regional competitiveness within Mpumalanga and the broader Southern African region.
          </p>
          <p>
            Located in Komatipoort, at the convergence of fertile agricultural corridors, cross-border trade routes and emerging industrial value chains, NSEZ represents a strategic platform for industrialisation, beneficiation and regional economic integration.
          </p>
        </div>
        <div className="mt-10">
          <GreenButton label="Learn More About NSEZ" href="#strategy" />
        </div>
      </FadeUp>

      {/* Large full-bleed aerial/SEZ image on the right */}
      <FadeUp delay={0.15} className="relative rounded-2xl overflow-hidden shadow-md">
        <div style={{
          minHeight: "520px"
        }}>
          <video
            src="/NSEZ 40_with_Subs.mp4"
            autoPlay
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.controls = true}
            onMouseLeave={(e) => e.currentTarget.controls = false}
            className="w-full h-full object-cover"
            style={{
              minHeight: "520px",
              display: "block"
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(5,18,12,0.55) 0%, transparent 55%)",
            pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute",
            bottom: "28px",
            left: "28px",
            right: "28px",
            pointerEvents: "none"
          }}>
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const
            }}>
              Komatipoort, Mpumalanga
            </span>
            <p style={{
              fontFamily: HEADING_FONT,
              fontWeight: 800,
              fontSize: "22px",
              color: "#ffffff",
              margin: "4px 0 0",
              textTransform: "uppercase" as const,
              letterSpacing: "-0.01em"
            }}>
              Nkomazi SEZ Development Site
            </p>
          </div>
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.3))"
          }} />
        </div>
      </FadeUp>
    </div>
  </div>
</section>;

// ─── Vision / Mission / Mandate Section — immersive editorial ─────────────────

interface FoundationItemProps {
  number: string;
  title: string;
  content: string;
  index: number;
}
const FoundationItem = ({
  number,
  title,
  content,
  index
}: FoundationItemProps) => {
  const [hovered, setHovered] = useState(false);
  const TRANSITION = 'all 450ms cubic-bezier(0.4, 0, 0.2, 1)';
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-50px'
  }} transition={{
    duration: 0.7,
    delay: index * 0.2,
    ease: [0.21, 0.45, 0.32, 0.9]
  }} className="group relative py-12 md:py-16 last:pb-0 rounded-sm" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
    backgroundColor: hovered ? '#F5EFE2' : 'transparent',
    boxShadow: hovered ? '0 4px 28px 0 rgba(180,145,60,0.08), 0 1.5px 6px 0 rgba(0,0,0,0.04)' : 'none',
    transition: `background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 450ms cubic-bezier(0.4, 0, 0.2, 1), padding-left 450ms cubic-bezier(0.4, 0, 0.2, 1), padding-right 450ms cubic-bezier(0.4, 0, 0.2, 1)`,
    paddingLeft: hovered ? '12px' : '0px',
    paddingRight: hovered ? '12px' : '0px'
  }}>
    {/* Gold gradient divider at top (not on first item) */}
    {index > 0 && <div className="absolute top-0 left-0 w-full h-px" style={{
      background: 'linear-gradient(to right, #C8A84B 0%, #C8A84B 30%, transparent 100%)'
    }} />}

    <div className="flex flex-col relative z-10">
      <div className="flex items-start mb-6">
        {/* Gold Accent Bar */}
        <div className="flex-shrink-0" style={{
          width: hovered ? '5px' : '4px',
          height: hovered ? '54px' : '48px',
          background: hovered ? 'linear-gradient(to bottom, #F0C850, #C8A84B)' : 'linear-gradient(to bottom, #D4B060, #C8A84B)',
          boxShadow: hovered ? '0 0 14px 3px rgba(200,168,75,0.55)' : '0 0 4px 0 rgba(200,168,75,0.18)',
          borderRadius: '2px',
          transition: TRANSITION
        }} />
        <div className="ml-6">
          <h3 className="uppercase mb-3" style={{
            fontFamily: HEADING_FONT,
            color: '#C8A84B',
            fontWeight: 700,
            letterSpacing: '0.22em',
            fontSize: '14px'
          }}>
            {title}
          </h3>
          <p className="text-[#374840] text-lg md:text-xl max-w-xl" style={{
            fontFamily: BODY_FONT,
            fontWeight: 300,
            lineHeight: 1.78
          }}>
            {content}
          </p>
        </div>
      </div>
    </div>

    {/* Watermark Numeral */}
    <div className="pointer-events-none select-none" style={{
      position: 'absolute',
      top: '16px',
      right: 0,
      transform: hovered ? 'translateX(-10px)' : 'translateX(0px)',
      opacity: hovered ? 0.1 : 0.065,
      transition: `transform 450ms cubic-bezier(0.4, 0, 0.2, 1), opacity 450ms cubic-bezier(0.4, 0, 0.2, 1)`
    }}>
      <span className="font-black" style={{
        fontFamily: HEADING_FONT,
        fontSize: 'clamp(120px, 14vw, 160px)',
        lineHeight: 1,
        WebkitTextStroke: '2px #C8A84B',
        color: 'transparent',
        display: 'block'
      }}>
        {number}
      </span>
    </div>
  </motion.div>;
};

const VisionMissionSection = () => {
  const foundationData = [{
    number: '01',
    title: 'Our Vision',
    content: '"An Economic Growth Catalyst that supports industrial and regional development."'
  }, {
    number: '02',
    title: 'Our Mission',
    content: 'To provide responsive infrastructure that supports a multisector industrial platform for investors in agro-processing, logistics, manufacturing and related industries.'
  }, {
    number: '03',
    title: 'Our Mandate',
    content: 'To attract and facilitate investment, develop industrial infrastructure, create jobs, and drive sustainable economic transformation across Mpumalanga and the SADC region.'
  }];
  return <section className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden">
    {/* Left Panel: Deep green-to-near-black gradient */}
    <div className="w-full md:w-[45%] p-8 md:p-20 lg:p-28 flex flex-col justify-center relative" style={{
      background: 'linear-gradient(to bottom, #1D4D35 0%, #112A1D 50%, #0D1F16 100%)'
    }}>
      {/* Decorative corner accents */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-[#C8A84B]/30 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b border-r border-[#C8A84B]/30 pointer-events-none" />

      {/* Thin gold vertical rule on right edge */}
      <div className="hidden md:block pointer-events-none" style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '1.5px',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent 0%, #C8A84B 20%, #C8A84B 50%, #C8A84B 80%, transparent 100%)',
        opacity: 0.7
      }} />

      <motion.div initial={{
        opacity: 0,
        x: -20
      }} whileInView={{
        opacity: 1,
        x: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="relative z-10">
        <span className="inline-block text-[#C8A84B] font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-6" style={{ fontFamily: BODY_FONT }}>
          Our Foundation
        </span>

        {/* Soft radial gold halo behind the heading */}
        <div className="relative">
          <div className="pointer-events-none" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '340px',
            height: '200px',
            background: 'radial-gradient(ellipse at center, rgba(200,168,75,0.12) 0%, rgba(200,168,75,0.04) 50%, transparent 75%)',
            borderRadius: '50%'
          }} />
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-white mb-8 relative" style={{ fontFamily: HEADING_FONT }}>
            <span className="block mb-2" style={{
              color: '#5DBB3A'
            }}>
              Vision
            </span>
            <span className="block italic">Mission &amp;</span>
            <span className="block">Mandate</span>
          </h2>
        </div>

        <div className="w-20 h-px" style={{
          background: '#C8A84B'
        }} />

        <p className="text-white/60 mt-8 max-w-sm text-sm md:text-base leading-relaxed" style={{ fontFamily: BODY_FONT }}>
          Rooted in excellence, our core values drive every decision we make to transform the
          economic landscape of the nation.
        </p>
      </motion.div>
    </div>

    {/* Right Panel: Off-White / Cream */}
    <div className="w-full md:w-[55%] bg-[#F7F4EF] p-8 md:p-20 lg:p-28 flex flex-col justify-center relative">
      <div className="max-w-2xl mx-auto w-full">
        {foundationData.map((item, index) => <FoundationItem key={item.number} number={item.number} title={item.title} content={item.content} index={index} />)}
      </div>
    </div>
  </section>;
};

// ─── Stats Section ────────────────────────────────────────────────────────────

const StatCounter = ({
  stat,
  index
}: {
  stat: StatItem;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px"
  });
  const count = useCountUp(stat.target, 2.4, inView, stat.decimals);
  const display = stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.round(count).toLocaleString();
  return <motion.div ref={ref} initial={{
    opacity: 0,
    y: 40
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.75,
    delay: index * 0.1,
    ease: EASE_PREMIUM
  }} className="flex flex-col items-center text-center" style={{
    background: "#ffffff",
    border: "1px solid rgba(29,77,53,0.12)",
    borderTop: "2px solid #C8A84B",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    borderRadius: "14px",
    padding: "2.5rem 2rem"
  }}>
    <span style={{
      fontFamily: HEADING_FONT,
      fontWeight: 700,
      fontSize: "clamp(32px,4vw,52px)",
      color: "#1D4D35",
      lineHeight: 1,
      letterSpacing: "-0.02em"
    }}>
      <span>{stat.prefix}</span>
      <span>{display}</span>
      <span>{stat.suffix}</span>
    </span>
    <span style={{
      fontFamily: BODY_FONT,
      fontSize: "11px",
      color: "#374840",
      marginTop: "12px",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      fontWeight: 500
    }}>
      {stat.label}
    </span>
  </motion.div>;
};
const ImpactStatsSection = () => <section style={{
  background: "#EFF4F1",
  paddingTop: "clamp(72px,8vh,120px)",
  paddingBottom: "clamp(72px,8vh,120px)"
}}>
  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
    <SectionWrapper className="mb-16">
      <EyebrowLabel label="Our Impact" />
      <SplitHeading text="Numbers That Define Our Ambition" lightBg />
    </SectionWrapper>

    <GoldMicroDivider />
    <div style={{
      marginTop: "48px"
    }} />

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {STATS.map((stat, index) => <StatCounter key={stat.label} stat={stat} index={index} />)}
    </div>
  </div>
</section>;

// ─── Full-width photo banner between stats and leadership ─────────────────────

const PhotoBannerSection = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-80px"
  });
  return <section ref={ref} style={{
    position: "relative",
    overflow: "hidden",
    height: "420px"
  }}>
    <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=85&w=2000" alt="Agricultural landscape in South Africa" style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 45%",
      display: "block"
    }} />
    <div style={{
      position: "absolute",
      inset: 0,
      background: "rgba(5,18,10,0.45)"
    }} />
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "0 clamp(24px, 6vw, 120px)",
      textAlign: "center"
    }}>
      <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.8,
        ease: EASE_V5
      }}>
        <div style={{
          width: "48px",
          height: "3px",
          background: "#C8A84B",
          margin: "0 auto 24px",
          borderRadius: "2px"
        }} />
        <blockquote style={{
          fontFamily: HEADING_FONT,
          fontWeight: 800,
          fontSize: "clamp(28px, 4.5vw, 56px)",
          color: "#ffffff",
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          margin: 0,
          maxWidth: "900px"
        }}>
          <span style={{
            color: "#5DBB3A"
          }}>1,600 hectares</span>
          {" "}of purpose-built industrial land, positioned at the gateway to Southern Africa.
        </blockquote>
        <div style={{
          width: "48px",
          height: "3px",
          background: "#C8A84B",
          margin: "24px auto 0",
          borderRadius: "2px"
        }} />
      </motion.div>
    </div>
  </section>;
};

// ─── Leadership Section ───────────────────────────────────────────────────────

const LeadershipSection = () => <section style={{
  background: "#F7F9F7",
  paddingTop: "clamp(72px,8vh,120px)",
  paddingBottom: "clamp(72px,8vh,120px)"
}}>
  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
    <SectionWrapper className="mb-16">
      <EyebrowLabel label="Leadership" />
      <SplitHeading text="Our Leadership Team" lightBg />
      <p style={{
        fontFamily: BODY_FONT,
        fontSize: "16px",
        color: "#374840",
        lineHeight: "1.8",
        maxWidth: "520px",
        marginTop: "18px",
        fontWeight: 300
      }}>
        Experienced leaders committed to driving sustainable industrial growth and meaningful economic transformation.
      </p>
    </SectionWrapper>

    <GoldMicroDivider />
    <div style={{
      marginTop: "48px"
    }} />

    <div className="grid md:grid-cols-3 gap-8">
      {LEADERSHIP.map((leader, idx) => <motion.div key={leader.name} initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-60px"
      }} transition={{
        duration: 0.75,
        delay: idx * 0.12,
        ease: EASE_V5
      }} className="group" style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid rgba(200,168,75,0)",
        transition: "border-color 0.35s ease, box-shadow 0.35s ease"
      }} onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,168,75,0.45)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
      }} onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,168,75,0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
      }}>
        {/* Portrait 3:4 image */}
        <div className="overflow-hidden" style={{
          aspectRatio: "3/4",
          position: "relative"
        }}>
          <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]" style={{
            objectPosition: "center 15%"
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(5,25,15,0.95) 0%, transparent 65%)",
            opacity: 0,
            transition: "opacity 0.4s ease"
          }} className="group-hover:opacity-100" />
          <div style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            right: "24px",
            opacity: 0,
            transform: "translateY(16px)",
            transition: "opacity 0.4s ease, transform 0.4s ease"
          }} className="group-hover:opacity-100 group-hover:translate-y-0">
            <div style={{
              fontFamily: HEADING_FONT,
              fontWeight: 800,
              fontSize: "22px",
              color: "#ffffff",
              textTransform: "uppercase" as const,
              letterSpacing: "-0.01em"
            }}>{leader.name}</div>
            <div style={{
              fontFamily: BODY_FONT,
              fontSize: "11px",
              color: "#C8A84B",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              marginTop: "4px"
            }}>{leader.role}</div>
            <p style={{
              fontFamily: BODY_FONT,
              fontSize: "12px",
              color: "rgba(255,255,255,0.8)",
              lineHeight: "1.6",
              marginTop: "8px",
              fontWeight: 300
            }}>{leader.bio}</p>
          </div>
        </div>
        {/* Card info below */}
        <div style={{
          background: "#ffffff",
          padding: "20px 24px"
        }}>
          <h3 style={{
            fontFamily: HEADING_FONT,
            fontWeight: 800,
            fontSize: "20px",
            color: "#0D2B1E",
            textTransform: "uppercase" as const,
            marginBottom: "4px",
            letterSpacing: "-0.01em"
          }}>{leader.name}</h3>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: "11px",
            color: "#C8A84B",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            margin: 0
          }}>{leader.role}</p>
        </div>
      </motion.div>)}
    </div>
  </div>
</section>;

// ─── Why NSEZ Section ─────────────────────────────────────────────────────────

const WhyNSEZSection = () => <section id="strategy" style={{
  background: "#FFFFFF",
  paddingTop: "clamp(72px,8vh,120px)",
  paddingBottom: "clamp(72px,8vh,120px)"
}}>
  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-20 items-start">
      <FadeUp>
        <EyebrowLabel label="Why Nkomazi SEZ" />
        <SplitHeading text="The Challenge We Are Solving" lightBg />
      </FadeUp>
      <FadeUp delay={0.15} className="flex flex-col gap-10">
        <p style={{
          fontFamily: BODY_FONT,
          fontSize: "18px",
          color: "#374840",
          lineHeight: "1.85",
          fontWeight: 300
        }}>
          Mpumalanga remains heavily reliant on primary agriculture and extractive industries, with limited downstream beneficiation and industrial diversification.
        </p>
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, rgba(200,168,75,0.6), rgba(200,168,75,0.1))"
        }} />
        <p style={{
          fontFamily: BODY_FONT,
          fontSize: "18px",
          color: "#374840",
          lineHeight: "1.85",
          fontWeight: 300
        }}>
          Nkomazi SEZ exists to unlock value-added production, create jobs, strengthen supply chains and facilitate regional trade across the SADC corridor.
        </p>
        <div className="flex gap-3 flex-wrap pt-2">
          <GreenButton label="Download Brochure" href="#" />
        </div>
      </FadeUp>
    </div>
  </div>
</section>;

// ─── Values Section — creative editorial INVEST layout ───────────────────────

const INVEST_LETTER_COLORS = ["#5DBB3A", "#C8A84B", "#5DBB3A", "#C8A84B", "#5DBB3A", "#C8A84B", "#5DBB3A"];
const ValuesSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "-80px"
  });
  return <section ref={sectionRef} style={{
    background: "#F7F9F7",
    paddingTop: "clamp(72px,8vh,120px)",
    paddingBottom: "clamp(72px,8vh,120px)",
    overflow: "hidden",
    position: "relative"
  }}>
    {/* NSEZ watermark background */}
    <div aria-hidden="true" style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontFamily: HEADING_FONT,
      fontWeight: 900,
      fontSize: "clamp(200px, 30vw, 420px)",
      color: "rgba(29,77,53,0.02)",
      lineHeight: 1,
      whiteSpace: "nowrap",
      userSelect: "none",
      pointerEvents: "none",
      letterSpacing: "-0.04em",
      zIndex: 0
    }}>
      NKOMAZI SEZ
    </div>

    <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8" style={{
      position: "relative",
      zIndex: 1
    }}>
      <SectionWrapper className="mb-16">
        <EyebrowLabel label="Our Values" />
        <h2 style={{
          fontFamily: HEADING_FONT,
          fontWeight: 800,
          fontSize: "clamp(32px,4vw,52px)",
          margin: 0,
          lineHeight: 1.05
        }}>
          <span style={{
            color: "#5DBB3A"
          }}>Our</span>
          <span style={{
            color: "#0D2B1E"
          }}>{" "}Values</span>
        </h2>
      </SectionWrapper>

      <GoldMicroDivider />
      <div style={{
        marginTop: "64px"
      }} />

      <div className="grid md:grid-cols-[200px_1fr] gap-16 items-start">
        {/* Left: large stacked INVEST letters */}
        <div className="hidden md:flex flex-col" style={{
          lineHeight: 0.92
        }}>
          {VALUES.map((val, idx) => <motion.span key={val.letter} initial={{
            opacity: 0,
            x: -40
          }} animate={inView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6,
            delay: idx * 0.08,
            ease: EASE_PREMIUM
          }} style={{
            fontFamily: HEADING_FONT,
            fontWeight: 900,
            fontSize: "clamp(80px, 10vw, 120px)",
            color: INVEST_LETTER_COLORS[idx],
            display: "block",
            lineHeight: 0.95,
            letterSpacing: "-0.04em"
          }}>
            {val.letter}
          </motion.span>)}
        </div>

        {/* Right: value rows */}
        <div className="flex flex-col">
          {VALUES.map((val, idx) => <motion.div key={val.letter} initial={{
            opacity: 0,
            x: 30
          }} animate={inView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6,
            delay: idx * 0.1,
            ease: EASE_PREMIUM
          }} onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)} style={{
            cursor: "pointer",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(29,77,53,0.1)",
            background: expandedIndex === idx ? "rgba(29,77,53,0.04)" : "transparent",
            transition: "background 0.3s ease",
            borderRadius: "8px"
          }}>
            <div className="flex items-start gap-5">
              {/* Letter badge */}
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "2px solid #C8A84B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: expandedIndex === idx ? "rgba(200,168,75,0.08)" : "transparent",
                transition: "background 0.3s ease"
              }}>
                <span style={{
                  fontFamily: HEADING_FONT,
                  fontWeight: 900,
                  fontSize: "24px",
                  color: INVEST_LETTER_COLORS[idx],
                  lineHeight: 1
                }}>
                  {val.letter}
                </span>
              </div>
              <div style={{
                flex: 1,
                paddingTop: "4px"
              }}>
                <span style={{
                  fontFamily: HEADING_FONT,
                  fontWeight: 800,
                  fontSize: "26px",
                  color: "#0D2B1E",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.02em",
                  display: "block",
                  lineHeight: 1.1
                }}>
                  {val.name}
                </span>
                <motion.div initial={false} animate={{
                  height: expandedIndex === idx ? "auto" : 0,
                  opacity: expandedIndex === idx ? 1 : 0
                }} transition={{
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1]
                }} style={{
                  overflow: "hidden"
                }}>
                  <p style={{
                    fontFamily: BODY_FONT,
                    fontSize: "14px",
                    color: "#374840",
                    lineHeight: 1.7,
                    margin: "10px 0 0",
                    fontWeight: 400
                  }}>
                    {val.description}
                  </p>
                </motion.div>
                {expandedIndex !== idx && <p style={{
                  fontFamily: BODY_FONT,
                  fontSize: "13px",
                  color: "#6B8B7A",
                  lineHeight: 1.6,
                  margin: "6px 0 0",
                  fontWeight: 300
                }}>
                  {val.description.split(" ").slice(0, 8).join(" ")}…
                </p>}
              </div>
            </div>
          </motion.div>)}
        </div>
      </div>
    </div>
  </section>;
};

// ─── Locations Section ────────────────────────────────────────────────────────

const LocationsSection = () => <section id="locations" style={{
  background: "#F7F9F7",
  paddingTop: "clamp(72px,8vh,120px)",
  paddingBottom: "clamp(72px,8vh,120px)"
}}>
  <div className="max-w-[1372px] mx-auto px-4 sm:px-6 lg:px-8">
    <SectionWrapper className="mb-16">
      <EyebrowLabel label="Our Locations" />
      <SplitHeading text="Where We Operate" lightBg />
    </SectionWrapper>

    <GoldMicroDivider />
    <div style={{
      marginTop: "48px"
    }} />

    {/* Map background banner */}
    <div className="rounded-2xl overflow-hidden mb-10" style={{
      position: "relative",
      height: "300px"
    }}>
      <img src="/Mpumalanga.jpg" alt="Satellite map of Mpumalanga region" style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 40%"
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(13,43,28,0.72) 0%, rgba(5,18,12,0.55) 50%, rgba(13,43,28,0.75) 100%)"
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px"
      }}>
        <span style={{
          fontFamily: BODY_FONT,
          fontSize: "11px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.6)",
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          marginBottom: "12px"
        }}>
          Strategic Position
        </span>
        <h3 style={{
          fontFamily: HEADING_FONT,
          fontWeight: 800,
          fontSize: "clamp(24px, 3.5vw, 40px)",
          color: "#ffffff",
          textTransform: "uppercase" as const,
          letterSpacing: "-0.01em",
          margin: "0 0 8px",
          textAlign: "center"
        }}>
          Mpumalanga, South Africa
        </h3>
        <p style={{
          fontFamily: BODY_FONT,
          fontSize: "14px",
          color: "rgba(255,255,255,0.7)",
          margin: 0,
          textAlign: "center",
          maxWidth: "480px"
        }}>
          Situated along the N4 Maputo Development Corridor — the gateway to SADC markets.
        </p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {LOCATIONS.map((loc, idx) => <motion.div key={loc.name} initial={{
        opacity: 0,
        y: 60
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-60px"
      }} transition={{
        duration: 0.75,
        delay: idx * 0.12,
        ease: EASE_PREMIUM
      }} className="group overflow-hidden" style={{
        borderRadius: "16px",
        border: "1px solid rgba(29,77,53,0.08)",
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
        background: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
      }} onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,168,75,0.4)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
      }} onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(29,77,53,0.08)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"
      }}>
        {/* Full-bleed image */}
        <div className="h-[300px] overflow-hidden" style={{
          position: "relative"
        }}>
          <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-105" style={{
            objectPosition: loc.bgPosition
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(5,18,12,0.75) 0%, transparent 55%)"
          }} />
          <div style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            display: "flex",
            gap: "6px",
            flexWrap: "wrap" as const
          }}>
            {loc.tags.map(tag => <span key={tag} style={{
              fontFamily: BODY_FONT,
              fontSize: "10px",
              fontWeight: 600,
              color: "#C8A84B",
              background: "rgba(5,18,12,0.75)",
              border: "1px solid rgba(200,168,75,0.5)",
              borderRadius: "9999px",
              padding: "3px 11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              backdropFilter: "blur(4px)"
            }}>
              {tag}
            </span>)}
          </div>
        </div>

        {/* Card content */}
        <div style={{
          padding: "24px 28px"
        }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{
                position: "absolute",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "rgba(93,187,58,0.25)",
                animation: "locPing 1.8s cubic-bezier(0,0,0.2,1) infinite"
              }} />
              <MapPin size={16} color="#5DBB3A" />
            </span>
            <span style={{
              fontFamily: BODY_FONT,
              fontSize: "12px",
              color: "#5DBB3A",
              fontWeight: 600,
              letterSpacing: "0.04em"
            }}>{loc.address}</span>
          </div>
          <h3 style={{
            fontFamily: HEADING_FONT,
            fontWeight: 800,
            fontSize: "24px",
            color: "#0D2B1E",
            textTransform: "uppercase" as const,
            marginBottom: "10px",
            letterSpacing: "-0.01em"
          }}>
            {loc.name}
          </h3>
          <p style={{
            fontFamily: BODY_FONT,
            fontSize: "14px",
            color: "#374840",
            lineHeight: "1.75",
            fontWeight: 300,
            margin: "0 0 20px"
          }}>
            {loc.description}
          </p>
        </div>
      </motion.div>)}
    </div>
  </div>
</section>;

// ─── Main Page Component ──────────────────────────────────────────────────────

export const AboutNSEZPage = () => {
  return <div className="w-full selection:bg-[#1D4D35] selection:text-white overflow-x-hidden" style={{
    fontFamily: BODY_FONT,
    background: "#F7F9F7"
  }}>
    <style>{`
        @keyframes locPing {
          0% { transform: scale(0.8); opacity: 0.6; }
          80%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

    <NSEZNavbar />

    <div style={{
      paddingTop: "36px"
    }}>
      <HeroSection />
      <GoldDivider />
      <WhoWeAreSection />
      <GoldDivider />
      <VisionMissionSection />
      <GoldDivider />
      <ImpactStatsSection />
      <PhotoBannerSection />
      {/* <GoldDivider />
        <LeadershipSection /> */}
      <GoldDivider />
      <WhyNSEZSection />
      <GoldDivider />
      <NsezValuesSection />
      <GoldDivider />
      <LocationsSection />

      <NSEZFooterSection />
    </div>
  </div>;
};