export interface DoTypeAnswerExercise {
  id: string;
  content: string;
  correctAnswer: string;
  type: 'image' | 'audio';
  topicId: string;
  // Directus fields
  imageUrl?: string;
  audioUrl?: string;
}

export interface DoTypeAnswerState {
  currentIndex: number;
  userAnswer: string;
  isCorrect: boolean | null;
  showResult: boolean;
  isCompleted: boolean;
  score: number;
}
