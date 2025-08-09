export type ExerciseReportItem = {
  exerciseId: string;
  question?: string;
  attemptedAt: string;
  score?: number;
  content?: string;
};

export type TopicReport = {
  topicId: string;
  topicName: string;
  exerciseResults: {
    items: ExerciseReportItem[];
    avgScore: number;
  };
};

export type ExerciseReport = {
  topics: TopicReport[];
};

export type CourseOverviewReport = {
  totalExercises: number | null;
  totalExercisesCompleted: number | null;
  totalTopicEnrolled: number | null;
  totalTopics: number | null;
  totalVocabLearned: number | null;
  totalVocabs: number | null;
  totalExercisesCorrect?: number | null;
};

export type VocabReportItems = {
  vocabId: string;
  word: string;
  isLearned: boolean;
  meaning: string | null;
};
export type ReportData = {
  userId: string;
  generatedAt: string;
  overview: CourseOverviewReport;
  topics: {
    topicId: string;
    topicName: string;
    vocabProgress: {
      total: number;
      learned: number;
      items: VocabReportItems[];
    };
    exerciseResults: {
      totalExercises: number;
      avgScore: number;
      lastAttemptAt: string | null;
      items: ExerciseReportItem[];
    };
  }[];
};

export enum ReportPage {
  COURSER = 'course',
  WORK_SPACE = 'workspace',
}
