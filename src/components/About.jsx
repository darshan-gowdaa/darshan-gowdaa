// src/components/About.jsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import profileImage from '../assets/profile-picture.png';
import TiltedCard from './react-bits/TiltedCard';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 60, delay: 0.1 }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 280, damping: 60, delay: 0.2 }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 280, damping: 60, delay: 0.3 }
    }
  };

  return (
    <section id="about" className="py-12 px-4 sm:px-8 min-h-screen flex items-center justify-center" ref={ref}>
      <div className="max-w-[1600px] w-full mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="glass-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            About <span className="text-gray-400">Me</span>
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">

          {/* Background Glow Spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

          {/* Left Column: Tilted Card */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInLeft}
            className="lg:col-span-1 flex justify-center items-center w-full"
          >
            <div className="w-full max-w-[280px] sm:max-w-[350px] lg:max-w-none h-[300px] sm:h-[380px] lg:h-[450px] flex items-center justify-center relative mx-auto">
              {/* Decorative ring behind image */}
              <div className="absolute inset-0 border border-white/5 rounded-full scale-110 opacity-20 animate-spin-slow pointer-events-none" />
              <TiltedCard
                imageSrc={profileImage}
                altText="Darshan Gowda"
                captionText="Darshan Gowda"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="280px"
                imageWidth="280px"
                rotateAmplitude={30}
                scaleOnHover={1.0}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            </div>
          </motion.div>

          {/* Right Column: Bio Content */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInRight}
            className="lg:col-span-2 space-y-6 w-full max-w-2xl mx-auto lg:max-w-none"
          >

            {/* Premium Glass Card */}
            <div className="relative backdrop-blur-2xl bg-white/5 border border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.06),0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[2rem] p-8 sm:p-10 overflow-hidden group hover:border-white/20 transition-colors duration-500">

              {/* Internal Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />

              <div className="relative z-10 space-y-6 text-gray-300 leading-relaxed text-base sm:text-lg text-justify">

                {/* Intro */}
                <div>
                  <h3 className="text-white text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-white/50 rounded-full"></span>
                    Who I Am
                  </h3>
                  <p>
                    I'm a <strong className="text-white font-semibold">Full-Stack Developer</strong> and <strong className="text-white font-semibold">Data Enthusiast</strong> currently pursuing my <strong className="text-gray-100">MSc in Data Analytics</strong> at Christ University, Bengaluru. I completed my BCA from St. Joseph's University and have hands-on experience from my internship at <strong className="text-white">WspacesAI Labs</strong>, where I built web applications using Vite, TypeScript, and PHP that improved system efficiency by 30%.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-white/5"></div>

                {/* Expertise */}
                <div>
                  <h3 className="text-white text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-white/50 rounded-full"></span>
                    What I Do
                  </h3>
                  <p>
                    I work primarily with the <strong className="text-white font-semibold">MERN stack</strong> and have built production-ready projects like a Petrol Bunk Management System and EduWorld platform. I'm skilled in <strong className="text-white">Python libraries for Data Science, AI, and ML</strong>, and I also develop <strong className="text-gray-100">Android apps using Java & React Native.</strong> My expertise includes <strong className="text-white">PowerBI and Python visualization</strong> for creating compelling data insights.
                  </p>
                </div>

                <div className="w-full h-[1px] bg-white/5"></div>

                {/* Tech & Research */}
                <div>
                  <p>
                    I'm comfortable with Python, MySQL, AWS, Docker, and have experience in mobile development. My work focuses on optimizing performance—reducing API calls by 60% and cutting report generation time by 65%. Outside of coding, I've published research on deep learning, hold AWS certifications, and help mentor junior students in web development.
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
