import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaFilm, FaLaptopCode, FaBriefcase, FaVideo, FaChartLine,
  FaRocket, FaHashtag, FaLandmark, FaGlobeAsia, FaFlask, FaFootballBall, FaEnvelope
} from 'react-icons/fa';
import { GiCricketBat } from 'react-icons/gi';

const Body = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroSectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const goToHome = () => {
    try {
      console.log("Attempting navigation to home...");
      window.location.href = '/';
      navigate('/');
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.replace('/');
    }
  };

  useEffect(() => {
    console.log("Body component mounted with navigation:", !!navigate);

    // Check if screen is mobile size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    const handleScroll = () => {
      if (heroSectionRef.current) {
        const heroSectionTop = heroSectionRef.current.getBoundingClientRect().top;
        setIsVisible(heroSectionTop < 0);
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [navigate]);

  const iconClass = "inline-block mr-2 text-primary";

  const topicsRow1 = [
    "Entertainment", "Technology", "Cricket", "Business", "Bollywood", "Stock Market"
  ];

  const topicsRow2 = [
    "Startups", "Social Media", "Politics", "Geopolitics", "Science", "Sports"
  ];

  const iconMap = {
    Entertainment: <FaFilm className={iconClass} />,
    Technology: <FaLaptopCode className={iconClass} />,
    Cricket: <GiCricketBat className={iconClass} />,
    Business: <FaBriefcase className={iconClass} />,
    Bollywood: <FaVideo className={iconClass} />,
    "Stock Market": <FaChartLine className={iconClass} />,
    Startups: <FaRocket className={iconClass} />,
    "Social Media": <FaHashtag className={iconClass} />,
    Politics: <FaLandmark className={iconClass} />,
    Geopolitics: <FaGlobeAsia className={iconClass} />,
    Science: <FaFlask className={iconClass} />,
    Sports: <FaFootballBall className={iconClass} />,
  };

  // Calculate animation speed based on device type
  const animationDuration = isMobile ? 15 : 20;
  // Adjust animation distance based on device type
  const animationDistance = isMobile ? -800 : -1000;

  return (
    <div className="bg-gray-100 py-10 md:py-20 px-4 md:px-6 text-center" ref={heroSectionRef}>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
        Read from your <span className="bg-primary text-white px-2 py-1 rounded">favorite news portals</span>
      </h1>

      <p className="text-sm md:text-base lg:text-lg mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
        Select your interests from a variety of options available & stay updated in domain specific relevant news <span className="font-semibold">24×7</span> at your fingertips.
      </p>

      {/* First row */}
      <div className="overflow-hidden mb-6 md:mb-8" ref={containerRef}>
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, animationDistance] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: animationDuration,
            ease: "linear"
          }}
        >
          {[...topicsRow1, ...topicsRow1].map((topic, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="inline-block mx-2 md:mx-4 px-3 md:px-6 py-2 md:py-3 bg-white border border-primary/30 rounded-md text-gray-800 cursor-pointer shadow-sm hover:shadow-md transition text-xs md:text-base"
            >
              {iconMap[topic]} {topic}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Second row */}
      <div className="overflow-hidden mb-8 md:mb-12">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [animationDistance, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: animationDuration,
            ease: "linear"
          }}
        >
          {[...topicsRow2, ...topicsRow2].map((topic, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="inline-block mx-2 md:mx-4 px-3 md:px-6 py-2 md:py-3 bg-white border border-primary/30 rounded-md text-gray-800 cursor-pointer shadow-sm hover:shadow-md transition text-xs md:text-base"
            >
              {iconMap[topic]} {topic}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Clickable icon - adjusted for mobile */}
      <div className={`fixed bottom-16 md:bottom-28 right-4 md:right-10 z-[99999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer bg-primary/10 hover:bg-primary/20 rounded-full transition-colors border-2 border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={goToHome}
          aria-label="Navigate to home page"
        >
          <motion.div
            animate={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
            </svg>
          </motion.div>
        </button>
      </div>
    </div>
  );
};

export default Body;