import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Daily Nuggets', path: '/daily-nuggets' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'FAQs', path: '/faqs' },
  ];
  
  return (
    <nav className="bg-custom-dark navText text-white py-6 px-7">
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center">
          <span className="bg-yellow-500 text-black font-bold p-1 mr-2">N</span>
          <span className="text-white font-bold text-lg">Nugget</span>
        </div>

        {/* Middle - Nav links (hidden on mobile) */}
        <div className="hidden  md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className="navText text-white hover:text-yellow-300"  
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right - Get Started button (hidden on mobile) */}
        <div className=" hidden md:block">
          <Link 
            to="/get-started"
            className="primary-bg  ordtext hover:bg-indigo-700 px-6 py-3 rounded-md font-medium text-white"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu, toggle based on state */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 pt-2 pb-4 border-t border-gray-700">
          <div className="flex flex-col space-y-3 px-4">
            {navLinks.map((link) => (
              <Link 
                key={`mobile-${link.path}`}
                to={link.path}
                className="text-white hover:text-blue-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/get-started"
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-medium text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}