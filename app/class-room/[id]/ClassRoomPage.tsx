'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionItem, Chip, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getMyClass } from '@/services/class';
import { ClassResponse } from '@/services/types/class';
import ClassRoomHeader from './component/ClassRoomHeader';
import ListTopicClass from './component/ListTopicClass';
import EmptySection from '@/components/EmptySection';
import ListMembers from './component/ListMembers';
import { useAuth } from '@clerk/nextjs';
import { USER_ROLE } from '@/constant/authorProtect';
import ClassReport from './component/ClassReport';

interface ClassRoomPageProps {
  classId: string; // Optional prop if you want to pass classId
}
const ClassRoomPage: React.FC<ClassRoomPageProps> = ({ classId }) => {
  const [classInfo, setClassInfo] = React.useState<ClassResponse | null>(null);
  const [currentRole, setCurrentRole] = React.useState<USER_ROLE | null>(null);
  const { sessionClaims } = useAuth();
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
                <Icon icon="lucide:info" />
                <span>Courses</span>
              </div>
            }
          >
            {classInfo?.roadmaps && classInfo.roadmaps.length > 0 ? (
              <Accordion variant="splitted" className="space-y-2">
                {classInfo.roadmaps.map((roadmap, index) => (
                  <AccordionItem
                    key={index}
                    // title={roadmap.name}
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
                    <ListTopicClass currentRole={currentRole} classTopics={roadmap.topics || []}  classId={classId}/>
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
            <div className="py-4">
              {classInfo?.teachers && classInfo.teachers.length > 0 ? (
                <ListMembers
                  teachers={classInfo.teachers}
                  students={classInfo.students || []}
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
          {
            currentRole && currentRole === USER_ROLE.TEACHER && (
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
            )
          }
          {/* {isManager && (
          <Tab
            key="admin"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:settings" />
                <span>Quản lý</span>
                {listWaiting.length > 0 && (
                  <Badge
                    color="danger"
                    content={listWaiting.length}
                    shape="circle"
                  >
                    <span className="w-4 h-4"></span>
                  </Badge>
                )}
              </div>
            }
          >
            <ClubManagement
              club={club}
              refeshClub={async () => {
                setIsLoading(true);
                await refeshClub();
              }}
              membersWaiting={members}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              onApproveJoin={handleOnApproveMember}
              onRejectJoin={handleRejectMember}
            />
          </Tab>
        )} */}

          {/* Add more tabs as needed */}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ClassRoomPage;
