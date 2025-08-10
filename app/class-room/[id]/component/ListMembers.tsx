import { ClassTeacher } from '@/services/types/class';
import { Student } from '@/services/types/student';
import { Avatar, Listbox, ListboxItem, ListboxSection } from '@heroui/react';
import React from 'react';

interface ListMembersProps {
  teachers: ClassTeacher[];
  students: Student[];
}
export const ListboxWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
const ListMembers: React.FC<ListMembersProps> = ({ teachers, students }) => {
  return (
    <ListboxWrapper>
      <Listbox
        classNames={{
          list: 'max-h-[300px] overflow-scroll w-full',
        }}
        defaultSelectedKeys={['1']}
        label="Assigned to"
        selectionMode="multiple"
        variant="flat"
      >
        <ListboxSection showDivider title="Teachers">
          {teachers.map((teacher) => (
            <ListboxItem
              key={teacher.id}
              textValue={teacher.fullName || teacher.email}
            >
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={teacher.fullName || teacher.email}
                  className="shrink-0"
                  size="sm"
                  name={teacher.fullName || teacher.email}
                />
                <div className="flex flex-col">
                  <span className="text-small">{teacher.fullName || '-'}</span>
                  <span className="text-tiny text-default-400">
                    {teacher.email}
                  </span>
                </div>
              </div>
            </ListboxItem>
          ))}
        </ListboxSection>
        <ListboxSection title="Students">
          {students.map((student) => (
            <ListboxItem
              key={student.id}
              textValue={student.fullName || student.username}
            >
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={student.fullName || student.username}
                  className="shrink-0"
                  size="sm"
                  name={student.fullName || student.username}
                />
                <div className="flex flex-col">
                  <span className="text-small">{student.fullName || '-'}</span>
                  <span className="text-tiny text-default-400">
                    {student.username}
                  </span>
                </div>
              </div>
            </ListboxItem>
          ))}
        </ListboxSection>
      </Listbox>
    </ListboxWrapper>
  );
};

export default ListMembers;
