import { TopicData } from '@/services/types/topic';
import { aiGenerate, genByImage } from '@/services/vocab';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import React, { useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import {
  PersonalLearning,
  PersonalLearningCreatePayload,
} from '@/services/types/workspace';
import toast from 'react-hot-toast';
import { PersonalLearningPreview } from './components/PersonalLearningPreview';
import { uploadFile } from '@/services/cms';
import {
  createPersonalLearning,
  getPersonalLearningByTopicId,
} from '@/services/personalLearning';
import ListPresonalLearningPreview from './components/ListPresonalLearningPreview';
import AIGeneratePage from './components/AIGenerate';
interface PersonalLearningPageProps {
  topic?: TopicData;
}

const PersonalLearningPage: React.FC<PersonalLearningPageProps> = ({
  topic,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [personalLearnings, setPersonalLearnings] = React.useState<
    PersonalLearning[]
  >([]);

  const [listing, setListing] = React.useState(true);

  const fetchPersonalLearnings = async () => {
    if (!topic?.id) return;
    const res = await getPersonalLearningByTopicId(topic.id);
    if (res && res.data) {
      setPersonalLearnings(res.data);
    } else {
      toast.error('Failed to fetch personal learnings. Please try again.');
    }
  };
  useEffect(() => {
    if (personalLearnings.length === 0 && topic?.id) {
      fetchPersonalLearnings();
    }
  }, []);

  const handleGenImageSuccess = async () => {
    setListing(true);
    await fetchPersonalLearnings();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Personal Learning
                </h1>
              </div>
            </div>

            {listing ? (
              <Button
                color="primary"
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => setListing(false)}
              >
                Generate
              </Button>
            ) : (
              <Button
                color="primary"
                startContent={<Icon icon="lucide:list" />}
                onPress={() => setListing(true)}
              >
                View
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-full">
          {/* Main Content Area */}
          {listing ? (
            <div className="space-y-5">
              {personalLearnings.length > 0 ? (
                personalLearnings.map((learning) => (
                  <ListPresonalLearningPreview
                    key={learning.id}
                    personalLearning={learning}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No personal learnings found. Please upload an image to
                  generate.
                </div>
              )}
            </div>
          ) : (
            <AIGeneratePage topic={topic} onSuccess={handleGenImageSuccess}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalLearningPage;
