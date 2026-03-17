// src/components/organisms/Skills.jsx
import { useRef, useState, useEffect } from 'react';
import { useAnimations } from '../../hooks/useAnimations';
import {
  FaHtml5, FaReact, FaNodeJs, FaDatabase,
  FaGitAlt, FaAws, FaBootstrap, FaChartLine
} from 'react-icons/fa';
import {
  SiJavascript, SiTailwindcss, SiMongodb, SiMysql,
  SiPython, SiExpress, SiDocker, SiNextdotjs, SiVercel, SiPostgresql
} from 'react-icons/si';
import LogoLoop from '../molecules/LogoLoop';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    check();
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);
  return isMobile;
};

const Skills = () => {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

  const { animateSkills } = useAnimations();
  animateSkills(containerRef);

  const allSkills = [
    { node: <SiNextdotjs />, title: 'Next.js', href: "https://nextjs.org" },
    { node: <FaReact />, title: 'React', href: "https://react.dev" },
    { node: <SiJavascript />, title: 'JavaScript', href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { node: <FaNodeJs />, title: 'Node.js', href: "https://nodejs.org" },
    { node: <SiExpress />, title: 'Express.js', href: "https://expressjs.com" },
    { node: <SiTailwindcss />, title: 'Tailwind CSS', href: "https://tailwindcss.com" },
    { node: <SiPython />, title: 'Python', href: "https://www.python.org" },
    { node: <SiMongodb />, title: 'MongoDB', href: "https://www.mongodb.com" },
    { node: <SiMysql />, title: 'MySQL', href: "https://www.mysql.com" },
    { node: <SiPostgresql />, title: 'PostgreSQL', href: "https://www.postgresql.org" },
    { node: <SiDocker />, title: 'Docker', href: "https://www.docker.com" },
    { node: <FaAws />, title: 'AWS', href: "https://aws.amazon.com" },
    { node: <SiVercel />, title: 'Vercel', href: "https://vercel.com" },
    { node: <FaGitAlt />, title: 'Git/GitHub', href: "https://git-scm.com" },
    { node: <FaChartLine />, title: 'Power BI', href: "https://powerbi.microsoft.com" }
  ];

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
          {item.node}
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
        <div className="skills-header text-center">
          <h2 className="glass-heading text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight">
            Skills
          </h2>
        </div>
      </div>

      <div className="skills-loop w-full relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <LogoLoop
          logos={allSkills}
          speed={isMobile ? 80 : 100}
          direction="left"
          logoHeight={isMobile ? 100 : 140}
          gap={isMobile ? 24 : 40}
          pauseOnHover={false}
          renderItem={renderSkillItem}
          scaleOnHover={false}
          fadeOut={false}
        />
      </div>
    </section>
  );
};

export default Skills;
