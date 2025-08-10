'use client';
import EmptySection from '@/components/EmptySection';
import { getMyClasses } from '@/services/class';
import { ClassResponse, UserClass } from '@/services/types/class';
import { CustomButton, LoadingSpinner } from '@/shared/components';
import React, { useEffect } from 'react';
import ClassCard from './ClassCard';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ListClassroom = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const [classes, setClasses] = React.useState<UserClass[]>([]);
  const fetchAllMyClasses = async () => {
    setIsLoading(true);
    const res = await getMyClasses();
    if (res && res.length > 0) {
      setClasses(res);
    } else {
      setClasses([]);
      toast.error('Failed to fetch classes. Please try again later.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllMyClasses();
  }, []);
  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Workspace</h1>
        <p className="text-gray-600 mb-6">
          Manage your vocabulary and learning resources here.
        </p>

        {/* New Folder Button using CustomButton */}
        <CustomButton
          preset="primary"
          icon="lucide:square-plus"
          iconSize={20}
          onPress={() => {}}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
        >
          Join By Code
        </CustomButton>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 pb-8">
        <div className="space-y-6">
          <div className="mb-6 text-center mt-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your Classes
            </h2>
            <p className="text-gray-600">Enter Class and start learn</p>
          </div>

          <div className="space-y-8">
            {isLoading ? (
              <LoadingSpinner.Page label="Loading your workspace..." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.length ? (
                  classes.map((clazz) => (
                    <ClassCard key={clazz.id} classInfo={clazz}  />
                  ))
                ) : (
                  <EmptySection
                    title="No Classes Found"
                    message="You have not joined any classes yet."
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListClassroom;
