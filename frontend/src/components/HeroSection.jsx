import React from 'react';
import img1 from "../assets/images/img1.jpeg";
import img2 from "../assets/images/img2.jpeg";
import img3 from "../assets/images/img3.jpeg";

const HeroSection = () => {
  return (
    <div className="bg-custom-dark text-white relative py-16 px-6 md:px-10 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Text Content */}
        <div className="max-w-2xl">
          <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Stay Smart, Read Less
          </h1>
          <p className="text-lg md:text-xl mb-8 navText ">
            Nugget gives you bite-sized summaries of the day's top stories—
            tailored to your interests and powered by AI.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md flex items-center transition-colors">
            Start Reading Smarter
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Image Collage */}
        <div className="relative w-96 h-96">

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