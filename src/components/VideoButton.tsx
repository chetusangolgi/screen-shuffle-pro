import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { VideoConfig } from '@/hooks/useVideoSync';

interface VideoButtonProps {
  video: VideoConfig;
  isActive: boolean;
  onClick: () => void;
}

const VideoButton = ({ video, isActive, onClick }: VideoButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="relative h-32 w-full overflow-hidden border-2 transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: isActive ? video.color : 'hsl(var(--secondary))',
        borderColor: video.color,
      }}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <Play className={`w-8 h-8 ${isActive ? 'fill-current' : ''}`} />
        <span className="text-lg font-bold">{video.title}</span>
      </div>
      
      {isActive && (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      )}
    </Button>
  );
};

export default VideoButton;
