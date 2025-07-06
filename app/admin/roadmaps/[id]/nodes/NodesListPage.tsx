'use client';
import { NodeData } from '@/services/types/node';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Switch,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import NodeViewCard from './components/NodeViewCard';
import { getNodesByRoadmapId } from '@/services/node';
import { Roadmap } from '@/services/types/roadmap';
import { getRoadmapById } from '@/services/roadmap';

interface NodeListPageProps {
  roadMapId: string;
}
const NodesListPage: React.FC<NodeListPageProps> = ({
  roadMapId, // Assuming you pass the roadmapId as a prop
}) => {
  const [viewMode, setViewMode] = React.useState<'list' | 'card'>('card');
  const [loading, setLoading] = useState<boolean>(false);
  const [roadmap, setRoadmap] = React.useState<Roadmap | null>(); // State to hold the roadmapId

  const [nodes, setNodes] = useState<NodeData[]>([]);

  const fetchNodes = async (roadmapId: string) => {
    setLoading(true);
    const res = await getNodesByRoadmapId(roadmapId);
    if (res) {
      setNodes(res);
    } else {
      setNodes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      const res = await getRoadmapById(roadMapId);

      if (res && res.id) {
        setRoadmap(res);
        await fetchNodes(res.id);
      }
      setLoading(false);
    };

    fetchRoadmap();
  }, [roadMapId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          {/* <div className="flex justify-between items-center"> */}
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
            {/* <h2 className="text-2xl font-bold">Node View</h2> */}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="mr-2">List</span>
              <Switch
                checked={viewMode === 'card'}
                onChange={() =>
                  setViewMode(viewMode === 'list' ? 'card' : 'list')
                }
              />
              <span className="ml-2">Card</span>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  Sort By <Icon icon="lucide:chevron-down" className="ml-2" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Sort options">
                <DropdownItem key="newest">Newest</DropdownItem>
                <DropdownItem key="popular">Most Popular</DropdownItem>
                <DropdownItem key="price-asc">Price: Low to High</DropdownItem>
                <DropdownItem key="price-desc">Price: High to Low</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          {/* </div> */}
        </CardHeader>

        <Divider />
        <CardBody className="p-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div
                className={
                  viewMode === 'card'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                {nodes.map((node) => (
                  <NodeViewCard key={node.id} nodeData={node} />
                  // viewMode === 'card' ? <NodeViewCard key={node.id} nodeData={node} /> : <ListView key={course.id} course={course} />
                ))}
              </div>

              {/* <div className="flex justify-center mt-8">
                <Pagination total={50} page={1} onChange={() => {}} />
              </div> */}
            </>
          )}
        </CardBody>
        <CardFooter className="flex justify-center mt-8">
          <Pagination total={50} page={1} onChange={() => {}} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default NodesListPage;
