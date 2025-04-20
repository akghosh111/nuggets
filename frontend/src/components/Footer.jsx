import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-700">
          {/* About Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="  floatingText text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
              <span className=" primary-bg w-2 h-6 mr-2 rounded"></span>
              About Nugget
            </h3>
            <p className="ordtext text-gray-300 text-sm md:text-base mb-3 md:mb-4">
              Bite-sized news summaries powered by AI, designed to keep you informed without information overload.
            </p>
            <p className="ordtext text-gray-300 text-sm md:text-base">
              Built with ❤️ during Hackathon 2025
            </p>
          </div>
          
          {/* Quick Links */}
          {/* <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
              <span className="bg-purple-500 w-2 h-6 mr-2 rounded"></span>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 text-sm md:text-base hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="/topics" className="text-gray-300 text-sm md:text-base hover:text-purple-400 transition-colors">Topics</a></li>
              <li><a href="/about" className="text-gray-300 text-sm md:text-base hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="/api" className="text-gray-300 text-sm md:text-base hover:text-purple-400 transition-colors">API</a></li>
              <li><a href="/privacy" className="text-gray-300 text-sm md:text-base hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div> */}
          
          {/* Subscribe Section */}
          <div className="md:col-start-3">
            <h3 className="  floatingText text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
              <span className="primary-bg w-2 h-6 mr-2 rounded"></span>
              Stay Updated
            </h3>
            <p className=" ordtext text-gray-300 text-sm md:text-base mb-3 md:mb-4">
              Subscribe to our newsletter for weekly news digest.
            </p>
            <div className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your email address" 
                className=" ordtext bg-gray-800 text-white p-2 md:p-3 rounded-t sm:rounded-t-none sm:rounded-l outline-none border-0 w-full mb-2 sm:mb-0"
              />
              <button className="ordtext primary-bg hover:bg-indigo-700 text-white p-2 md:p-3 rounded-b sm:rounded-b-none sm:rounded-r transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className=" ordtext text-gray-400 text-sm md:text-base mb-4 md:mb-0 text-center md:text-left">
            © {currentYear} Nugget News. All rights reserved.
          </p>
          
          {/* Social Media Links */}
          <div className=" ordtext flex space-x-4 justify-center md:justify-start">
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub size={18} className="md:text-xl" />
            </motion.a>
            <motion.a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTwitter size={18} className="md:text-xl" />
            </motion.a>
            <motion.a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedin size={18} className="md:text-xl" />
            </motion.a>
            <motion.a 
              href="mailto:team@nugget.news" 
              whileHover={{ y: -3 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaEnvelope size={18} className="md:text-xl" />
            </motion.a>
            <motion.a 
              href="/hackathon" 
              whileHover={{ y: -3 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaCode size={18} className="md:text-xl" />
            </motion.a>
          </div>
        </div>
        
        {/* Hackathon Badge */}
        {/* <div className="mt-6 md:mt-8 text-center">
          <motion.div 
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium"
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(124, 58, 237, 0)', '0 0 0 10px rgba(124, 58, 237, 0.2)', '0 0 0 0 rgba(124, 58, 237, 0)']
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 
            }}
          >
            Hackathon 2025 Project
          </motion.div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;