'use client';

import React, { useState, useMemo } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Card,
  CardBody,
  Chip,
  Progress
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/rootReducer';
import { selectVocabsByTopic, updateVocabInStore } from '@/store/slices/vocabSlice';
import { TopicData } from '@/services/types/topic';
import { VocabData } from '@/services/types/vocab';
import { updateVocab } from '@/services/vocab';

interface VocabLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicData;
}

export function VocabLearningModal({ isOpen, onClose, topic }: VocabLearningModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loadingVocabs, setLoadingVocabs] = useState<Record<string, boolean>>({});
  
  // Get vocabularies for this topic from Redux
  const topicVocabs = useSelector((state: RootState) => 
    selectVocabsByTopic(state, topic.id)
  );

  // Calculate progress
  const progress = useMemo(() => {
    if (topicVocabs.length === 0) return { known: 0, total: 0, percentage: 0 };
    
    const knownCount = topicVocabs.filter(vocab => vocab.is_know).length;
    const total = topicVocabs.length;
    const percentage = Math.round((knownCount / total) * 100);
    
    return { known: knownCount, total, percentage };
  }, [topicVocabs]);

  // Handle marking vocab as known/unknown
  const handleToggleKnown = async (vocab: VocabData) => {
    const newKnownStatus = !vocab.is_know;
    setLoadingVocabs(prev => ({ ...prev, [vocab.id]: true }));

    try {
      // Call API to update vocab - include all required fields
      const payload = {
        word: vocab.word,
        meaning: vocab.meaning,
        nodeId: vocab.topicId, // API expects nodeId, not topicId
        example: vocab.example,
        imageUrl: vocab.imageUrl,
        audioUrl: vocab.audioUrl,
        is_know: newKnownStatus
      };
      
      console.log('Updating vocab with payload:', payload);
      const result = await updateVocab(vocab.id, payload);
      console.log('Update vocab result:', result);

      if (result) {
        // Update Redux store
        dispatch(updateVocabInStore({
          id: vocab.id,
          updates: { is_know: newKnownStatus }
        }));
        
        // Show success toast
        addToast({
          title: newKnownStatus ? "Word Marked as Known" : "Word Marked as Unknown",
          description: newKnownStatus 
            ? `"${vocab.word}" has been marked as known!`
            : `"${vocab.word}" has been marked as unknown`,
          color: "success",
        });
      } else {
        // Show error toast when no result
        addToast({
          title: "Update Failed",
          description: `Failed to update "${vocab.word}". Please try again.`,
          color: "danger",
        });
        console.error('Failed to update vocab on server - no result returned');
      }
    } catch (error: any) {
      console.error('Error updating vocab:', error);
      
      // Determine error message based on error details
      let title = "Update Error";
      let description = `Failed to update "${vocab.word}"`;
      
      if (error?.response?.status) {
        switch (error.response.status) {
          case 400:
            title = "Invalid Request";
            description = `Invalid request for "${vocab.word}"`;
            break;
          case 401:
            title = "Authentication Required";
            description = `Please log in to update "${vocab.word}"`;
            break;
          case 403:
            title = "Permission Denied";
            description = `You don't have permission to update "${vocab.word}"`;
            break;
          case 404:
            title = "Vocab Not Found";
            description = `Vocabulary "${vocab.word}" was not found`;
            break;
          case 500:
            title = "Server Error";
            description = `Server error occurred while updating "${vocab.word}"`;
            break;
          default:
            title = "Update Failed";
            description = `Failed to update "${vocab.word}" (Error ${error.response.status})`;
        }
      } else if (error?.message) {
        description = error.message;
      } else if (error?.response?.data?.message) {
        description = error.response.data.message;
      }
      
      // Show error toast
      addToast({
        title,
        description,
        color: "danger",
      });
    } finally {
      setLoadingVocabs(prev => ({ ...prev, [vocab.id]: false }));
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Icon 
              icon="material-symbols:quiz" 
              className="text-2xl text-blue-500"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{topic.title}</h2>
              <p className="text-sm text-gray-600">
                Learn vocabulary • {topicVocabs.length} words
              </p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-blue-600">
                {progress.known}/{progress.total} ({progress.percentage}%)
              </span>
            </div>
            <Progress 
              value={progress.percentage} 
              className="max-w-full"
              color="primary"
              size="sm"
            />
          </div>
        </ModalHeader>

        <ModalBody>
          {topicVocabs.length === 0 ? (
            <div className="text-center py-8">
              <Icon 
                icon="material-symbols:quiz-outline" 
                className="text-4xl text-gray-300 mb-4 mx-auto"
              />
              <p className="text-gray-500">No vocabulary found for this topic</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topicVocabs.map((vocab) => (
                <Card 
                  key={vocab.id}
                  className={`
                    transition-all duration-300 border-2
                    ${vocab.is_know 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-blue-200'
                    }
                  `}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Vocab Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Image */}
                          {vocab.imageUrl && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img 
                                src={vocab.imageUrl} 
                                alt={vocab.word}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                {vocab.word}
                              </h3>
                              {vocab.is_know && (
                                <Chip 
                                  size="sm" 
                                  color="success" 
                                  variant="flat"
                                  startContent={
                                    <Icon icon="material-symbols:check-circle" />
                                  }
                                >
                                  Known
                                </Chip>
                              )}
                            </div>
                            
                            <p className="text-gray-600 font-medium mb-2">
                              {vocab.meaning}
                            </p>
                            
                            {vocab.example && (
                              <p className="text-sm text-gray-500 italic">
                                "{vocab.example}"
                              </p>
                            )}
                            
                            {/* Audio */}
                            {vocab.audioUrl && (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="light"
                                  startContent={
                                    <Icon icon="material-symbols:volume-up" />
                                  }
                                  onClick={() => {
                                    const audio = new Audio(vocab.audioUrl);
                                    audio.play().catch(e => 
                                      console.error('Error playing audio:', e)
                                    );
                                  }}
                                >
                                  Listen
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Button
                          size="sm"
                          color={vocab.is_know ? "default" : "primary"}
                          variant={vocab.is_know ? "light" : "solid"}
                          isLoading={loadingVocabs[vocab.id]}
                          disabled={loadingVocabs[vocab.id]}
                          startContent={
                            !loadingVocabs[vocab.id] && (
                              <Icon 
                                icon={vocab.is_know 
                                  ? "material-symbols:refresh" 
                                  : "material-symbols:check-circle"
                                } 
                              />
                            )
                          }
                          onClick={() => handleToggleKnown(vocab)}
                        >
                          {vocab.is_know ? "Mark as Unknown" : "Already Know This"}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          {topicVocabs.length > 0 && (
            <Button 
              color="primary" 
              variant="solid"
              onPress={() => {
                onClose();
                router.push(`/learn-vocabulary/${topic.id}`);
              }}
              startContent={<Icon icon="material-symbols:play-arrow" />}
            >
              Start Learning
            </Button>
          )}
          {progress.percentage === 100 && (
            <Button color="success" variant="solid">
              <Icon icon="material-symbols:celebration" className="mr-1" />
              Completed!
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
