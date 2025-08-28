export interface AI_suggestQuizPayload {  
    topicId: string;
    // content: string;
    type?: 'image' | 'audio';
    includeFile?: boolean; 
}
