"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface ExerciseHeaderProps {
  currentIndex: number;
  totalExercises: number;
  topicName: string;
  progress: number;
  remainingExercises: number;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  currentIndex,
  totalExercises,
  topicName,
  progress,
  remainingExercises
}) => {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => router.push("/learn-vocabulary")}
          color="primary"
          variant="ghost"
          size="lg"
          className="hover:scale-105 transition-transform duration-200"
          startContent={<Icon icon="mdi:arrow-left" className="text-xl" />}
        >
          Back to Topics
        </Button>
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
            <div className="text-lg font-bold text-gray-800">
              Exercise {currentIndex + 1} of {totalExercises}
            </div>
            <div className="text-sm text-gray-500">{topicName}</div>
          </div>
        </div>
        <div className="w-32"></div> {/* Spacer for balance */}
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative">
        <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-4 shadow-inner overflow-hidden border border-white/30">
          <div 
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
          <span className="text-sm text-gray-500">{remainingExercises} remaining</span>
        </div>
      </div>
    </div>
  );
};
