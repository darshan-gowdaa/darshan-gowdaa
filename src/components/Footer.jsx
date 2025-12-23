import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-2 sm:px-4 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-xl font-bold">
              <span className="text-white">Darshan</span>
              <span className="text-gray-400">&nbsp;Gowda</span>
            </div>
          </div>

          <div className="flex space-x-4 mb-6 md:mb-0">
            <a
              href="https://github.com/darshan-gowdaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/Darshan-Gowda-43a29a339"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="mailto:darshangowdaa223@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} Darshan Gowda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
