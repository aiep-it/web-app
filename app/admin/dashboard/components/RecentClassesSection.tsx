"use client";

import React, { Component, ReactNode } from "react";
import {
  Button,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Avatar, Badge, Chip, Skeleton,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import SectionCard from "./SectionCard";

type RangeKey = "7d" | "30d" | "90d" | "365d";
type ClassStatus = "Active" | "Upcoming" | "Completed" | "Paused" | string;

export type ClassItem = {
  id: string;
  name: string;
  level?: string;
  teacher: string;
  students: number;
  startDate: string; // ISO hoặc đã format sẵn
  status: ClassStatus;
};

type RecentClassesProps = {
  title?: string;
  range: RangeKey;
  loading: boolean;
  filteredClasses: ClassItem[];
  fetchAll: (range: RangeKey) => Promise<void>;
  actionExtra?: ReactNode;
};

class RecentClassesSection extends Component<RecentClassesProps> {
  static defaultProps = {
    title: "Lớp gần đây",
  };

  handleReload = () => {
    const { fetchAll, range } = this.props;
    fetchAll(range);
  };

  // Màu & icon trạng thái
renderStatusBadge(status: ClassStatus) {
  const map: Record<
    string,
    { color: "success" | "primary" | "default" | "warning" | "danger"; icon: string; label: string }
  > = {
    Active:    { color: "success", icon: "mdi:check-circle",   label: "Active" },
    Upcoming:  { color: "primary", icon: "mdi:clock-outline",  label: "Upcoming" },
    Completed: { color: "default", icon: "mdi:flag-checkered", label: "Completed" },
    Paused:    { color: "warning", icon: "mdi:pause-circle",   label: "Paused" },
  };
  const conf = map[status] ?? { color: "default" as const, icon: "mdi:help-circle", label: String(status) };

  return (
    <Chip
      size="sm"
      variant="flat"
      color={conf.color}
      className="rounded-lg px-2 py-0.5 h-6"
      startContent={<Icon icon={conf.icon} className="text-base" />}
    >
      {conf.label}
    </Chip>
  );
}

  // Chip Level (nếu có)
  renderLevel(level?: string) {
    if (!level) return <span className="text-xs text-default-400">Level: -</span>;
    const tone =
      level?.toUpperCase().includes("START") ? "success" :
      level?.toUpperCase().includes("MOVE")  ? "primary" :
      level?.toUpperCase().includes("FLY")   ? "warning" : "default";
    return (
      <Chip size="sm" variant="flat" color={tone as any} className="h-5">
        {level}
      </Chip>
    );
  }

  render() {
    const { title, loading, filteredClasses, actionExtra, range } = this.props;

    // số hàng skeleton khi loading
    const skeletonRows = Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={`sk-${i}`}>
        <TableCell><Skeleton className="h-4 w-16 rounded-md" /></TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-28 rounded-md" /></TableCell>
        <TableCell><Skeleton className="h-4 w-10 rounded-md" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20 rounded-md" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24 rounded-md" /></TableCell>
      </TableRow>
    ));

    return (
      <SectionCard
        title={title!}
        action={
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="flat" color="secondary" className="uppercase tracking-wide">
              {range}
            </Chip>
            {actionExtra}
            <Button
              size="sm"
              variant="flat"
              className="rounded-xl"
              onClick={this.handleReload}
              isDisabled={loading}
              startContent={<Icon icon="mdi:refresh" className="text-lg" />}
            >
              Tải lại
            </Button>
          </div>
        }
      >
        <Table
          removeWrapper
          aria-label="Recent classes"
          isHeaderSticky
          classNames={{
            table: "rounded-2xl overflow-hidden",
            th: "bg-default-100 text-default-600 text-xs font-semibold",
            tr: "data-[odd=true]:bg-default-50", // zebra
            td: "align-middle",
          }}
        >
          <TableHeader>
            <TableColumn className="w-[88px]">MÃ</TableColumn>
            <TableColumn>LỚP</TableColumn>
            <TableColumn className="min-w-[160px]">GIÁO VIÊN</TableColumn>
            <TableColumn className="w-[80px] text-right">HS</TableColumn>
            <TableColumn className="w-[140px]">BẮT ĐẦU</TableColumn>
            <TableColumn className="w-[140px]">TRẠNG THÁI</TableColumn>
          </TableHeader>

          <TableBody
            emptyContent={loading ? undefined : "Không có dữ liệu"}
          >
            {loading
              ? skeletonRows
              : filteredClasses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-default-700">{c.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                      
                        <div className="min-w-0">
                          <div className="font-medium truncate">{c.name}</div>
                          <div className="mt-0.5">{this.renderLevel(c.level)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar size="sm" name={c.teacher} className="hidden sm:inline-flex" />
                        <span className="truncate">{c.teacher}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{c.students}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-default-700">
                        <Icon icon="mdi:calendar-outline" className="text-base" />
                        <span>{c.startDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>{this.renderStatusBadge(c.status)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </SectionCard>
    );
  }
}

export default RecentClassesSection;
