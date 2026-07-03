import * as React from 'react';
import { AnimatePresence, motion, useAnimation, useScroll, useTransform, type AnimationControls } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValueItem {
  id: string;
  letter: string;
  title: string;
  description: string;
  hint: string;
  iconPath: string;
}

interface AnimatedLetterItem extends ValueItem {
  controls: AnimationControls;
  isActive: boolean;
}

interface LetterTileStyle {
  background: string;
  activeBackground: string;
  borderColor: string;
  activeBorderColor: string;
  boxShadow: string;
  activeBoxShadow: string;
}

const VALUES: ValueItem[] = [{
  id: 'integrity',
  letter: 'I',
  title: 'Integrity',
  description: 'Doing the right thing, always — in every interaction, decision and commitment we make to our investors, communities and partners.',
  hint: 'Ethical excellence in every commitment.',
  iconPath: 'M12 3v18M7 6h10M6 9l-3 6h6L6 9Zm12 0l-3 6h6l-3-6ZM5 21h14'
}, {
  id: 'nurture',
  letter: 'N',
  title: 'Nurture',
  description: 'Developing talent, growing enterprises and cultivating potential within our communities and the organisations we work with.',
  hint: 'Cultivating potential and growth.',
  iconPath: 'M12 21V11M12 11c-4.5-.2-7-2.6-7-6.5 4.8-.2 7.2 2.1 7 6.5Zm0 0c4.5-.2 7-2.6 7-6.5-4.8-.2-7.2 2.1-7 6.5ZM7 21h10'
}, {
  id: 'value',
  letter: 'V',
  title: 'Value',
  description: 'Creating sustainable economic impact that benefits investors, workers and the region through long-term industrial growth.',
  hint: 'Sustainable economic impact for all.',
  iconPath: 'M12 3l8 4v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V7l8-4Zm-3.5 9.5 2.3 2.3 4.9-5.2'
}, {
  id: 'excellence',
  letter: 'E',
  title: 'Excellence',
  description: 'Striving for the highest quality in service, infrastructure and investor support — setting the benchmark for SEZ performance.',
  hint: 'Setting the benchmark for SEZ performance.',
  iconPath: 'M12 3l2.6 5.3 5.9.8-4.2 4.1 1 5.8-5.3-2.8L6.7 19l1-5.8-4.2-4.1 5.9-.8L12 3Z'
}, {
  id: 'service',
  letter: 'S',
  title: 'Service',
  description: 'Delivering proactive, investor-centric solutions through efficient one-stop-shop facilitation and dedicated support systems.',
  hint: 'Proactive, investor-centric solutions.',
  iconPath: 'M7 12h10M12 7v10M4.8 5.8a10 10 0 0 1 14.4 0M4.8 18.2a10 10 0 0 0 14.4 0M3 12h18'
}, {
  id: 'trust',
  letter: 'T',
  title: 'Trust',
  description: "Building enduring relationships founded on transparency, reliability, and a steadfast commitment to our stakeholders' success.",
  hint: 'Transparency and reliability.',
  iconPath: 'M12 4.5c2.8-2.5 7-.5 7 3.3 0 4.7-7 9.7-7 9.7s-7-5-7-9.7c0-3.8 4.2-5.8 7-3.3ZM8 20h8'
}];

const COLORS = {
  green: '#5DBB3A',
  deepGreen: '#0D2B1E',
  gold: '#C9A84C',
  brightGold: '#D4A853',
  amber: '#A07830',
  sage: '#4A6258',
  mutedSage: '#6B8B7A',
  sageWhite: '#E8F0EC',
  ivory: '#FDFAF4',
  coolSage: '#F0F4F0',
  panelTop: '#1A3D2B',
  panelBottom: '#0A1F14'
};

const LETTER_TILE_STYLES: Record<string, LetterTileStyle> = {
  integrity: {
    background: 'radial-gradient(circle at 52% 45%, rgba(201,168,75,0.16) 0%, rgba(201,168,75,0.04) 36%, rgba(26,61,43,0) 72%), #1A3D2B',
    activeBackground: 'radial-gradient(circle at 52% 45%, rgba(201,168,75,0.24) 0%, rgba(201,168,75,0.08) 40%, rgba(32,74,52,0) 74%), #204A34',
    borderColor: 'rgba(201,168,75,0.4)',
    activeBorderColor: 'rgba(201,168,75,0.82)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 0 24px rgba(201,168,75,0.11)',
    activeBoxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 28px rgba(201,168,75,0.36), inset 0 0 34px rgba(201,168,75,0.18)'
  },
  nurture: {
    background: 'radial-gradient(circle at 50% 52%, rgba(93,187,58,0.13) 0%, rgba(93,187,58,0.035) 38%, rgba(15,45,42,0) 70%), #0F2D2A',
    activeBackground: 'radial-gradient(circle at 50% 52%, rgba(93,187,58,0.21) 0%, rgba(93,187,58,0.07) 42%, rgba(18,55,51,0) 72%), #123733',
    borderColor: 'rgba(93,187,58,0.3)',
    activeBorderColor: 'rgba(93,187,58,0.72)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    activeBoxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 26px rgba(93,187,58,0.28)'
  },
  value: {
    background: 'repeating-linear-gradient(135deg, rgba(201,168,75,0.045) 0px, rgba(201,168,75,0.045) 1px, transparent 1px, transparent 10px), #1C2E1A',
    activeBackground: 'repeating-linear-gradient(135deg, rgba(201,168,75,0.065) 0px, rgba(201,168,75,0.065) 1px, transparent 1px, transparent 10px), #223820',
    borderColor: 'rgba(201,168,75,0.4)',
    activeBorderColor: 'rgba(201,168,75,0.82)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    activeBoxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 28px rgba(201,168,75,0.32)'
  },
  excellence: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 12%, rgba(14,34,51,0) 38%), #0E2233',
    activeBackground: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 14%, rgba(16,40,61,0) 42%), #10283D',
    borderColor: 'rgba(93,187,58,0.3)',
    activeBorderColor: 'rgba(93,187,58,0.72)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    activeBoxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 26px rgba(93,187,58,0.26)'
  },
  service: {
    background: 'radial-gradient(ellipse at 50% 104%, rgba(201,168,75,0.17) 0%, rgba(201,168,75,0.045) 42%, rgba(30,43,20,0) 73%), #1E2B14',
    activeBackground: 'radial-gradient(ellipse at 50% 104%, rgba(201,168,75,0.26) 0%, rgba(201,168,75,0.075) 44%, rgba(36,52,24,0) 75%), #243418',
    borderColor: 'rgba(201,168,75,0.4)',
    activeBorderColor: 'rgba(201,168,75,0.82)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    activeBoxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 28px rgba(201,168,75,0.34)'
  },
  trust: {
    background: 'linear-gradient(115deg, transparent 0%, rgba(201,168,75,0.055) 42%, rgba(201,168,75,0.012) 51%, transparent 68%), #0D1F16',
    activeBackground: 'linear-gradient(115deg, transparent 0%, rgba(201,168,75,0.09) 42%, rgba(201,168,75,0.022) 52%, transparent 69%), #10261B',
    borderColor: 'rgba(93,187,58,0.3)',
    activeBorderColor: 'rgba(93,187,58,0.72)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    activeBoxShadow: '0 4px 20px rgba(0,0,0,0.24), 0 0 26px rgba(93,187,58,0.24), inset 0 0 22px rgba(201,168,75,0.055)'
  }
};

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;

type ViewportRange = 'mobile' | 'tablet' | 'desktop';

const getViewportRange = (): ViewportRange => {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  if (window.innerWidth <= 640) {
    return 'mobile';
  }
  if (window.innerWidth <= 1024) {
    return 'tablet';
  }
  return 'desktop';
};

export const NsezValuesSection = () => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>('integrity');
  const [activeValueId, setActiveValueId] = React.useState<string | null>(null);
  const [viewportRange, setViewportRange] = React.useState<ViewportRange>(() => getViewportRange());

  const integrityControls = useAnimation();
  const nurtureControls = useAnimation();
  const valueControls = useAnimation();
  const excellenceControls = useAnimation();
  const serviceControls = useAnimation();
  const trustControls = useAnimation();

  const {
    scrollYProgress
  } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const desktopLetterParallaxY = useTransform(scrollYProgress, [0, 1], [-34, 54]);
  const tabletLetterParallaxY = useTransform(scrollYProgress, [0, 1], [-17, 27]);
  const mobileLetterParallaxY = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const letterParallaxY = viewportRange === 'mobile' ? mobileLetterParallaxY : viewportRange === 'tablet' ? tabletLetterParallaxY : desktopLetterParallaxY;

  const integrityValue = VALUES[0] as ValueItem;
  const nurtureValue = VALUES[1] as ValueItem;
  const valueValue = VALUES[2] as ValueItem;
  const excellenceValue = VALUES[3] as ValueItem;
  const serviceValue = VALUES[4] as ValueItem;
  const trustValue = VALUES[5] as ValueItem;

  const animatedLetters: AnimatedLetterItem[] = React.useMemo(() => [{
    id: integrityValue.id,
    letter: integrityValue.letter,
    title: integrityValue.title,
    description: integrityValue.description,
    hint: integrityValue.hint,
    iconPath: integrityValue.iconPath,
    controls: integrityControls,
    isActive: activeValueId === integrityValue.id
  }, {
    id: nurtureValue.id,
    letter: nurtureValue.letter,
    title: nurtureValue.title,
    description: nurtureValue.description,
    hint: nurtureValue.hint,
    iconPath: nurtureValue.iconPath,
    controls: nurtureControls,
    isActive: activeValueId === nurtureValue.id
  }, {
    id: valueValue.id,
    letter: valueValue.letter,
    title: valueValue.title,
    description: valueValue.description,
    hint: valueValue.hint,
    iconPath: valueValue.iconPath,
    controls: valueControls,
    isActive: activeValueId === valueValue.id
  }, {
    id: excellenceValue.id,
    letter: excellenceValue.letter,
    title: excellenceValue.title,
    description: excellenceValue.description,
    hint: excellenceValue.hint,
    iconPath: excellenceValue.iconPath,
    controls: excellenceControls,
    isActive: activeValueId === excellenceValue.id
  }, {
    id: serviceValue.id,
    letter: serviceValue.letter,
    title: serviceValue.title,
    description: serviceValue.description,
    hint: serviceValue.hint,
    iconPath: serviceValue.iconPath,
    controls: serviceControls,
    isActive: activeValueId === serviceValue.id
  }, {
    id: trustValue.id,
    letter: trustValue.letter,
    title: trustValue.title,
    description: trustValue.description,
    hint: trustValue.hint,
    iconPath: trustValue.iconPath,
    controls: trustControls,
    isActive: activeValueId === trustValue.id
  }], [activeValueId, excellenceControls, excellenceValue, integrityControls, integrityValue, nurtureControls, nurtureValue, serviceControls, serviceValue, trustControls, trustValue, valueControls, valueValue]);

  React.useEffect(() => {
    animatedLetters.forEach((item, index) => {
      void item.controls.start({
        y: 0,
        opacity: item.isActive ? 1 : 0.88,
        scale: item.isActive ? 1.15 : 1,
        textShadow: item.isActive ? '0 4px 24px rgba(0,0,0,0.35), 0 0 40px rgba(201,168,75,0.52)' : '0 4px 24px rgba(0,0,0,0.35)',
        transition: {
          y: {
            type: 'spring',
            stiffness: 430,
            damping: 24,
            mass: 0.7,
            delay: index * 0.08
          },
          opacity: {
            duration: 0.38,
            ease: EASE_OUT
          },
          scale: {
            type: 'spring',
            stiffness: 360,
            damping: 22
          },
          textShadow: {
            duration: 0.4,
            ease: EASE_OUT
          }
        }
      });
    });
  }, [activeValueId, animatedLetters]);

  React.useEffect(() => {
    const updateViewportRange = () => {
      setViewportRange(getViewportRange());
    };
    updateViewportRange();
    window.addEventListener('resize', updateViewportRange);
    return () => window.removeEventListener('resize', updateViewportRange);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const pulseInvestLetters = () => {
    animatedLetters.forEach((item, index) => {
      void item.controls.start({
        scale: item.isActive ? [1.15, 1.22, 1.15] : [1, 1.08, 1],
        transition: {
          duration: 0.46,
          delay: index * 0.06,
          ease: EASE_OUT
        }
      });
    });
  };

  return <section ref={sectionRef} className="nsez-values-section relative w-full overflow-hidden" style={{
    padding: 'clamp(32px, 4vh, 56px) 0',
    background: 'radial-gradient(circle at 50% 42%, #FDFAF4 0%, #F7F8F2 46%, #F0F4F0 100%)'
  }}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] mix-blend-multiply" style={{
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")"
    }} />
      <span aria-hidden="true" className="nsez-values-arc pointer-events-none absolute -bottom-64 -right-48 z-0 h-[520px] w-[520px] rounded-full border-[3px] border-[#C9A84C]/[0.05] md:-bottom-80 md:-right-56 md:h-[720px] md:w-[720px]" />
      <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden">
        <span className="text-[30vw] font-black tracking-tighter text-[#0D2B1E] opacity-[0.015]">
          NSEZ
        </span>
      </div>

      <div className="nsez-values-container relative z-10 mx-auto max-w-[1372px] px-5 sm:px-6 md:px-12 lg:px-20">
        <div className="mb-4">
          <motion.span initial={{
          opacity: 0,
          y: 10
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.42,
          ease: EASE_OUT
        }} className="nsez-values-eyebrow mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.2em]" style={{
          color: COLORS.gold
        }}>
            Our Values
          </motion.span>

          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1,
          duration: 0.5,
          ease: EASE_OUT
        }} className="nsez-values-heading mb-4 font-extrabold leading-[0.98] tracking-[-0.04em]" style={{
          fontSize: 'clamp(32px, 3.5vw, 48px)'
        }}>
            <span style={{
            color: COLORS.green
          }}>
              Our
            </span>
            <span className="relative ml-3 inline-block" style={{
            color: COLORS.deepGreen
          }}>
              <span>
                Values
              </span>
            </span>
          </motion.h2>
        </div>

        <div className="nsez-values-layout grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[260px_1fr] lg:gap-20 xl:gap-24">
          <motion.aside initial={{
          opacity: 0,
          x: -40
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          margin: '-80px'
        }} transition={{
          delay: 0.08,
          duration: 0.8,
          ease: EASE_OUT
        }} className="nsez-letter-aside relative hidden overflow-hidden rounded-lg px-10 py-12 lg:flex lg:flex-col lg:justify-center" onHoverStart={pulseInvestLetters}>
            <motion.div className="nsez-letter-stack relative flex select-none flex-col items-start" style={{
            y: letterParallaxY
          }}>
              {animatedLetters.map((item, index) => <motion.div key={item.id} initial={{
              y: -96,
              opacity: 0,
              scale: 0.96,
              textShadow: '0 4px 24px rgba(0,0,0,0.35)'
            }} animate={item.controls} className="nsez-letter-item mb-3 inline-flex origin-left flex-col items-center font-black leading-[0.88] tracking-[-0.085em] will-change-transform" style={{
              fontSize: 'clamp(48px, 6vw, 72px)',
              color: index % 2 === 0 ? COLORS.brightGold : COLORS.sageWhite,
              opacity: item.isActive ? 1 : 0.88,
              textShadow: '0 4px 24px rgba(0,0,0,0.35)'
            }}>
                  <motion.span className="block" animate={{
                y: [0, index % 2 === 0 ? -8 : -6]
              }} transition={{
                duration: 2.65 + index % 2 * 0.2,
                delay: index * 0.4,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut'
              }}>
                    <motion.span className="nsez-letter-tile relative block overflow-hidden px-[10px] py-[6px] transition-[filter] duration-[420ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" initial={false} animate={{
                  background: item.isActive ? LETTER_TILE_STYLES[item.id].activeBackground : LETTER_TILE_STYLES[item.id].background,
                  borderColor: item.isActive ? LETTER_TILE_STYLES[item.id].activeBorderColor : LETTER_TILE_STYLES[item.id].borderColor,
                  boxShadow: item.isActive ? LETTER_TILE_STYLES[item.id].activeBoxShadow : LETTER_TILE_STYLES[item.id].boxShadow
                }} transition={{
                  duration: 0.42,
                  ease: EASE_OUT
                }} style={{
                  borderRadius: 12,
                  border: '1px solid',
                  minWidth: '1.12em'
                }}>
                      <span className="relative block text-center">
                        {item.letter}
                      </span>
                    </motion.span>
                  </motion.span>
                  <motion.span aria-hidden="true" initial={{
                opacity: 0,
                scaleX: 0
              }} whileInView={{
                opacity: 0.6,
                scaleX: 1
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.28 + index * 0.08,
                duration: 0.42,
                ease: EASE_OUT
              }} className="nsez-letter-tick mt-1 h-[2px] w-6 origin-center bg-[#C9A84C]" />
                </motion.div>)}
            </motion.div>
          </motion.aside>

          <motion.div initial={{
          opacity: 0,
          y: 40
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: '-80px'
        }} transition={{
          delay: 0.28,
          duration: 0.8,
          ease: EASE_OUT
        }} className="nsez-values-list flex flex-col gap-3 md:gap-4">
            {VALUES.map((item, index) => <motion.article key={item.id} initial={{
            opacity: 0,
            y: 24
          }} whileInView={{
            opacity: 1,
            y: 0
          }} animate={{
            backgroundColor: expandedId === item.id ? '#0F2A1C' : activeValueId === item.id ? '#1A3D2B' : 'rgba(255,255,255,0)',
            boxShadow: expandedId === item.id ? '0 14px 38px rgba(13,27,20,0.2)' : activeValueId === item.id ? '0 10px 28px rgba(13,27,20,0.14)' : '0 0 0 rgba(13,27,20,0)'
          }} viewport={{
            once: true,
            margin: '-80px'
          }} transition={{
            opacity: {
              duration: 0.62,
              delay: index * 0.1,
              ease: EASE_OUT
            },
            y: {
              duration: 0.62,
              delay: index * 0.1,
              ease: EASE_OUT
            },
            backgroundColor: {
              duration: 0.35,
              ease: EASE_OUT
            },
            boxShadow: {
              duration: 0.35,
              ease: EASE_OUT
            }
          }} className={cn('group relative cursor-pointer overflow-hidden rounded-lg transition-[transform] duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/55 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F8F2]')} onClick={() => toggleExpand(item.id)} onMouseEnter={() => setActiveValueId(item.id)} onMouseLeave={() => setActiveValueId(null)} onFocus={() => setActiveValueId(item.id)} onBlur={() => setActiveValueId(null)} onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggleExpand(item.id);
            }
          }} aria-expanded={expandedId === item.id} role="button" tabIndex={0}>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:opacity-100 group-focus-visible:opacity-100 bg-[linear-gradient(90deg,transparent_0%,rgba(201,168,75,0.1)_48%,transparent_100%)]" />
                <motion.span aria-hidden="true" className="absolute left-0 top-0 h-full rounded-full bg-[linear-gradient(180deg,#D4A853_0%,#C9A84C_58%,#A07830_100%)]" initial={false} animate={{
              scaleY: expandedId === item.id || activeValueId === item.id ? 1 : 0,
              width: expandedId === item.id ? 4 : 3
            }} transition={{
              duration: 0.35,
              ease: EASE_OUT
            }} style={{
              transformOrigin: 'top'
            }} />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full bg-[linear-gradient(90deg,transparent_0%,rgba(201,168,75,0.28)_10%,rgba(212,168,83,0.76)_24%,rgba(212,168,83,0.76)_64%,rgba(201,168,75,0)_100%)]" />

                <div className="nsez-value-row-content relative flex items-start gap-5 px-5 py-3 sm:gap-6 sm:px-5 md:px-5 md:py-3">
                  <div className="nsez-value-badge relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-[transform,box-shadow,border-color,background-color] duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 group-hover:shadow-[0_0_0_3px_rgba(201,168,75,0.34),0_0_20px_rgba(201,168,75,0.22)] group-focus-visible:scale-105 group-focus-visible:shadow-[0_0_0_3px_rgba(201,168,75,0.34),0_0_20px_rgba(201,168,75,0.22)]" style={{
                borderColor: expandedId === item.id || activeValueId === item.id ? COLORS.brightGold : COLORS.gold,
                backgroundColor: expandedId === item.id ? '#081B12' : activeValueId === item.id ? '#102A1D' : 'rgba(255,255,255,0)'
              }}>
                    <motion.span aria-hidden="true" className="absolute inset-0 rounded-lg border border-[#C9A84C]" animate={{
                  scale: activeValueId === item.id ? [1, 1.5] : 1,
                  opacity: activeValueId === item.id ? [0.42, 0] : 0
                }} transition={{
                  duration: 0.6,
                  ease: EASE_OUT,
                  repeat: activeValueId === item.id ? Infinity : 0
                }} />
                    <span className="nsez-value-badge-letter relative text-xl font-black transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{
                  color: expandedId === item.id || activeValueId === item.id ? COLORS.brightGold : index % 2 !== 0 ? COLORS.gold : COLORS.green
                }}>
                      {item.letter}
                    </span>
                  </div>

                  <div className="min-w-0 flex-grow pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="nsez-value-title text-[22px] font-bold uppercase leading-tight tracking-[0.06em] transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{
                    color: expandedId === item.id || activeValueId === item.id ? '#F5F0E8' : COLORS.deepGreen
                  }}>
                        {item.title}
                      </h3>
                      <ChevronDown className={cn('mt-1 h-5 w-5 flex-shrink-0 transition-[transform,opacity,color] duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]', expandedId === item.id ? 'rotate-180 opacity-100' : 'opacity-45 group-hover:opacity-90 group-focus-visible:opacity-90')} style={{
                    color: expandedId === item.id || activeValueId === item.id ? '#F5F0E8' : COLORS.deepGreen
                  }} aria-hidden="true" />
                    </div>

                    <AnimatePresence initial={false}>
                      {expandedId === item.id ? <motion.div key="content" initial={{
                    height: 0,
                    opacity: 0
                  }} animate={{
                    height: 'auto',
                    opacity: 1
                  }} exit={{
                    height: 0,
                    opacity: 0
                  }} transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }} className="overflow-hidden">
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" className="absolute right-5 top-5 h-16 w-16 opacity-25 transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] sm:right-7 sm:top-6" style={{
                      color: COLORS.brightGold
                    }}>
                            <path d={item.iconPath} />
                          </svg>
                          <p className="nsez-value-description mt-4 max-w-2xl border-l-2 pl-2 text-[13px] leading-[1.6] transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{
                      color: '#F5F0E8',
                      borderColor: 'rgba(212,168,83,0.7)'
                     }}>
                            {item.description}
                          </p>
                        </motion.div> : <motion.div key="teaser" initial={{
                    opacity: 0,
                    y: 4
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: -4
                  }} transition={{
                    duration: 0.36,
                    ease: EASE_OUT
                  }} className="mt-2 overflow-hidden">
                          <p className="nsez-value-description truncate text-sm font-medium leading-relaxed transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{
                      color: activeValueId === item.id ? '#F5F0E8' : COLORS.sage,
                      opacity: activeValueId === item.id ? 0.92 : 0.5
                    }}>
                            {item.description}
                          </p>
                          <span className="mt-1 block text-sm font-medium italic leading-relaxed transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{
                      color: activeValueId === item.id ? '#E8F0EC' : COLORS.mutedSage
                    }}>
                            {item.hint}
                          </span>
                        </motion.div>}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>)}
          </motion.div>
        </div>
      </div>
    </section>;
};
