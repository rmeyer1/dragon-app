import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { SiJavascript, SiReact, SiPython, SiGithub, SiApple, SiLinux } from 'react-icons/si';
import { FaWindows, FaNodeJs } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-black text-white px-4 py-14">
      {/* Main Container */}
      <div className="max-w-3xl mx-auto space-y-16">
        
        {/* Header & Bio Section */}
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-center mb-12">About Me</h1>
          <p className="text-1xl text-center leading-relaxed">
            Senior Quality Engineer at CarMax with over 10 years of experience delivering enterprise software solutions in a variety of industries and roles.
          </p>
        </div>
          
          {/* Avatar Section */}
          <div className="w-64 h-64 mx-auto bg-purple-600 rounded-2xl p-4">
          <img 
            src="/images/robAvatar.png" 
            alt="Profile Avatar" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Tech Stack Section */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <SiJavascript className="text-3xl text-white hover:text-[#646cff] transition-colors" />
          <SiReact className="text-3xl text-white hover:text-[#646cff] transition-colors" />
          <FaNodeJs className="text-3xl text-white hover:text-[#646cff] transition-colors" />
          <SiPython className="text-3xl text-white hover:text-[#646cff] transition-colors" />
          <SiGithub className="text-3xl text-white hover:text-[#646cff] transition-colors" />
          <FaWindows className="text-3xl text-white hover:text-[#646cff] transition-colors" />
          <SiApple className="text-3xl text-white hover:text-[#646cff] transition-colors" />
          <SiLinux className="text-3xl text-white hover:text-[#646cff] transition-colors" />
        </div>

        {/* GitHub Activity Section */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold">GitHub Activity</h2>
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
      </div>
    </section>
  );
};

export default AboutPage;