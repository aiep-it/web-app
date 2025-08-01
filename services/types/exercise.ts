export enum VocabColumn {
  text = 'text',
  image = 'image',
  audio = 'audio',
}

export enum Difficulty {
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}

export interface ExercisePayload {
  type: VocabColumn;
  content: string;
  options?: string[]; // For multiple choice exercises
  correctAnswer: string;
  hint?: string; // Optional hint for the exercise
  difficulty: Difficulty;
  topicId: string; // ID of the topic this exercise belongs to
  userId: string; // ID of the user who created this exercise
}

export interface ExerciseData {
  id: string;
  type: VocabColumn;
  content: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
  difficulty: Difficulty;
  topicId: string; 
  userId: string; 
  createdAt: string;
  updatedAt?: string | null; 
}

