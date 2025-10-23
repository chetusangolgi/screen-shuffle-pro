import { useEffect, useRef } from 'react';
import { useVideoSync } from '@/hooks/useVideoSync';

const VideoPlayer = () => {
  const { currentVideo } = useVideoSync();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  }, [currentVideo.id]);

  return (
    <div className="fixed inset-0 bg-background">
      <video
        ref={videoRef}
        key={currentVideo.id}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={currentVideo.url} type="video/mp4" />
      </video>
      
      <div className="absolute bottom-8 left-8 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">Now Playing</p>
        <h2 className="text-xl font-bold text-foreground">{currentVideo.title}</h2>
      </div>
    </div>
  );
};

export default VideoPlayer;
