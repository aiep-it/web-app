'use client';
import React, { useEffect, useRef, useState } from 'react';
import '@xyflow/react/dist/style.css';
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Edge, Node, Viewport } from '@xyflow/react';
import ButtonConfirm from '@/components/ButtonConfirm';
import { Roadmap } from '@/services/types/roadmap';
import { getRoadmapById } from '@/services/roadmap';
import { aiSuggestTopic, createTopic } from '@/services/topic';
import { NodeViewCMS, TopicPayload } from '@/services/types/topic';
import { createItemCMS, getItems } from '@/services/cms';
import { COLLECTIONS } from '@/config/cms';
import NodeFlow, { NodeFlowRef } from './NodeFlow';
import AISuggestTopicForm, { AISuggestTopicRef } from './AISuggestTopic';
import { useRouter } from 'next/navigation';

interface TopicEditorProps {
  id: string;
}

const TopicEditor: React.FC<TopicEditorProps> = ({ id }) => {
  const nodeFlowRef = useRef<NodeFlowRef>(null);
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [nodeViewContent, setNodeViewContent] =
    React.useState<NodeViewCMS | null>(null);
  const formRef = useRef<AISuggestTopicRef>(null);
  const router = useRouter();
  const [aiSuggestLoading, setAISuggestLoading] = useState(false);

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

      console.log('dataNodeView', dataNodeView);
      setNodeViewContent(dataNodeView);
    }
  };

  const handleAction = async () => {
    setAISuggestLoading(true);
    const data = formRef.current?.getData();
    if (!data) {
      alert('Please fill in the content');
      return;
    }

    const payload = {
      content: data.content,
    };
    const rest = await aiSuggestTopic(payload);

    if (rest) {
      setNodeViewContent(rest);
    } else {
      // toast.error('Failed to suggest quiz. Please try again.');
    }

    setAISuggestLoading(false);
    // Do something with `data`
    // e.g., call API, close modal, etc.
    onClose();
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      const res = await getRoadmapById(id);
      if (res && res.id) {
        setRoadmap(res);
        await fetchNodes(res.id);
      }
      setRoadmap(res);
    };

    fetchRoadmap();
  }, [id]);

  // <functions>
  const onPublisher = () => {
    const formRef = nodeFlowRef.current;

    const instance = formRef?.getRFInstance();

    // TODO validation nodes and edges
    if (instance) {
      const { nodes, edges, viewport = null } = instance.toObject();

      processToSave(nodes, edges)
        .then(async ({ nodes, edges }) => {
          if (nodes.length === 0 && edges.length === 0) {
            return;
          } else {
            const cmsPayload: { roadmapId: string; nodes: Node[]; edges: Edge[]; viewport: Viewport | null; id?: string } = {
              roadmapId: id,
              nodes,
              edges,
              viewport,
            };

            if(nodeViewContent?.id) {
                cmsPayload.id = nodeViewContent.id;
            }

            await createItemCMS(COLLECTIONS.NodeView, cmsPayload);

            addToast({
              title: 'Nodes and Edges Processed',
              color: 'success',
            });

            router.push(`/admin/roadmaps/${id}/topics`);
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

      if(nodeViewContent?.id) {
        payload.id = node.id;
      }

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
            <Tooltip
              content="AI Sugger"
              className="capitalize"
              color="secondary"
            >
              <Button
                color="secondary"
                className="ml-2"
                startContent={<Icon icon={'lucide:bot'} />}
                onPress={onOpen}
              >
                AI Suggest
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody>
          {nodeViewContent ? (
            <NodeFlow
              key={JSON.stringify(nodeViewContent)}
              ref={nodeFlowRef}
              nodeData={nodeViewContent?.nodes || []}
              edgeData={nodeViewContent?.edges || []}
              viewPort={nodeViewContent?.viewport}
            />
          ) : (
            <NodeFlow ref={nodeFlowRef} />
          )}
          {/* <NodeFlow ref={nodeFlowRef} /> */}
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                {aiSuggestLoading ? (
                  <Spinner className="mx-auto" />
                ) : (
                  <AISuggestTopicForm ref={formRef} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAction}>
                  Send
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TopicEditor;
