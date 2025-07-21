import { TopicStatus } from '@/constant/enums';
import { TopicData } from '@/services/types/topic';
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
  topicData: TopicData;
}
const TopicViewCard: React.FC<IProps> = ({ topicData }) => {
  const router = useRouter();
  return (
    <Card className="max-w-[400px] w-full">
      <CardHeader className="p-0">
        {topicData.coverImage ? (
          <Image
            removeWrapper
            className="z-0 w-full h-[200px] scale-125 -translate-y-6 object-cover"
            alt={topicData.title}
            src={
              getFullPathFile(topicData.coverImage) ||
              'https://placehold.co/600x400'
            }
          />
        ) : (
          <div className="w-full h-[100px] flex items-center justify-center">
            <h3>{topicData.title}</h3>
          </div>
        )}
      </CardHeader>
      <CardBody className="mt-3">
        <h4 className="font-bold text-large">{topicData.title}</h4>
        {topicData?.status && topicData.status === TopicStatus.SETTUPED ? (
          <>
            <Chip className="my-2" variant="flat" color="success">
              {topicData.suggestionLevel}{' '}
            </Chip>
            <p className="text-small text-default-500">
              {topicData.description || '-'}
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
              {!topicData.updated_at && !topicData.created_at
                ? '-'
                : topicData.updated_at
                  ? parseDateTime(topicData.updated_at, 'DD/MM/YYYY HH:mm')
                  : parseDateTime(
                      topicData.created_at || new Date(),
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
                  router.push(`/admin/node/${topicData.id}`);
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
                  router.push(`/admin/node/${topicData.id}/edit`);
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

export default TopicViewCard;
