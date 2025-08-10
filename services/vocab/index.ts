import {
  VocabSearchPayload,
  VocabPayload,
  VocabListResponse,
  VocabData,
} from '../types/vocab';

import { ENDPOINTS } from '@/constant/api';
import axiosInstance from '@/lib/axios';

export async function searchListVocab(payload: VocabSearchPayload) {
  try {
    return await axiosInstance
      .post(ENDPOINTS.VOCAB.SEARCH, payload)
      .then((response) => {
        if (response.status === 200) {
          return response.data as VocabListResponse;
        }

        return [];
      })
      .catch((e) => {
        console.error('Error fetching vocabs:', e);

        return [];
      });
  } catch (error) {
    console.error('Error fetching vocabs:', error);

    return [];
  }
}

export async function createVocab(payload: VocabPayload) {
  try {
    return await axiosInstance
      .post(ENDPOINTS.VOCAB.CREATE, payload)
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
export async function updateVocab(id: string, payload: VocabPayload) {
  try {
    return await axiosInstance
      .put(ENDPOINTS.VOCAB.UPDATE(id), payload)
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
export async function deleteVocab(id: string) {
  try {
    return await axiosInstance
      .delete(ENDPOINTS.VOCAB.DELETE(id))
      .then((response) => {
        if (response.status === 200) {
          return true;
        }

        return false;
      })
      .catch((e) => {
        console.error('Error creating vocabulary:', e);

        return false;
      });
  } catch (error) {
    console.error('Error creating vocabulary:', error);

    return false;
  }
}

export async function fetchVocabsByTopicId(
  topicId: string,
  payload: VocabSearchPayload,
) {
  try {
    return await axiosInstance
      .post(ENDPOINTS.VOCAB.GET_BY_TOPIC_ID(topicId), payload)
      .then((response) => {
        if (response.status === 200) {
          return response.data as VocabListResponse;
        }

        return [];
      })
      .catch((e) => {
        console.error('Error fetching vocabs:', e);

        return [];
      });
  } catch (error) {
    console.error('Error fetching vocabs:', error);

    return [];
  }
}

export async function aiGenerate(topicId: string) {
  try {
    return await axiosInstance
      .post(ENDPOINTS.VOCAB.AI_GENRATE, {
        topicId,
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }

        return [];
      })
      .catch((e) => {
        console.error('Error fetching vocabs:', e);

        return [];
      });
  } catch (error) {
    console.error('Error fetching vocabs:', error);

    return [];
  }
}

export async function getByTopicId(topicId: string) {
  try {
    return await axiosInstance
      .get(ENDPOINTS.VOCAB.GET_ALL_BY_TOPIC_ID(topicId))
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

export async function genByImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    return await axiosInstance
      .post(ENDPOINTS.AI.GEN_FROM_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }

        return null;
      })
      .catch((e) => {
        console.error('Error generating vocabulary by image:', e);

        return null;
      });
  } catch (error) {
    console.error('Error generating vocabulary by image:', error);

    return null;
  }
}

export async function getMyVocabs() {
  try {
    return await axiosInstance
      .get(ENDPOINTS.VOCAB.MY_VOCAB)
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

export async function markDone(vocabId: string) {
  try {
    return await axiosInstance
      .put(ENDPOINTS.VOCAB.MARK_DONE(vocabId))
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

export async function bulkVocabs(payload: VocabData[]) {
  try {
    return await axiosInstance
      .post(ENDPOINTS.VOCAB.BULK, payload)
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
