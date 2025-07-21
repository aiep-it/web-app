'use client';
import React, { useEffect, useRef } from 'react';
import '@xyflow/react/dist/style.css';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Edge, Node } from '@xyflow/react';
import ButtonConfirm from '@/components/ButtonConfirm';
import { Roadmap } from '@/services/types/roadmap';
import { getRoadmapById } from '@/services/roadmap';
import NodeFlow, { NodeFlowRef } from '../../components/NodeFlow';
import { createTopic } from '@/services/topic';
import { TopicPayload } from '@/services/types/topic';
import { createItemCMS } from '@/services/cms';
import { COLLECTIONS } from '@/config/cms';

interface NewTopicsPageProps {
  id: string;
}

const NewTopicsPage: React.FC<NewTopicsPageProps> = ({ id }) => {
  const nodeFlowRef = useRef<NodeFlowRef>(null);
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      const res = await getRoadmapById(id);

      setRoadmap(res);
    };

    fetchRoadmap();
  }, [id]);

  // <functions>
  const onPublisher = () => {
    const formRef = nodeFlowRef.current;

    const instance = formRef?.getRFInstance();

    // TODO validation nodes and edges
    console.log('instance', instance);
    if (instance) {
      const { nodes, edges, viewport = null } = instance.toObject();

      processToSave(nodes, edges)
        .then(async ({ nodes, edges }) => {
          if (nodes.length === 0 && edges.length === 0) {
            return;
          } else {
            const cmsPayload = {
              roadmapId: id,
              nodes,
              edges,
              viewport,
            };

            await createItemCMS(COLLECTIONS.NodeView, cmsPayload);

            addToast({
              title: 'Nodes and Edges Processed',
              color: 'success',
            });
          }
        })
        .catch((error) => {
          addToast({
            title: 'Error Processing Nodes and Edges',
            color: 'danger',
          });
        });
    }
  };

  const processToSave = async (
    nodes: Node[],
    edges: Edge[],
  ): Promise<{ nodes: Node[]; edges: Edge[] }> => {
    const idsMap = new Map<string, string>();

    for (const node of nodes) {
      const { data } = node;

      const payload: TopicPayload = {
        title: typeof data.label === 'string' ? data.label : 'Node',
        roadmapId: id,
      };

      const res = await createTopic(payload);

      if (res) {
        idsMap.set(node.id, res.id);
      }
    }

    const updatedNodes = nodes.map((node) => ({
      ...node,
      id: idsMap.get(node.id) || node.id,
    }));

    const updatedEdges = edges.map((edge) => ({
      ...edge,
      source: idsMap.get(edge.source) || edge.source,
      target: idsMap.get(edge.target) || edge.target,
    }));

    return { nodes: updatedNodes, edges: updatedEdges };
  };
  //</functions>

  return (
    <div className="flex justify-center items-center h-full mt-auto">
      <Card className="w-full h-full">
        <CardHeader className=" flex justify-between">
          <div className="p-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {roadmap?.name || 'Roadmap Name'}
                </h1>
                <Chip variant="flat" color="secondary">
                  {roadmap?.category?.name || 'Roadmap Name'}
                </Chip>
                <p className="text-foreground-500 mt-1">
                  {roadmap?.description || 'Roadmap Desctiption'}
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

export default NewTopicsPage;
