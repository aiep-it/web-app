// services/stats/index.ts
import axiosInstance from "@/lib/axios";
import { ENDPOINTS } from "@/constant/api";
import type { RangeKey, RoleDistResp, StudentsRes, TeachersRes, ClassesRes } from "../types/stats";
import axios, { AxiosError } from "axios";


function isCanceled(err: unknown) {
  return axios.isCancel(err) || (err as AxiosError)?.code === "ERR_CANCELED";
}


export async function getStudentsStats(
  range: RangeKey,
  signal?: AbortSignal
): Promise<StudentsRes> {
  try {
    const res = await axiosInstance.get<StudentsRes>(ENDPOINTS.STATS.STUDENTS, {
      params: { range },
      signal,
    });
    if (res.status === 200) return res.data;
    return { total: 0, series: [] };
  } catch (err) {
     if (!isCanceled(err)) {
      console.error("Error getRoleDistribution:", err);
    }
    return { total: 0, series: [] };
  }
}

export async function getTeachersStats(
  range: RangeKey,
  signal?: AbortSignal
): Promise<TeachersRes> {
  try {
    const res = await axiosInstance.get<TeachersRes>(ENDPOINTS.STATS.TEACHERS, {
      params: { range },
      signal,
    });
    if (res.status === 200) return res.data;
    return { total: 0, series: [] };
  } catch (err) {
    if (!isCanceled(err)) {
      console.error("Error getRoleDistribution:", err);
    }
    return { total: 0, series: [] };
  }
}

export async function getClassesStats(
  range: RangeKey,
  limit = 8,
  signal?: AbortSignal
): Promise<ClassesRes> {
  try {
    const res = await axiosInstance.get<ClassesRes>(ENDPOINTS.STATS.CLASSES, {
      params: { range, limit },
      signal,
    });
    if (res.status === 200) return res.data;
    return { total: 0, series: [], recent: [] };
  } catch (err) {
    if (!isCanceled(err)) {
      console.error("Error getRoleDistribution:", err);
    }
    return { total: 0, series: [], recent: [] };
  }
}

// Optional: gộp gọi 3 API một lúc cho tiện nơi dùng
export async function getAllStats(
  range: RangeKey,
  limit = 8,
  signal?: AbortSignal
) {
  const [students, teachers, classes] = await Promise.all([
    getStudentsStats(range, signal),
    getTeachersStats(range, signal),
    getClassesStats(range, limit, signal),
  ]);
  return { students, teachers, classes };
}

export type { StudentsRes, TeachersRes, ClassesRes };




export async function getRoleDistribution(range: RangeKey, signal?: AbortSignal): Promise<RoleDistResp | null> {
  try {
    const res = await axiosInstance.get<RoleDistResp>(
      ENDPOINTS.STATS.USERS_ROLE_DISTRIBUTION,
      { params: { range }, signal }
    );
    if (res.status === 200) return res.data;
    return null;
  } catch (err) {
   if (!isCanceled(err)) {
      console.error("Error getRoleDistribution:", err);
    }
    return null;
  }
}
