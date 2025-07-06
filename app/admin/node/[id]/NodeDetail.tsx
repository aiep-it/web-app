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
import NodeEditPage from './edit/NodeEditPage';
import { NodeData } from '@/services/types/node';
import { getNodeById } from '@/services/node';
import { getItems } from '@/services/cms';
import { COLLECTIONS } from '@/config/cms';
import { NodeContentCMS } from './edit/types';
import NodeDetailInfo from './components/NodeDetailInfo';
import { Icon } from '@iconify/react';
import VocabularyListPage from '../../vocabularies/page';

interface NodeDetailProps {
  id: string;
}
const NodeDetail: React.FC<NodeDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = React.useState('roadmap');
  const [node, setNode] = useState<NodeData>();
  const [nodeContentCMS, setNodeContentCMS] = useState<NodeContentCMS | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const [node, contentRes] = await Promise.all([
        getNodeById(id),
        getItems<NodeContentCMS>(COLLECTIONS.NodeContent, {
          filter: { nodeId: { _eq: id } },
        }),
      ]);

      // Reset form only once
      if (node) {
        setNode(node);
      }
      // Set CMS content
      let content = '';
      if (contentRes && contentRes.length) {
        const cmsContent = contentRes[0];
        setNodeContentCMS(cmsContent);
        content = cmsContent.content || '';
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
          >
            <Icon icon="lucide:arrow-left" />
          </Button>
        </Tooltip>
        <h1>Node Detail</h1>
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
            <NodeDetailInfo nodeData={node} nodeContent={nodeContentCMS} />
          </Tab>
          <Tab key="document" title="Document" >
            {/* TODO */}
          </Tab>
          <Tab key="vocab" title="Vocab" >
            <VocabularyListPage />
          </Tab>
         
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default NodeDetail;
