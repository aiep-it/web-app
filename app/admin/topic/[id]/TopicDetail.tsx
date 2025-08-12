'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs,
  Tooltip,
} from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 🆕 Import useRouter
import NodeEditPage from './edit/TopicEditPage';
import { TopicData } from '@/services/types/topic';
import { getTopicId } from '@/services/topic';
import { getItems } from '@/services/cms';
import { COLLECTIONS } from '@/config/cms';
import { TopicContentCMS } from './edit/types';
import NodeDetailInfo from './components/TopicDetailInfo';
import { Icon } from '@iconify/react';
import VocabularyListPage from '../../vocabularies/page';

interface TopicDetailProps {
  id: string;
}
const TopicDetail: React.FC<TopicDetailProps> = ({ id }) => {
  const router = useRouter(); // 🆕 Khởi tạo router
  const [activeTab, setActiveTab] = React.useState('roadmap');
  const [topic, setTopic] = useState<TopicData>();
  const [topicContentCMS, setTopicContentCMS] = useState<TopicContentCMS | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const [topic, contentRes] = await Promise.all([
        getTopicId(id),
        getItems<TopicContentCMS>(COLLECTIONS.NodeContent, {
          filter: { nodeId: { _eq: id } },
        }),
      ]);

      if (topic) {
        setTopic(topic);
      }
      if (contentRes && contentRes.length) {
        const cmsContent = contentRes[0];
        setTopicContentCMS(cmsContent);
      }
    };

    loadData();
  }, [id]);

  return (
    <Card>
      <CardHeader>
        <Tooltip title="Back To List Nodes">
          <Button
            isIconOnly
            aria-label="Back"
            color="primary"
            radius="full"
            variant="ghost"
            className="my-3 mr-5"
            onPress={() => router.back()} // 🆕 Gọi hàm back
          >
            <Icon icon="lucide:arrow-left" />
          </Button>
        </Tooltip>
        <h1>Topic Detail</h1>
      </CardHeader>
      <CardBody>
        <Tabs
          key={'secondary'}
          aria-label="Tabs colors"
          color={'secondary'}
          onSelectionChange={(key) => setActiveTab(key as string)}
          radius="full"
        >
          <Tab key="info" title="Node Information">
            <NodeDetailInfo topicData={topic} topicContent={topicContentCMS} />
          </Tab>
          <Tab key="vocab" title="Vocab">
            <VocabularyListPage topic={topic} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default TopicDetail;
