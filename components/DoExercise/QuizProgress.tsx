'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
}

export function QuizProgress({ currentQuestion, totalQuestions, score }: QuizProgressProps) {
  const progressPercentage = Math.round(((currentQuestion + 1) / totalQuestions) * 100);

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-600">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:progress-question" className="text-blue-500" />
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Icon icon="mdi:star" className="text-yellow-500" />
          <span className="text-sm font-medium">{score}/{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
}
