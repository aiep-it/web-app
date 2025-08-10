'use client';
import React from 'react';
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Teacher } from '@/services/types/user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClassFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedTeacher: string | null;
  setSelectedTeacher: (value: string | null) => void;
  teachers: Teacher[];
  onAddNewClass: () => void;
}

const ClassFilters: React.FC<ClassFiltersProps> = ({
  search,
  setSearch,
  selectedTeacher,
  setSelectedTeacher,
  teachers,
  onAddNewClass,
}) => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-grow">
        {/* Input tìm kiếm */}
        <Input
          placeholder="Search by class name or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startContent={
            <Icon icon="lucide:search" className="text-default-400" />
          }
          className="w-full max-w-xs"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat">
              {teachers.find((t) => t.id === selectedTeacher)?.fullName ||
                'Filter by Teacher'}
              <Icon icon="lucide:chevron-down" className="ml-2" />
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Teacher filter"
            selectionMode="single"
            selectedKeys={
              selectedTeacher ? new Set([selectedTeacher]) : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setSelectedTeacher(selectedKey === 'all' ? null : selectedKey);
            }}
          >
            <DropdownItem key="all">All Teachers</DropdownItem>
            <>
              {teachers.map((teacher) => (
                <DropdownItem key={teacher.id}>{teacher.fullName}</DropdownItem>
              ))}
            </>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Button
        color="primary"
        onPress={() => router.push(`/admin/classmanage/create`)}
      >
        Add New Class
      </Button>
    </div>
  );
};

export default ClassFilters;
