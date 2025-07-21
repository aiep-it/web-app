import { VocabularyWord, Exercise } from "@/types/vocabulary";

export const generateExercises = (vocabulary: VocabularyWord[], topicId: string): Exercise[] => {
  return vocabulary.slice(0, 5).map((word, index) => ({
    id: `${topicId}-exercise-${index}`,
    sentence: generateSentenceWithBlank(word),
    correctAnswer: word.word.toLowerCase(),
    imageUrl: getImageForWord(word.word),
    relatedWords: [word.word],
    difficulty: word.difficulty || 'medium'
  }));
};

export const generateSentenceWithBlank = (word: VocabularyWord): string => {
  // Create sentences with blanks based on the word's example or generate new ones
  const sentences: { [key: string]: string } = {
    // Professional words
    'doctor': 'The _____ examined the patient carefully.',
    'teacher': 'Our _____ explained the lesson very well.',
    'engineer': 'The _____ designed a new bridge for the city.',
    'nurse': 'The _____ took care of all the patients.',
    'lawyer': 'The _____ defended his client in court.',
    'manager': 'The _____ organized the team meeting.',
    'accountant': 'The _____ calculated the company\'s profits.',
    'chef': 'The _____ prepared a delicious meal.',
    'architect': 'The _____ designed a modern building.',
    
    // Family words
    'mother': 'My _____ cooks delicious meals every day.',
    'father': 'My _____ goes to work every morning.',
    'sister': 'My _____ is studying at university.',
    'brother': 'My _____ plays football every weekend.',
    'grandmother': 'My _____ tells wonderful stories.',
    'grandfather': 'My _____ worked as a farmer.',
    'aunt': 'My _____ lives in another city.',
    'uncle': 'My _____ is a doctor.',
    
    // Household items
    'kitchen': 'We cook all our meals in the _____.',
    'bedroom': 'I sleep in my _____ every night.',
    'bathroom': 'The _____ is upstairs.',
    'refrigerator': 'Keep the milk in the _____ to stay fresh.',
    'television': 'We watch the news on the _____ every evening.',
    
    // School subjects
    'mathematics': '_____ is my favorite subject at school.',
    'science': 'We conducted an experiment in _____ class.',
    'history': '_____ teaches us about the past events.',
    'geography': 'We studied world _____ in today\'s lesson.',
    'literature': 'English _____ is fascinating.',
    'physics': '_____ explains how the world works.',
    'chemistry': 'We did experiments in _____ lab.',
    
    // Classroom items
    'blackboard': 'The teacher wrote on the _____.',
    'desk': 'Each student has their own _____.',
    'notebook': 'I write notes in my _____.',
    'pencil': 'Please use a _____ for the test.',
    'eraser': 'I need an _____ to fix my mistake.',
    'calculator': 'Use a _____ for math problems.',
    
    // Transportation
    'airplane': 'The _____ takes off at 6 PM tonight.',
    'train': 'I take the _____ to work every day.',
    'bus': 'The _____ arrives at 8 AM.',
    'taxi': 'Let\'s take a _____ to the airport.',
    'bicycle': 'I ride my _____ to school every morning.',
    'motorcycle': 'He drives a _____ to work.',
    
    // Airport vocabulary
    'passport': 'Don\'t forget to bring your _____.',
    'boarding-pass': 'Please show your _____.',
    'luggage': 'Where can I pick up my _____?',
    'departure': 'The _____ time is 3:30 PM.',
    'arrival': 'The _____ gate is B12.',
    
    // Office work
    'meeting': 'We have a _____ at 3 PM.',
    'presentation': 'She gave an excellent _____.',
    'deadline': 'The project _____ is next Friday.',
    'computer': 'I use my _____ for work every day.',
    'email': 'Please send me an _____ with the details.',
    'schedule': 'Let me check my _____ for tomorrow.',
    'colleague': 'My _____ helped me with the project.'
  };

  const wordKey = word.word.toLowerCase().replace(/\s+/g, '-');
  
  return sentences[wordKey] || 
         word.example?.replace(new RegExp(word.word, 'gi'), '_____') || 
         `The _____ is very important in daily life.`;
};

export const getImageForWord = (word: string): string => {
  // You can replace these with actual image URLs or use a service like Unsplash
  const imageMap: { [key: string]: string } = {
    // Professions
    'doctor': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
    'teacher': 'https://images.unsplash.com/photo-1580649415980-d3ad9bc2c59d?w=400&h=300&fit=crop',
    'engineer': 'https://images.unsplash.com/photo-1581092795442-8d4605c1f2de?w=400&h=300&fit=crop',
    'nurse': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    'lawyer': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
    'chef': 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=300&fit=crop',
    'architect': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    
    // Family
    'mother': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop',
    'father': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
    'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
    
    // Household
    'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'bedroom': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    'bathroom': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
    'refrigerator': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop',
    'television': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    
    // School
    'school': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
    'mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    'science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
    'blackboard': 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=400&h=300&fit=crop',
    
    // Transportation
    'airplane': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    'train': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    'bus': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop',
    'bicycle': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    
    // Airport
    'airport': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    'passport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    
    // Office
    'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    'computer': 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=400&h=300&fit=crop',
    'meeting': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
  };

  const wordKey = word.toLowerCase().replace(/\s+/g, '-');
  return imageMap[wordKey] || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop';
};
