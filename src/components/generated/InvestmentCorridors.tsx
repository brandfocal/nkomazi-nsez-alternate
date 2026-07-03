import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
const HEADING_FONT = "'Saira Condensed', system-ui, sans-serif";
const BODY_FONT = "'Poppins', system-ui, sans-serif";
const CORRIDOR_STAT_PILLS = [{
  id: 'dist',
  label: '2,600km Corridor'
}, {
  id: 'countries',
  label: '5 SADC Countries'
}, {
  id: 'port',
  label: 'Port of Maputo Access'
}];
const DESTINATION_LIST = [{
  id: 'jhb',
  label: 'Johannesburg (N4 Highway)'
}, {
  id: 'mbm',
  label: 'Mbombela'
}, {
  id: 'kmt',
  label: 'Komatipoort / NSEZ'
}, {
  id: 'mpt',
  label: 'Maputo Port'
}, {
  id: 'sadc',
  label: 'SADC Markets'
}];

// ─── Corridor path points ──────────────────────────────────────────────────────
const CORRIDOR_PTS = [{
  x: 108,
  y: 248
},
// Johannesburg
{
  x: 196,
  y: 194
},
// Middelburg / Witbank
{
  x: 264,
  y: 178
},
// Mbombela (Nelspruit)
{
  x: 312,
  y: 172
},
// Komatipoort / NSEZ
{
  x: 374,
  y: 162
} // Maputo
];
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function getPointOnPath(pts: {
  x: number;
  y: number;
}[], t: number) {
  const segs = pts.length - 1;
  const segT = t * segs;
  const idx = Math.min(Math.floor(segT), segs - 1);
  const localT = segT - idx;
  return {
    x: lerp(pts[idx].x, pts[idx + 1].x, localT),
    y: lerp(pts[idx].y, pts[idx + 1].y, localT)
  };
}

// Path length helper for stroke-dasharray
function buildCorridorPath(pts: {
  x: number;
  y: number;
}[]) {
  return pts.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ');
}
const corridorPathD = buildCorridorPath(CORRIDOR_PTS);

// ─── Country shapes ────────────────────────────────────────────────────────────
const CORRIDOR_ADJACENT_IDS = new Set(['za', 'mz', 'sz']);
const COUNTRIES = [{
  id: 'za',
  label: 'SOUTH AFRICA',
  lx: 148,
  ly: 295,
  fill: '#C8D4BC',
  stroke: '#8A9E80',
  d: 'M 40 185 L 70 165 L 108 152 L 145 148 L 180 150 L 210 158 L 238 168 L 265 178 L 290 180 L 305 188 L 315 200 L 318 215 L 312 230 L 302 248 L 288 265 L 268 280 L 245 292 L 220 300 L 195 305 L 168 305 L 142 298 L 116 285 L 90 268 L 65 248 L 45 228 L 34 210 Z'
}, {
  id: 'mz',
  label: 'MOZAMBIQUE',
  lx: 410,
  ly: 208,
  fill: '#C8D4BC',
  stroke: '#8A9E80',
  d: 'M 374 162 L 392 152 L 415 140 L 438 130 L 455 125 L 468 128 L 472 140 L 468 155 L 460 170 L 448 185 L 434 200 L 418 215 L 402 228 L 385 240 L 370 248 L 358 252 L 348 248 L 342 238 L 342 224 L 348 212 L 358 202 L 368 190 L 374 175 Z'
}, {
  id: 'sz',
  label: 'ESWATINI',
  lx: 308,
  ly: 262,
  fill: '#C8D4BC',
  stroke: '#8A9E80',
  d: 'M 298 238 L 315 232 L 325 238 L 328 250 L 322 260 L 310 266 L 298 262 L 292 252 Z'
}, {
  id: 'zw',
  label: 'ZIMBABWE',
  lx: 295,
  ly: 108,
  fill: '#E2D9C5',
  stroke: '#B8A98A',
  d: 'M 235 98 L 265 88 L 298 84 L 328 88 L 350 100 L 362 116 L 360 132 L 348 148 L 325 158 L 295 162 L 268 158 L 245 145 L 230 128 L 228 112 Z'
}, {
  id: 'zm',
  label: 'ZAMBIA',
  lx: 228,
  ly: 60,
  fill: '#E2D9C5',
  stroke: '#B8A98A',
  d: 'M 175 38 L 205 28 L 240 24 L 270 28 L 295 40 L 310 58 L 308 78 L 292 90 L 265 95 L 238 92 L 210 82 L 188 68 L 172 52 Z'
}, {
  id: 'mw',
  label: 'MALAWI',
  lx: 388,
  ly: 110,
  fill: '#E2D9C5',
  stroke: '#B8A98A',
  d: 'M 380 90 L 394 82 L 406 86 L 412 100 L 408 115 L 400 128 L 388 132 L 376 126 L 372 112 L 374 98 Z'
}, {
  id: 'bw',
  label: 'BOTSWANA',
  lx: 72,
  ly: 132,
  fill: '#E2D9C5',
  stroke: '#B8A98A',
  d: 'M 42 88 L 78 72 L 115 68 L 148 74 L 168 90 L 175 110 L 172 132 L 158 152 L 135 162 L 108 165 L 82 158 L 58 142 L 40 122 L 38 104 Z'
}, {
  id: 'na',
  label: 'NAMIBIA',
  lx: 18,
  ly: 150,
  fill: '#E2D9C5',
  stroke: '#B8A98A',
  d: 'M -8 72 L 18 60 L 42 65 L 48 88 L 42 115 L 35 145 L 30 175 L 25 205 L 22 230 L 15 250 L 0 260 L -15 250 L -18 225 L -16 190 L -12 158 Z'
}] as {
  id: string;
  label: string;
  lx: number;
  ly: number;
  fill: string;
  stroke: string;
  d: string;
}[];

// ─── Comet trail hook ─────────────────────────────────────────────────────────
function useCometTrail(inView: boolean) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let animFrame: number;
    let start: number | null = null;
    const duration = 2500;
    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      setProgress(elapsed / duration);
      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [inView]);
  return progress;
}

// ─── Topo lines generator (deterministic) ──────────────────────────────────────
function buildTopoLines() {
  const lines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    key: string;
  }[] = [];
  const rows = [40, 80, 120, 160, 200, 240, 280, 320];
  rows.forEach((y, ri) => {
    let x = -10;
    let cy = y;
    while (x < 510) {
      const nx = x + 18 + (ri * 7 + x) % 12;
      const ny = cy + ((ri + x) % 7 - 3) * 1.8;
      lines.push({
        x1: x,
        y1: cy,
        x2: nx,
        y2: ny,
        key: `topo-${ri}-${x}`
      });
      x = nx;
      cy = ny;
    }
  });
  return lines;
}
const TOPO_LINES = buildTopoLines();

// ─── Pulsing beacon ring component ────────────────────────────────────────────
const PulseRing = ({
  cx,
  cy,
  color,
  delay,
  maxR
}: {
  cx: number;
  cy: number;
  color: string;
  delay: number;
  maxR: number;
}) => <motion.circle cx={cx} cy={cy} r={6} fill="none" stroke={color} strokeWidth="1" animate={{
  r: [6, maxR],
  opacity: [0.7, 0]
}} transition={{
  duration: 2,
  delay,
  repeat: Infinity,
  ease: 'easeOut'
}} />;
export const InvestmentCorridors: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: '-80px'
  });
  const mapInView = useInView(mapRef, {
    once: true,
    margin: '-60px'
  });
  const cometProgress = useCometTrail(mapInView);

  // Comet head and trail
  const cometHead = getPointOnPath(CORRIDOR_PTS, cometProgress);
  const trailProgress = Math.max(0, cometProgress - 0.12);
  const trailTail = getPointOnPath(CORRIDOR_PTS, trailProgress);
  return <section ref={sectionRef} style={{
    background: '#FFFFFF',
    borderTop: '1px solid rgba(200,168,75,0.15)',
    borderBottom: '1px solid rgba(200,168,75,0.15)'
  }}>
      <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      minHeight: '720px',
      maxWidth: '100%',
      paddingTop: '100px',
      paddingBottom: '100px',
      paddingLeft: 'clamp(40px, 6vw, 96px)',
      paddingRight: 'clamp(40px, 6vw, 96px)',
      gap: 'clamp(40px, 6vw, 80px)',
      alignItems: 'center'
    }} className="flex flex-col lg:grid">
        {/* LEFT — Editorial text block */}
        <motion.div initial={{
        opacity: 0,
        y: 28
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
          <span style={{
          fontFamily: BODY_FONT,
          fontSize: '11px',
          fontWeight: 700,
          color: '#C9A84C',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          display: 'block'
        }}>
            THE MAPUTO CORRIDOR
          </span>

          <h2 style={{
          fontFamily: HEADING_FONT,
          fontSize: 'clamp(38px, 4.5vw, 52px)',
          fontWeight: 700,
          color: '#1D4D35',
          lineHeight: 1.0,
          letterSpacing: '-0.5px',
          margin: 0
        }}>
            Our Strategic Position
          </h2>

          <div style={{
          width: '40px',
          height: '1px',
          background: '#C9A84C',
          flexShrink: 0
        }} />

          <p style={{
          fontFamily: BODY_FONT,
          fontSize: '15px',
          lineHeight: 1.8,
          color: 'rgba(17,17,17,0.65)',
          margin: 0,
          maxWidth: '520px'
        }}>
            Positioned at the crossroads of the Maputo Development Corridor, NSEZ provides direct access to South Africa, Mozambique, Eswatini and broader SADC markets — connecting investors to Indian Ocean ports and sub-Saharan Africa.
          </p>

          <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
            {CORRIDOR_STAT_PILLS.map(pill => <span key={pill.id} style={{
            fontFamily: BODY_FONT,
            fontSize: '13px',
            fontWeight: 700,
            color: '#1D4D35',
            border: '1.5px solid #1D4D35',
            borderRadius: '999px',
            padding: '6px 14px',
            display: 'inline-block',
            letterSpacing: '0.01em'
          }}>
                {pill.label}
              </span>)}
          </div>

          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '4px'
        }}>
            {DESTINATION_LIST.map(dest => <div key={dest.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{
              flexShrink: 0
            }}>
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
              fontFamily: BODY_FONT,
              fontSize: '14px',
              color: 'rgba(17,17,17,0.72)',
              lineHeight: 1.5
            }}>
                  {dest.label}
                </span>
              </div>)}
          </div>
        </motion.div>

        {/* RIGHT — SVG Map card */}
        <motion.div ref={mapRef} initial={{
        opacity: 0,
        y: 32
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.7,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1]
      }} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
          <div style={{
          width: '100%',
          maxWidth: '660px',
          background: '#F5F0E8',
          borderRadius: '20px',
          boxShadow: '0 12px 56px rgba(29,77,53,0.16), 0 4px 16px rgba(0,0,0,0.09)',
          padding: '28px 24px 20px',
          position: 'relative'
        }}>
            {/* Map header */}
            <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
              <span style={{
              fontFamily: BODY_FONT,
              fontSize: '10px',
              fontWeight: 700,
              color: '#1D4D35',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              opacity: 0.7
            }}>
                Maputo Development Corridor
              </span>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
                <motion.span animate={{
                opacity: [1, 0.3, 1]
              }} transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }} style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#1D4D35',
                display: 'inline-block'
              }} />
                <span style={{
                fontFamily: BODY_FONT,
                fontSize: '9px',
                color: '#1D4D35',
                opacity: 0.5
              }}>
                  LIVE ROUTE
                </span>
              </div>
            </div>

            {/* SVG Map */}
            <svg viewBox="20 80 460 260" preserveAspectRatio="xMidYMid meet" style={{
            display: 'block',
            width: '100%'
          }} aria-label="Maputo Development Corridor Southern Africa map">
              <defs>
                {/* Glow filters */}
                <filter id="ic-gold-glow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="ic-nsez-glow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="ic-teal-glow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Corridor shimmer gradient */}
                <linearGradient id="ic-corridor-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9B7D2C" />
                  <stop offset="40%" stopColor="#C9A84C" />
                  <stop offset="70%" stopColor="#E8C96A" />
                  <stop offset="100%" stopColor="#C9A84C" />
                  <animateTransform attributeName="gradientTransform" type="translate" values="-1 0; 1 0; -1 0" dur="2s" repeatCount="indefinite" />
                </linearGradient>
                {/* Sage glow filter for corridor-adjacent countries */}
                <filter id="ic-sage-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Background */}
              <rect x="0" y="0" width="500" height="340" fill="#EDE8DE" rx="4" />

              {/* Topographic lines layer */}
              <g opacity="0.07">
                {TOPO_LINES.map(line => <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#5A4020" strokeWidth="0.8" />)}
              </g>

              {/* Corridor-adjacent country glowing aura (pulsing sage border) */}
              {COUNTRIES.filter(c => CORRIDOR_ADJACENT_IDS.has(c.id)).map(country => <motion.path key={`${country.id}-aura`} d={country.d} fill="none" stroke="#8ABF88" strokeWidth="3" style={{
              filter: 'url(#ic-sage-glow)'
            }} animate={{
              opacity: [0.4, 0.8, 0.4]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }} />)}

              {/* Country fills — staggered fade-in */}
              {COUNTRIES.map((country, i) => <motion.path key={country.id} d={country.d} fill={country.fill} stroke={country.stroke} strokeWidth="1.2" initial={{
              opacity: 0
            }} animate={mapInView ? {
              opacity: 1
            } : {}} transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: 'easeOut'
            }} />)}

              {/* Country labels */}
              {COUNTRIES.filter(c => c.lx >= 0 && c.lx <= 490).map((country, i) => <motion.text key={`${country.id}-lbl`} x={country.lx} y={country.ly} textAnchor="middle" fontSize="7" fill="rgba(100,80,40,0.45)" style={{
              fontFamily: BODY_FONT,
              letterSpacing: '1.5px',
              userSelect: 'none'
            }} initial={{
              opacity: 0
            }} animate={mapInView ? {
              opacity: 1
            } : {}} transition={{
              duration: 0.5,
              delay: i * 0.08 + 0.4
            }}>
                  {country.label}
                </motion.text>)}

              {/* Corridor glow halo */}
              <motion.path d={corridorPathD} fill="none" stroke="#C9A84C" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity={0.08} style={{
              filter: 'url(#ic-gold-glow)'
            }} initial={{
              pathLength: 0,
              opacity: 0
            }} animate={mapInView ? {
              pathLength: 1,
              opacity: 0.08
            } : {}} transition={{
              duration: 1.4,
              delay: 0.7,
              ease: 'easeOut'
            }} />

              {/* Corridor main line — flowing shimmer gradient */}
              <motion.path d={corridorPathD} fill="none" stroke="url(#ic-corridor-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{
              pathLength: 0,
              opacity: 0
            }} animate={mapInView ? {
              pathLength: 1,
              opacity: 1
            } : {}} transition={{
              duration: 1.6,
              delay: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }} />

              {/* Comet trail */}
              {mapInView && <g>
                  <line x1={trailTail.x} y1={trailTail.y} x2={cometHead.x} y2={cometHead.y} stroke="#E8C96A" strokeWidth="2" strokeLinecap="round" opacity={0.5} style={{
                filter: 'url(#ic-gold-glow)'
              }} />
                  <circle cx={cometHead.x} cy={cometHead.y} r={7} fill="#C9A84C" opacity={0.2} style={{
                filter: 'url(#ic-gold-glow)'
              }} />
                  <circle cx={cometHead.x} cy={cometHead.y} r={4} fill="#E8C96A" style={{
                filter: 'url(#ic-gold-glow)'
              }} />
                  <circle cx={cometHead.x} cy={cometHead.y} r={2} fill="#FFFFFF" />
                </g>}

              {/* Johannesburg — white dot */}
              <motion.g initial={{
              opacity: 0,
              scale: 0
            }} animate={mapInView ? {
              opacity: 1,
              scale: 1
            } : {}} transition={{
              duration: 0.4,
              delay: 1.0
            }}>
                <circle cx={108} cy={248} r={4} fill="#FFFFFF" stroke="rgba(100,80,40,0.4)" strokeWidth="0.8" />
                <text x={108} y={262} textAnchor="middle" fontSize="7.5" fill="rgba(80,55,20,0.75)" style={{
                fontFamily: BODY_FONT,
                fontWeight: 600
              }}>
                  Johannesburg
                </text>
              </motion.g>

              {/* Mbombela — white dot */}
              <motion.g initial={{
              opacity: 0,
              scale: 0
            }} animate={mapInView ? {
              opacity: 1,
              scale: 1
            } : {}} transition={{
              duration: 0.4,
              delay: 1.08
            }}>
                <circle cx={264} cy={178} r={3} fill="#FFFFFF" stroke="rgba(100,80,40,0.35)" strokeWidth="0.7" />
                <text x={264} y={170} textAnchor="middle" fontSize="7" fill="rgba(80,55,20,0.65)" style={{
                fontFamily: BODY_FONT
              }}>
                  Mbombela
                </text>
              </motion.g>

              {/* Maputo Port — teal pulsing dot */}
              <motion.g initial={{
              opacity: 0,
              scale: 0
            }} animate={mapInView ? {
              opacity: 1,
              scale: 1
            } : {}} transition={{
              duration: 0.5,
              delay: 1.3
            }}>
                {mapInView && <motion.circle cx={374} cy={162} r={6} fill="none" stroke="#2DD4BF" strokeWidth="1" animate={{
                r: [6, 16],
                opacity: [0.7, 0]
              }} transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeOut'
              }} />}
                <circle cx={374} cy={162} r={4} fill="#2DD4BF" style={{
                filter: 'url(#ic-teal-glow)'
              }} />
                <circle cx={374} cy={162} r={2} fill="#FFFFFF" />
                <text x={374} y={153} textAnchor="middle" fontSize="7.5" fill="rgba(10,100,90,0.85)" style={{
                fontFamily: BODY_FONT,
                fontWeight: 600
              }}>
                  Port of Maputo
                </text>
              </motion.g>

              {/* NSEZ Komatipoort — layered pulsing beacon + diamond pin */}
              <motion.g initial={{
              opacity: 0,
              scale: 0.5
            }} animate={mapInView ? {
              opacity: 1,
              scale: 1
            } : {}} transition={{
              duration: 0.6,
              delay: 1.2
            }}>
                {/* Three concentric pulse rings with staggered delay */}
                {mapInView && <PulseRing cx={312} cy={172} color="#C9A84C" delay={0} maxR={20} />}
                {mapInView && <PulseRing cx={312} cy={172} color="#C9A84C" delay={0.8} maxR={28} />}
                {mapInView && <PulseRing cx={312} cy={172} color="#C9A84C" delay={1.6} maxR={36} />}

                {/* Gold diamond pin */}
                <polygon points={`${312},${162} ${318},${172} ${312},${182} ${306},${172}`} fill="#C9A84C" style={{
                filter: 'url(#ic-nsez-glow)'
              }} />
                <polygon points={`${312},${165} ${316},${172} ${312},${179} ${308},${172}`} fill="#E8C96A" />

                {/* Elevated label card */}
                <rect x={320} y={158} width={88} height={28} rx={5} fill="#FFFFFF" stroke="#C9A84C" strokeWidth="1.2" style={{
                filter: 'drop-shadow(0px 2px 6px rgba(29,77,53,0.2))'
              }} />
                <text x={364} y={169} textAnchor="middle" fontSize="8.5" fill="#1D4D35" style={{
                fontFamily: BODY_FONT,
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                  NSEZ
                </text>
                <line x1={330} y1={172} x2={406} y2={172} stroke="rgba(201,168,76,0.35)" strokeWidth="0.5" />
                <text x={364} y={181} textAnchor="middle" fontSize="6.5" fill="rgba(29,77,53,0.6)" style={{
                fontFamily: BODY_FONT
              }}>
                  Komatipoort
                </text>
              </motion.g>

              {/* Compass rose */}
              <g>
                <circle cx={468} cy={28} r={13} stroke="rgba(100,80,40,0.25)" strokeWidth="0.8" fill="rgba(255,255,255,0.5)" />
                <line x1={468} y1={28} x2={468} y2={17} stroke="rgba(100,80,40,0.7)" strokeWidth="1.2" />
                <polygon points="468,14 466,21 470,21" fill="#C9A84C" />
                <text x={468} y={12} textAnchor="middle" fontSize="6.5" fill="rgba(100,80,40,0.8)" style={{
                fontFamily: BODY_FONT,
                fontWeight: 700
              }}>N</text>
              </g>

              {/* Legend — bottom */}
              <motion.g initial={{
              opacity: 0
            }} animate={mapInView ? {
              opacity: 1
            } : {}} transition={{
              duration: 0.5,
              delay: 1.6
            }}>
                <rect x="8" y="270" width="230" height="62" rx="5" fill="rgba(255,255,255,0.82)" stroke="rgba(201,168,76,0.25)" strokeWidth="0.7" />
                {/* NSEZ diamond */}
                <polygon points="22,284 27,290 22,296 17,290" fill="#C9A84C" />
                <text x="34" y="294" fontSize="7.5" fill="rgba(60,40,10,0.7)" style={{
                fontFamily: BODY_FONT
              }}>NSEZ Location</text>
                {/* Corridor line */}
                <line x1="12" y1="308" x2="32" y2="308" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                <text x="38" y="312" fontSize="7.5" fill="rgba(60,40,10,0.7)" style={{
                fontFamily: BODY_FONT
              }}>Maputo Corridor</text>
                {/* Teal dot — Port of Maputo */}
                <circle cx="22" cy="322" r="3.5" fill="#2DD4BF" />
                <text x="32" y="326" fontSize="7.5" fill="rgba(60,40,10,0.7)" style={{
                fontFamily: BODY_FONT
              }}>Port of Maputo</text>
                {/* White dot — key cities */}
                <circle cx="122" cy="308" r="3" fill="#FFFFFF" stroke="rgba(100,80,40,0.4)" strokeWidth="0.8" />
                <text x="132" y="312" fontSize="7.5" fill="rgba(60,40,10,0.7)" style={{
                fontFamily: BODY_FONT
              }}>Key Cities</text>
              </motion.g>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>;
};