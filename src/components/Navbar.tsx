import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/yb.jpg';

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-toggle" onClick={handleToggle}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <ul className={`navbar-links ${isActive ? 'active' : ''}`}>
        <li><Link to="/" onClick={handleToggle}>Home</Link></li>
        <li><Link to="/about" onClick={handleToggle}>About</Link></li>
        <li><Link to="/videos" onClick={handleToggle}>Videos</Link></li>
        <li><Link to="/sports" onClick={handleToggle}>Sports</Link></li>
        <li><Link to="/finance" onClick={handleToggle}>Finance</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
