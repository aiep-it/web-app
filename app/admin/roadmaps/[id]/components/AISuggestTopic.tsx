import React, {
    useRef,
    forwardRef,
    useImperativeHandle,
    useState,
  } from 'react';
  import { Difficulty } from '@/services/types/exercise';
  import { Button, Textarea } from '@heroui/react';
  
  export interface AISuggestTopicFormData {
    content: string;
  }
  
  export interface AISuggestTopicRef {
    getData: () => AISuggestTopicFormData | null;
  }
  
  const AISuggestTopicForm = forwardRef<AISuggestTopicRef>((_, ref) => {

    const contentRef = useRef<HTMLTextAreaElement | null>(null);
  
    useImperativeHandle(ref, () => ({
      getData: () => {
        if (!contentRef.current) return null;
        const content = contentRef.current.value.trim();
        if (!content) return null;
  
        return {
          content,
        };
      },
    }));
  
    return (
      <div className="w-full space-y-4 flex flex-col justify-center items-center content-center">
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <Textarea
            ref={contentRef}
            placeholder="Enter your content for AI suggestion here..."
            minRows={3}
            maxRows={6}
            variant="bordered"
          />
        </div>
      </div>
    );
  });
  
  export default AISuggestTopicForm;
  