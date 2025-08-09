import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { UserExerciseResultPayload } from "../types/userExcerciseResult";



export async function postExcerciseResult(payload: UserExerciseResultPayload) {
    try {
        return await axiosInstance
        .post(ENDPOINTS.USER_EXCERCISER_RESULT.POST_RESULT, payload)
        .then((response) => {
            if (response.status === 200) {
            return response.data;
            }
            return null;
        })
        .catch((e) => {
            console.error('Error fetching exercise result:', e);
            return null;
        });
    } catch (error) {
        console.error('Error fetching exercise result:', error);
        return null;
    }
}