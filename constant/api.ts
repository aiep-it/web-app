// For define constant

export const ENDPOINTS = {
  AUTHEN: {
    ROLE: "/users/update-metadata",
    GET_USER_BY_CLERK_ID: (clerkId: string) => `/users/${clerkId}`,
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
  STUDENT: {
    GET_ALL: '/students',
    CREATE: '/students/create',
    IMPORT: '/students/bulk-import',
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
    CHANGE_MY_PASSWORD: '/students/me/change-password',
  },
  EXERCISE: {
    GET_ALL: "/exercises",
    CREATE: '/exercises',
    GET_BY_EXERCISE_ID: (exerciseId: string) => `/exercises/${exerciseId}`,
    UPDATE: (id: string) => `/exercises/${id}`,
    DELETE: (id: string) => `/exercises/${id}`,
  },
  WORK_SPACE: {
    GET_ALL: "/workspaces",
    GET_BY_ID: (id: string) => `/workspaces/${id}`,
    CREATE_TOPIC: "/workspace/topics",
    UPDATE: (id: string) => `/workspaces/${id}`,
    DELETE: (id: string) => `/workspaces/${id}`,
  }
};
