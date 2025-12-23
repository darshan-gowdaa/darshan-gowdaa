// src/components/Experience.jsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const TimelineMarker = ({ icon, isLast }) => {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ borderColor: "rgba(255,255,255,0.8)" }}
        className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black border border-white/20 flex items-center justify-center z-20 relative shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-colors duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
      >
        <span className="text-white text-lg md:text-2xl">{icon}</span>
        {/* Glow behind marker */}
        <div className="absolute inset-0 rounded-full bg-white/10 blur-md -z-10" />
      </motion.div>
      {!isLast && (
        <div className="w-0.5 h-full bg-white/10 absolute top-16 md:hidden" />
      )}
    </div>
  );
};

const TimelineContent = ({ title, organization, period, description, certificateLink }) => {
  return (
    <div
      className={`glass-panel relative p-6 md:p-8 rounded-3xl overflow-hidden group`}
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-100 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-500 pointer-events-none" />

      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-white uppercase border border-white/20 rounded-full bg-white/5 w-fit">
            {period}
          </span>
          {certificateLink && (
            <a href={certificateLink} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors underline decoration-gray-600 hover:decoration-white underline-offset-4">
              View Certificate
            </a>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-1 font-heading">{title}</h3>
          <p className="text-lg text-gray-400 font-light">{organization}</p>
        </div>

        <p className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4">
          {description}
        </p>
      </div>
    </div>
  );
};

const TimelineItem = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Spacer for Desktop Alignment */}
      <div className="hidden md:block md:w-1/2" />

      {/* Marker Area */}
      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex justify-center w-12 md:w-auto">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-black border-2 border-white rounded-full z-20 shadow-[0_0_10px_white]" />
      </div>

      {/* Content Area */}
      <div className={`pl-16 md:pl-0 w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
        <TimelineContent {...item} />
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const timelineItems = [
    {
      icon: <FaGraduationCap />,
      title: "Bachelor of Computer Applications",
      period: "2022 - 2025",
      organization: "St. Joseph's University, Bengaluru",
      description: "Building a robust foundation in computer science, focusing on web technologies, database management, and software engineering principles.",
      certificateLink: ""
    },
    {
      icon: <FaBriefcase />,
      title: "Software Development Intern",
      period: "Jan 2025 - May 2025",
      organization: "WspacesAI Labs Private Limited",
      description: "Spearheaded frontend development using React and Vite. Optimized CRM workflows, achieving a 30% increase in operational efficiency.",
      certificateLink: "https://drive.google.com/file/d/1zN0Dpgxt9sQVyzFuG2YFxRMBQlzm-60c/view?usp=sharing"
    },
    {
      icon: <FaGraduationCap />,
      title: "MSc in Data Analytics",
      period: "2025 - 2027",
      organization: "Christ University, Bengaluru",
      description: "Specializing in advanced data analytics, machine learning algorithms, and big data technologies to drive data-informed decision making.",
      certificateLink: ""
    }
  ];

  return (
    <section ref={containerRef} id="experience" className="py-20 relative min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="glass-heading text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight text-white">
            Experience
          </h2>
        </motion.div>

        {/* Timeline Spine (Background) */}
        <div className="absolute left-6 md:left-1/2 top-[300px] bottom-24 w-px bg-white/5 md:-translate-x-1/2" />

        {/* Timeline Spine (Animated foreground) */}
        <motion.div
          className="absolute left-6 md:left-1/2 top-[300px] bottom-24 w-px bg-gradient-to-b from-white via-white/50 to-transparent md:-translate-x-1/2 origin-top"
          style={{ scaleY }}
        />

        <div className="space-y-12">
          {timelineItems.map((item, index) => (
            <TimelineItem key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;
