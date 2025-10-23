import { useVideo } from '@/contexts/VideoContext';
import VideoButton from '@/components/VideoButton';
import { Monitor } from 'lucide-react';

const Buttons = () => {
  const { currentVideo, changeVideo, videos } = useVideo();

  const handleVideoClick = (videoId: string) => {
    // Just change the video - BroadcastChannel will sync to other tabs
    changeVideo(videoId);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Monitor className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Video Control Panel</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Select a video to play on the main screen
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoButton
              key={video.id}
              video={video}
              isActive={currentVideo.id === video.id}
              onClick={() => handleVideoClick(video.id)}
            />
          ))}
        </div>

        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Current: <span className="text-foreground font-semibold">{currentVideo.title}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Click a button to change the video
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Buttons;
