import React, { useState, useEffect } from 'react';
import './LandingPage.css';

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
      // Add pause when word is complete
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
    <section className="landing-page">
      <div className="content">
        <h1 className="typewriter">{displayText}</h1>
      </div>
    </section>
  );
};

export default LandingPage;
