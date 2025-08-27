'use client';
import type { SVGProps } from 'react';
import type { ChipProps } from '@heroui/react';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Listbox,
  ListboxItem,
  Avatar,
  Badge,
  Modal,
  useDisclosure,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalContent,
  Accordion,
  AccordionItem,
  Input,
} from '@heroui/react';
import { FeedbackData, StudentData } from '@/services/types/user';
import { getFeedback, getMyChildrens } from '@/services/parents';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { set } from 'react-hook-form';
import EmptySection from '@/components/EmptySection';
import { sendFeedbackToClass } from '@/services/class';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const columns = [
  { name: 'NAME', uid: 'fullName' },
  { name: 'Class', uid: 'userClasses' },
  { name: 'STATUS', uid: 'status' },
  { name: 'ACTIONS', uid: 'actions' },
];

export const EyeIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};
const statusColorMap: Record<string, ChipProps['color']> = {
  ACTIVATE: 'success',
  DEACTIVATE: 'danger',
};
const statusColorLabel: Record<string, string> = {
  ACTIVATE: 'Active',
  DEACTIVATE: 'Deactive',
};
const classLevelColorLabel: Record<string, ChipProps['color']> = {
  STARTERS: 'primary',
  MOVERS: 'success',
  FLYERS: 'warning',
};

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

export default function ListChildren() {
  const [children, setChildren] = React.useState<StudentData[]>([]);
  const router = useRouter();

  const [selectedStudent, setSelectedStudent] =
    React.useState<StudentData | null>(null);
  const [listFeedBackSeletec, setListFeedBackSelected] = React.useState<
    FeedbackData[]
  >([]);

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const handleChange = (classId: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [classId]: value }));
  };

  const renderCell = React.useCallback(
    (user: StudentData, columnKey: React.Key): React.ReactNode => {
      const cellValue = user[columnKey as keyof StudentData];

      switch (columnKey) {
        case 'fullName':
          return (
            <User
              avatarProps={{ radius: 'lg', name: user.fullName }}
              description={user.username}
              name={String(cellValue) || '-'}
            >
              {user.fullName}
            </User>
          );

        case 'status':
          return (
            <Chip
              className="capitalize"
              color={user.status ? statusColorMap[user.status] : 'default'}
              size="sm"
              variant="flat"
            >
              {typeof cellValue === 'string'
                ? statusColorLabel[cellValue]
                : '-'}
            </Chip>
          );
        case 'userClasses':
          const classes = Array.isArray(cellValue) ? cellValue : [];
          console.log(classes[0]);
          return classes.length > 0 ? (
            <div className="flex flex-col items-start gap-2 space-y-2">
              {classes.map((cls) => (
                <Tooltip content={cls.class.code} key={cls?.class?.id}>
                  <User
                    avatarProps={{ radius: 'lg', name: cls?.class?.code }}
                    description={
                      <Chip
                        size="sm"
                        color={
                          cls?.class?.level
                            ? classLevelColorLabel[cls.class.level]
                            : 'primary'
                        }
                      >
                        {cls.class.level}
                      </Chip>
                    }
                    name={String(cls.class?.name) || '-'}
                  >
                    {cls.class?.name}
                  </User>
                </Tooltip>
              ))}
            </div>
          ) : (
            <p className="text-default-400 text-tiny">No Join Any Class</p>
          );
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    router.push(`/parent/reports/${user.id}`);
                  }}
                >
                  <Icon icon="lucide:eye" width={20} />
                </span>
              </Tooltip>
              <Tooltip content="See Feedback">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedStudent(user);
                    onOpen();
                  }}
                >
                  <Badge
                    color="secondary"
                    content={user._count?.feedbackReceived || 0}
                  >
                    <Icon icon="lucide:message-circle" width={20} />
                  </Badge>
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue !== undefined ? <>{cellValue}</> : '-';
      }
    },
    [],
  );

  const fetchChildren = async () => {
    const res = await getMyChildrens();

    if (res) {
      setChildren(res);
    }
  };

  useEffect(() => {
    if (children.length === 0) {
      fetchChildren();
    }
  }, []);

  const fetchFeedbacks = async (studentId: string) => {
    const res = await getFeedback(studentId);

    setListFeedBackSelected(res || []);
  };

  useEffect(() => {
    if (selectedStudent && selectedStudent.id) {
      fetchFeedbacks(selectedStudent.id);
    }
  }, [selectedStudent]);


  const handleSend = async (classId: string) => {
    console.log('Handle send for classId:', classId);
    const message = inputValues[classId]?.trim();
    if (!message || !selectedStudent) return;

    console.log(`Send message for class ${classId}:`, message);
    const res = await sendFeedbackToClass(
      classId,
      selectedStudent?.id,
      message,
    );

    setInputValues((prev) => ({ ...prev, [classId]: '' })); // reset input
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={children} emptyContent={'No rows to display.'}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                List FeedBack for{' '}
                {selectedStudent?.fullName || 'No Student Selected'}
              </ModalHeader>
              <ModalBody>
                {listFeedBackSeletec.length > 0 ? (
                  <Accordion variant="bordered" className="space-y-2">
                    {listFeedBackSeletec.map((feedback) => (
                      <AccordionItem
                        key={feedback.classId}
                        startContent={
                          <Avatar
                            isBordered
                            color="primary"
                            radius="md"
                            name={feedback.classInfo.name}
                          />
                        }
                        subtitle={`Class: ${feedback.classInfo.code} `}
                        title={feedback.classInfo.name}
                      >
                        {feedback.feedbacks.length > 0 ? (
                          feedback.feedbacks.map((fb, idx) => (
                            <div key={idx} className="mb-4">
                              <p className="text-sm mb-1">
                                <span className="font-semibold"></span>{' '}
                                {fb.teacher.fullName || '-'} : {fb.content}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-default-400 text-tiny">
                            No Feedback from teacher yet.
                          </p>
                        )}
                        <Input
                          placeholder="Type your message here..."
                          value={inputValues[feedback.classId] || ''}
                          onChange={(e) =>
                            handleChange(feedback.classId, e.target.value)
                          }
                          endContent={
                            <Button
                              isIconOnly
                              variant="faded"
                              color="primary"
                              onPress={() => handleSend(feedback.classId)}
                            >
                              {' '}
                              <Icon icon={'lucide:send-horizontal'} />{' '}
                            </Button>
                          }
                        />
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <EmptySection
                    title="No Feedbacks"
                    message="This student does not have any feedbacks yet."
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
