import React, { useEffect, useState } from 'react';

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
    <section className="w-full min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-16">
          Drone Shots
        </h1>
        
        <div className="space-y-8">
          {videoUrls.map((url, index) => (
            <div 
              key={index}
              className="relative rounded-2xl overflow-hidden border-2 border-[#39d353]"
            >
              <video 
                controls 
                src={url}
                className="w-full aspect-video bg-black"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosPage;
