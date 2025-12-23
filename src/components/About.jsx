// src/components/About.jsx
import { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'framer-motion';
import profileImage from '../assets/DGpfp.png';
import TiltedCard from './react-bits/TiltedCard';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  const fadeInUp = useSpring({
    opacity: isInView ? 1 : 0,
    config: { tension: 280, friction: 60 },
    delay: 100,
  });

  const fadeInLeft = useSpring({
    opacity: isInView ? 1 : 0,
    config: { tension: 280, friction: 60 },
    delay: 200,
  });

  const fadeInRight = useSpring({
    opacity: isInView ? 1 : 0,
    config: { tension: 280, friction: 60 },
    delay: 300,
  });

  return (
    <section id="about" className="py-12 px-4 sm:px-8 min-h-screen flex items-center justify-center" ref={ref}>
      <div className="max-w-[1600px] w-full mx-auto">
        {/* Section Header */}
        <animated.div style={fadeInUp} className="text-center mb-16">
          <h2 className="glass-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            About <span className="text-gray-400">Me</span>
          </h2>
        </animated.div>

        {/* Main Content Grid */}
        <div className="relative grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">

          {/* Background Glow Spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

          {/* Left Column: Tilted Card */}
          <animated.div style={fadeInLeft} className="lg:col-span-1 flex justify-center items-center w-full">
            <div className="w-full h-[450px] flex items-center justify-center relative">
              {/* Decorative ring behind image */}
              <div className="absolute inset-0 border border-white/5 rounded-full scale-110 opacity-20 animate-spin-slow pointer-events-none" />
              <TiltedCard
                imageSrc={profileImage}
                altText="Darshan Gowda"
                captionText="Darshan Gowda"
                containerHeight="420px"
                containerWidth="420px"
                imageHeight="400px"
                imageWidth="400px"
                rotateAmplitude={30}
                scaleOnHover={1.0}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            </div>
          </animated.div>

          {/* Right Column: Bio Content */}
          <animated.div style={fadeInRight} className="lg:col-span-2 space-y-6">

            {/* Premium Glass Card */}
            <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-[2rem] p-8 sm:p-10 overflow-hidden group hover:border-white/20 transition-colors duration-500">

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
          </animated.div>
        </div>
      </div>
    </section>
  );
};

export default About;
