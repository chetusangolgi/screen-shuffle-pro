import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const VIDEO_STORAGE_KEY = 'current-video-id';
const BROADCAST_CHANNEL_NAME = 'video-channel';

export interface VideoConfig {
  id: string;
  url: string;
  title: string;
  color: string;
}

export const videos: VideoConfig[] = [
  {
    id: '1',
    title: 'Video 1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Video 2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    color: '#8b5cf6',
  },
  {
    id: '3',
    title: 'Video 3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    color: '#ec4899',
  },
  {
    id: '4',
    title: 'Video 4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    color: '#f59e0b',
  },
  {
    id: '5',
    title: 'Video 5',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    color: '#10b981',
  },
  {
    id: '6',
    title: 'Video 6',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    color: '#06b6d4',
  },
];

interface VideoContextType {
  currentVideo: VideoConfig;
  changeVideo: (videoId: string) => void;
  videos: VideoConfig[];
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

let broadcastChannel: BroadcastChannel | null = null;

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialVideoId = () => {
    const sessionId = sessionStorage.getItem(VIDEO_STORAGE_KEY);
    const localId = localStorage.getItem(VIDEO_STORAGE_KEY);
    return sessionId || localId || '1';
  };

  const [currentVideoId, setCurrentVideoId] = useState<string>(getInitialVideoId);

  useEffect(() => {
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'VIDEO_CHANGE') {
          const newVideoId = event.data.videoId;
          setCurrentVideoId(newVideoId);
          sessionStorage.setItem(VIDEO_STORAGE_KEY, newVideoId);
          localStorage.setItem(VIDEO_STORAGE_KEY, newVideoId);
        }
      };
    } catch (error) {
      console.error('BroadcastChannel not supported:', error);
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, []);

  const changeVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    sessionStorage.setItem(VIDEO_STORAGE_KEY, videoId);
    localStorage.setItem(VIDEO_STORAGE_KEY, videoId);

    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'VIDEO_CHANGE', videoId });
      } catch (error) {
        console.error('Error broadcasting:', error);
      }
    }
  };

  const currentVideo = videos.find((v) => v.id === currentVideoId) || videos[0];

  return (
    <VideoContext.Provider value={{ currentVideo, changeVideo, videos }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
