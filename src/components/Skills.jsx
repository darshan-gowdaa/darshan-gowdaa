// src/components/Skills.jsx
import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaHtml5, FaReact, FaNodeJs, FaDatabase,
  FaGitAlt, FaAws, FaBootstrap, FaChartLine
} from 'react-icons/fa';
import {
  SiJavascript, SiTailwindcss, SiMongodb, SiMysql,
  SiPython, SiExpress, SiDocker
} from 'react-icons/si';
import LogoLoop from './LogoLoop';

const Skills = () => {
  const containerRef = useRef(null);

  const allSkills = [
    { node: <FaReact />, title: 'React', href: "https://react.dev" },
    { node: <SiJavascript />, title: 'JavaScript', href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { node: <FaHtml5 />, title: 'HTML & CSS', href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { node: <SiTailwindcss />, title: 'Tailwind CSS', href: "https://tailwindcss.com" },
    { node: <FaBootstrap />, title: 'Bootstrap', href: "https://getbootstrap.com" },
    { node: <FaNodeJs />, title: 'Node.js', href: "https://nodejs.org" },
    { node: <SiExpress />, title: 'Express.js', href: "https://expressjs.com" },
    { node: <SiPython />, title: 'Python', href: "https://www.python.org" },
    { node: <SiMongodb />, title: 'MongoDB', href: "https://www.mongodb.com" },
    { node: <SiMysql />, title: 'MySQL', href: "https://www.mysql.com" },
    { node: <FaDatabase />, title: 'PostgreSQL', href: "https://www.postgresql.org" },
    { node: <FaGitAlt />, title: 'Git/GitHub', href: "https://git-scm.com" },
    { node: <FaAws />, title: 'AWS', href: "https://aws.amazon.com" },
    { node: <FaChartLine />, title: 'Power BI', href: "https://powerbi.microsoft.com" },
    { node: <SiDocker />, title: 'Docker', href: "https://www.docker.com" }
  ];

  // Custom renderer for LogoLoop to ensure monochrome styling
  const renderSkillItem = (item, key) => (
    <div key={key} className="flex flex-col items-center justify-center gap-4 group/skill p-4">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-colors duration-300 group-hover/skill:shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover/skill:border-white/40 group-hover/skill:bg-white/10">
        <div className="text-5xl md:text-6xl text-gray-400 transition-colors duration-300 group-hover/skill:text-white drop-shadow-lg">
          {item.node}
        </div>
      </div>
      <span className="text-sm md:text-base font-medium text-gray-500 uppercase tracking-widest group-hover/skill:text-white transition-colors duration-300">
        {item.title}
      </span>
    </div>
  );

  return (
    <section
      id="skills"
      className="py-24 relative overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto mb-20 relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <h2 className="glass-heading text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight">
            Skills
          </h2>
        </motion.div>
      </div>

      <div className="w-full relative">
        {/* Gradient Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <LogoLoop
          logos={allSkills}
          speed={100}
          direction="left"
          logoHeight={140}
          gap={40}
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
