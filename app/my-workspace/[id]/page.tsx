'use client';

import QuizExercisePage from '@/app/admin/exercises/[id]/quiz/page';
import TopicDataInfo from '@/app/admin/topic/[id]/components/TopicDetailInfo';
import { TopicContentCMS } from '@/app/admin/topic/[id]/edit/types';
import VocabularyListPage from '@/app/admin/vocabularies/page';
import { COLLECTIONS } from '@/config/cms';
import { getItems } from '@/services/cms';
import { getTopicId } from '@/services/topic';
import { TopicData } from '@/services/types/topic';
import { Tab, Tabs, Button } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import PersonalLearningPage from './AI/PersonalLearningPage';
import TypeAnswerExercisePage from '@/app/admin/exercises/[id]/type-answer/page';

export default function MyWorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [topicContentCMS, setTopicContentCMS] =
    useState<TopicContentCMS | null>(null);

  const [topic, setTopic] = useState<TopicData>();
  const [activeTab, setActiveTab] = useState('roadmap');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const [topic, contentRes] = await Promise.all([
        getTopicId(id),
        getItems<TopicContentCMS>(COLLECTIONS.NodeContent, {
          filter: { nodeId: { _eq: id } },
        }),
      ]);

      // Reset form only once
      if (topic) {
        setTopic(topic);
      }
      // Set CMS content
      let content = '';
      if (contentRes && contentRes.length) {
        const cmsContent = contentRes[0];
        setTopicContentCMS(cmsContent);
        content = cmsContent.content || '';
      }
    };

    loadData();
  }, [id]);

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            startContent={<Icon icon="lucide:arrow-left" width={20} />}
            variant="light"
            onPress={() => router.push('/my-workspace')}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to My Workspace
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">My Workspace</h1>
        <p className="text-gray-600 mb-6">
          Manage your vocabulary and learning resources here.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 pb-8">
        <div className="space-y-6">
          {/* <div className="mb-6 mt-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {topic?.title}
            </h2>
            <p className="text-gray-600">{topic?.description}</p>
          </div> */}

          <div className="space-y-8">
            {/* managed Grid */}
            <Tabs
              key={'secondary'}
              aria-label="Tabs colors"
              color={'primary'}
              onSelectionChange={(key) => setActiveTab(key as string)}
              radius="full"
            >
              <Tab key="info" title="Node Information">
                <TopicDataInfo
                  isWorkspace={true}
                  topicData={topic}
                  topicContent={topicContentCMS}
                />
              </Tab>
              <Tab key="vocab" title="Vocab">
                <VocabularyListPage topic={topic} />
              </Tab>
              <Tab key={"excercise"} title="Excercise">
                <QuizExercisePage />
              </Tab>
              <Tab key={"type"} title="Type Excercise">
                <TypeAnswerExercisePage />
              </Tab>
              <Tab key={"AI"} title="AI">
                <PersonalLearningPage topic={topic}/>
              </Tab>
            </Tabs>
          </div>

          {/* Empty State */}
          {!topic && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses available yet
              </h3>
              <p className="text-gray-500">
                Check back later for new vocabulary courses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
