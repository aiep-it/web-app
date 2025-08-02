import { ExerciseData, ExercisePayload } from "../types/exercise";
import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { getAudioByExerciseId, getExerciseByIdFromDirectus } from "../cms/exercise";

export async function createQuiz(payload: ExercisePayload): Promise<ExerciseData | null> {
    try{
        const response = await axiosInstance.post<ExerciseData>(ENDPOINTS.EXERCISE.CREATE, payload);
        if (response.status === 201) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error creating exercise:", error);
        return null;
    }
}

export async function getAllExercises(): Promise<ExerciseData[]> {
  try {
    return await axiosInstance
      .get(ENDPOINTS.EXERCISE.GET_ALL)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return [];
      })
      .catch((e) => {
        console.error("Error fetching exercises:", e);
        return [];
      });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
}

export async function getExerciseById(id: string): Promise<ExerciseData | null> {
    try {
        const response = await axiosInstance.get<ExerciseData>(ENDPOINTS.EXERCISE.GET_BY_EXERCISE_ID(id));
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching exercise by ID:", error);
        return null;
    }
}

export async function updateExercise(id: string, payload: ExercisePayload): Promise<ExerciseData | null> {
    try {
        const response = await axiosInstance.put<ExerciseData>(ENDPOINTS.EXERCISE.UPDATE(id), payload);
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error updating exercise:", error);
        return null;
    }
}

export async function deleteExercise(id: string): Promise<boolean> {
    try {
        const response = await axiosInstance.delete(ENDPOINTS.EXERCISE.DELETE(id));
        if (response.status === 200 || response.status === 204) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error deleting exercise:", error);
        return false;
    }
}

export async function getExerciseAudioFromDirectus(exerciseId: string): Promise<string | null> {
    try {
        return await getAudioByExerciseId(exerciseId);
    } catch (error) {
        console.error("Error getting audio from Directus:", error);
        return null;
    }
}

export async function getExerciseFromDirectus(exerciseId: string) {
    try {
        return await getExerciseByIdFromDirectus(exerciseId);
    } catch (error) {
        console.error("Error getting exercise from Directus:", error);
        return null;
    }
}