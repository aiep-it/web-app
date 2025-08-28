import EmptySection from '@/components/EmptySection';
import { USER_ROLE } from '@/constant/authorProtect';
import { sendFeedbackToClass } from '@/services/class';
import { teacherGetFeedback } from '@/services/parents';
import { ClassTeacher } from '@/services/types/class';
import { Student } from '@/services/types/student';
import { TeacherFeedback } from '@/services/types/user';
import {
  Accordion,
  AccordionItem,
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

export const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
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
   const openReport = (studentId: string) => {
    onOpenStudentReport?.(studentId);
  };
  const router = useRouter();
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
  };

  const [listFeedBackSeletect, setListFeedBackSelected] = React.useState<
    TeacherFeedback[]
  >([]);

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

  // ===== NEW: Điều hướng sang trang Report của học sinh =====
  const goToStudentReport = (studentId: string) => {
    // tái sử dụng trang /report/me với query stdId
    router.push(`/report/me?stdId=${studentId}`);
  };

  return (
    <div>
      {/* Teachers card... giữ nguyên */}
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
      <Card></Card>
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
                className="flex gap-2 items-center h-full justify-between rounded-xl px-2 py-1 cursor-pointer hover:bg-default-100 transition-colors"
                onClick={() => openReport(student.id)}               // NEW
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openReport(student.id);                           // NEW
                  }
                }}
                aria-label={`Open report of ${student.fullName || student.username}`}
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

                <div className="flex items-center gap-2">
                  {/* Nút Report riêng (không kích hoạt click của row) */}
                  <Tooltip content="View report">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={(e) => {
                        (e as any).preventDefault?.();
                        (e as any).stopPropagation?.();
                        openReport(student.id);                       // NEW
                      }}
                    >
                      <Icon icon="lucide:bar-chart-3" />
                    </Button>
                  </Tooltip>

                  {currentRole === 'TEACHER' && (
                    <Badge
                      isInvisible={(student?.feedbackCount ?? 0) === 0}
                      content={student.feedbackCount || ''}
                      color="danger"
                    >
                      <Tooltip content="Send feedback">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={(e) => {
                            (e as any).preventDefault?.();
                            (e as any).stopPropagation?.();
                            setSelectedStudent(student);
                            onOpen();
                          }}
                        >
                          <Icon icon="lucide:message-square" />
                        </Button>
                      </Tooltip>
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      
    </div>
  );
};

export default ListMembers;