"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface AudioControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onPlay,
  onStop
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        onClick={isPlaying ? onStop : onPlay}
        color={isPlaying ? "danger" : "secondary"}
        variant="bordered"
        size="lg"
        className="font-semibold hover:scale-105 transform transition-all duration-200"
        startContent={
          <Icon 
            icon={isPlaying ? "mdi:stop" : "mdi:volume-high"} 
            className={`text-xl ${isPlaying ? 'animate-pulse' : ''}`}
          />
        }
      >
        {isPlaying ? 'Stop Audio' : 'Listen to Sentence'}
      </Button>
      
      <div className="text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
        <Icon icon="mdi:information-outline" className="inline-block mr-2 text-blue-500" />
        Listen carefully to fill the blank
      </div>
    </div>
  );
};
