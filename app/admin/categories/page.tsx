'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@heroui/button';
import { toast } from 'react-hot-toast';
import BaseCard from '@/components/card/BaseCard';
import { Icon } from '@iconify/react';
import CTable from '@/components/CTable';
import {
  addToast,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@heroui/react';
import { Key, Selection } from '@react-types/shared';
import AdminPageHeader from '@/components/AdminPageHeader';
import FormAddCategory, { FormAddCategoryRef } from './addcategories/Form';
import ButtonConfirm from '@/components/ButtonConfirm';
import { getAllCategories } from '@/services/category';
import { Category } from '@/services/types/category';

const column = [
  { uid: 'name', name: 'Tên', sortable: true },
  { uid: 'description', name: 'Mô Tả', sortable: false },
  { uid: 'type', name: 'Kiểu', sortable: false },
  { uid: 'actions', name: 'Actions', sortable: false },
];

const CategoryListPage = () => {
  const { getToken } = useAuth();
  
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formRef = useRef<FormAddCategoryRef>(null);

  const fetchCategories = async () => {
  
    const res = await getAllCategories();
    setCategories(res);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      const backendUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
      const res = await fetch(`${backendUrl}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Xoá thất bại');

      toast.success('Đã xoá category');
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      toast.error('Lỗi khi xoá category');
    }
  };
  const handleSearchChange = (value: string) => {
    // debouncedSearch(value);
  };

  useEffect(() => {
  
      fetchCategories();
   
  }, []);



  return (
    <div className="min-h-screen dark:bg-black text-foreground p-6">
      <AdminPageHeader
        title="Phân Loại"
        icon="book-plus"
        subTitle="Phân Loại"
        onSearch={() => {}}
        onSort={() => {}}
        onChangeView={setIsGridView}
        addRecord={onOpen}
        onRefesh={fetchCategories}
      />
      {isGridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <BaseCard
              key={cat.id}
              id={cat.id}
              name={cat.name}
              description={cat.description}
              onDelete={handleDelete}
              editUrl={`categories/${cat.id}/edit`}
              viewUrl={`/admin/roadmaps`}
            />
          ))}
        </div>
      ) : (
        <Table
          isHeaderSticky
          aria-label="Loại"
          bottomContentPlacement="outside"
          classNames={{
            wrapper: 'max-h-[100%]',
          }}
          selectionBehavior="toggle"
          selectionMode="multiple"
        >
          <TableHeader columns={column}>
            {(column) => (
              <TableColumn key={column.uid as string} align="start">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="No data found" items={categories}>
            {(category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.type}</TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Edit user"
                  >
                    <Icon icon="lucide:edit" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    aria-label="Delete user"
                  >
                    <Icon icon="lucide:trash" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thêm Loại
              </ModalHeader>
              <ModalBody>
                <FormAddCategory
                  ref={formRef}
                  onSuccess={() => {
                    addToast({
                      title: 'Lưu Thành Công',
                      color: 'success',
                    });
                    onClose();
                    fetchCategories();
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <ButtonConfirm
                  endContent={<Icon icon="lucide:send-horizontal" />}
                  color="primary"
                  onSave={async () => {
                    await formRef.current?.submit();
                  }}
                  saveButtonText="Lưu"
                  disabled={false}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoryListPage;
