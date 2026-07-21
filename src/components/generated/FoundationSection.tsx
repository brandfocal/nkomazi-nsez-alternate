import * as React from 'react';
import { motion } from 'framer-motion';

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
  const [hovered, setHovered] = React.useState(false);
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
    boxShadow: hovered ? '0 4px 28px 0 rgba(180,145,60,0.08), 0 1.5px 6px 0 rgba(0,0,0,0.04)' : '0 0px 0px 0 rgba(180,145,60,0), 0 0px 0px 0 rgba(0,0,0,0)',
    transition: `background-color 450ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 450ms cubic-bezier(0.4, 0, 0.2, 1), padding-left 450ms cubic-bezier(0.4, 0, 0.2, 1), padding-right 450ms cubic-bezier(0.4, 0, 0.2, 1)`,
    paddingLeft: hovered ? '12px' : '0px',
    paddingRight: hovered ? '12px' : '0px'
  }}>
      {/* Gold gradient divider at top (not on first item) */}
      {index > 0 && <div className="absolute top-0 left-0 w-full h-px" style={{
      background: 'linear-gradient(to right, #C9A84C 0%, #C9A84C 30%, transparent 100%)'
    }} />}

      <div className="flex flex-col relative z-10">
        <div className="flex items-start mb-6">
          {/* Gold Accent Bar */}
          <div className="flex-shrink-0" style={{
          width: hovered ? '5px' : '4px',
          height: hovered ? '54px' : '48px',
          background: hovered ? 'linear-gradient(to bottom, #F0C850, #C9A84C)' : 'linear-gradient(to bottom, #D4B060, #C9A84C)',
          boxShadow: hovered ? '0 0 14px 3px rgba(201,168,76,0.55)' : '0 0 4px 0 rgba(201,168,76,0.18)',
          borderRadius: '2px',
          transition: TRANSITION
        }} />
          <div className="ml-6">
            <h3 className="font-sans uppercase mb-3" style={{
            color: '#C9A84C',
            fontWeight: 700,
            letterSpacing: '0.22em',
            fontSize: '11px'
          }}>
              {title}
            </h3>
            <p className="text-[#2C2C2C] font-sans text-lg md:text-xl max-w-xl" style={{
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
        <span className="font-serif font-black" style={{
        fontSize: 'clamp(120px, 14vw, 160px)',
        lineHeight: 1,
        WebkitTextStroke: '2px #C9A84C',
        color: 'transparent',
        display: 'block'
      }}>
          {number}
        </span>
      </div>
    </motion.div>;
};

export const FoundationSection = () => {
  const foundationData = [{
    number: '01',
    title: 'Vision',
    content: 'To be a leading global hub for specialized economic activities, driving sustainable industrial growth and technological innovation across the region.'
  }, {
    number: '02',
    title: 'Mission',
    content: 'Empowering businesses through state-of-the-art infrastructure, streamlined regulatory frameworks, and a vibrant ecosystem that fosters international trade and investment.'
  }, {
    number: '03',
    title: 'Mandate',
    content: 'To govern and facilitate the development of special economic zones while ensuring socio-economic progress, environmental stewardship, and adherence to global excellence standards.'
  }];
  return <section className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left Panel: Deep green-to-near-black gradient */}
      <div className="w-full md:w-[45%] p-8 md:p-20 lg:p-28 flex flex-col justify-center relative" style={{
      background: 'linear-gradient(to bottom, #1A3D2B 0%, #112A1D 50%, #0D1F16 100%)'
    }}>
        {/* Decorative corner accents */}
        <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-[#C9A84C]/30 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-16 h-16 border-b border-r border-[#C9A84C]/30 pointer-events-none" />

        {/* Thin gold vertical rule on right edge */}
        <div className="hidden md:block pointer-events-none" style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '1.5px',
        height: '100%',
        background: 'linear-gradient(to bottom, transparent 0%, #C9A84C 20%, #D4B060 50%, #C9A84C 80%, transparent 100%)',
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
          <span className="inline-block text-[#C9A84C] font-sans font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
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
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 50%, transparent 75%)',
            borderRadius: '50%'
          }} />
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold leading-tight text-white mb-8 relative">
              <span className="block mb-2" style={{
              color: '#7DAA7A'
            }}>
                Vision
              </span>
              <span className="block italic">Mission &</span>
              <span className="block">Mandate</span>
            </h2>
          </div>

          <div className="w-20 h-px" style={{
          background: '#C9A84C'
        }} />

          <p className="text-white/60 font-sans mt-8 max-w-sm text-sm md:text-base leading-relaxed">
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
