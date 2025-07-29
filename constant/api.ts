// For define constant

export const ENDPOINTS = {
  AUTHEN: {
    ROLE: "/users/update-metadata",
  },
  CATEGORY: {
    GET_ALL: "/categories",
    GET_BY_ID: (id: string) => `/categories/${id}`,
    CREATE: "/categories",
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  ROAD_MAP: {
    GET_ALL: "/roadmaps",
    GET_BY_ID: (id: string) => `/roadmaps/${id}`,
    CREATE: "/roadmaps",
  },
  TOPIC: {
    GET_BY_ROADMAP_ID: (roadMapId: string) => `/topic/list/${roadMapId}`,
    GET_BY_ID: (id: string) => `/topic/${id}`,
    CREATE: '/topic',
    UPDATE: (id: string) => `/topic/${id}`,
  },
  VOCAB: {
    SEARCH: "/vocabs/search",
    CREATE: "/vocabs",
    UPDATE: (id: string) => `/vocabs/${id}`,
    DELETE: (id: string) => `/vocabs/${id}`,
    GET_BY_TOPIC_ID: (topicId: string) => `/vocabs/topic/${topicId}`,
    AI_GENRATE: `/vocabs/ai/gen`,
  },
};
