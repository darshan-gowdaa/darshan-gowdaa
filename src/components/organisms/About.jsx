// src/components/organisms/About.jsx
import { useRef, useState, useEffect } from 'react';
import { useAnimations } from '../../hooks/useAnimations';
import profileImage from '../../assets/profile-picture.avif';
import TiltedCard from '../molecules/TiltedCard';

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

const About = () => {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();

  const { animateAbout } = useAnimations();
  animateAbout(sectionRef);

  return (
    <section id="about" className="py-24 px-4 sm:px-8 relative overflow-hidden" ref={sectionRef}>
      <div className="max-w-[1600px] w-full mx-auto">

        <div className="about-header text-center mb-16">
          <h2 className="glass-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            About <span className="text-gray-400">Me</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">

          <div className="about-left lg:col-span-1 flex justify-center items-center w-full mb-20 lg:mb-0">
            <div className="w-full max-w-[220px] sm:max-w-[350px] lg:max-w-none h-[220px] sm:h-[380px] lg:h-[500px] flex items-center justify-center relative mx-auto">
              <div className="absolute inset-0 border border-white/5 rounded-full scale-110 opacity-20 animate-spin-slow pointer-events-none" />
              <TiltedCard
                imageSrc={profileImage}
                altText="Darshan Gowda"
                captionText="Darshan Gowda"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight={isMobile ? "280px" : "400px"}
                imageWidth={isMobile ? "280px" : "400px"}
                rotateAmplitude={30}
                scaleOnHover={1.0}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            </div>
          </div>

          <div className="about-right lg:col-span-2 space-y-6 w-full max-w-2xl mx-auto lg:max-w-none">
            <div className="relative backdrop-blur-2xl bg-white/5 border border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.06),0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[2rem] p-8 sm:p-10 overflow-hidden group hover:border-white/20 transition-colors duration-500">

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
