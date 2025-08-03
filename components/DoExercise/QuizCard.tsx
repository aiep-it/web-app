'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ExerciseData } from '@/services/types/exercise';

interface QuizCardProps {
  exercise: ExerciseData;
  selectedAnswer: string;
  showResult: boolean;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export function QuizCard({
  exercise,
  selectedAnswer,
  showResult,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  isLastQuestion,
}: QuizCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Icon icon="mdi:quiz" className="text-lg" />
          </div>
          <span className="text-sm font-medium opacity-90">Question</span>
        </div>
        <h2 className="text-xl font-semibold">
          {exercise.content}
        </h2>
        {exercise.hint && (
          <p className="text-sm opacity-80 mt-2">
            💡 Hint: {exercise.hint}
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="p-6">
        <div className="space-y-3">
          {exercise.options?.map((option, index) => (
            <button
              key={index}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                selectedAnswer === option
                  ? showResult
                    ? option === exercise.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-blue-500 bg-blue-50 text-blue-700'
                  : showResult && option === exercise.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => !showResult && onAnswerSelect(option)}
              disabled={showResult}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option
                    ? showResult
                      ? option === exercise.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-blue-500 bg-blue-500'
                    : showResult && option === exercise.correctAnswer
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                }`}>
                  {(selectedAnswer === option && showResult) || 
                   (showResult && option === exercise.correctAnswer) ? (
                    <Icon 
                      icon={option === exercise.correctAnswer ? "mdi:check" : "mdi:close"} 
                      className="text-white text-sm" 
                    />
                  ) : selectedAnswer === option ? (
                    <Icon icon="mdi:check" className="text-white text-sm" />
                  ) : null}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {!showResult ? (
            <Button
              color="primary"
              size="lg"
              className="flex-1"
              onPress={onSubmitAnswer}
              isDisabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              color="primary"
              size="lg"
              className="flex-1"
              onPress={onNextQuestion}
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
