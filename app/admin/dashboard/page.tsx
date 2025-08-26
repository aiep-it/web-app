"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Chip,
  Spacer,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Badge,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Icon } from "@iconify/react";
import RoleDistributionCard from "./components/RoleDistributionCard";
import KpiCard from "./components/KpiCard";
import SectionCard from "./components/SectionCard";
import RecentClassesSection from "./components/RecentClassesSection";


type RangeKey = "7d" | "30d" | "90d" | "365d";

type SeriesPoint = { label: string; value: number };

type StudentsRes = {
  total: number;
  activate?: number;
  deactivate?: number;
  series: SeriesPoint[];
};

type TeachersRes = {
  total: number;
  series: SeriesPoint[];
};

type ClassRecent = {
  id: string;
  name: string;
  code?: string;
  level?: string;
  description?: string;
  createdAt: string;
  teacherNames?: string[];
  studentCount?: number;
  roadmapCount?: number;
};

type ClassesRes = {
  total: number;
  series: SeriesPoint[];
  recent: ClassRecent[];
};



const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

function formatCurrencyVND(n: number) {
  try {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n.toLocaleString()} đ`;
  }
}



export default function AdminDashboard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // live data
  const [studentsTotal, setStudentsTotal] = useState(0);
  const [teachersTotal, setTeachersTotal] = useState(0);
  const [classesTotal, setClassesTotal] = useState(0);

  const [lineData, setLineData] = useState<{ date: string; active: number }[]>([]);
  const [barData, setBarData] = useState<{ name: string; classes: number }[]>([]);
  const [recentClasses, setRecentClasses] = useState<
    { id: string; name: string; level?: string; teacher: string; students: number; startDate: string; status: string }[]
  >([]);

  const filteredClasses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recentClasses;
    return recentClasses.filter((c) => `${c.name} ${c.teacher} ${c.level}`.toLowerCase().includes(q));
  }, [search, recentClasses]);

  async function fetchAll(currentRange: RangeKey) {
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, teachersRes, classesRes]: [StudentsRes, TeachersRes, ClassesRes] = await Promise.all([
        fetch(`${API_BASE}/stats/students?range=${currentRange}`).then((r) => r.json()),
        fetch(`${API_BASE}/stats/teachers?range=${currentRange}`).then((r) => r.json()),
        fetch(`${API_BASE}/stats/classes?range=${currentRange}&limit=8`).then((r) => r.json()),
      ]);

      // KPI
      setStudentsTotal(studentsRes?.total ?? 0);
      setTeachersTotal(teachersRes?.total ?? 0);
      setClassesTotal(classesRes?.total ?? 0);

      // Charts
      setLineData((studentsRes?.series || []).map((p) => ({ date: p.label, active: p.value })));
      setBarData((classesRes?.series || []).map((p) => ({ name: p.label, classes: p.value })));

      
      setRecentClasses(
        (classesRes?.recent || []).map((c) => ({
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
      setError(e?.message || "Load dữ liệu thất bại");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll(range);
  
  }, [range]);

  const roleDistData = [
    { name: "Students", value: studentsTotal },
    { name: "Teachers", value: teachersTotal },
  ];

  return (
    <div className="min-h-screen w-full p-6 md:p-8 lg:p-10 bg-gradient-to-b from-white to-default-50">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
    <p className="text-default-500">Tổng quan hoạt động trung tâm và hệ thống (live)</p>
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

      <Spacer y={error ? 4 : 0} />

      {/* KPI Grid */}
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
  {/* <KpiCard 
    icon="mdi:cash" 
    label="Doanh thu (ước)" 
    value={formatCurrencyVND(studentsTotal * 150000)} 
    sub="Demo tính theo HS * 150k" 
    accent="orange"
  /> */}
</div>


      <Spacer y={6} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard title="Học sinh mới theo kỳ (proxy Active)">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" name="New Students" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Lớp mới theo kỳ">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
               
                <Bar
                  dataKey="classes"
                  name="Classes"
                  radius={[8, 8, 0, 0]}
                  fill="#6366F1"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>


        {/* <SectionCard title="Phân bố người dùng theo vai trò">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={roleDistData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {roleDistData.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard> */}
          <RoleDistributionCard title="Tỉ lệ vai trò" />



      </div>

      <Spacer y={6} />

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* <SectionCard
          title="Lớp gần đây"
          action={<Button size="sm" variant="flat" className="rounded-xl" onClick={() => fetchAll(range)} disabled={loading}>Tải lại</Button>}
        > </SectionCard> */}
          <RecentClassesSection
            range={range}
            loading={loading}
            filteredClasses={filteredClasses}
            fetchAll={fetchAll}
          />

       

        {/* <SectionCard title="Hoạt động mới nhất">
          <ul className="space-y-3">
            {["Đồng bộ thống kê", "Tải dữ liệu", "Kết xuất CSV"].map((t, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-default-100">
                  <Icon icon="mdi:lightning-bolt" className="text-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t}</p>
                  <p className="text-xs text-default-500">{new Date().toLocaleTimeString("vi-VN")} · system</p>
                </div>
                <Button size="sm" variant="light" className="rounded-xl">Chi tiết</Button>
              </li>
            ))}
          </ul>
        </SectionCard> */}

        {/* <SectionCard
          title="Báo cáo nhanh"
          // action={<Button size="sm" variant="flat" className="rounded-xl">Tải CSV</Button>}
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Tổng HS</span>
              <Chip size="sm" color="primary" variant="flat">{studentsTotal.toLocaleString()}</Chip>
            </div>
            <div className="flex items-center justify-between">
              <span>Tổng lớp</span>
              <Chip size="sm" color="success" variant="flat">{classesTotal.toLocaleString()}</Chip>
            </div>
            <div className="flex items-center justify-between">
              <span>Giáo viên</span>
              <Chip size="sm" color="warning" variant="flat">{teachersTotal.toLocaleString()}</Chip>
            </div>
          </div>
        </SectionCard> */}
      </div>

      <Spacer y={6} />

      {/* Footer Actions
      <div className="flex justify-end gap-2">
        <Button className="rounded-2xl" onClick={() => fetchAll(range)} disabled={loading}>
          <Icon icon="mdi:database-sync" className="mr-2" /> Đồng bộ lại
        </Button>
        <Button color="primary" className="rounded-2xl">
          <Icon icon="mdi:plus" className="mr-2" /> Tạo lớp mới
        </Button>
      </div> */}
    </div>
  );
}
