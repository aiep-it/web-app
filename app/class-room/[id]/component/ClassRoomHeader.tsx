import { ClassResponse } from '@/services/types/class';
import { getCmsAssetUrl } from '@/utils';
import { Avatar, Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

interface ClassRoomHeaderProps {
  classInfo?: ClassResponse | null;
}
const ClassRoomHeader: React.FC<ClassRoomHeaderProps> = ({ classInfo }) => {
  return (
    <Card className="shadow-sm">
      <CardBody className="p-0">
        <div className="relative">
          <img
            src={
              //   club.coverImage
              //     ? getCmsAssetUrl(club.coverImage)
              //     :
              getCmsAssetUrl('306e57e3-7929-4a7f-8f36-7c29e04d4c82')
            }
            alt={classInfo?.name || 'Class Cover Image'}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={
                  //   club.logo
                  //     ? getCmsAssetUrl(club.logo)
                  //     :
                  getCmsAssetUrl('4b0307c7-c4b7-46ed-9bf8-7aeeab42bae8')
                }
                size="lg"
                className="border-2 border-white"
              />
              <div className="flex flex-column">
                <h1 className="text-white text-3xl font-bold">
                  {classInfo?.name || '-'}
                </h1>
                <span className="text-white/60 text-small">
                  {classInfo?.description || '-'}
                </span>
              </div>
            </div>
            <div className="flex text-white/90 mt-2 justify-between">
              <div className="flex items-center">
                <Icon icon="lucide:circle-gauge" className="mr-1" />
                <Chip color="primary" variant="solid">
                  <span>{classInfo?.level || '-'}</span>
                </Chip>
                <div className="mx-2 h-4 w-px bg-white/30" />
                <Icon icon="lucide:users" className="mr-1" />
                <span>{classInfo?.students?.length || 0} members</span>
                <div className="mx-2 h-4 w-px bg-white/30" />
                <Icon icon="lucide:user" className="mr-1" />
                <span>
                  {classInfo?.teachers && classInfo.teachers.length > 0
                    ? classInfo.teachers[0].fullName || classInfo.teachers[0].email
                    : '-'}
                </span>
              </div>
              {/* <div className="flex items-center gap-2 mr-15 float-end">
                    {!isJoined && (
                      <>
                        <Button
                          color="secondary"
                          disabled={isWaiting}
                          onPress={requestJoin}
                          startContent={<Icon icon={'lucide:users-round'} />}
                        >
                          {isWaiting ? 'Đợi Duyệt' : 'Tham Gia CLB'}
                        </Button>
    
                        {!isWaiting && (
                          <>
                            <Button
                              color="success"
                              variant="ghost"
                              startContent={<Icon icon={'lucide:plus'} />}
                            >
                              {' '}
                              Mời{' '}
                            </Button>
                            <Button
                              color="primary"
                              startContent={
                                <Icon icon={'lucide:square-arrow-out-up-right'} />
                              }
                            >
                              {' '}
                              Chia Sẻ{' '}
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div> */}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ClassRoomHeader;
