'use client';
import React from 'react';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/constant/api';
import { updateRole } from '@/services/user';
import RoleUserTable from '../components/RoleUserTable';

type UserWithClerk = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

type State = {
  users: UserWithClerk[];
  search: string;
  fetching: boolean;
  isOpen: boolean;
  selectedUser: UserWithClerk | null;
  newRole: Set<string>;
};

export default class UserWithClerkTables extends React.Component<{}, State> {
  state: State = {
    users: [],
    search: '',
    fetching: false,
    isOpen: false,
    selectedUser: null,
    newRole: new Set([]),
  };

  componentDidMount() {
    this.fetchUsers();
  }

  async fetchUsers() {
    this.setState({ fetching: true });
    try {
      const res = await axiosInstance.get(ENDPOINTS.AUTHEN.WITH_CLERK_ID);
      this.setState({ users: res.data || [], fetching: false });
    } catch (err) {
      console.error(err);
      this.setState({ fetching: false });
    }
  }

  openUpdate = (user: UserWithClerk) => {
    this.setState({ selectedUser: user, newRole: new Set([user.role]), isOpen: true });
  };

  handleUpdateRole = async () => {
    const { selectedUser, newRole } = this.state;
    if (!selectedUser) return;
    const role = Array.from(newRole)[0] || selectedUser.role;
    await updateRole({ userId: selectedUser.id, role });
    await this.fetchUsers();
    this.setState({ isOpen: false });
  };

  render() {
    const { users, search, fetching, selectedUser, newRole, isOpen } = this.state;
    const q = search.trim().toLowerCase();
    let list = users.filter(u => (u.role || '').toLowerCase() !== 'student');
    if (q) {
      list = list.filter(u => `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''}`.toLowerCase().includes(q));
    }
    const admins = list.filter(u => u.role?.toLowerCase() === 'admin');
    const teachers = list.filter(u => u.role?.toLowerCase() === 'teacher');
    const anonymus = list.filter(u => u.role?.toLowerCase() === 'anonymus');

    return (
      <div className="mt-6 space-y-4">
        <div className="flex justify-between gap-3">
          <Input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => this.setState({ search: e.target.value })}
            startContent={<Icon icon="lucide:search" />}
            className="w-full md:w-96"
          />
          <div className="text-sm text-default-500">Tổng: <b>{list.length}</b></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleUserTable title={`Admin (${admins.length})`} users={admins} loading={fetching} onEdit={()=>{console.log("canupdaterole tếch")}} />
          <RoleUserTable title={`Teacher (${teachers.length})`} users={teachers} loading={fetching} onEdit={this.openUpdate} />
          <RoleUserTable title={`ANONYMUS (${anonymus.length})`} users={anonymus} loading={fetching} onEdit={this.openUpdate} />
        </div>

        {/* Modal update role */}
        <Modal isOpen={isOpen} onOpenChange={(o) => this.setState({ isOpen: o })}>
          <ModalContent>
            <>
              <ModalHeader>Cập nhật vai trò</ModalHeader>
              <ModalBody>
                <div>Email: <b>{selectedUser?.email}</b></div>
                <Select selectedKeys={newRole} onSelectionChange={(keys) => this.setState({ newRole: new Set(keys as Set<string>) })}>
                  <SelectItem key="admin">Admin</SelectItem>
                  <SelectItem key="teacher">Teacher</SelectItem>
                  <SelectItem key="ANONYMUS">ANONYMUS</SelectItem>
                  <SelectItem key="staff">Staff</SelectItem>
                  <SelectItem key="student">Student</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={() => this.setState({ isOpen: false })}>Hủy</Button>
                <Button color="primary" onClick={this.handleUpdateRole}>Lưu</Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>
    );
  }
}
