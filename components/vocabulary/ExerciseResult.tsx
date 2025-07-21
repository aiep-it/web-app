"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ExerciseResultProps {
  isCorrect: boolean;
  correctAnswer: string;
  currentIndex: number;
  totalExercises: number;
  onRetry: () => void;
  onNext: () => void;
}

export const ExerciseResult: React.FC<ExerciseResultProps> = ({
  isCorrect,
  correctAnswer,
  currentIndex,
  totalExercises,
  onRetry,
  onNext
}) => {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Enhanced Result Display */}
      <div className={`
        relative p-8 rounded-3xl text-center overflow-hidden
        border-4 transition-all duration-500 transform
        ${isCorrect 
          ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 shadow-green-100' 
          : 'bg-gradient-to-br from-red-50 to-pink-100 border-red-300 shadow-red-100'
        } shadow-2xl
      `}>
        {/* Background Pattern */}
        <div className={`absolute inset-0 opacity-10 ${
          isCorrect ? 'bg-green-pattern' : 'bg-red-pattern'
        }`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${isCorrect ? 'bg-green-500 animate-bounce-success' : 'bg-red-500 animate-shake'}
            `}>
              <Icon 
                icon={isCorrect ? "mdi:check-circle" : "mdi:close-circle"} 
                className="text-3xl text-white" 
              />
            </div>
            <div>
              <span className={`font-black text-3xl ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {isCorrect ? 'Excellent!' : 'Almost there!'}
              </span>
              <p className={`text-lg ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect ? 'Perfect answer!' : 'Give it another try'}
              </p>
            </div>
          </div>
          
          {!isCorrect && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/50 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Icon icon="mdi:lightbulb-on" className="text-2xl text-amber-500" />
                <p className="text-lg font-semibold text-gray-700">The correct answer is:</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-lg">
                <p className="text-2xl font-bold">{correctAnswer}</p>
              </div>
            </div>
          )}
          
          <div className={`
            inline-block px-6 py-3 rounded-full text-sm font-medium
            ${isCorrect 
              ? 'bg-green-100 text-green-700 border-2 border-green-200' 
              : 'bg-amber-100 text-amber-700 border-2 border-amber-200'
            }
          `}>
            {isCorrect 
              ? "🌟 You're becoming a vocabulary master!" 
              : "💪 Practice makes perfect - keep going!"
            }
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {!isCorrect && (
          <Button
            onClick={onRetry}
            color="warning"
            variant="bordered"
            size="lg"
            className="font-bold px-8 py-3 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
            startContent={<Icon icon="mdi:refresh" className="text-xl" />}
          >
            Try Again
          </Button>
        )}
        <Button
          onClick={onNext}
          color="success"
          size="lg"
          className="font-bold px-8 py-3 hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl bg-gradient-to-r from-green-500 to-emerald-600"
          startContent={<Icon icon={currentIndex < totalExercises - 1 ? "mdi:arrow-right" : "mdi:flag-checkered"} className="text-xl" />}
        >
          {currentIndex < totalExercises - 1 ? 'Next Exercise' : 'Complete All!'}
        </Button>
      </div>
    </div>
  );
};
