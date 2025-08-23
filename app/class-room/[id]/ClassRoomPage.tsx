'use client';
import React, { useEffect } from 'react';
import { Key, Selection } from '@react-types/shared';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  addToast,
  Button,
  Chip,
  getKeyValue,
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
import toast from 'react-hot-toast';

interface ClassRoomPageProps {
  classId: string; // Optional prop if you want to pass classId
}

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'description',
    label: 'DESCRIPTION',
  },
  {
    key: 'actions',
    label: 'ACTIONS',
  },
];
const ClassRoomPage: React.FC<ClassRoomPageProps> = ({ classId }) => {
  const [classInfo, setClassInfo] = React.useState<ClassResponse | null>(null);
  const [currentRole, setCurrentRole] = React.useState<USER_ROLE | null>(null);
  const { sessionClaims } = useAuth();
  const [extendsRoadmaps, setExtendsRoadmaps] = React.useState<Roadmap[]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set<Key>(),
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: viewRoadMap,
    onOpen: onOpenViewRoadMap,
    onOpenChange: onOpenChangeViewRoadmap,
  } = useDisclosure();

  const [roadMapSelected, setRoadMapSelected] = React.useState<Roadmap | null>(
    null,
  );
  useEffect(() => {
    interface Metadata {
      role?: string;
    }

    const metadata = sessionClaims?.metadata as Metadata;

    if (metadata?.role) {
      const role = metadata.role.toUpperCase() as USER_ROLE;

      setCurrentRole(role);
    }
  }, [sessionClaims]);
  const fetchMyClass = async () => {
    const res = await getMyClass(classId);

    if (res) {
      // Handle the fetched class data
      setClassInfo(res);
    } else {
      // Handle error case
      console.error('Failed to fetch class data');
    }
  };

  useEffect(() => {
    if (!classInfo && classId) {
      fetchMyClass();
    }
  }, [classId]);

  const fetchExtendsRoadMap = async () => {
    const res = await getExtendRoadMaps(classId);

    setExtendsRoadmaps(res || []);
  };
  useEffect(() => {
    if (isOpen) {
      // Fetch class data when modal opens
      fetchExtendsRoadMap();
    }
  }, [isOpen]);

  const handleClose = () => {
    setSelectedKeys(new Set<Key>()); // Reset selected keys when closing
    onOpenChange();
  }

  const pickRoadmap = async () => {
    let payloadInsert: string[] = [];
    if (selectedKeys === 'all') {
      payloadInsert = extendsRoadmaps?.map((roadmap) => roadmap.id) || [];
    } else if (selectedKeys.size > 0) {
      payloadInsert = Array.from(selectedKeys).map((key) => key.toString());
    }

    const res = await pickRoadmapIntoClass(classId, payloadInsert);

    if (res) {
      addToast({
        title: 'Roadmap picked successfully!',
        
        color: 'success',
      });
      handleClose();
      fetchMyClass(); // Refresh class data
    } else {
      // Handle error case
      addToast({
        title: 'Roadmap picked fail!',
        color: 'danger',
      });
    }
  };

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
              <Tooltip content="See Feedback">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50"></span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue !== undefined ? <>{cellValue}</> : '-';
      }
    },
    [],
  );
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
            {currentRole && currentRole === USER_ROLE.TEACHER && (
              <div className="flex justify-end mb-4">
                <Tooltip content={'Pick from bank'} color="primary">
                  <Button color="primary" onPress={onOpenChange}>
                    <Icon icon="lucide:plus" className="mr-2" />
                    Pick Roadmap
                  </Button>
                </Tooltip>
              </div>
            )}
            {classInfo?.roadmaps && classInfo.roadmaps.length > 0 ? (
              <Accordion variant="bordered" className="space-y-2">
                {classInfo.roadmaps.map((roadmap, index) => (
                  <AccordionItem
                    key={index}
                    startContent={
                      <div className="flex flex-row space-x-2">
                        <p>{roadmap.name}</p>
                        {roadmap.category && (
                          <Chip
                            color="primary"
                            variant="flat"
                            className="text-xs"
                          >
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
                {classInfo?.students && classInfo.students.length > 0 && (
                  <Chip size="sm" variant="flat" color="success">
                    {classInfo?.students && classInfo.students.length}
                  </Chip>
                )}
              </div>
            }
          >
            <div className="py-4 h-full">
              {classInfo?.teachers && classInfo.teachers.length > 0 ? (
                <ListMembers
                  teachers={classInfo.teachers}
                  students={classInfo.students || []}
                  classId={classId}
                  currentRole={currentRole}
                />
              ) : (
                <EmptySection
                  title="No Members"
                  message="This class does not have any members yet."
                />
              )}
            </div>
          </Tab>
          <Tab
            key="Media"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:tv-minimal" />
                <span>Media</span>
                {/* {events.length > 0 && <Chip size="sm" variant="flat">{events.length}</Chip>} */}
              </div>
            }
          >
            <EmptySection
              title="No Media"
              message="This class does not have any media yet."
            />
          </Tab>
          {currentRole && currentRole === USER_ROLE.TEACHER && (
            <Tab
              key="class-report"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:clipboard-minus" />
                  <span>Class Report</span>
                  {/* {events.length > 0 && <Chip size="sm" variant="flat">{events.length}</Chip>} */}
                </div>
              }
            >
              <ClassReport classId={classId} />
            </Tab>
          )}
        </Tabs>
      </motion.div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={pickRoadmap}>
                  Pick
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={viewRoadMap}
        onOpenChange={onOpenChangeViewRoadmap}
        size="5xl"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        scrollBehavior={'inside'}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                RoadMap View
              </ModalHeader>
              <ModalBody>
                {roadMapSelected ? (
                  <RoadMapDetailPage
                    id={roadMapSelected.id}
                    isViewOnly={true}
                  />
                ) : (
                  <EmptySection
                    title="No Roadmap Selected"
                    message="Please select a roadmap to view details."
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="bordered" onPress={onClose}>
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
