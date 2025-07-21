"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useVocabulary } from "@/components/vocabulary/VocabularyContext";
import { useExercise } from "@/hooks/vocabulary/useExercise";
import { useAudio } from "@/hooks/vocabulary/useAudio";
import { ExerciseHeader } from "@/components/vocabulary/ExerciseHeader";
import { ExerciseImage } from "@/components/vocabulary/ExerciseImage";
import { AudioControls } from "@/components/vocabulary/AudioControls";
import { InteractiveSentence } from "@/components/vocabulary/InteractiveSentence";
import { ExerciseResult } from "@/components/vocabulary/ExerciseResult";
import { ExerciseCompletion } from "@/components/vocabulary/ExerciseCompletion";

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { getTopic, isLoading } = useVocabulary();
  
  const topicId = params?.topicId as string;
  const topic = getTopic(topicId);

  // Custom hooks
  const {
    currentExercise,
    currentExerciseIndex,
    userAnswer,
    showResult,
    isCorrect,
    results,
    isComplete,
    progress,
    exercises,
    setUserAnswer,
    handleSubmitAnswer,
    handleNextExercise,
    handleRetry,
    resetExercise
  } = useExercise(topicId);

  const { isPlaying, playFullSentence, stopAudio } = useAudio();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading exercises...</h2>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Topic not found</h2>
          <Button
            onClick={() => router.push("/learn-vocabulary")}
            color="primary"
            startContent={<Icon icon="mdi:arrow-left" className="text-lg" />}
          >
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isComplete) {
    return (
      <ExerciseCompletion
        topicName={topic.name}
        totalExercises={exercises.length}
        results={results}
        onTryAgain={resetExercise}
        onBackToCategories={() => router.push("/learn-vocabulary")}
      />
    );
  }

  // Main Exercise Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-25 animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-indigo-200 rounded-full opacity-35 animate-float"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        {/* Header with Progress */}
        <ExerciseHeader
          currentIndex={currentExerciseIndex}
          totalExercises={exercises.length}
          topicName={topic.name}
          progress={progress}
          remainingExercises={exercises.length - currentExerciseIndex - 1}
        />

        {/* Exercise Card */}
        {currentExercise && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 p-8">
              {/* Image Section */}
              <ExerciseImage imageUrl={currentExercise.imageUrl || ''} />

              {/* Exercise Section */}
              <div className="xl:col-span-3 order-1 xl:order-2 space-y-6">
                <div className="text-center mb-8">
                  {/* Audio Controls */}
                  <AudioControls
                    isPlaying={isPlaying}
                    onPlay={() => playFullSentence(currentExercise)}
                    onStop={stopAudio}
                  />
                </div>
                
                {/* Interactive Sentence */}
                <InteractiveSentence
                  sentence={currentExercise.sentence}
                  userAnswer={userAnswer}
                  showResult={showResult}
                  isCorrect={isCorrect}
                  onAnswerChange={setUserAnswer}
                  onSubmit={handleSubmitAnswer}
                />

                {/* Submit Button or Result */}
                {!showResult ? (
                  <div className="text-center">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim()}
                      color="primary"
                      size="lg"
                      className="font-bold px-12 py-4 text-lg hover:scale-105 transform transition-all duration-200 shadow-xl hover:shadow-2xl"
                      startContent={<Icon icon="mdi:check-circle" className="text-2xl" />}
                    >
                      <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Check My Answer
                      </span>
                    </Button>
                    <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
                      <Icon icon="mdi:keyboard" className="text-blue-400" />
                      Or press Enter to submit
                    </p>
                  </div>
                ) : (
                  <ExerciseResult
                    isCorrect={isCorrect}
                    correctAnswer={currentExercise.correctAnswer}
                    currentIndex={currentExerciseIndex}
                    totalExercises={exercises.length}
                    onRetry={handleRetry}
                    onNext={handleNextExercise}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/30">
            <Icon icon="mdi:lightbulb-on" className="text-amber-500 text-lg" />
            <p className="text-sm font-medium text-gray-600">
              Look at the image, listen to the audio, and complete the sentence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
