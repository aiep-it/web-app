import { CONTENT } from '@/constant/content';
import { UserClass } from '@/services/types/class';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import React from 'react';
interface ClassCardProps {
  classInfo: UserClass;
}
const ClassCard: React.FC<ClassCardProps> = ({ classInfo }) => {
  const router = useRouter();

  const handleEnterClass = () => {
    router.push(`/class-room/${classInfo.id}`);
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Topic Image */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
        <img
          src={
          
            CONTENT.CLASS_COVER_IMAGE
          }
          alt={classInfo.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />

        {/* Gradient Fallback */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white"
          style={{ display: 'none' }}
        >
          <div className="text-center">
            <Icon
              icon="material-symbols:quiz"
              className="text-4xl mb-1 mx-auto opacity-80"
            />
            <div className="text-sm font-semibold opacity-90">
              {classInfo.name}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-green-500/90 text-white`}
          >
            {classInfo.level}
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            <Icon
              icon="material-symbols:signal-cellular-alt"
              className="text-orange-300 text-sm"
            />
            <span>Level {classInfo.level}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-800 text-medium mb-2 line-clamp-2">
          {classInfo.name}
        </h3>

        {/* Description */}
        {classInfo.description ? (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {classInfo.description}
          </p>
        ) : (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            No description for this topic.
          </p>
        )}

        {/* Action Button */}
        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
          size="sm"
          onPress={() => {handleEnterClass()}}
        >
          <Icon icon="material-symbols:play-arrow" className="mr-1" />
          Enter
        </Button>
      </div>
    </div>
  );
};

export default ClassCard;
