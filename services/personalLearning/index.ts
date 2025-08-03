import axiosInstance from '@/lib/axios';
import { PersonalLearningCreatePayload } from '../types/workspace';
import { ENDPOINTS } from '@/constant/api';

export const createPersonalLearning = async (
  payload: PersonalLearningCreatePayload,
) => {
  try {
    return await axiosInstance
      .post(ENDPOINTS.PERSONAL_LEARNING.CREATE, payload)
      .then((response) => {
        if (response.status === 201) {
          return response.data;
        }
        return null;
      })
      .catch((e) => {
        console.error('Error creating personal learning:', e);
        return null;
      });
  } catch (error) {
    console.error('Error creating personal learning:', error);
    return null;
  }
};

export const getPersonalLearningByTopicId = async (topicId: string) => {
  try {
    return await axiosInstance
      .get(ENDPOINTS.PERSONAL_LEARNING.GET_BY_TOPIC(topicId))
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return [];
      })
      .catch((e) => {
        console.error('Error fetching personal learning by topic ID:', e);
        return [];
      });
  } catch (error) {
    console.error('Error fetching personal learning by topic ID:', error);
    return [];
  }
};
