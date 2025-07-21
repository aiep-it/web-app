
export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  pronunciation?: string;
  isKnown: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  vocabulary: VocabularyWord[];
  isCompleted?: boolean;
  progress?: number; // percentage 0-100
  isLocked?: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  topics: Topic[];
  color?: string; 
  icon?: string; 
  isLocked?: boolean;
  order: number;
}

export interface VocabularyLearningState {
  currentWordIndex: number;
  knownWords: string[];
  completedWords: string[];
}

export interface LearningProgress {
  totalWords: number;
  knownWords: number;
  percentage: number;
}

export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  totalTopics: number;
  completedTopics: number;
  totalWords: number;
  knownWords: number;
  overallProgress: number;
}

export interface Exercise {
  id: string;
  sentence: string; 
  correctAnswer: string; 
  imageUrl?: string; 
  relatedWords: string[]; 
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExerciseResult {
  exerciseId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}
