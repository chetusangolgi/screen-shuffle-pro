import { useState, useEffect } from 'react';

export const VIDEO_STORAGE_KEY = 'current-video-id';

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
    color: 'hsl(var(--video-1))',
  },
  {
    id: '2',
    title: 'Video 2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    color: 'hsl(var(--video-2))',
  },
  {
    id: '3',
    title: 'Video 3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    color: 'hsl(var(--video-3))',
  },
  {
    id: '4',
    title: 'Video 4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    color: 'hsl(var(--video-4))',
  },
  {
    id: '5',
    title: 'Video 5',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    color: 'hsl(var(--video-5))',
  },
  {
    id: '6',
    title: 'Video 6',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    color: 'hsl(var(--video-6))',
  },
];

export const useVideoSync = () => {
  const [currentVideoId, setCurrentVideoId] = useState<string>(() => {
    return localStorage.getItem(VIDEO_STORAGE_KEY) || '1';
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === VIDEO_STORAGE_KEY && e.newValue) {
        setCurrentVideoId(e.newValue);
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentVideoId(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('videoChange', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('videoChange', handleCustomEvent);
    };
  }, []);

  const changeVideo = (videoId: string) => {
    localStorage.setItem(VIDEO_STORAGE_KEY, videoId);
    setCurrentVideoId(videoId);
    window.dispatchEvent(new CustomEvent('videoChange', { detail: videoId }));
  };

  const currentVideo = videos.find((v) => v.id === currentVideoId) || videos[0];

  return { currentVideo, changeVideo, videos };
};
