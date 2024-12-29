import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black/90 backdrop-blur-sm py-4 px-4 fixed bottom-0 left-0">
      <div className="max-w-7xl mx-auto">
        <p className="text-gray-400 text-center text-sm">
          &copy; 2024 Yb
        </p>
      </div>
    </footer>
  );
};

export default Footer;
