import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/yb.jpg';

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const closeMenu = () => {
    setIsActive(false);
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-sm z-50 h-16">
      <div className="w-full h-full flex justify-between items-center">
        {/* Logo - Removed max-width container and adjusted left padding */}
        <div className="flex items-center pl-1 lg:pl-1">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src={logo} alt="Logo" className="h-12 w-12 lg:h-14 lg:w-14" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={handleToggle}
          className="lg:hidden flex flex-col gap-1.5 p-2 pr-4"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isActive ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${isActive ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isActive ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Navigation Links - Centered in remaining space */}
        <ul className={`
          fixed lg:relative top-16 lg:top-0 left-0 w-full lg:w-auto
          bg-black/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
          py-4 lg:py-0 px-4 lg:pr-8
          flex flex-col lg:flex-row items-center gap-6
          transform transition-transform duration-300 ease-in-out
          ${isActive ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <li>
            <Link 
              to="/" 
              onClick={closeMenu} 
              className={`text-white hover:text-green-500 transition-colors ${isCurrentPath('/') ? 'text-green-500' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              onClick={closeMenu} 
              className={`text-white hover:text-green-500 transition-colors ${isCurrentPath('/about') ? 'text-green-500' : ''}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/projects" 
              onClick={closeMenu} 
              className={`text-white hover:text-green-500 transition-colors ${isCurrentPath('/projects') ? 'text-green-500' : ''}`}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link 
              to="/videos" 
              onClick={closeMenu} 
              className={`text-white hover:text-green-500 transition-colors ${isCurrentPath('/videos') ? 'text-green-500' : ''}`}
            >
              Videos
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              onClick={closeMenu} 
              className={`text-white hover:text-green-500 transition-colors ${isCurrentPath('/contact') ? 'text-green-500' : ''}`}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
