import React, { useEffect, useState } from 'react';
import './VideoPage.css';

const VideosPage: React.FC = () => {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  useEffect(() => {
    setVideoUrls([
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/crescent-beach.mov',
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/sand-bar.mov',
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/quarry.mov',
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/1623953939349.mov',
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/the-point.mov',
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/salt-pond.mp4',
    ]);
  }, []);

  return (
    <section className="videos-page">
      <h2>Drone Shots</h2>
      <div className="videos-container">
        {videoUrls.map((url, index) => (
          <video key={index} controls poster={url} src={url} />
        ))}
      </div>
    </section>
  );
};

export default VideosPage;
