'use client';

import React, { useCallback, useEffect } from 'react';
import { Key, Selection } from '@react-types/shared';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  addToast,
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  getExtendRoadMaps,
  getMyClass,
  pickRoadmapIntoClass,
} from '@/services/class';
import { ClassResponse } from '@/services/types/class';
import ClassRoomHeader from './component/ClassRoomHeader';
import ListTopicClass from './component/ListTopicClass';
import EmptySection from '@/components/EmptySection';
import ListMembers from './component/ListMembers';
import { useAuth } from '@clerk/nextjs';
import { USER_ROLE } from '@/constant/authorProtect';
import ClassReport from './component/ClassReport';
import { Roadmap } from '@/services/types/roadmap';
import RoadMapDetailPage from '@/app/admin/roadmaps/[id]/RoadMapDetailPage';
import MyReport from '@/app/report/me/MyReport';

interface ClassRoomPageProps {
  classId: string;
}

const columns = [
  { key: 'name', label: 'NAME' },
  { key: 'description', label: 'DESCRIPTION' },
  { key: 'actions', label: 'ACTIONS' },
];

const ClassRoomPage: React.FC<ClassRoomPageProps> = ({ classId }) => {
  const [classInfo, setClassInfo] = React.useState<ClassResponse | null>(null);
  const [currentRole, setCurrentRole] = React.useState<USER_ROLE | null>(null);
  const { sessionClaims } = useAuth();

  const [extendsRoadmaps, setExtendsRoadmaps] = React.useState<Roadmap[]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set<Key>());

  const { isOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: viewRoadMap,
    onOpenChange: onOpenChangeViewRoadmap,
  } = useDisclosure();

  const [roadMapSelected, setRoadMapSelected] = React.useState<Roadmap | null>(null);

  const {
    isOpen: isOpenStudentReport,
    onOpenChange: onOpenChangeStudentReport,
    onOpen: onOpenStudentReportInternal,
  } = useDisclosure();
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null);

  // open Report modal from child
  const handleOpenStudentReport = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
    onOpenStudentReportInternal();
  }, [onOpenStudentReportInternal]);

  // Lấy role từ Clerk
  useEffect(() => {
    interface Metadata { role?: string }
    const metadata = sessionClaims?.metadata as Metadata;
    if (metadata?.role) {
      const role = metadata.role.toUpperCase() as USER_ROLE;
      setCurrentRole(role);
    }
  }, [sessionClaims]);

  // Fetch class info
  const fetchMyClass = useCallback(async () => {
    const res = await getMyClass(classId);
    if (res) setClassInfo(res);
    else console.error('Failed to fetch class data');
  }, [classId]);

  useEffect(() => {
    if (!classInfo && classId) {
      fetchMyClass();
    }
  }, [classId, classInfo, fetchMyClass]);

  // Fetch danh sách roadmap mở rộng, lọc bỏ deleted
  const fetchExtendsRoadMap = useCallback(async () => {
    const res = await getExtendRoadMaps(classId);
    const cleaned = (res || []).filter((r: any) =>
      !(r?.is_delected ?? r?.is_deleted ?? r?.isDeleted ?? false) &&
      (r?.status ? String(r.status).toUpperCase() !== 'DELETED' : true)
    );
    setExtendsRoadmaps(cleaned);
  }, [classId]);

  // Khi mở modal thì fetch danh sách
  useEffect(() => {
    if (isOpen) {
      fetchExtendsRoadMap();
    }
  }, [isOpen, fetchExtendsRoadMap]);

  // Đóng modal + reset chọn
  const handleClose = useCallback(() => {
    setSelectedKeys(new Set<Key>());
    onOpenChange();
  }, [onOpenChange]);

  // Pick roadmap: chỉ gửi ID hợp lệ
  const pickRoadmap = useCallback(async () => {
    const eligibleIds = extendsRoadmaps
      .filter((r: any) => !(r?.is_delected ?? r?.is_deleted ?? r?.isDeleted ?? false))
      .map((r) => r.id);

    let payloadInsert: string[] = [];
    const isAll = selectedKeys === 'all';

    if (isAll) {
      payloadInsert = eligibleIds;
    } else {
      const setSel = selectedKeys as Set<Key>;
      if (setSel && setSel.size > 0) {
        payloadInsert = Array.from(setSel)
          .map((k) => k.toString())
          .filter((id) => eligibleIds.includes(id));
      }
    }

    if (!payloadInsert.length) {
      addToast({ title: 'Không có roadmap hợp lệ để thêm.', color: 'warning' });
      return;
    }

    const res = await pickRoadmapIntoClass(classId, payloadInsert);
    if (res) {
      addToast({ title: 'Thêm roadmap thành công!', color: 'success' });
      handleClose();
      fetchMyClass();
    } else {
      addToast({ title: 'Thêm roadmap thất bại!', color: 'danger' });
    }
  }, [classId, extendsRoadmaps, selectedKeys, fetchMyClass, handleClose]);

  const renderCell = React.useCallback(
    (roadmap: Roadmap, columnKey: React.Key): React.ReactNode => {
      const cellValue = roadmap[columnKey as keyof Roadmap];
      switch (columnKey) {
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setRoadMapSelected(roadmap);
                    onOpenChangeViewRoadmap();
                  }}
                >
                  <Icon icon="lucide:eye" width={20} />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue !== undefined ? <>{cellValue}</> : '-';
      }
    },
    [onOpenChangeViewRoadmap]
  );

  const pickDisabled =
    selectedKeys !== 'all' &&
    (!selectedKeys || (selectedKeys as Set<Key>).size === 0);

  return (
    <div className="flex-grow container mx-auto px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <ClassRoomHeader classInfo={classInfo} />

        <Tabs
          aria-label="Class Options"
          color="primary"
          variant="underlined"
          className="w-full block"
        >
          <Tab
            key="about"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:library" />
                <span>Courses</span>
              </div>
            }
          >
            {currentRole === USER_ROLE.TEACHER && (
              <div className="flex justify-end mb-4">
                <Tooltip content="Pick from bank" color="primary">
                  <Button color="primary" onPress={onOpenChange}>
                    <Icon icon="lucide:plus" className="mr-2" />
                    Pick Roadmap
                  </Button>
                </Tooltip>
              </div>
            )}

            {classInfo?.roadmaps && classInfo.roadmaps.length > 0 ? (
              <Accordion variant="bordered" className="space-y-2">
                {classInfo.roadmaps.map((roadmap) => (
                  <AccordionItem
                    key={roadmap.id}
                    startContent={
                      <div className="flex flex-row space-x-2">
                        <p>{roadmap.name}</p>
                        {roadmap.category && (
                          <Chip color="primary" variant="flat" className="text-xs">
                            {roadmap.category}
                          </Chip>
                        )}
                      </div>
                    }
                  >
                    <ListTopicClass
                      currentRole={currentRole}
                      classTopics={roadmap.topics || []}
                      classId={classId}
                    />
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <EmptySection
                title="No Courses Available"
                message="This class does not have any courses yet."
              />
            )}
          </Tab>

          <Tab
            key="members"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:users" />
                <span>Members</span>
                {!!(classInfo?.students?.length) && (
                  <Chip size="sm" variant="flat" color="success">
                    {classInfo!.students!.length}
                  </Chip>
                )}
              </div>
            }
          >
            <div className="py-4 h-full">
              {(classInfo?.teachers?.length ?? 0) > 0 ||
              (classInfo?.students?.length ?? 0) > 0 ? (
                <ListMembers
                  teachers={classInfo?.teachers ?? []}
                  students={classInfo?.students ?? []}
                  classId={classId}
                  currentRole={currentRole}
                  clazzName={classInfo?.name}
                  onOpenStudentReport={handleOpenStudentReport}
                />

                
              ) : (
                <EmptySection
                  title="No Members"
                  message="This class does not have any members yet."
                />
              )}
            </div>
          </Tab>

          {currentRole === USER_ROLE.TEACHER && (
            <Tab
              key="class-report"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clipboard-minus" />
                  <span>Class Report</span>
                </div>
              }
            >
              <ClassReport classId={classId} />
            </Tab>
          )}
        </Tabs>
      </motion.div>

      {/* Modal Pick Roadmap */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Pick Roadmap</ModalHeader>
              <ModalBody>
                <Table
                  aria-label="Controlled table example with dynamic content"
                  selectedKeys={selectedKeys}
                  selectionMode="multiple"
                  onSelectionChange={setSelectedKeys}
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>

                  <TableBody items={extendsRoadmaps}>
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => (
                          <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleClose}>
                  Close
                </Button>
                <Button color="primary" onPress={pickRoadmap} isDisabled={pickDisabled}>
                  Pick
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal View Roadmap */}
      <Modal
        isOpen={isOpenStudentReport}
        onOpenChange={onOpenChangeStudentReport}
        size="5xl"
        isDismissable
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedStudentId ? 'Student Report' : 'No Student Selected'}
              </ModalHeader>
              <ModalBody className="p-0">
                {selectedStudentId ? (
                  <MyReport stdId={selectedStudentId} />
                ) : (
                  <EmptySection
                    title="No Student Selected"
                    message="Please select a student to view report."
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onOpenChangeStudentReport}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClassRoomPage;
