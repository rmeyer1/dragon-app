import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { FaNodeJs, FaReact, FaPython, FaWindows, FaApple, FaLinux } from 'react-icons/fa';
import './AboutPage.css';
import { FaGithub } from 'react-icons/fa6';

const AboutPage: React.FC = () => {
  return (
    <section className="about-page">
      <div className="about-content">
        <div className="about-text">
          <h2>About Me</h2>
          <p className="description">
            Senior Quality Engineer at CarMax with over 10 years of experience delivering enterprise software solutions in a variety of industries and roles.
          </p>
          <div className="tech-stack">
            <FaNodeJs className="tech-icon" title="Node.js" />
            <FaReact className="tech-icon" title="React" />
            <FaPython className="tech-icon" title="Python" />
            <FaGithub className="tech-icon" title="GitHub" />
            <FaWindows className="tech-icon" title="Windows" />
            <FaApple className="tech-icon" title="macOS" />
            <FaLinux className="tech-icon" title="Linux" />
          </div>
        </div>
        <div className="image-container">
          <img 
            src="/images/robAvatar.png" 
            alt="Profile Avatar" 
            className="profile-image"
          />
        </div>
      </div>
      <div className="git-activity">
        <h3>GitHub Activity</h3>
        <GitHubCalendar 
          username="rmeyer1"
          blockSize={12}
          blockMargin={4}
          fontSize={12}
          hideColorLegend={true}
          hideMonthLabels={true}
          year="last"
          colorScheme='dark'
          style={{
            minHeight: '100px',
            maxWidth: '100%',
          }}
        />
      </div>
    </section>
  );
};

export default AboutPage;
