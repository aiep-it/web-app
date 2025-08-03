'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestartQuiz: () => void;
  onBackToLearning: () => void;
}

export function QuizResults({ score, totalQuestions, onRestartQuiz, onBackToLearning }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getResultMessage = () => {
    if (score === totalQuestions) {
      return "Perfect! You got all questions correct! 🎉";
    } else if (score >= totalQuestions * 0.8) {
      return "Great job! You did very well! 👏";
    } else if (score >= totalQuestions * 0.6) {
      return "Good work! Keep practicing to improve! 💪";
    } else {
      return "Keep studying and try again! You can do it! 📚";
    }
  };

  const getResultColor = () => {
    if (score === totalQuestions) {
      return "from-green-400 to-green-600";
    } else if (score >= totalQuestions * 0.8) {
      return "from-blue-400 to-blue-600";
    } else if (score >= totalQuestions * 0.6) {
      return "from-yellow-400 to-yellow-600";
    } else {
      return "from-red-400 to-red-600";
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className={`w-20 h-20 bg-gradient-to-br ${getResultColor()} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon 
            icon={score === totalQuestions ? "mdi:trophy" : score >= totalQuestions * 0.6 ? "mdi:medal" : "mdi:progress-star"} 
            className="text-white text-3xl" 
          />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Completed!
        </h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{totalQuestions - score}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                percentage >= 80 ? 'text-green-600' : 
                percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {percentage}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          {getResultMessage()}
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            color="primary"
            variant="light"
            onPress={onRestartQuiz}
            startContent={<Icon icon="mdi:refresh" />}
          >
            Try Again
          </Button>
          <Button
            color="primary"
            onPress={onBackToLearning}
            startContent={<Icon icon="mdi:arrow-left" />}
          >
            Back to Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
