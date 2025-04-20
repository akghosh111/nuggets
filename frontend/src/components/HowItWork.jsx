import React from 'react';
import { Newspaper, UserCheck, Filter, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWork = () => {
  const steps = [
    {
      icon: <UserCheck className="h-10 w-10 text-indigo-400" />,
      title: "Create Your Account",
      description: "Sign up and log in to your Nugget profile in seconds. Authentication helps us save your preferences for personalized content."
    },
    {
      icon: <Filter className="h-10 w-10 text-indigo-400" />,
      title: "Select Your Preferences",
      description: "After logging in, choose your preferred topics and select from our curated trusted news portals that you want to follow."
    },
    {
      icon: <Newspaper className="h-10 w-10 text-indigo-400" />,
      title: "Receive Personalized Nuggets",
      description: "We'll deliver news only from your selected sources, focusing on the topics that matter to you—no more information overload."
    },
    {
      icon: <Bell className="h-10 w-10 text-indigo-400" />,
      title: "Stay Updated Daily",
      description: "Get fresh nuggets delivered to your feed daily. Update your preferences anytime to refine your personalized news experience."
    }
  ];

  return (
    <div className="w-full h-full bg-[#0c0f1d] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className=" floatingText text-4xl font-bold mb-4 text-white">How It Works</h2>
          <p className="ordtext text-gray-300 text-lg max-w-2xl mx-auto">
            Nugget simplifies your news experience by delivering only what matters to you.
            Here's how we make staying informed effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-[#171c30] rounded-lg p-6 flex flex-col items-center text-center transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div className="mb-4 bg-[#0c0f1d] p-4 rounded-full">
                {step.icon}
              </div>
              <h3 className="floatingText text-xl font-semibold mb-3">{step.title}</h3>
              <p className="ordtext text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">Ready to experience news without the noise?</p>
          <Link to="/get-started">
            <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white font-medium py-3 px-8 rounded-full">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;