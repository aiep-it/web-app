import { NodeStatus } from '@/constant/enums';
import { NodeData } from '@/services/types/node';
import { parseDateTime } from '@/utils/dateTimeUtil';
import { getFullPathFile } from '@/utils/expections';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';
import { NodeContentCMS } from '../edit/types';

interface nodeDataInfoProps {
  nodeData?: NodeData;
  nodeContent?: NodeContentCMS | null;
}
const nodeDataInfo: React.FC<nodeDataInfoProps> = ({
  nodeData,
  nodeContent,
}) => {
  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-4">
          <Image
            src={
              nodeData?.coverImage
                ? getFullPathFile(nodeData?.coverImage)
                : undefined
            }
            className="w-full md:w-64 h-48 md:h-36 text-large"
          />
          <div className="flex-grow space-y-2">
            <h1 className="text-2xl font-bold">{nodeData?.title}</h1>
            <p className="text-default-500">{nodeData?.description}</p>
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" variant="flat">
                {nodeData?.roadmap?.name}
              </Chip>
              <Chip color="secondary" variant="flat">
                {nodeData?.suggestionLevel}
              </Chip>
              <Chip
                color={
                  nodeData?.status === NodeStatus.SETTUPED
                    ? 'success'
                    : 'warning'
                }
                variant="flat"
              >
                {nodeData?.status?.replace('_', ' ')}
              </Chip>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:map" className="text-default-400" />
              <span>Roadmap: {nodeData?.roadmap.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:calendar" className="text-default-400" />
              {/* <span>Last updated: {nodeData?.updated_at?.toLocaleDateString()}</span> */}
            </div>
          </div>
          <Divider />
          <div>
            <h2 className="text-xl font-semibold mb-2">About this Node</h2>
            <p>{nodeData?.description}</p>
            <Divider className='my-3'/>
            {nodeContent?.content ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: nodeContent?.content || '' }}
              />
            ) : (
              <p className="text-default-500">No Content to show</p>
            )}
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <Button color="primary" variant='bordered'>
              Edit
            </Button>
            <div className="flex gap-2">
              <Button isIconOnly variant="light" aria-label="Previous node">
                <Icon icon="lucide:chevron-left" className="text-xl" />
              </Button>
              <Button isIconOnly variant="light" aria-label="Next node">
                <Icon icon="lucide:chevron-right" className="text-xl" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default nodeDataInfo;
