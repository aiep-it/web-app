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
  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'STARTERS': return 'primary';
      case 'MOVERS': return 'secondary';
      case 'FLYERS': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card key={class_.id} className="w-full hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <CardBody className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-default-900">{class_.name}</h3>
            <p className="text-default-500 text-sm font-medium">{class_.code}</p>
          </div>
          <Chip
            color={getLevelColor(class_.level)}
            variant="flat"
            size="sm"
            className="px-3 py-1 text-xs font-semibold"
          >
            {class_.level}
          </Chip>
        </div>

        <hr className="border-t border-default-200" />

        <div>
          <h5 className="font-semibold text-default-700 mb-2 flex items-center gap-1 ">
            <Icon icon="lucide:users" className="text-default-500" /> Teachers:
          </h5>
          <div className="flex flex-wrap gap-2">
            {class_.teachers && class_.teachers.length > 0 ? (
              class_.teachers.map((teacher) => (
                <Chip key={teacher.id} variant="flat" size="lg"  className="pr-2 ">
                  {teacher.fullName}
                </Chip>
              ))
            ) : (
              <Chip variant="flat" size="sm" color="default">No Teachers Assigned</Chip>
            )}
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-default-700 mb-2 flex items-center gap-1">
            <Icon icon="lucide:map" className="text-default-500" /> Topics:
          </h5>
          <div className="flex flex-wrap gap-2">
            {class_.roadmaps && class_.roadmaps.length > 0 ? (
              class_.roadmaps.map((roadmap) => (
                <Chip key={roadmap.id} variant="flat" color="secondary" size="lg">
                  {roadmap.name}
                </Chip>
              ))
            ) : (
              <Chip variant="flat" size="sm" color="default">No Topics Defined</Chip>
            )}
          </div>
        </div>

        {class_.description && (
          <p className="text-sm text-default-600 leading-relaxed pt-2 border-t border-default-200">
            {class_.description}
          </p>
        )}
      </CardBody>
      <CardFooter className="flex flex-wrap justify-center gap-1 border-t border-default-200 p-3">
        <Tooltip content="View Class Details">
          <Button size="sm" isIconOnly variant="light" color="primary" onPress={() => onViewDetails(class_.id)}>
            <Icon icon="lucide:eye" />
          </Button>
        </Tooltip>
        <Tooltip content="Edit Class Information">
          <Button size="sm" isIconOnly variant="light" color="warning" onPress={() => onEditClass(class_.id)}>
            <Icon icon="lucide:edit" />
          </Button>
        </Tooltip>
        <Tooltip content="Manage Teachers">
          <Button size="sm" isIconOnly variant="light" color="success" onPress={() => onManageTeachers(class_.id)}>
            <Icon icon="lucide:user-cog" />
          </Button>
        </Tooltip>
        <Tooltip content="Manage Students">
          <Button size="sm" isIconOnly variant="light" color="secondary" onPress={() => onManageStudents(class_.id)}>
            <Icon icon="lucide:users" />
          </Button>
        </Tooltip>
        <Tooltip content="Delete Class" color="danger">
          <Button size="sm" isIconOnly variant="light" color="danger" onPress={() => onDeleteClass(class_)}>
            <Icon icon="lucide:trash-2" />
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default ClassCard;
