'use client';
import React, { useEffect, useRef } from 'react';
import '@xyflow/react/dist/style.css';
import { Button, Card, CardBody, CardHeader, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Node } from '@xyflow/react';
import ButtonConfirm from '@/components/ButtonConfirm';
import NodeFlow, { NodeFlowRef } from '../components/NodeFlow';
import { NodeViewCMS } from '@/services/types/topic';
import { getItems } from '@/services/cms';
import { COLLECTIONS } from '@/config/cms';
import { getRoadmapById } from '@/services/roadmap';
import { useParams } from 'next/navigation';
import { Roadmap } from '@/services/types/roadmap';

interface AdminNodePageProps {
  id: string;
}

const AdminNodePage: React.FC<AdminNodePageProps> = ({ id }) => {
  const nodeFlowRef = useRef<NodeFlowRef>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [nodeViewContent, setNodeViewContent] =
    React.useState<NodeViewCMS | null>(null);
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>();

  const onPublisher = () => {
    const formRef = nodeFlowRef.current;

    const instance = formRef?.getRFInstance();

    instance?.toObject();
  };
  
  const fetchNodes = async (roadmapId: string) => {
    const res = await getItems<NodeViewCMS>(COLLECTIONS.NodeView, {
      filter: {
        roadmapId: {
          _eq: roadmapId,
        },
      },
    });
    if (res && res.length) {
      const dataNodeView = res[0] as NodeViewCMS;

      setNodeViewContent(dataNodeView);
    }
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      const res = await getRoadmapById(id);

      if (res && res.id) {
        setRoadmap(res);
        await fetchNodes(res.id);
      }
      setLoading(false);
    };

    fetchRoadmap();
  }, [id]);

  return (
    <div className="flex justify-center items-center h-full mt-auto">
      <Card className="w-full h-full">
        <CardHeader className=" flex justify-between">
          <div className="p-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Learning Roadmaps
                </h1>
                <p className="text-foreground-500 mt-1">
                  Track your progress across multiple learning paths
                </p>
              </div>
            </div>
          </div>
          <div>
            <Tooltip content="Public" className="capitalize" color="primary">
              <ButtonConfirm
                endContent={<Icon icon="lucide:send-horizontal" />}
                color="primary"
                onSave={onPublisher}
                saveButtonText="Publisher"
                disabled={false}
              />
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody>
          <NodeFlow ref={nodeFlowRef} />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminNodePage;
