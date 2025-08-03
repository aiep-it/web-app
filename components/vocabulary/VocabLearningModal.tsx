'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Chip,
  Progress,
  Spinner,
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/rootReducer';
import {
  selectVocabsByTopic,
  updateVocabInStore,
  setVocabsForTopic,
} from '@/store/slices/vocabSlice';
import { TopicData } from '@/services/types/topic';
import { VocabData, VocabSearchPayload, VocabColumn } from '@/services/types/vocab';
import { getByTopicId, markDone, updateVocab, fetchVocabsByTopicId } from '@/services/vocab';
import { CustomButton } from '@/shared/components/button/CustomButton';
import { getAllVocabularyWords } from '@/utils/vocabulary/vocabularyUtils';

interface VocabLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicData;
}

export function VocabLearningModal({
  isOpen,
  onClose,
  topic,
}: VocabLearningModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loadingVocabs, setLoadingVocabs] = useState<Record<string, boolean>>(
    {},
  );
  const [isLoadingTopicVocabs, setIsLoadingTopicVocabs] = useState(false);

  // Get vocabularies for this topic from Redux
  const topicVocabs = useSelector((state: RootState) =>
    selectVocabsByTopic(state, topic.id)
  );

  // Load vocabularies when modal opens
  useEffect(() => {
    if (isOpen && topic.id) {
      const loadTopicVocabs = async () => {
        setIsLoadingTopicVocabs(true);
        try {
          const payload: VocabSearchPayload = {
            page: 1,
            size: 100, // Load all vocabs for the topic
            sort: [{ field: VocabColumn.created_at, order: 'desc' }]
          };

          const response = await fetchVocabsByTopicId(topic.id, payload);
          
          if (response && !Array.isArray(response) && 'content' in response) {
            // Response is VocabListResponse
            dispatch(setVocabsForTopic({
              topicId: topic.id,
              vocabs: response.content
            }));
          } else if (response && Array.isArray(response)) {
            // Response is direct array (fallback case)
            dispatch(setVocabsForTopic({
              topicId: topic.id,
              vocabs: response
            }));
          }
        } catch (error) {
          console.error('Error loading topic vocabularies:', error);
          addToast({
            title: 'Error Loading Vocabularies',
            description: 'Failed to load vocabularies for this topic',
            color: 'danger',
          });
        } finally {
          setIsLoadingTopicVocabs(false);
        }
      };

      loadTopicVocabs();
    }
  }, [isOpen, topic.id, dispatch]);

  // Calculate progress
  const progress = useMemo(() => {
    if (topicVocabs.length === 0) return { known: 0, total: 0, percentage: 0 };

    const knownCount = topicVocabs.filter((vocab) => vocab.is_learned).length;
    const total = topicVocabs.length;
    const percentage = Math.round((knownCount / total) * 100);

    return { known: knownCount, total, percentage };
  }, [topicVocabs]);

  // Handle marking vocab as known/unknown
  const handleToggleKnown = async (vocab: VocabData) => {
    const newKnownStatus = !vocab.is_learned;
    setLoadingVocabs((prev) => ({ ...prev, [vocab.id]: true }));

    try {
      // Call API to update vocab - include all required fields
      const payload = {
        word: vocab.word,
        meaning: vocab.meaning,
        nodeId: vocab.topicId, // API expects nodeId, not topicId
        example: vocab.example,
        imageUrl: vocab.imageUrl,
        audioUrl: vocab.audioUrl,
        is_learned: newKnownStatus,
      };

      console.log('Updating vocab with payload:', payload);
      const result = await markDone(vocab.id);
      console.log('Update vocab result:', result);

      if (result) {
        // Update Redux store
        dispatch(
          updateVocabInStore({
            id: vocab.id,
            updates: { is_learned: newKnownStatus },
          }),
        );

        // Show success toast
        addToast({
          title: newKnownStatus
            ? 'Word Marked as Known'
            : 'Word Marked as Unknown',
          description: newKnownStatus
            ? `"${vocab.word}" has been marked as known!`
            : `"${vocab.word}" has been marked as unknown`,
          color: 'success',
        });

        // Optionally refresh the vocab list to ensure consistency
        // This helps maintain data integrity after server updates
        setTimeout(async () => {
          try {
            const payload: VocabSearchPayload = {
              page: 1,
              size: 100,
              sort: [{ field: VocabColumn.created_at, order: 'desc' }]
            };

            const response = await fetchVocabsByTopicId(topic.id, payload);
            
            if (response && !Array.isArray(response) && 'content' in response) {
              dispatch(setVocabsForTopic({
                topicId: topic.id,
                vocabs: response.content
              }));
            } else if (response && Array.isArray(response)) {
              dispatch(setVocabsForTopic({
                topicId: topic.id,
                vocabs: response
              }));
            }
          } catch (error) {
            console.error('Error refreshing vocabularies:', error);
          }
        }, 500); // Small delay to ensure server has processed the update
      } else {
        // Show error toast when no result
        addToast({
          title: 'Update Failed',
          description: `Failed to update "${vocab.word}". Please try again.`,
          color: 'danger',
        });
        console.error('Failed to update vocab on server - no result returned');
      }
    } catch (error: any) {
      console.error('Error updating vocab:', error);

      // Determine error message based on error details
      let title = 'Update Error';
      let description = `Failed to update "${vocab.word}"`;

      if (error?.response?.status) {
        switch (error.response.status) {
          case 400:
            title = 'Invalid Request';
            description = `Invalid request for "${vocab.word}"`;
            break;
          case 401:
            title = 'Authentication Required';
            description = `Please log in to update "${vocab.word}"`;
            break;
          case 403:
            title = 'Permission Denied';
            description = `You don't have permission to update "${vocab.word}"`;
            break;
          case 404:
            title = 'Vocab Not Found';
            description = `Vocabulary "${vocab.word}" was not found`;
            break;
          case 500:
            title = 'Server Error';
            description = `Server error occurred while updating "${vocab.word}"`;
            break;
          default:
            title = 'Update Failed';
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
        color: 'danger',
      });
    } finally {
      setLoadingVocabs((prev) => ({ ...prev, [vocab.id]: false }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        backdrop:
          'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
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
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
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
          {isLoadingTopicVocabs ? (
            <div className="text-center py-8">
              <Spinner size="md" />
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : topicVocabs.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                icon="material-symbols:quiz-outline"
                className="text-4xl text-gray-300 mb-4 mx-auto"
              />
              <p className="text-gray-500">
                No vocabulary found for this topic
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topicVocabs.map((vocab) => (
                <Card
                  key={vocab.id}
                  className={`
                    transition-all duration-300 border-2
                    ${
                      vocab.is_learned
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
                              {vocab.is_learned && (
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
                                <CustomButton
                                  size="sm"
                                  preset="ghost"
                                  icon="material-symbols:volume-up"
                                  onClick={() => {
                                    const audio = new Audio(vocab.audioUrl);
                                    audio
                                      .play()
                                      .catch((e) =>
                                        console.error(
                                          'Error playing audio:',
                                          e,
                                        ),
                                      );
                                  }}
                                >
                                  Listen
                                </CustomButton>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <CustomButton
                          size="sm"
                          preset={vocab.is_learned ? 'ghost' : 'primary'}
                          loading={loadingVocabs[vocab.id]}
                          icon={
                            vocab.is_learned
                              ? 'material-symbols:refresh'
                              : 'material-symbols:check-circle'
                          }
                          onClick={() => handleToggleKnown(vocab)}
                        >
                          {vocab.is_learned
                            ? 'Mark as Unknown'
                            : 'Already Know This'}
                        </CustomButton>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <CustomButton preset="danger" onPress={onClose}>
            Close
          </CustomButton>
          {topicVocabs.length > 0 && (
            <CustomButton
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
              size="md"
              icon="material-symbols:play-arrow"
              onPress={() => {
                onClose();
                router.push(`/learn-vocabulary/${topic.id}`);
              }}
            >
              Start Learning
            </CustomButton>
          )}
          {/* Exercise Button - Always show for testing */}
          {topicVocabs.length > 0 && (
            <CustomButton
              preset="primary"
              icon="material-symbols:quiz"
              onPress={() => {
                onClose();
                router.push(`/learn-vocabulary/exercise/${topic.id}/quiz`);
              }}
            >
              Quiz
              {progress.percentage === 100 ? (
                <Chip size="sm" color="success" variant="flat" className="ml-2">
                  ✓
                </Chip>
              ) : (
                <Chip size="sm" color="warning" variant="flat" className="ml-2">
                  TEST
                </Chip>
              )}
            </CustomButton>
          )}
          {/* Type Answer Button */}
          {topicVocabs.length > 0 && (
            <CustomButton
              preset="primary"
              icon="material-symbols:edit"
              onPress={() => {
                onClose();
                router.push(`/learn-vocabulary/exercise/${topic.id}/type-answer`);
              }}
            >
              Type Answer
            </CustomButton>
          )}
          {progress.percentage === 100 && (
            <CustomButton preset="success" icon="material-symbols:celebration">
              Completed!
            </CustomButton>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
