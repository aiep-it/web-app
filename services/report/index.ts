import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { CourseOverviewReport, ReportData, ReportPage } from "../types/report";

export async function getSelfReport(): Promise<ReportData | null>{
    try {
        return await axiosInstance
        .get(ENDPOINTS.REPORT.SELF)
        .then((response) => {
            if (response.status === 200) {
            return response.data;
            }
            return null;
        })
        .catch((e) => {
            console.error('Error fetching self report:', e);
            return null;
        });
    } catch (error) {
        console.error('Error fetching self report:', error);
        return null;
    }
}

export async function getCourseOverview(page: ReportPage):  Promise<CourseOverviewReport | null>  {
    try {
        return await axiosInstance
        .get(ENDPOINTS.REPORT.COURSER_OVER_VIEW, { params: { page } }) 
        .then((response) => {
            if (response.status === 200) {
            return response.data;
            }
            return null;
        })
        .catch((e) => {
            console.error('Error fetching course overview:', e);
            return null;
        });
    } catch (error) {
        console.error('Error fetching self report:', error);
        return null;
    }
}

export async function getClassReport(classId: string): Promise<any | null> {
    try {
        return await axiosInstance
        .get(ENDPOINTS.REPORT.CLASS(classId))
        .then((response) => {
            if (response.status === 200) {
            return response.data;
            }
            return null;
        })
        .catch((e) => {
            console.error('Error fetching class report:', e);
            return null;
        });
    } catch (error) {
        console.error('Error fetching class report:', error);
        return null;
    }
}

export async function getClassTopicReport(classId: string, topicId: string): Promise<any | null> {
    try {
        return await axiosInstance
        .get(ENDPOINTS.REPORT.CLASS_TOPIC(classId, topicId))
        .then((response) => {
            if (response.status === 200) {
            return response.data;
            }
            return null;
        })
        .catch((e) => {
            console.error('Error fetching class topic report:', e);
            return null;
        });
    } catch (error) {
        console.error('Error fetching class topic report:', error);
        return null;
    }
}