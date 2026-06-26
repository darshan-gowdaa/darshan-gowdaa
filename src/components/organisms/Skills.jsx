// src/components/organisms/Skills.jsx
import { useRef, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import LogoLoop from '../molecules/LogoLoop';
import { allSkills } from '../../data/skillsData';

const Skills = () => {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
  };

  const renderSkillItem = (item, key) => (
    <a
      key={key}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-4 group/skill p-4 no-underline"
      aria-label={`Learn more about ${item.title}`}
    >
      <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center transition-all duration-300
        ${isMobile 
          ? 'bg-transparent border-none shadow-none' 
          : 'backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover/skill:shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover/skill:border-white/40 group-hover/skill:bg-white/10'
        }`}>
        <div className={`text-5xl md:text-6xl transition-colors duration-300
          ${isMobile 
            ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
            : 'text-gray-400 group-hover/skill:text-white'
          }`}>
          <item.node />
        </div>
      </div>
      <span className={`text-sm md:text-base font-medium uppercase tracking-widest transition-colors duration-300
        ${isMobile 
          ? 'text-white drop-shadow-md' 
          : 'text-gray-500 group-hover/skill:text-white'
        }`}>
        {item.title}
      </span>
    </a>
  );

  return (
    <section id="skills" className="py-24 relative overflow-hidden section-lazy" ref={containerRef}>
      <div className="max-w-7xl mx-auto mb-16 relative z-10 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center"
        >
          <h2 className="glass-heading text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight">
            Skills
          </h2>
        </motion.div>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInRight}
        className="w-full relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <LogoLoop
          logos={allSkills}
          speed={isMobile ? 140 : 180}
          hoverSpeed={isMobile ? 80 : 100}
          direction="left"
          logoHeight={isMobile ? 100 : 140}
          gap={isMobile ? 24 : 40}
          pauseOnHover={false}
          renderItem={renderSkillItem}
          scaleOnHover={false}
          fadeOut={false}
        />
      </motion.div>
    </section>
  );
};

export default memo(Skills);
