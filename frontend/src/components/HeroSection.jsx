import React from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from "../assets/images/img1.jpeg";
import img2 from "../assets/images/img2.jpeg";
import img3 from "../assets/images/img3.jpeg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-custom-dark text-white relative py-16 px-6 md:px-10 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
        {/* Text Content */}
        <div className="max-w-2xl mb-8 lg:mb-0 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
            Stay Smart, Read Less
          </h1>
          <p className="text-lg md:text-xl mb-8 navText ">
            Nugget gives you bite-sized summaries of the day's top stories—
            tailored to your interests and powered by AI.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button 
             onClick={() => navigate("/daily-nuggets")}
            className="primary-bg hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md flex items-center transition-colors">
              Start Reading Smarter
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Collage (Hidden on mobile) */}
        <div className="relative w-96 h-96 hidden lg:block">

          {/* OtherImage */}
          <div className="absolute top-0 left-0 w-48 h-64 border-2 border-yellow-500 transform -rotate-12 overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img1})` }}></div>
          </div>

          {/* Person Image */}
          <div className="absolute left-[140px] top-[70px] w-48 h-64 border-2 border-yellow-500 transform rotate-[29deg] overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img2})` }}></div>
          </div>

          {/* Peacock Image  */}
          <div className="absolute -left-[140px] top-[90px] w-48 h-64 border-2 border-yellow-500 transform -rotate-[39deg] overflow-hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img3})` }}></div>
          </div>

        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900 to-transparent"></div>
    </div>
  );
};

export default HeroSection;