"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ExerciseResult } from "@/types/vocabulary";

interface ExerciseCompletionProps {
  topicName: string;
  totalExercises: number;
  results: ExerciseResult[];
  onTryAgain: () => void;
  onBackToCategories: () => void;
}

export const ExerciseCompletion: React.FC<ExerciseCompletionProps> = ({
  topicName,
  totalExercises,
  results,
  onTryAgain,
  onBackToCategories
}) => {
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const accuracy = Math.round((correctAnswers / results.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          {/* Success Animation */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-8 relative">
            <span className="text-6xl animate-bounce">🏆</span>
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exercise Completed!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Great job completing "{topicName}" exercises
          </p>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{totalExercises}</div>
                <div className="text-sm text-gray-600">Total Exercises</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={onTryAgain}
              color="success"
              size="lg"
              className="w-full max-w-md mx-auto h-12 font-semibold"
              startContent={<Icon icon="mdi:refresh" className="text-xl" />}
            >
              Try Again
            </Button>
            <Button
              onClick={onBackToCategories}
              color="default"
              variant="flat"
              size="lg"
              className="w-full max-w-md mx-auto h-12 font-semibold"
              startContent={<Icon icon="mdi:arrow-left" className="text-xl" />}
            >
              Back to Categories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
