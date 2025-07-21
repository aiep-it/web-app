'use client';
import React, { useEffect } from 'react';
import '@xyflow/react/dist/style.css';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
} from '@heroui/react';
import { Node } from '@xyflow/react';
import { getRoadmapById } from '@/services/roadmap';
import NodeFlowViewOnlyWrapper from './components/ViewOnly';
import { Roadmap } from '@/services/types/roadmap';
import { getItems } from '@/services/cms';
import { COLLECTIONS } from '@/config/cms';
import { NodeViewCMS } from '@/services/types/topic';
import NodeFlow from './components/NodeFlow';
import { useRouter } from 'next/navigation';

interface RoadMapDetailPageProps {
  id: string;
}

const RoadMapDetailPage: React.FC<RoadMapDetailPageProps> = ({ id }) => {
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>();
  const [nodeViewContent, setNodeViewContent] =
    React.useState<NodeViewCMS | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editNode, setEditNode] = React.useState<boolean>(false);

  const router = useRouter();

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
            <Button
              color="primary"
              variant="bordered"
              onPress={() => setEditNode(!editNode)}
            >
              {editNode ? 'Save Node' : 'Edit Node'}
            </Button>
            <Button className="mx-3" color="secondary" variant="bordered" onPress={() => {
              router.push(`/admin/roadmaps/${id}/topics`); // Navigate to Nodes List Page
            }}>
              List Node Detail
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {!loading ? (
            nodeViewContent ? (
              editNode ? (
                // TODO : Implement edit mode for NodeFlow
                <NodeFlow
                  nodeData={nodeViewContent?.nodes || []}
                  edgeData={nodeViewContent?.edges || []}
                  viewPort={nodeViewContent?.viewport}
                />
              ) : (
                <NodeFlowViewOnlyWrapper
                  nodeData={nodeViewContent?.nodes || []}
                  edgeData={nodeViewContent?.edges || []}
                  viewPort={nodeViewContent?.viewport}
                />
              )
            ) : (
              <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-default-200 bg-default-50 flex-col">
                <p className="text-default-500">Không Có Chủ Đề</p>
                <Button className='mt-3' variant='ghost' color='primary' onPress={() => {router.push(`/admin/roadmaps/${roadmap?.id}/topics/new`)}}>
                  Chuyển Đến Trang Tạo Chủ Đề Mới
                </Button>
              </div>
            )
          ) : (
            <Spinner
              label="Loading roadmap..."
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default RoadMapDetailPage;
