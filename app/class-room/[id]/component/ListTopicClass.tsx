import { CONTENT } from '@/constant/content';
import { ClassRoadmap, ClassTopic } from '@/services/types/class';
import { calculePercentage, getCmsAssetUrl } from '@/utils';
import {
  Button,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ListTopicClassProps {
  classTopics: ClassTopic[];
}

const ListTopicClass: React.FC<ListTopicClassProps> = ({ classTopics }) => {
  const router = useRouter();

  const handleLearning = (topicId: string) => {
    router.push(`/learn-vocabulary/${topicId}`);
  }
  return (
    <Table removeWrapper aria-label="Playlists table">
      <TableHeader>
        <TableColumn>TITLE</TableColumn>
        <TableColumn>DESCRIPTION</TableColumn>
        <TableColumn>PROGRESS</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {classTopics.map((topic) => {
          const progressPercentage =
            topic.progress &&
            topic.progress.totalVocabs &&
            topic.progress.learnedVocabs
              ? calculePercentage(
                  topic.progress.learnedVocabs || 0,
                  topic.progress.totalVocabs,
                )
              : 0;
          return (
            <TableRow
              key={topic.id}
              className="hover:bg-content3 transition-colors cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={topic.image ? getCmsAssetUrl(topic.image) : CONTENT.DEFAULT_TOPIC_IMAGE}
                    alt={topic.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="font-semibold">{topic.title}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground-500">
                {topic.description}
              </TableCell>
              <TableCell>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-800">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
                  size="sm"
                  onPress={() => handleLearning(topic.id)}
                >
                  <Icon icon="material-symbols:play-arrow" className="mr-1" />
                  {progressPercentage > 0 ? 'Countinue' : 'Start'} Learning
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ListTopicClass;
