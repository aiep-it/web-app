"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Spacer,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
} from "@heroui/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "@iconify/react";

import RoleDistributionCard from "./components/RoleDistributionCard";
import KpiCard from "./components/KpiCard";
import SectionCard from "./components/SectionCard";
import RecentClassesSection from "./components/RecentClassesSection";

// ⬇️ NEW: dùng services thay vì fetch
import { getAllStats } from "@/services/stats";
import type {
  RangeKey,
  ClassesRes,
  StudentsRes,
  TeachersRes,
} from "@/services/types/stats";

function formatCurrencyVND(n: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n.toLocaleString()} đ`;
  }
}

export default function AdminDashboard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // KPI
  const [studentsTotal, setStudentsTotal] = useState(0);
  const [teachersTotal, setTeachersTotal] = useState(0);
  const [classesTotal, setClassesTotal] = useState(0);

  // Charts
  const [lineData, setLineData] = useState<{ date: string; active: number }[]>(
    []
  );
  const [barData, setBarData] = useState<{ name: string; classes: number }[]>(
    []
  );

  // Table (recent classes)
  const [recentClasses, setRecentClasses] = useState<
    {
      id: string;
      name: string;
      level?: string;
      teacher: string;
      students: number;
      startDate: string;
      status: string;
    }[]
  >([]);

  const filteredClasses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recentClasses;
    return recentClasses.filter((c) =>
      `${c.name} ${c.teacher} ${c.level}`.toLowerCase().includes(q)
    );
  }, [search, recentClasses]);

  // Giữ 1 AbortController cho mỗi lần load
  const abortRef = useRef<AbortController | null>(null);

  // ⬇️ NEW: dùng getAllStats từ service
  const fetchAll = async (currentRange: RangeKey) => {
    setLoading(true);
    setError(null);
    abortRef.current?.abort(); // hủy request cũ nếu còn
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { students, teachers, classes } = await getAllStats(
        currentRange,
        8,
        controller.signal
      );

      // KPI
      setStudentsTotal(students?.total ?? 0);
      setTeachersTotal(teachers?.total ?? 0);
      setClassesTotal(classes?.total ?? 0);

      // Charts
      setLineData((students?.series || []).map((p) => ({ date: p.label, active: p.value })));
      setBarData((classes?.series || []).map((p) => ({ name: p.label, classes: p.value })));

      // Recent classes
      setRecentClasses(
        (classes?.recent || []).map((c) => ({
          id: c.id,
          name: c.name,
          level: c.level,
          teacher: (c.teacherNames && c.teacherNames[0]) || "-",
          students: c.studentCount ?? 0,
          startDate: new Date(c.createdAt).toLocaleDateString("vi-VN"),
          status: "Active",
        }))
      );
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message || "Load dữ liệu thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(range);
    return () => abortRef.current?.abort();
  }, [range]);

  // (Optional) nếu cần: có thể truyền data thật vào RoleDistributionCard qua props
  // hiện tại component đó tự handle nên giữ nguyên.

  return (
    <div className="min-h-screen w-full p-6 md:p-8 lg:p-10 bg-gradient-to-b from-white to-default-50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-default-500">
            Tổng quan hoạt động trung tâm và hệ thống (live)
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm lớp/giáo viên..."
            startContent={<Icon icon="mdi:magnify" />}
            className="w-60"
          />

          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="rounded-xl">
                {range.toUpperCase()} ▼
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select range"
              onAction={(key) => setRange(key as RangeKey)}
              selectedKeys={[range]}
              selectionMode="single"
            >
              <DropdownItem key="7d">7D</DropdownItem>
              <DropdownItem key="30d">30D</DropdownItem>
              <DropdownItem key="90d">90D</DropdownItem>
              <DropdownItem key="365d">365D</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button
            color="primary"
            className="rounded-xl"
            onClick={() => fetchAll(range)}
            disabled={loading}
          >
            <Icon icon="mdi:refresh" className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Spacer y={6} />

      {error ? (
        <Card className="border border-danger-200 bg-danger-50/30">
          <CardBody>
            <p className="text-danger-600">{error}</p>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon="mdi:account-group"
          label="Tổng học sinh"
          value={studentsTotal.toLocaleString()}
          sub={`Range: ${range.toUpperCase()}`}
          accent="blue"
        />
        <KpiCard
          icon="mdi:google-classroom"
          label="Tổng lớp học"
          value={classesTotal.toLocaleString()}
          sub={`Range: ${range.toUpperCase()}`}
          accent="purple"
        />
        <KpiCard
          icon="mdi:teach"
          label="Giáo viên"
          value={teachersTotal.toLocaleString()}
          sub={`Range: ${range.toUpperCase()}`}
          accent="green"
        />
      </div>

      <Spacer y={6} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard title="Học sinh mới theo kỳ (proxy Active)">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active"
                  name="New Students"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Lớp mới theo kỳ">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                
                />
                <Legend />
                <Bar dataKey="classes" name="Classes"    fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <RoleDistributionCard title="Tỉ lệ vai trò" />
      </div>

      <Spacer y={6} />

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentClassesSection
          range={range}
          loading={loading}
          filteredClasses={filteredClasses}
          fetchAll={fetchAll}
        />
      </div>

      <Spacer y={6} />
    </div>
  );
}
