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
  // Always read from localStorage on every render to get the latest value
  const getStoredVideoId = () => {
    const stored = localStorage.getItem(VIDEO_STORAGE_KEY);
    console.log('🔍 Reading from localStorage:', stored);
    return stored || '1';
  };

  const [currentVideoId, setCurrentVideoId] = useState<string>(() => {
    const initial = getStoredVideoId();
    console.log('🎬 Initial video ID on mount:', initial);
    return initial;
  });

  useEffect(() => {
    // Poll localStorage every 100ms to detect changes
    const interval = setInterval(() => {
      const storedId = getStoredVideoId();
      if (storedId !== currentVideoId) {
        console.log('📊 Video ID changed from', currentVideoId, 'to', storedId);
        setCurrentVideoId(storedId);
      }
    }, 100);

    // Also listen to storage events for cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === VIDEO_STORAGE_KEY && e.newValue) {
        console.log('🔄 Storage event detected, changing to:', e.newValue);
        setCurrentVideoId(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentVideoId]);

  const changeVideo = (videoId: string) => {
    console.log('🎬 changeVideo called with videoId:', videoId);
    localStorage.setItem(VIDEO_STORAGE_KEY, videoId);
    console.log('💾 Saved to localStorage:', videoId);
    setCurrentVideoId(videoId);
    console.log('📊 State updated to:', videoId);
  };

  const currentVideo = videos.find((v) => v.id === currentVideoId) || videos[0];

  console.log('🎯 useVideoSync render - ID:', currentVideoId, 'Title:', currentVideo.title);

  return { currentVideo, changeVideo, videos };
};
