'use client';
import React from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Avatar, Spinner, Select, SelectItem,
  Pagination, Card, CardHeader, CardBody
} from '@heroui/react';
import { Icon } from '@iconify/react';

type UserWithClerk = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

const ROLE_CHIP_COLOR: Record<string, any> = {
  admin: 'danger',
  teacher: 'primary',
  staff: 'secondary',
  anonymus: 'warning',
};

type Props = {
  title: string;
  users: UserWithClerk[];
  loading?: boolean;
  onEdit: (u: UserWithClerk) => void;
};

type State = {
  page: number;
  rowsPerPage: number;
  rowsPerPageKey: Set<string>;
};

export default class RoleUserTable extends React.PureComponent<Props, State> {
  state: State = {
    page: 1,
    rowsPerPage: 10,
    rowsPerPageKey: new Set(['10']),
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.users !== this.props.users || prevState.rowsPerPage !== this.state.rowsPerPage) {
      if (this.state.page !== 1) this.setState({ page: 1 });
    }
  }

  handleRowsChange = (keys: any) => {
    const first = Array.from(keys as Set<string>)[0];
    const n = Number(first);
    this.setState({ rowsPerPage: n, rowsPerPageKey: new Set([String(n)]) });
  };

  renderRoleChip(role?: string) {
    const r = (role || '').toLowerCase();
    const color = ROLE_CHIP_COLOR[r] ?? 'default';
    const label = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown';
    return <Chip color={color} variant="flat" size="sm" className="capitalize">{label}</Chip>;
  }

  render() {
    const { title, users, loading, onEdit } = this.props;
    const { page, rowsPerPage, rowsPerPageKey } = this.state;

    const pages = Math.max(1, Math.ceil(users.length / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const items = users.slice(start, start + rowsPerPage);

    return (
      <Card className="h-full overflow-visible">
        <CardHeader className="flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <div className="flex items-center gap-2">
   
            <span className="text-sm text-default-500">Tổng: <b>{users.length}</b></span>
          </div>
        </CardHeader>

        {/* Không scroll: để body “thở”, tránh cắt nội dung */}
        <CardBody className="overflow-visible">
          <Table
            aria-label={title}
            isHeaderSticky={false}
            removeWrapper
            classNames={{
              base: 'w-full',
              table: 'min-w-full table-fixed',         // bảng chiếm full, layout cố định
              th: 'whitespace-nowrap',
              td: 'align-middle',
            }}
          >
            <TableHeader>
              <TableColumn className="w-[35%]">User</TableColumn>
              <TableColumn className="w-[20%]">Role</TableColumn>
              {/* w-[1%] + whitespace-nowrap giúp cột luôn đủ chỗ cho nút */}
              <TableColumn className="w-[10%] text-right whitespace-nowrap">Thao tác</TableColumn>
            </TableHeader>

            <TableBody
              items={items}
              isLoading={!!loading}
              loadingContent={<div className="flex items-center gap-2"><Spinner size="sm" /> Đang tải…</div>}
              emptyContent={loading ? ' ' : 'Không có user nào'}
            >
              {(user: UserWithClerk) => {
                const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '—';
                const initials = (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '');
                return (
                  <TableRow key={user.id}>
                    <TableCell className="truncate">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          name={fullName}
                          showFallback
                          fallback={<span className="text-xs">{initials || 'U'}</span>}
                          className="shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate">{fullName}</span>
                          <span className="text-default-500 text-sm truncate">{user.email}</span>
                        </div>
                      </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                            {this.renderRoleChip(user.role)}
                        </TableCell>

                        <TableCell className="text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2 shrink-0">
                             

                                {/* Chỉ hiện nếu không phải admin */}
                                {user.role?.toLowerCase() !== 'admin' && (
                                    <Button
                                        size="sm"
                                        color="primary"
                                        variant="solid"
                                        startContent={<Icon icon="lucide:edit" />}
                                        className="shrink-0"
                                        onClick={() => onEdit(user)}
                                    >
                                        Cập nhật
                                    </Button>
                                )}
                            </div>
                        </TableCell>

                    </TableRow>
                );
              }}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-default-500">Trang <b>{page}</b> / <b>{pages}</b></div>
            <Pagination
              page={page}
              total={pages}
              onChange={(p) => this.setState({ page: p })}
              showControls
              className="justify-end"
            />
          </div>
        </CardBody>
      </Card>
    );
  }
}
