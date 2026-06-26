// src/components/organisms/Projects.jsx
import React, { memo } from 'react';
import { motion } from 'motion/react';
import { FaGithub, FaExternalLinkAlt, FaPlay } from 'react-icons/fa';
import { projects } from '../../data/projectsData';

// Buttery 120fps spring config
const SPRING = { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 };

// Desktop: col-0 → from left, col-1 → from bottom, col-2 → from right (3-col grid)
// Mobile: even index → from left, odd index → from right
const getVariants = (index, isMobile) => {
  if (isMobile) {
    const fromLeft = index % 2 === 0;
    return {
      hidden: { opacity: 0, x: fromLeft ? -60 : 60 },
      visible: { opacity: 1, x: 0 },
    };
  }
  const col = index % 3;
  if (col === 0) return { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } };
  if (col === 2) return { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } };
  return { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } };
};

const ActionLink = ({ href, icon: Icon, label, variant, isLiveLink }) => {
  if (!href) return null;

  if (variant === 'desktop') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
        title={label}
        aria-label={label}
      >
        <Icon size={isLiveLink ? 20 : 18} />
      </a>
    );
  }

  const isCode = label === 'Code';
  const displayLabel = isCode ? 'Code' : (isLiveLink ? 'Live' : 'Demo');
  const iconSize = isCode ? 16 : (isLiveLink ? 14 : 12);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/20 transition-all active:scale-95 ${
        isCode ? 'bg-white/10 text-white backdrop-blur-md active:bg-white/20' : 'bg-white/90 text-black active:bg-white'
      }`}
      aria-label={label}
    >
      <Icon size={iconSize} />
      <span>{displayLabel}</span>
    </a>
  );
};

const ProjectCard = ({ index, title, description, tags, image, liveLink, demoVideo, githubLink, isVignette }) => {
  const actionLink = liveLink || demoVideo;
  const isLiveLink = !!liveLink;
  const actionLabel = isLiveLink ? 'Live Demo' : 'Demo Video';
  const ActionIcon = isLiveLink ? FaExternalLinkAlt : FaPlay;

  // Pick variants for desktop (uses CSS media query logic via JS)
  const desktopVariants = getVariants(index, false);
  const mobileVariants = getVariants(index, true);

  return (
    <>
      {/* Desktop card (md+) */}
      <motion.div
        variants={desktopVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ ...SPRING, delay: Math.floor(index / 3) * 0.08 }}
        className="group relative h-full flex flex-col project-card hidden md:flex"
      >
        <CardInner
          title={title}
          description={description}
          tags={tags}
          image={image}
          liveLink={liveLink}
          demoVideo={demoVideo}
          githubLink={githubLink}
          isVignette={isVignette}
          actionLink={actionLink}
          isLiveLink={isLiveLink}
          actionLabel={actionLabel}
          ActionIcon={ActionIcon}
        />
      </motion.div>

      {/* Mobile card (< md) */}
      <motion.div
        variants={mobileVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ ...SPRING, delay: index * 0.06 }}
        className="group relative h-full flex flex-col project-card md:hidden"
      >
        <CardInner
          title={title}
          description={description}
          tags={tags}
          image={image}
          liveLink={liveLink}
          demoVideo={demoVideo}
          githubLink={githubLink}
          isVignette={isVignette}
          actionLink={actionLink}
          isLiveLink={isLiveLink}
          actionLabel={actionLabel}
          ActionIcon={ActionIcon}
        />
      </motion.div>
    </>
  );
};

const CardInner = ({ title, description, tags, image, githubLink, isVignette, actionLink, isLiveLink, actionLabel, ActionIcon }) => (
  <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:border-white/30">
    <div className="relative aspect-video overflow-hidden">
      {/* image overlays */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-all duration-500 ${isVignette ? 'shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]' : ''}`} />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />

      {/* Plain img — no lazy loading interference */}
      <img
        src={image}
        alt={title}
        loading="eager"
        decoding="async"
        fetchPriority="auto"
        className="w-full h-full object-cover transition-transform duration-700"
      />

      {/* desktop actions */}
      <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-4 bg-black/60 backdrop-blur-[2px]">
        <ActionLink href={githubLink} icon={FaGithub} label="Code" variant="desktop" />
        <ActionLink href={actionLink} icon={ActionIcon} label={actionLabel} variant="desktop" isLiveLink={isLiveLink} />
      </div>

      {/* mobile actions */}
      {(githubLink || actionLink) && (
        <div className="absolute bottom-0 left-0 right-0 z-20 md:hidden flex items-center justify-center gap-3 p-4 pt-12 bg-gradient-to-t from-black via-black/70 to-transparent">
          <ActionLink href={githubLink} icon={FaGithub} label="Code" variant="mobile" />
          <ActionLink href={actionLink} icon={ActionIcon} label={actionLabel} variant="mobile" isLiveLink={isLiveLink} />
        </div>
      )}
    </div>

    {/* project info */}
    <div className="p-6 md:p-8 flex flex-col flex-grow">
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="glass-element text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full text-gray-300">{tag}</span>
        ))}
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 font-heading leading-tight group-hover:text-gray-200 transition-colors">
        {title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed flex-grow">
        {description}
      </p>
    </div>

    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </div>
);

const Projects = () => {
  return (
    <section id="projects" className="py-24 relative overflow-hidden section-lazy">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ ...SPRING }}
          className="text-center mb-16"
        >
          <h2 className="glass-heading text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight">
            Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              index={index}
              {...project}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Projects);
