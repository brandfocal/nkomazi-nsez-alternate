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
  iconPath: 'M12 3v18M6 8l-3 6h6l-3-6zm12 0l-3 6h6l-3-6zM3 8h18M8 21h8'
}, {
  id: 'nurture',
  letter: 'N',
  title: 'Nurture',
  description: 'Developing talent, growing enterprises and cultivating potential within our communities and the organisations we work with.',
  hint: 'Cultivating potential and growth.',
  iconPath: 'M12 22v-9M12 13C8 13 5 10 5 6c4 0 7 3 7 7zm0 0c4 0 7-3 7-7-4 0-7 3-7 7zM8 22h8'
}, {
  id: 'value',
  letter: 'V',
  title: 'Value',
  description: 'Creating sustainable economic impact that benefits investors, workers and the region through long-term industrial growth.',
  hint: 'Sustainable economic impact for all.',
  iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-2-10l2 2 4-4'
}, {
  id: 'excellence',
  letter: 'E',
  title: 'Excellence',
  description: 'Striving for the highest quality in service, infrastructure and investor support — setting the benchmark for SEZ performance.',
  hint: 'Setting the benchmark for SEZ performance.',
  iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
}, {
  id: 'service',
  letter: 'S',
  title: 'Service',
  description: 'Delivering proactive, investor-centric solutions through efficient one-stop-shop facilitation and dedicated support systems.',
  hint: 'Proactive, investor-centric solutions.',
  iconPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
}, {
  id: 'trust',
  letter: 'T',
  title: 'Trust',
  description: "Building enduring relationships founded on transparency, reliability, and a steadfast commitment to our stakeholders' success.",
  hint: 'Transparency and reliability.',
  iconPath: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z'
}, {
  id: 'agility',
  letter: 'A',
  title: 'Agility',
  description: 'Adapting to changing markets, seizing new opportunities and responding swiftly to investor and developer needs.',
  hint: 'Dynamic responsiveness and rapid execution.',
  iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z'
}];

const COLORS = {
  green: '#28B674',
  deepGreen: '#023A23',
  gold: '#F2AE37',
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

const UNIFIED_TILE_STYLE: LetterTileStyle = {
  background: 'radial-gradient(circle at 50% 50%, rgba(242,174,55,0.14) 0%, rgba(242,174,55,0.03) 42%, rgba(2,58,35,0) 74%), #081B12',
  activeBackground: 'radial-gradient(circle at 50% 50%, rgba(242,174,55,0.24) 0%, rgba(242,174,55,0.08) 44%, rgba(2,58,35,0) 76%), #0D2619',
  borderColor: 'rgba(242,174,55,0.4)',
  activeBorderColor: '#F2AE37',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  activeBoxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 24px rgba(242,174,55,0.35)'
};

const LETTER_TILE_STYLES: Record<string, LetterTileStyle> = {
  integrity: UNIFIED_TILE_STYLE,
  nurture: UNIFIED_TILE_STYLE,
  value: UNIFIED_TILE_STYLE,
  excellence: UNIFIED_TILE_STYLE,
  service: UNIFIED_TILE_STYLE,
  trust: UNIFIED_TILE_STYLE,
  agility: UNIFIED_TILE_STYLE
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
  const agilityControls = useAnimation();

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
  const agilityValue = VALUES[6] as ValueItem;

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
  }, {
    id: agilityValue.id,
    letter: agilityValue.letter,
    title: agilityValue.title,
    description: agilityValue.description,
    hint: agilityValue.hint,
    iconPath: agilityValue.iconPath,
    controls: agilityControls,
    isActive: activeValueId === agilityValue.id
  }], [activeValueId, agilityControls, agilityValue, excellenceControls, excellenceValue, integrityControls, integrityValue, nurtureControls, nurtureValue, serviceControls, serviceValue, trustControls, trustValue, valueControls, valueValue]);

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
    background: '#FFFFFF'
  }}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] mix-blend-multiply" style={{
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")"
    }} />
      <span aria-hidden="true" className="nsez-values-arc pointer-events-none absolute -bottom-64 -right-48 z-0 h-[520px] w-[520px] rounded-full border-[3px] border-[#F2AE37]/[0.05] md:-bottom-80 md:-right-56 md:h-[720px] md:w-[720px]" />
      <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden">
        <span className="text-[30vw] font-black tracking-tighter text-[#023A23] opacity-[0.015]">
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
              color: COLORS.gold,
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
              }} className="nsez-letter-tick mt-1 h-[2px] w-6 origin-center bg-[#F2AE37]" />
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
          }} className={cn('group relative cursor-pointer overflow-hidden rounded-lg transition-[transform] duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2AE37]/55 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F8F2]')} onClick={() => toggleExpand(item.id)} onMouseEnter={() => setActiveValueId(item.id)} onMouseLeave={() => setActiveValueId(null)} onFocus={() => setActiveValueId(item.id)} onBlur={() => setActiveValueId(null)} onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggleExpand(item.id);
            }
          }} aria-expanded={expandedId === item.id} role="button" tabIndex={0}>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:opacity-100 group-focus-visible:opacity-100 bg-[linear-gradient(90deg,transparent_0%,rgba(201,168,75,0.1)_48%,transparent_100%)]" />
                <motion.span aria-hidden="true" className="absolute left-0 top-0 h-full rounded-full bg-[linear-gradient(180deg,#D4A853_0%,#F2AE37_58%,#A07830_100%)]" initial={false} animate={{
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
                    <motion.span aria-hidden="true" className="absolute inset-0 rounded-lg border border-[#F2AE37]" animate={{
                  scale: activeValueId === item.id ? [1, 1.5] : 1,
                  opacity: activeValueId === item.id ? [0.42, 0] : 0
                }} transition={{
                  duration: 0.6,
                  ease: EASE_OUT,
                  repeat: activeValueId === item.id ? Infinity : 0
                }} />
                    <span className="nsez-value-badge-letter relative text-xl font-black transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" style={{
                  color: COLORS.gold
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
                      {item.description ? (
                        <ChevronDown className={cn('mt-1 h-5 w-5 flex-shrink-0 transition-[transform,opacity,color] duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]', expandedId === item.id ? 'rotate-180 opacity-100' : 'opacity-45 group-hover:opacity-90 group-focus-visible:opacity-90')} style={{
                          color: expandedId === item.id || activeValueId === item.id ? '#F5F0E8' : COLORS.deepGreen
                        }} aria-hidden="true" />
                      ) : null}
                    </div>

                    {item.description ? (
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
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-5 top-5 h-16 w-16 opacity-30 transition-colors duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] sm:right-7 sm:top-6" style={{
                      color: COLORS.gold
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
                    ) : null}
                  </div>
                </div>
              </motion.article>)}
          </motion.div>
        </div>
      </div>
    </section>;
};
