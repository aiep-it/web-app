import { Category, Topic, VocabularyWord } from "@/types/vocabulary";

//Find a category that contains a specific topic
export const getCategoryByTopicId = (categories: Category[], topicId: string): Category | undefined => {
  return categories.find(category => 
    category.topics.some(topic => topic.id === topicId)
  );
};

//Filter vocabulary words by search term
export const filterVocabularyWords = (words: VocabularyWord[], searchTerm: string): VocabularyWord[] => {
  if (!searchTerm.trim()) return words;
  
  const term = searchTerm.toLowerCase();
  return words.filter(word => 
    word.word.toLowerCase().includes(term) ||
    word.meaning.toLowerCase().includes(term) ||
    (word.example && word.example.toLowerCase().includes(term))
  );
};

//Calculate overall progress across all categories
export const calculateOverallProgress = (
  categories: Category[], 
  knownWordIds: string[]
): {
  totalWords: number;
  knownWords: number;
  percentage: number;
} => {
  const totalWords = categories.reduce(
    (sum, category) => sum + category.topics.reduce(
      (topicSum, topic) => topicSum + topic.vocabulary.length, 0
    ), 0
  );
  
  const knownWords = knownWordIds.length;
  const percentage = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0;
  
  return {
    totalWords,
    knownWords,
    percentage
  };
};

//Get all vocabulary words from all categories
export const getAllVocabularyWords = (categories: Category[]): VocabularyWord[] => {
  return categories.flatMap(category => 
    category.topics.flatMap(topic => topic.vocabulary)
  );
};

//Check if a topic should be unlocked based on previous topic completion
export const shouldTopicBeUnlocked = (
  categories: Category[],
  topicId: string,
  knownWordIds: string[]
): boolean => {
  const category = getCategoryByTopicId(categories, topicId);
  if (!category) return false;

  const topic = category.topics.find(t => t.id === topicId);
  if (!topic) return false;

  // First topic in category is always unlocked
  if (topic.order === 1) return true;

  // Check if previous topic is completed
  const previousTopic = category.topics.find(t => t.order === topic.order - 1);
  if (!previousTopic) return true;

  const previousTopicProgress = calculateTopicProgress(previousTopic, knownWordIds);
  return previousTopicProgress === 100;
};

//Calculate progress for a specific topic
export const calculateTopicProgress = (
  topic: Topic,
  knownWordIds: string[]
): number => {
  if (topic.vocabulary.length === 0) return 0;
  
  const knownWordsCount = topic.vocabulary.filter(word => 
    knownWordIds.includes(word.id)
  ).length;
  
  return Math.round((knownWordsCount / topic.vocabulary.length) * 100);
};

//Get next available topic for learning
export const getNextAvailableTopic = (
  categories: Category[],
  knownWordIds: string[]
): Topic | null => {
  for (const category of categories.sort((a, b) => a.order - b.order)) {
    if (category.isLocked) continue;
    
    for (const topic of category.topics.sort((a, b) => a.order - b.order)) {
      if (topic.isLocked) continue;
      
      const progress = calculateTopicProgress(topic, knownWordIds);
      if (progress < 100) {
        return topic;
      }
    }
  }
  
  return null;
};

//Get learning streak information
export const getLearningStreak = (): {
  currentStreak: number;
  longestStreak: number;
  lastLearningDate: Date | null;
} => {
  // This would be implemented with actual date tracking
  // For now, return mock data
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastLearningDate: null
  };
};
