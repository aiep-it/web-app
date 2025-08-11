// components/class/ClassCard.tsx
import React from 'react';
import { Card, CardBody, CardFooter, Chip, Tooltip, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ClassResponse } from '@/services/types/class'; // Import ClassResponse type

interface ClassCardProps {
  class_: ClassResponse;
  onViewDetails: (classId: string) => void;
  onEditClass: (classId: string) => void;
  onManageTeachers: (classId: string) => void;
  onManageStudents: (classId: string) => void;
  onDeleteClass: (classItem: ClassResponse) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  class_,
  onViewDetails,
  onEditClass,
  onManageTeachers,
  onManageStudents,
  onDeleteClass,
}) => {
  const getLevelBadgeColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'STARTERS': return 'primary';
      case 'MOVERS': return 'secondary';
      case 'FLYERS': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card className="w-full hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white border border-gray-100 overflow-hidden group">
      {/* Header with gradient background */}
      <div className="relative h-20 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-6 -translate-x-6"></div>
        </div>

        {/* Level badge */}
        <div className="absolute top-3 right-3">
          <Chip
            color={getLevelBadgeColor(class_.level)}
            variant="flat"
            size="sm"
            className="bg-white/90 backdrop-blur-sm text-xs font-bold shadow-sm"
          >
            {class_.level}
          </Chip>
        </div>

        {/* Class icon */}
        <div className="absolute bottom-3 left-4">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Icon icon="lucide:graduation-cap" className="text-white text-lg" />
          </div>
        </div>
      </div>

      <CardBody className="p-6 space-y-5">
        {/* Class info */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            {class_.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="lucide:hash" className="text-xs" />
            <span className="font-medium">{class_.code}</span>
          </div>
        </div>

        {/* Teachers section */}
        <div>
          <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon icon="lucide:users" className="text-blue-600 text-xs" />
            </div>
            Teachers ({class_.teachers?.length || 0})
          </h5>
          <div className="flex flex-wrap gap-2">
            {class_.teachers && class_.teachers.length > 0 ? (
              class_.teachers.map((teacher) => (
                <Chip 
                  key={teacher.id} 
                  variant="flat" 
                  color="primary"
                  size="sm"
                  className="text-xs font-medium"
                >
                  {teacher.fullName}
                </Chip>
              ))
            ) : (
              <Chip variant="flat" size="sm" color="default" className="text-xs">
                No Teachers Assigned
              </Chip>
            )}
          </div>
        </div>

        {/* Topics section */}
        <div>
          <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <Icon icon="lucide:book-open" className="text-purple-600 text-xs" />
            </div>
            Topics ({class_.roadmaps?.length || 0})
          </h5>
          <div className="flex flex-wrap gap-2">
            {class_.roadmaps && class_.roadmaps.length > 0 ? (
              class_.roadmaps.slice(0, 3).map((roadmap) => (
                <Chip 
                  key={roadmap.id} 
                  variant="flat" 
                  color="secondary" 
                  size="sm"
                  className="text-xs font-medium"
                >
                  {roadmap.name}
                </Chip>
              ))
            ) : (
              <Chip variant="flat" size="sm" color="default" className="text-xs">
                No Topics Defined
              </Chip>
            )}
            {class_.roadmaps && class_.roadmaps.length > 3 && (
              <Chip variant="flat" size="sm" color="default" className="text-xs">
                +{class_.roadmaps.length - 3} more
              </Chip>
            )}
          </div>
        </div>

        {/* Description */}
        {class_.description && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {class_.description}
            </p>
          </div>
        )}
      </CardBody>

      <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-4">
        <div className="flex flex-wrap justify-center gap-2 w-full">
          <Tooltip content="View Details">
            <Button 
              size="sm" 
              isIconOnly 
              variant="flat" 
              color="primary" 
              className="hover:scale-110 transition-transform"
              onPress={() => onViewDetails(class_.id)}
            >
              <Icon icon="lucide:eye" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Edit Class">
            <Button 
              size="sm" 
              isIconOnly 
              variant="flat" 
              color="warning" 
              className="hover:scale-110 transition-transform"
              onPress={() => onEditClass(class_.id)}
            >
              <Icon icon="lucide:edit" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Manage Teachers">
            <Button 
              size="sm" 
              isIconOnly 
              variant="flat" 
              color="success" 
              className="hover:scale-110 transition-transform"
              onPress={() => onManageTeachers(class_.id)}
            >
              <Icon icon="lucide:user-cog" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Manage Students">
            <Button 
              size="sm" 
              isIconOnly 
              variant="flat" 
              color="secondary" 
              className="hover:scale-110 transition-transform"
              onPress={() => onManageStudents(class_.id)}
            >
              <Icon icon="lucide:users" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Delete Class" color="danger">
            <Button 
              size="sm" 
              isIconOnly 
              variant="flat" 
              color="danger" 
              className="hover:scale-110 transition-transform"
              onPress={() => onDeleteClass(class_)}
            >
              <Icon icon="lucide:trash-2" />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClassCard;
