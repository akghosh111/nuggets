import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Nugget?",
      answer: "Nugget is your personalized news feed. No clutter. Just the stories that matter to you."
    },
    {
      question: "Why do I need to log in?",
      answer: "Logging in helps us save your preferences, so you only see the news you care about—from sources you trust."
    },
    {
      question: "How does it work?",
      answer: "Once you log in, you choose your preferred topics and news portals. We'll fetch and show you only the most relevant news nuggets, daily."
    },
    {
      question: "Is it free to use?",
      answer: "Absolutely! Nugget is free to use with no hidden charges."
    }
  ];

  return (
    <div className="w-full h-full bg-[#0c0f1d] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="floatingText text-4xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className=" bg-[#171c30] rounded-lg overflow-hidden mb-4"
            >
              <button
                className="flex justify-between items-center w-full text-left py-6 px-8 focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="floatingText text-xl font-medium text-white">{faq.question}</span>
                <div className={`bg-indigo-600 rounded-full p-1 ${openIndex === index ? 'transform rotate-180' : ''}`}>
                  <ChevronDown className="h-6 w-6 text-white" />
                </div>
              </button>
              
              {openIndex === index && (
                <div className=" ordtext px-8 pb-6 text-gray-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-full font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faqs;