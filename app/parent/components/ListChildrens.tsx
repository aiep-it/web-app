'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Tooltip,
  Avatar,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Accordion,
  AccordionItem,
  Input,
  Spacer,
  Skeleton,
  Kbd,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

import EmptySection from '@/components/EmptySection';
import { getMyChildrens, getFeedback } from '@/services/parents';
import type { StudentData, FeedbackData } from '@/services/types/user';

// ---- Color & label maps
const statusColorMap: Record<string, 'success' | 'danger' | 'default' | 'primary' | 'warning' | 'secondary'> = {
  ACTIVATE: 'success',
  DEACTIVATE: 'danger',
};
const statusLabelMap: Record<string, string> = {
  ACTIVATE: 'Active',
  DEACTIVATE: 'Deactive',
};
const classLevelColorMap: Record<string, 'primary' | 'success' | 'warning' | 'secondary' | 'danger' | 'default'> = {
  STARTERS: 'primary',
  MOVERS: 'success',
  FLYERS: 'warning',
};

// ---- Helper to normalize userClasses
const normalizeClasses = (uc: unknown) => {
  return Array.isArray(uc) ? uc : uc ? [uc] : [];
};

export default function ChildrenCardsView() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<StudentData[]>([]);
  const [query, setQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // ---- Fetch children on mount
  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyChildrens();
      setChildren(res || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // ---- Search / filter
  const filteredChildren = useMemo(() => {
    if (!query.trim()) return children;
    const q = query.toLowerCase();
    return children.filter((s) => {
      const name = (s.fullName || '').toLowerCase();
      const usern = (s.username || '').toLowerCase();
      const classesJoined = normalizeClasses(s.userClasses)
        .map((c: any) => `${c?.class?.name ?? ''} ${c?.class?.code ?? ''}`.toLowerCase())
        .join(' ');
      return name.includes(q) || usern.includes(q) || classesJoined.includes(q);
    });
  }, [children, query]);

  // ---- Feedback modal logic
  const openFeedbackModal = async (student: StudentData) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    setFeedbackLoading(true);
    try {
      const res = await getFeedback(student.id);
      setFeedbacks(res || []);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const closeFeedbackModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFeedbacks([]);
  };

  // ---- Card UI for one student (BIGGER & MORE IMPACTFUL)
  const StudentCard: React.FC<{ s: StudentData }> = ({ s }) => {
    const initials = (s.fullName || s.username || 'U')
      .split(' ')
      .map((t) => t[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const classesArr = normalizeClasses(s.userClasses);
    const classCount = classesArr.length;
    const feedbackCount = s._count?.feedbackReceived || 0;

    return (
      <Card
        radius="lg"
        shadow="md"
        className="h-full overflow-hidden border border-default-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
      >
        {/* Cover / Banner */}
        <CardHeader className="relative p-0">
          <div className="h-24 w-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20" />
          <Avatar
            isBordered
            radius="lg"
            name={initials}
            className="absolute left-5 -bottom-7 size-16 shadow-medium"
          />
        </CardHeader>

        <CardBody className="pt-10">
          {/* Name & status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold leading-none tracking-tight">{s.fullName || '-'}</h3>
              <div className="mt-1 flex items-center gap-2 text-small text-default-500">
                <Icon icon="lucide:at-sign" width={16} />
                <span>{s.username || '—'}</span>
              </div>
            </div>
            {/* {s.status && (
              // <Tooltip content={`Status: ${statusLabelMap[s.status] ?? s.status}`}>
              //   <Chip size="sm" color={statusColorMap[s.status] ?? 'default'} variant="flat" className="min-w-20 justify-center">
              //     {statusLabelMap[s.status] ?? s.status}
              //   </Chip>
              // </Tooltip>
            )} */}
          </div>

          {/* Mini stats row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-default-200 p-3 text-center">
              <div className="text-xl font-bold leading-none">{classCount}</div>
              <div className="mt-1 text-tiny text-default-500">Classes</div>
            </div>
            <div className="rounded-xl border border-default-200 p-3 text-center">
              <div className="text-xl font-bold leading-none">{feedbackCount}</div>
              <div className="mt-1 text-tiny text-default-500">Feedback</div>
            </div>
            <div className="rounded-xl border border-default-200 p-3 text-center">
              <div className="text-xl font-bold leading-none">{s.status ? (statusLabelMap[s.status] ?? s.status) : '—'}</div>
              <div className="mt-1 text-tiny text-default-500">Status</div>
            </div>
          </div>

          {/* Class chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {classCount > 0 ? (
              classesArr.map((uc: any) => (
                <Tooltip key={uc?.class?.id} content={`Code: ${uc?.class?.code || '—'}`}>
                  <Chip
                    size="sm"
                    color={uc?.class?.level ? classLevelColorMap[uc.class.level] : 'default'}
                    variant="flat"
                  >
                    {uc?.class?.name || 'Unknown class'}
                  </Chip>
                </Tooltip>
              ))
            ) : (
              <span className="text-tiny text-default-400">No classes joined</span>
            )}
          </div>
        </CardBody>

        <CardFooter className="pt-0">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              size="md"
              color="primary"
              variant="solid"
              startContent={<Icon icon="lucide:eye" width={18} />}
              onPress={() => router.push(`/parent/reports/${s.id}`)}
            >
              View report
            </Button>

            <Tooltip content="See feedback from teachers">
              <Button
                size="md"
                variant="flat"
                startContent={
                  <Badge content={feedbackCount} color="secondary" placement="top-right">
                    <Icon icon="lucide:message-circle" width={18} />
                  </Badge>
                }
                onPress={() => openFeedbackModal(s)}
              >
                Feedback
              </Button>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Children</h2>
          <p className="text-small text-default-500">Profiles, classes and teacher feedback</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onValueChange={setQuery}
            radius="lg"
            variant="bordered"
            placeholder="Search by name, username, or class..."
            startContent={<Icon icon="lucide:search" width={18} />}
            className="min-w-[280px]"
          />
        </div>
      </div>

      <Spacer y={4} />

      {/* Content area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader className="relative p-0">
                <Skeleton className="h-24 w-full rounded-none" />
                <Skeleton className="absolute left-5 -bottom-7 h-16 w-16 rounded-2xl" />
              </CardHeader>
              <CardBody className="pt-10">
                <Skeleton className="h-5 w-1/2 rounded-md" />
                <Skeleton className="mt-2 h-4 w-1/3 rounded-md" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </CardBody>
              <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredChildren.length === 0 ? (
        <EmptySection title="No students" message="You don't have any linked students or your search returned no results." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredChildren.map((s) => (
            <StudentCard key={s.id} s={s} />
          ))}
        </div>
      )}

      {/* Feedback modal */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="3xl" placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Feedback — {selectedStudent?.fullName || 'Student'}
              </ModalHeader>
              <ModalBody>
                {feedbackLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="w-10 h-10 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/3 rounded-md" />
                          <Skeleton className="h-4 w-2/3 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : feedbacks.length > 0 ? (
                  <Accordion variant="bordered" className="space-y-2">
                    {feedbacks.map((fb) => (
                      <AccordionItem
                        key={fb.id}
                        title={fb.teacher.fullName}
                        subtitle={`Class: ${fb.class.name}`}
                        startContent={<Avatar isBordered color="primary" radius="md" name={fb.class.name} />}
                      >
                        {fb.content}
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <EmptySection title="No Feedbacks" message="This student does not have any feedbacks yet." />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}