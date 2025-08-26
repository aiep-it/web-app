"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardHeader, CardBody, Button, Chip, Skeleton } from "@heroui/react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Icon } from "@iconify/react";

type RoleItem = { name: string; value: number; percent?: number };
type ApiResp = { total: number; data: RoleItem[]; generatedAt?: string };

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";
const API_BASE = RAW_BASE.replace(/\/$/, ""); // bỏ "/" cuối nếu có
const COLORS = ["#6366F1","#22C55E","#F59E0B","#EF4444","#06B6D4","#A855F7","#84CC16","#F97316"];

export type RoleDistributionCardProps = {
  title?: string;
  height?: number | string; // 280 | "280px"
  className?: string;
  range?: "7d" | "30d" | "90d" | "365d";
};

export default function RoleDistributionCard({
  title = "Phân bố người dùng theo vai trò",
  height = 280,
  className,
  range = "30d",
}: RoleDistributionCardProps) {
  const [data, setData] = useState<RoleItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/stats/users/role-distribution?range=${range}`;
      const res = await fetch(url, { signal, cache: "no-store", headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResp = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);
      setUpdatedAt(json.generatedAt ?? null);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
    return () => ac.abort();
  }, [fetchData, refreshKey]);

  // Nếu BE không trả percent thì tính tạm ở FE
  const chartData = useMemo(() => {
    if (!data) return [];
    if (data.length && data[0].percent !== undefined) return data;
    const t = total || data.reduce((s, d) => s + d.value, 0);
    return data.map(d => ({ ...d, percent: t ? +(d.value * 100 / t).toFixed(2) : 0 }));
  }, [data, total]);

  // Formatter cho tooltip (value + %)
  const tooltipFormatter = (value: number, _name: string, item: any) => {
    const pct = item?.payload?.percent ?? 0;
    return [`${value} (${pct}%)`, item?.payload?.name];
  };

  return (
    <Card className={`rounded-2xl shadow-md ${className ?? ""}`} aria-label="Biểu đồ phân bố vai trò người dùng">
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {!loading && <Chip size="sm" variant="flat" color="default">Tổng: {total}</Chip>}
          {!loading && updatedAt && (
            <Chip size="sm" variant="flat" color="default" className="hidden md:inline-flex">
              Cập nhật: {new Date(updatedAt).toLocaleTimeString()}
            </Chip>
          )}
        </div>
        <Button
          size="sm"
          variant="flat"
          startContent={<Icon icon="mdi:refresh" width={18} height={18} />}
          isDisabled={loading}
          onPress={() => setRefreshKey(k => k + 1)}
        >
          Làm mới
        </Button>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div style={{ height }} className="w-full">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ) : error ? (
          <div style={{ height }} className="flex w-full items-center justify-center text-sm text-danger">
            Lỗi tải dữ liệu: {error}
          </div>
        ) : !chartData.length ? (
          <div style={{ height }} className="flex w-full items-center justify-center text-sm text-foreground-500">
            Không có dữ liệu
          </div>
        ) : (
          <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip formatter={tooltipFormatter as any} />
                <Legend />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
