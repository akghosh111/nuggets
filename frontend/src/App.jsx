import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust the path as needed
import Home from './pages/Home'; // Import Home page
import DailyNuggets from './pages/DailyNuggets'; // Other pages
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';
import GetStarted from './pages/GetStarted';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar /> {/* This will appear on all pages */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* HeroSection will be part of Home */}
        <Route path="/daily-nuggets" element={<DailyNuggets />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
