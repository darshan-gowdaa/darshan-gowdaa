// src/components/Projects.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

import petrolBunkThumbnail from '../assets/petrolbunkmanagementsystem-thumnail.png';
import eduWorldThumbnail from '../assets/eduworld-thumbnail.png';
import headlinesHubThumbnail from '../assets/headlinesHub-thumnail.png';
import loginDashboardThumbnail from '../assets/login-dashboard.png';
import zapierCloneThumbnail from '../assets/zapier_clone-thumnail.png';

const ProjectCard = ({ title, description, tags, image, liveLink, githubLink, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full flex flex-col"
    >
      <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:border-white/30">

        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 bg-black/60 backdrop-blur-[2px]">
            {githubLink && (
              <motion.a
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)", color: "#000" }}
                whileTap={{ scale: 0.95 }}
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md transition-colors"
                title="View Source Code"
              >
                <FaGithub size={20} />
              </motion.a>
            )}
            {liveLink && (
              <motion.a
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)", color: "#000" }}
                whileTap={{ scale: 0.95 }}
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md transition-colors"
                title="View Live Demo"
              >
                <FaExternalLinkAlt size={20} />
              </motion.a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="liquid-glass-tag"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 font-heading leading-tight group-hover:text-gray-200 transition-colors">
            {title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed flex-grow">
            {description}
          </p>
        </div>

        {/* Decorative Bottom Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const projects = useMemo(() => [
    {
      title: "Petrol Bunk Management System",
      description: "A comprehensive MERN-Stack solution for managing petrol bunk operations. Streamlines inventory tracking, sales reporting, and employee management with real-time data visualization.",
      tags: ["MERN Stack", "Dashboard", "Analytics"],
      image: petrolBunkThumbnail,
      githubLink: "https://github.com/darshan-gowdaa/petrol-bunk-management-system",
    },
    {
      title: "EduWorld-FullStack",
      description: "Complete education management ecosystem featuring admission portals, course administration, and an integrated AI chatbot for student enquiries.",
      tags: ["MERN Stack", "AI Chatbot", "Management"],
      image: eduWorldThumbnail,
      githubLink: "https://github.com/darshan-gowdaa/eduworld-fullstack",
    },
    {
      title: "Headlines Hub",
      description: "Modern news aggregator leveraging NewsAPI. Features infinite scrolling, category filtering, and a responsive reading experience built with React and Vite.",
      tags: ["React", "API Integration", "News"],
      image: headlinesHubThumbnail,
      liveLink: "https://headlineshub-react.vercel.app/",
      githubLink: "https://github.com/darshan-gowdaa/headlinesHub-React",
    },
    {
      title: "Login & Dashboard Panel",
      description: "A pixel-perfect admin dashboard featuring interactive charts, user management tables, and comprehensive authentication flows. Built for scalability and responsiveness.",
      tags: [ "Vite + JSX", "Tailwind CSS", "Recharts"],
      image: loginDashboardThumbnail,
      liveLink: "https://darshan-gowdaa.github.io/Login-and-Dashboard-Vite/",
      githubLink: "https://github.com/darshan-gowdaa/Login-and-Dashboard-Vite",
    },
    {
      title: "Zapier Interface Clone",
      description: "A meticulous recreation of the Zapier Interface tab, demonstrating advanced search logic, dynamic filtering, and complex state management with TypeScript.",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      image: zapierCloneThumbnail,
      liveLink: "https://darshan-gowdaa.github.io/Zapier-Clone-React/",
      githubLink: "https://github.com/darshan-gowdaa/Zapier-Clone-React",
    },
  ], []);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

export default Projects;
