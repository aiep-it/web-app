'use client';
import React, { useEffect, useState } from 'react';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { updateRole } from '@/services/user';
import { ENDPOINTS } from '@/constant/api';
import axiosInstance from '@/lib/axios';

type UserWithClerk = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
};

export default function UserWithClerkTable() {
    const [users, setUsers] = useState<UserWithClerk[]>([]);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserWithClerk | null>(null);
    const [newRole, setNewRole] = useState('');
    const [loading, setLoading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(ENDPOINTS.AUTHEN.WITH_CLERK_ID);
            setUsers(res.data || []);
        } catch (err) {
            console.error('Failed to fetch users with Clerk ID', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenUpdateRole = (user: UserWithClerk) => {
        setSelectedUser(user);
        setNewRole(user.role);
        onOpen();
    };

    const handleUpdateRole = async () => {
        if (!selectedUser) return;
        setLoading(true);
        try {
            await updateRole({ userId: selectedUser.id, role: newRole });
            await fetchUsers();
            onClose();
        } catch (err) {
            console.error('Failed to update role:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = users.filter((u) =>
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm user"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startContent={<Icon icon="lucide:search" className="text-default-400" />}
                    className="w-full max-w-xs"
                />
            </div>

            <Table aria-label="Danh sách user có Clerk ID">
                <TableHeader>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Họ</TableColumn>
                    <TableColumn>Tên</TableColumn>
                    <TableColumn>Vai trò</TableColumn>
                    <TableColumn>Thao tác</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Không có user nào">
                    {filtered.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="light" onClick={() => console.log('Chi tiết:', user)}>
                                        <Icon icon="lucide:eye" className="text-lg" />
                                    </Button>
                                    <Button size="sm" color="primary" variant="light" onClick={() => handleOpenUpdateRole(user)}>
                                        <Icon icon="lucide:edit" className="text-lg" /> Cập nhật vai trò
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* ✅ Modal cập nhật vai trò */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Cập nhật vai trò</ModalHeader>
                            <ModalBody>
                                <p>Email: <b>{selectedUser?.email}</b></p>
                                <div className="space-y-2 mt-2">
                                    <label className="text-sm font-medium">Chọn vai trò mới</label>
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="staff">Nhân viên (staff)</option>
                                        <option value="teacher">Giáo viên (teacher)</option>
                                        <option value="student">Học sinh (student)</option>
                                    </select>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Hủy</Button>
                                <Button
                                    color="primary"
                                    onClick={handleUpdateRole}
                                    isDisabled={loading || newRole === selectedUser?.role}
                                >
                                    {loading ? <Spinner size="sm" /> : 'Lưu'}
                                </Button>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
