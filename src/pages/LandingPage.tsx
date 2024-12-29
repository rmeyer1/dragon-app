import React, { useState, useEffect } from 'react';
import mountainLandscape from '/images/mountain-landscape.png';


const words = ['Engineer', 'Technologist', 'Investor'];

const LandingPage: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 150;
    const currentWord = words[wordIndex];

    let timer: NodeJS.Timeout;
    
    if (!isDeleting && displayText === currentWord) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
    } else {
      timer = setTimeout(() => {
        if (!isDeleting) {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
        } else {
          setDisplayText(currentWord.substring(0, displayText.length - 1));
          if (displayText === '') {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      }, typeSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
        style={{ backgroundImage: `url(${mountainLandscape})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 
          className={`
            text-4xl md:text-6xl lg:text-7xl 
            font-bold text-white 
            drop-shadow-lg
            min-h-[1.2em]
            ${isDeleting ? 'border-r-2 border-white animate-blink' : ''}
          `}
        >
          {displayText}
        </h1>
      </div>
    </section>
  );
};

export default LandingPage;
