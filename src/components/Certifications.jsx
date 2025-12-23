// src/components/Certifications.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { SiAmazonwebservices, SiInfosys } from 'react-icons/si';
import { NeonButton } from './ui/NeonButton';

const CertificationCard = ({ title, issuer, description, link, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay * 0.001 }} // delay is in ms in the data
      className="group relative h-full"
    >
      <div className="h-full p-6 md:p-8 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-2xl text-gray-300 group-hover:text-white group-hover:bg-white/10 transition-colors">
            {icon}
          </div>
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase border border-white/10 px-3 py-1 rounded-full bg-black/20">
            {issuer}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3 font-heading group-hover:text-gray-200 transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
          {description}
        </p>

        {/* Action */}
        {link && (
          <NeonButton
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            className="w-full"
          >
            View Certificate
          </NeonButton>
        )}
      </div>
    </motion.div>
  );
};

const Certifications = () => {
  const certifications = [
    {
      title: "AWS Academy Graduate",
      issuer: "AWS Academy",
      description: "Cloud Foundations & Architecture. Gained hands-on experience with core AWS services and distributed systems.",
      link: "https://drive.google.com/drive/folders/1VSngU3XZfkpLdXzRRIWZLZrRpWLmHTQ6?usp=sharing",
      icon: <SiAmazonwebservices />,
      delay: 0
    },
    {
      title: "Cybersecurity Foundation",
      issuer: "Infosys Springboard",
      description: "Comprehensive training in security protocols, risk management, and network defense strategies.",
      link: "https://drive.google.com/drive/folders/1i2oZ1cNJpIdKR3BSpGi85pGLvRn5DR2l?usp=drive_link",
      icon: <SiInfosys />,
      delay: 100
    }
  ];

  return (
    <section id="certifications" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >

          <h2 className="glass-heading text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight">
            Certifications
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {certifications.map((cert, index) => (
            <CertificationCard
              key={index}
              {...cert}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
