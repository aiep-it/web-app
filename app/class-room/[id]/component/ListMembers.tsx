import EmptySection from '@/components/EmptySection';
import { USER_ROLE } from '@/constant/authorProtect';
import { sendFeedbackToClass } from '@/services/class';
import { teacherGetFeedback } from '@/services/parents';
import { ClassTeacher } from '@/services/types/class';
import { Student } from '@/services/types/student';
import { TeacherFeedback } from '@/services/types/user';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ListMembersProps {
  teachers: ClassTeacher[];
  students: Student[];
  classId?: string;
  currentRole?: USER_ROLE | null;
  clazzName?: string;
  onOpenStudentReport?: (studentId: string) => void;
}

export const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 h-full">
    {children}
  </div>
);

const ListMembers: React.FC<ListMembersProps> = ({
  teachers,
  students,
  classId,
  currentRole,
  clazzName,
  onOpenStudentReport,
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const [listFeedBackSeletect, setListFeedBackSelected] = React.useState<TeacherFeedback[]>([]);

  const isTeacher = currentRole === USER_ROLE.TEACHER;
  const canOpenReport = isTeacher; // chỉ teacher được mở report theo yêu cầu

  const openReport = (studentId: string) => {
    if (!canOpenReport) return;
    onOpenStudentReport?.(studentId);
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setMessage('');
    onOpenChange();
  };

  const fetchFeedbacks = async (studentId: string) => {
    if (!classId) return;
    const res = await teacherGetFeedback(studentId, classId);
    setListFeedBackSelected(res || []);
  };

  useEffect(() => {
    if (selectedStudent?.id) {
      fetchFeedbacks(selectedStudent.id);
    }
  }, [selectedStudent]);

  const sendFeedBack = async () => {
    if (!selectedStudent || !message || !classId) return;
    setIsSending(true);
    const res = await sendFeedbackToClass(classId, selectedStudent.id, message);
    if (res) {
      toast.success('Feedback sent successfully!');
      handleClose();
    } else {
      toast.error('Failed to send feedback. Please try again later.');
    }
    setIsSending(false);
  };

  // helper chặn nổi bọt khi bấm button trong row
  const stopRow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

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
            <div key={teacher.id || teacher.email} className="flex gap-2 items-center h-full">
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

      <Card className="mt-4">
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
              <div
                key={student.id}
                className={[
                  'flex gap-2 items-center h-full justify-between rounded-xl px-2 py-1 transition-colors',
                  canOpenReport ? 'cursor-pointer hover:bg-default-100' : 'cursor-default',
                ].join(' ')}
                onClick={canOpenReport ? () => openReport(student.id) : undefined}
                role={canOpenReport ? 'button' : undefined}
                tabIndex={canOpenReport ? 0 : -1}
                onKeyDown={(e) => {
                  if (!canOpenReport) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openReport(student.id);
                  }
                }}
                aria-label={`Row of ${student.fullName || student.username}${canOpenReport ? ', open report' : ''}`}
              >
                <div className="flex gap-2 items-center h-full">
                  <Avatar
                    alt={student.fullName || student.username}
                    className="shrink-0"
                    color="primary"
                    isBordered
                    name={student.fullName || student.username}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{student.fullName || '-'}</span>
                    <span className="text-tiny text-default-400">
                      {student.username}
                    </span>
                  </div>
                </div>

                {/* Action zone */}
                <div className="flex items-center gap-2">
                  {isTeacher && (
                    <>
                      {/* View report */}
                      <Tooltip content="View report">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={(e) => {
                            stopRow(e);
                            openReport(student.id);
                          }}
                        >
                          <Icon icon="lucide:bar-chart-3" />
                        </Button>
                      </Tooltip>

                      {/* Send / See feedback */}
                      <Badge
                        isInvisible={(student?.feedbackCount ?? 0) === 0}
                        content={student.feedbackCount || ''}
                        color="danger"
                      >
                        <Tooltip content="Send / See feedback">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="primary"
                            onClick={(e) => {
                              stopRow(e); // FIX: chặn row click nuốt event
                              setSelectedStudent(student);
                              onOpen();
                            }}
                          >
                            <Icon icon="lucide:message-square" />
                          </Button>
                        </Tooltip>
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {/* Modal Feedback (giữ nguyên logic, chỉ hiển thị khi teacher mở) */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Feedback for {selectedStudent?.fullName || selectedStudent?.username}
          </ModalHeader>
          <ModalBody className="space-y-3">
            {/* List feedbacks đã có */}
          {/* List feedbacks đã có */}
{listFeedBackSeletect?.length ? (
  <div className="space-y-2">
    {listFeedBackSeletect.map((fb) => (
      <div
        key={fb.id}
        className="text-sm p-2 rounded-lg border border-default-200 dark:border-default-100"
      >
        <div className="font-medium">
          {(fb.teacher && fb.teacher.fullName) ? fb.teacher.fullName : 'Teacher'}:
        </div>
        <div className="opacity-80">{fb.content}</div>
        <div className="text-xs opacity-60 mt-1">
          {fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ''}
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-small opacity-60">No feedback yet.</div>
)}


            {/* Ô nhập thêm feedback mới cho teacher */}
            {isTeacher && (
              <Textarea
                label="Add feedback"
                placeholder="Type your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minRows={3}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={handleClose}>
              Close
            </Button>
            {isTeacher && (
              <Button color="primary" isLoading={isSending} onClick={sendFeedBack} isDisabled={!message.trim()}>
                Send feedback
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ListMembers;
