"use client";

import React from "react";
import { Input } from "@heroui/react";

interface InteractiveSentenceProps {
  sentence: string;
  userAnswer: string;
  showResult: boolean;
  isCorrect: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
}

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  sentence,
  userAnswer,
  showResult,
  isCorrect,
  onAnswerChange,
  onSubmit
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-inner border border-blue-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-transparent rounded-bl-full opacity-50"></div>
      <div className="relative z-10">
        <div className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium text-center max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sentence.split('_____').map((part, index, array) => (
              <span key={index} className="inline-flex items-center">
                <span className="whitespace-pre-wrap break-words">{part}</span>
                {index < array.length - 1 && (
                  <div className="mx-2 relative inline-flex items-center">
                    {!showResult ? (
                      <div className="relative group">
                        <Input
                          value={userAnswer}
                          onChange={(e) => onAnswerChange(e.target.value)}
                          placeholder="type here..."
                          size="sm"
                          variant="bordered"
                          className="w-32 sm:w-40"
                          classNames={{
                            input: "text-sm sm:text-xl font-bold text-center text-blue-700 placeholder:text-blue-300",
                            inputWrapper: "border-2 border-dashed border-blue-300 hover:border-blue-500 focus-within:border-blue-600 bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg h-10 sm:h-12"
                          }}
                          disabled={showResult}
                          onKeyDown={(e) => e.key === 'Enter' && !showResult && userAnswer.trim() && onSubmit()}
                        />
                      </div>
                    ) : (
                      <div className={`
                        inline-flex items-center justify-center min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg sm:text-xl text-center
                        transform transition-all duration-500 animate-result-reveal
                        ${isCorrect 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200' 
                          : 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg shadow-red-200'
                        }
                      `}>
                        {userAnswer || '...'}
                        <div className={`absolute inset-0 rounded-lg opacity-30 ${
                          isCorrect ? 'animate-pulse-green' : 'animate-pulse-red'
                        }`}></div>
                      </div>
                    )}
                  </div>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
