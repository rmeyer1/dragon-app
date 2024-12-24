import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Yb
      </Link>
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
