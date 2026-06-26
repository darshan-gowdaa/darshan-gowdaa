// src/components/organisms/About.jsx
import { useRef, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import profileImage from '../../assets/profile-picture.avif';
import TiltedCard from '../molecules/TiltedCard';
import { useIsMobile } from '../../hooks/useIsMobile';

const About = () => {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-8 relative overflow-hidden section-lazy" ref={sectionRef}>
      <div className="max-w-[1600px] w-full mx-auto">

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="glass-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            About <span className="text-gray-400">Me</span>
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInLeft}
            className="lg:col-span-1 flex justify-center items-center w-full mb-20 lg:mb-0"
          >
            <div className="w-full max-w-[220px] sm:max-w-[350px] lg:max-w-none h-[220px] sm:h-[380px] lg:h-[500px] flex items-center justify-center relative mx-auto">
              <div className="absolute inset-0 border border-white/5 rounded-full scale-110 opacity-20 animate-spin-slow pointer-events-none" />
              <TiltedCard
                imageSrc={profileImage}
                altText="Darshan Gowda G S"
                captionText="Darshan Gowda G S"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight={isMobile ? "280px" : "400px"}
                imageWidth={isMobile ? "280px" : "400px"}
                rotateAmplitude={30}
                scaleOnHover={1.15}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInRight}
            className="lg:col-span-2 space-y-6 w-full max-w-2xl mx-auto lg:max-w-none"
          >
            <div className="relative bg-white/5 border border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.06),0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[2rem] p-8 sm:p-10 overflow-hidden group hover:border-white/20 transition-colors duration-500">

              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />

              <div className="relative z-10 space-y-6 text-gray-300 leading-relaxed text-base sm:text-lg text-justify">

                <div>
                  <h3 className="text-white text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-white/50 rounded-full"></span>
                    Who I Am
                  </h3>
                  <p>
                    I'm a <strong className="text-white font-semibold">Full-Stack Developer</strong> and <strong className="text-white font-semibold">Data Enthusiast</strong> currently pursuing an <strong className="text-gray-100">MSc in Data Analytics</strong> at Christ University, Bengaluru, after completing a BCA from St. Joseph’s University, Bengaluru. With experience as a <strong className="text-white">Software Development Intern</strong> at WspacesAI Labs, the focus has been on improving system efficiency, enhancing user experience, and delivering features on time in a collaborative, fast-paced environment.
                  </p>
                </div>
                <div>
  <h3 className="text-white text-xl font-semibold mb-3 flex items-center gap-2">
    <span className="w-8 h-[2px] bg-white/50 rounded-full"></span>
    What I Do
  </h3>
  <p className="mb-4">
    I work primarily with the <strong className="text-white font-semibold">MERN stack</strong> and have built production-ready projects. I'm skilled in <strong className="text-white">Python libraries for Data Science, AI & ML</strong>, and develop <strong className="text-gray-100">mobile apps using Android Studio & React Native</strong>. My expertise includes <strong className="text-white">PowerBI and Python visualization</strong> for creating compelling data insights.
  </p>
  <p>
    Proficient in MySQL, AWS, Docker, and mobile development, with a strong focus on performance optimization—cutting API calls by 60% and slashing report generation time by 65%. Outside coding, published research on deep learning frontiers, hold AWS Academy certifications (Cloud Foundations), and actively mentor junior students in web development concepts and open-source contributions.
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

export default memo(About);
