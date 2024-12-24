import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import './AboutPage.css'; // Import your CSS file

const AboutPage: React.FC = () => {
  return (
    <section className="about-page">
      <h2>About Me</h2>
      <p>
        {/* Add your overview and work experience here */}
        I am a passionate developer with experience in...
      </p>
      <div className="git-activity">
        <h3>GitHub Activity</h3>
        {/* You can use a library like react-github-calendar to display your activity */}
        <GitHubCalendar username="rmeyer1" />
      </div>
    </section>
  );
};

export default AboutPage;
