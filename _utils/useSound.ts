import { useEffect, useState } from 'react';

const useSound = (url: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio(url));
    }
  }, [url]);

  const play = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  return play;
};

export default useSound;
