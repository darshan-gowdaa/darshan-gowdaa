// src/components/organisms/Contact.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useAnimations } from '../../hooks/useAnimations';
import { FaMapMarkerAlt, FaEnvelope, FaGithub, FaLinkedin, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { NeonButton } from '../atoms/NeonButton';

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
  const containerRef = useRef(null);
  const toastRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { animateContactSection, animateToastEnter, animateToastExit } = useAnimations();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      animateToastExit(toastRef, () => setToast(null));
    }, 5000);
  };

  useEffect(() => {
    const cleanup = animateContactSection(containerRef);
    return cleanup;
  }, [animateContactSection]);

  useEffect(() => {
    if (!toast) return;
    animateToastEnter(toastRef);
  }, [toast, animateToastEnter]);

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (formData.name.length < 2) return "Name must be at least 2 characters";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) return "Email is required";
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address";
    
    if (!formData.subject.trim()) return "Subject is required";
    if (formData.subject.length < 5) return "Subject must be at least 5 characters";
    
    if (!formData.message.trim()) return "Message is required";
    if (formData.message.length < 10) return "Message must be at least 10 characters";
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast(null);

    const validationError = validateForm();
    if (validationError) {
      showToast('error', validationError);
      return;
    }

    setIsSubmitting(true);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const templateParams = {
      name: formData.name,
      email: formData.email,
      title: formData.subject,
      message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
      time: new Date().toLocaleString(),
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        showToast('success', 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, (error) => {
        console.error(error.text);
        showToast('error', 'Failed to send message. Please try again later.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
    <section ref={containerRef} id="contact" className="py-24 relative overflow-hidden section-lazy">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none">
          <div
            ref={toastRef}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${
              toast.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <FaCheckCircle size={20} /> : <FaExclamationCircle size={20} />}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="contact-header text-center mb-16">
          <h2 className="glass-heading text-4xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight">
            Contact Me
          </h2>
        </div>

        <div className="contact-content grid md:grid-cols-2 gap-10 md:gap-24 items-start">
          <div className="contact-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 font-heading">Let's collaborate</h3>
            <p className="text-gray-400 leading-relaxed mb-12 text-base md:text-lg">
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
                      <a href={item.href} className="text-lg md:text-xl text-white hover:text-gray-300 transition-colors font-medium break-all">{item.value}</a>
                    ) : (
                      <span className="text-lg md:text-xl text-white font-medium">{item.value}</span>
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
                    aria-label={`Visit my ${item.icon.type.name.replace('Fa', '')} profile`}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-right bg-white/5 border border-white/15 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.06)]">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
