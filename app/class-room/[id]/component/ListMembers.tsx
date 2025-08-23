import EmptySection from '@/components/EmptySection';
import { USER_ROLE } from '@/constant/authorProtect';
import { sendFeedbackToClass } from '@/services/class';
import { ClassTeacher } from '@/services/types/class';
import { Student } from '@/services/types/student';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';
import toast from 'react-hot-toast';

interface ListMembersProps {
  teachers: ClassTeacher[];
  students: Student[];
  classId?: string;
  currentRole?: USER_ROLE | null;
}
export const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 h-full">
    {children}
  </div>
);
const ListMembers: React.FC<ListMembersProps> = ({ teachers, students, classId,currentRole }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null,
  );
  const [isSending, setIsSending] = React.useState<boolean>(false);

  const [message, setMessage] = React.useState<string>('');

  const handleClose = () => {
    setSelectedStudent(null);
    setMessage('');
    onOpenChange();
  }

  const sendFeedBack = async () => {
    if (!selectedStudent || !message || !classId) {
      return;
    }
    setIsSending(true);
    // Here you would typically send the feedback to your backend
    const res = await sendFeedbackToClass(classId, selectedStudent.id, message);
    // Reset the message after sending
    if(res) {
      toast.success('Feedback sent successfully!');
      handleClose();
    } else {
      toast.error('Failed to send feedback. Please try again later.');
    }
    setIsSending(false);
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">Teachers</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-3">
          {teachers.map((teacher) => (
            <div className="flex gap-2 items-center h-full">
              <Avatar
                alt={teacher.fullName || teacher.email}
                className="shrink-0"
                color="secondary"
                isBordered
                name={teacher.fullName || teacher.email}
              />
              <div className="flex flex-col">
                <span className="text-small">{teacher.fullName || '-'}</span>
                <span className="text-tiny text-default-400">
                  {teacher.email}
                </span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">Students</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-3">
          {students.length === 0 ? (
            <EmptySection
              title="No Students"
              message="This class does not have any students yet."
            />
          ) : (
            students.map((student) => (
              <div className="flex gap-2 items-center h-full justify-between">
                <div className="flex gap-2 items-center h-full">
                  <Avatar
                    alt={student.fullName || student.username}
                    className="shrink-0"
                    color="primary"
                    isBordered
                    name={student.fullName || student.username}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">
                      {student.fullName || '-'}
                    </span>
                    <span className="text-tiny text-default-400">
                      {student.username}
                    </span>
                  </div>
                </div>
               {
                  currentRole === 'TEACHER' && (
                    <Button
                      variant="flat"
                      color="primary"
                      onPress={() => {
                        setSelectedStudent(student);
                        onOpen();
                      }}
                    >
                      <Icon icon="lucide:message-square" />
                    </Button>
                  )
               }
              </div>
            ))
          )}
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                FeedBack For {selectedStudent?.fullName || 'No Student Selected'}
              </ModalHeader>
              <ModalBody className='space-y-3'>
                <div className="flex items-center px-2">
                  <p>to: <span>{selectedStudent?.parentEmail}</span></p>
                </div>
                <Textarea
                  label="Message"
                  placeholder="Type your message here..."
                  value={message}
                  onValueChange={setMessage}
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={sendFeedBack} isLoading={isSending}>
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

export default ListMembers;
