import { NodeStatus } from '@/constant/enums';
import { NodeData } from '@/services/types/node';
import { parseDateTime } from '@/utils/dateTimeUtil';
import { getFullPathFile } from '@/utils/expections';
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface IProps {
  nodeData: NodeData;
}
const NodeViewCard: React.FC<IProps> = ({ nodeData }) => {
  const router = useRouter();
  return (
    <Card className="max-w-[400px] w-full">
      <CardHeader className="p-0">
        {nodeData.coverImage ? (
          <Image
            removeWrapper
            className="z-0 w-full h-[200px] scale-125 -translate-y-6 object-cover"
            alt={nodeData.title}
            src={
              getFullPathFile(nodeData.coverImage) ||
              'https://placehold.co/600x400'
            }
          />
        ) : (
          <div className="w-full h-[100px] flex items-center justify-center">
            <h3>{nodeData.title}</h3>
          </div>
        )}
      </CardHeader>
      <CardBody className="mt-3">
        <h4 className="font-bold text-large">{nodeData.title}</h4>
        {nodeData?.status && nodeData.status === NodeStatus.SETTUPED ? (
          <>
            <Chip className="my-2" variant="flat" color="success">
              {nodeData.suggestionLevel}{' '}
            </Chip>
            <p className="text-small text-default-500">
              {nodeData.description || '-'}
            </p>
          </>
        ) : (
          <div className='my-2'>
            <Alert color="warning" title={`Your Node is not available info`} />
          </div>
        )}
      </CardBody>
      <CardFooter className="flex flex-col items-start">
        <div className="flex justify-between items-center w-full mt-2">
          <div className="flex items-center">
            <Icon icon="lucide:clock" className="mr-1 text-default-400" />
            <span className="text-tiny text-default-400">
              {!nodeData.updated_at && !nodeData.created_at
                ? '-'
                : nodeData.updated_at
                  ? parseDateTime(nodeData.updated_at, 'DD/MM/YYYY HH:mm')
                  : parseDateTime(
                      nodeData.created_at || new Date(),
                      'DD/MM/YYYY HH:mm',
                    )}
            </span>
          </div>
          <div>
            <Tooltip content="View Detail" className="capitalize">
              <Button
                size="sm"
                color="primary"
                variant="bordered"
                onPress={() => {
                  router.push(`/admin/node/${nodeData.id}`);
                }}
              >
                Detail
              </Button>
            </Tooltip>
            <Tooltip content="Edit Note Info" className="capitalize ">
              <Button
                className="mx-2"
                size="sm"
                color="primary"
                onPress={() => {
                  router.push(`/admin/node/${nodeData.id}/edit`);
                }}
              >
                Edit
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NodeViewCard;
