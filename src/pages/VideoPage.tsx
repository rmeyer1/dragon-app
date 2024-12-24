import React, { useEffect, useState } from 'react';
import './VideoPage.css'; // Import your CSS file

const VideosPage: React.FC = () => {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  useEffect(() => {
    // Fetch your video URLs from Google Cloud Storage
    // For this example, we'll use placeholder URLs
    setVideoUrls([
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/sand-bar.mov',
      'https://storage.googleapis.com/porfolio-d6cff.appspot.com/salt-pond.mp4',
    ]);
  }, []);

  return (
    <section className="videos-page">
      <h2>My Drone Footage</h2>
      <div className="videos-container">
        {videoUrls.map((url, index) => (
          <video key={index} controls src={url} />
        ))}
      </div>
    </section>
  );
};

export default VideosPage;
