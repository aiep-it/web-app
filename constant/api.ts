// For define constant

export const ENDPOINTS = {
  USER: {
   TEACHER: "/users/teachers",
  },
  AUTHEN: {
    ROLE: "/users/update-metadata",
    WITH_CLERK_ID: '/users/with-clerk-id',
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
    WITH_CLERK_ID: '/students/with-clerk-id',
  },
 CLASS: {
    GET_ALL: '/class',
    CREATE: '/class',
    ADD_ROADMAP: (id: string) => `/class/${id}/roadmaps`,
    GET_BY_ID: (id: string) => `/class/${id}`,
    UPDATE: (id: string) => `/class/${id}`,
    DELETE: (id: string) => `/class/${id}`,
    ADD_TEACHER: (id: string) => `/class/${id}/add-teacher`,
    REMOVE_TEACHER: (id: string) => `/class/${id}/remove-teacher`,
    ADD_STUDENTS: (id: string) => `/class/${id}/add-students`,
    REMOVE_STUDENT: (id: string, studentId: string) => `/class/${id}/remove-student/${studentId}`,
    REMOVE_ROADMAP: (id: string) => `/class/${id}/remove-roadmap`,

  },
};
