// src/components/Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaGithub, FaLinkedin, FaArrowRight, FaPaperPlane } from 'react-icons/fa';
import { NeonButton } from './ui/NeonButton';

const InputField = ({ label, name, type = "text", placeholder, value, onChange, isTextarea, required }) => {
  return (
    <div className="mb-6">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
        {label} {required && <span className="text-gray-400">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows="4"
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
        />
      )}
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus(null), 5000);
  };

  const contactDetails = [
    { icon: <FaMapMarkerAlt />, label: "Location", value: "Bengaluru, India" },
    { icon: <FaEnvelope />, label: "Email", value: "darshangowdaa223@gmail.com", href: "mailto:darshangowdaa223@gmail.com" }
  ];

  const socialLinks = [
    { icon: <FaGithub />, href: "https://github.com/darshan-gowdaa" },
    { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/Darshan-Gowda-G-S" }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >

          <h2 className="glass-heading text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight">
            Contact Me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">

          {/* Left Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-white mb-6 font-heading">Let's collaborate</h3>
            <p className="text-gray-400 leading-relaxed mb-12 text-lg">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-8 mb-12">
              {contactDetails.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-gray-300">
                    {item.icon}
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-xl text-white hover:text-gray-300 transition-colors font-medium">{item.value}</a>
                    ) : (
                      <span className="text-xl text-white font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-10">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">Socials</h4>
              <div className="flex gap-4">
                {socialLinks.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <InputField label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
              <InputField label="Message" name="message" isTextarea value={formData.message} onChange={handleChange} required />

              <NeonButton
                type="submit"
                variant="solid"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-3"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <FaPaperPlane />
                  </>
                )}
              </NeonButton>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm text-center"
                >
                  Message sent successfully!
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
