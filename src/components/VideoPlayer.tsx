import { useEffect, useRef } from 'react';
import { useVideo } from '@/contexts/VideoContext';

const VideoPlayer = () => {
  const { currentVideo, changeVideo } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Silently handle autoplay errors - user can click to play
          if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            console.error('Error playing video:', error);
          }
        });
      }
    }
  }, [currentVideo.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      // Go back to default video (Video 1) when current video ends
      changeVideo('1');
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [changeVideo]);

  const handleVideoClick = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-background">
      <video
        ref={videoRef}
        key={currentVideo.id}
        className="w-full h-full object-cover cursor-pointer"
        autoPlay
        muted
        playsInline
        onClick={handleVideoClick}
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
