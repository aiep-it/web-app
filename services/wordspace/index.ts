import axiosInstance from '@/lib/axios';
import { WorkspaceCreateTopicPayload } from '../types/workspace';
import { ENDPOINTS } from '@/constant/api';

export async function createTopicWorkspace(
  payload: WorkspaceCreateTopicPayload,
) {
  try {
    return await axiosInstance
      .post(ENDPOINTS.WORK_SPACE.CREATE_TOPIC, payload)
      .then((response) => {
        if (response.status === 201) {
          return response.data;
        }

        return null;
      })
      .catch((e) => {
        console.error('Error creating vocabulary:', e);

        return null;
      });
  } catch (error) {
    console.error('Error creating vocabulary:', error);

    return null;
  }
}

export async function getMyWorkspace() {
    try {
      return await axiosInstance
        .get(ENDPOINTS.WORK_SPACE.GET_ALL)
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
  
          return null;
        })
        .catch((e) => {
          console.error('Error creating vocabulary:', e);
  
          return null;
        });
    } catch (error) {
      console.error('Error creating vocabulary:', error);
  
      return null;
    }
  }
