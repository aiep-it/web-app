import { USER_ROLE } from '@/constant/authorProtect';
import { CONTENT } from '@/constant/content';
import { getClassTopicReport } from '@/services/report';
import { ClassRoadmap, ClassTopic } from '@/services/types/class';
import { calculePercentage, getCmsAssetUrl } from '@/utils';
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ListTopicClassProps {
  classTopics: ClassTopic[];
  currentRole?: USER_ROLE | null;
  classId?: string;
}

const ListTopicClass: React.FC<ListTopicClassProps> = ({
  classTopics,
  currentRole,
  classId,
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [topic, setTopic] = React.useState<ClassTopic | null>(null);
  const [classTopicReport, setClassTopicReport] = React.useState<any[]>([]);
  const [classTopicReportLoading, setClassTopicReportLoading] =
    React.useState(false);

  const getClassTopicIdReport = async (
    classId: string,
    topicId: string,
  ): Promise<void> => {
    const res = await getClassTopicReport(classId, topicId);
    if (res) {
      console.log('Class Topic Report Data:', res);
      const { studentsTopicReport } = res;
      if (studentsTopicReport) {
        setClassTopicReport(studentsTopicReport);
      }
    } else {
      // Handle error case
      console.error('Failed to fetch class topic report data');
    }
  };

  const handleClassTopicReport = async (topic: ClassTopic) => {
    // console.log('handleClassTopicReport', topicId, classId);
    if (topic && classId) {
      onOpen();
      setClassTopicReportLoading(true);
      setTopic(topic);
      await getClassTopicIdReport(classId, topic.id);
      
      setClassTopicReportLoading(false);
    }
  };

  const handleLearning = (topicId: string) => {
    router.push(`/learn-vocabulary/${topicId}`);
  };
  return (
    <>
      {' '}
      <Table removeWrapper aria-label="Playlists table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn hidden={currentRole !== USER_ROLE.STUDENT}>
            {currentRole === USER_ROLE.STUDENT ? 'PROGRESS' : ''}
          </TableColumn>
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
                      src={
                        topic.image
                          ? getCmsAssetUrl(topic.image)
                          : CONTENT.DEFAULT_TOPIC_IMAGE
                      }
                      alt={topic.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="font-semibold">{topic.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground-500">
                  {topic.description}
                </TableCell>
                <TableCell hidden={currentRole !== USER_ROLE.STUDENT}>
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
                  {currentRole === USER_ROLE.STUDENT ? (
                    <Button
                      variant="solid"
                      color="primary"
                      onClick={() => handleLearning(topic.id)}
                    >
                      <Icon icon="lucide:book-open" className="mr-2" />
                      Learn
                    </Button>
                  ) : (
                    <Button
                      variant="solid"
                      color="secondary"
                      onPress={() => handleClassTopicReport(topic)}
                      // disabled={true}
                    >
                      <Icon icon="lucide:eye" />
                      View Report
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                TOPIC: {topic?.title || 'No Topic Selected'}
              </ModalHeader>
              <ModalBody>
                <Table removeWrapper aria-label="Playlists table">
                  <TableHeader>
                    <TableColumn>Student</TableColumn>
                    <TableColumn>Excercise</TableColumn>
                    <TableColumn>Vocabs</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {classTopicReportLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : classTopicReport.length > 0 ? (
                      classTopicReport.map((report) => (
                        <TableRow key={report.student.id}>
                          <TableCell>
                            {report.student.firstName} {report.student.lastName}
                          </TableCell>
                          <TableCell>
                            {report.exerciseSummary ? (
                               <Progress
                               aria-label="Downloading..."
                               className="max-w-md"
                               color="success"
                               showValueLabel={true}
                               size="md"
                               value={calculePercentage(
                                report.exerciseSummary.exerciseSuccessRate ||
                                  0,
                                report.exerciseSummary
                                  .totalExercisesAttempted || 0,
                              )}
                             />
                             
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>{report.vocabSummary ? (
                               <Progress
                               aria-label="Downloading..."
                               className="max-w-md"
                               color="success"
                               showValueLabel={true}
                               size="md"
                               value={calculePercentage(
                                report.vocabSummary.learnedVocabCount ||
                                  0,
                                report.vocabSummary
                                  .totalVocabCount || 0,
                              )}
                             />
                             
                            ) : (
                              '-'
                            )}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => {
                  setTopic(null);
                  setClassTopicReport([]);

                  onClose();
                }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListTopicClass;
