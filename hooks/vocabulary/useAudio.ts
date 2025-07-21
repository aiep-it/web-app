"use client";

import { useState, useEffect } from "react";
import { Exercise } from "@/types/vocabulary";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  const playFullSentence = (currentExercise: Exercise) => {
    if (!currentExercise) return;
    
    setIsPlaying(true);
    
    // Create the complete sentence with the correct answer
    const completeSentence = currentExercise.sentence.replace('_____', currentExercise.correctAnswer);
    
    // Use Web Speech API to speak the sentence
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(completeSentence);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower for learning
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
      alert('Your browser does not support text-to-speech functionality.');
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isPlaying,
    playFullSentence,
    stopAudio
  };
}
