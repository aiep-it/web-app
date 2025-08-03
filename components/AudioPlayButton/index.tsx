'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useRef } from 'react';

interface AudioPlayButtonProps {
  src: string;
}

const AudioPlayButton: React.FC<AudioPlayButtonProps> = ({ src }) => {

    console.log("Audio URL:", src);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    audioRef.current?.play();
  };

  return (
    <div className="flex items-center gap-2">

      <Button
        isIconOnly
        color="primary"
        variant="light"
        onPress={handlePlay}
        startContent={<Icon icon="lucide:play" />}
      ></Button>
      <audio ref={audioRef} src={src} className="hidden" />
    </div>
  );
};

export default AudioPlayButton;
