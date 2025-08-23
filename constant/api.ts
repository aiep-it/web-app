// For define constant

export const ENDPOINTS = {
  USER: {
    TEACHER: '/users/teachers',
  },
  AUTHEN: {
    ROLE: '/users/update-metadata',

    WITH_CLERK_ID: '/users/with-clerk-id',

    GET_USER_BY_CLERK_ID: (clerkId: string) => `/users/${clerkId}`,
  },
  CATEGORY: {
    GET_ALL: '/categories',
    GET_BY_ID: (id: string) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  ROAD_MAP: {
    GET_ALL: '/roadmaps',
    GET_BY_ID: (id: string) => `/roadmaps/${id}`,
    CREATE: '/roadmaps',
  },
  TOPIC: {
    GET_BY_ROADMAP_ID: (roadMapId: string) => `/topic/list/${roadMapId}`,
    GET_BY_ID: (id: string) => `/topic/${id}`,
    CREATE: '/topic',
    UPDATE: (id: string) => `/topic/${id}`,
    AI_SUGGEST: '/topic/ai/suggest',
  },
  VOCAB: {
    SEARCH: '/vocabs/search',
    CREATE: '/vocabs',
    BULK: '/vocabs/bulk',
    UPDATE: (id: string) => `/vocabs/${id}`,
    DELETE: (id: string) => `/vocabs/${id}`,
    GET_BY_TOPIC_ID: (topicId: string) => `/vocabs/topic/${topicId}`,
    GET_ALL_BY_TOPIC_ID: (topicId: string) => `/vocabs/topic/${topicId}/all`,
    AI_GENRATE: `/vocabs/ai/gen`,
    MY_VOCAB: '/vocabs/my-vocabs',
    MARK_DONE: (id: string) => `/vocabs/mark-done/${id}`,
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
    REMOVE_STUDENT: (id: string, studentId: string) =>
      `/class/${id}/remove-student/${studentId}`,
    REMOVE_ROADMAP: (id: string) => `/class/${id}/remove-roadmap`,
    MY_CLASS: (classId: string) => `/class/my-class-info/${classId}`,
    ALL_MY_CLASSES: '/class/all-my-classes',
    JOIN_BY_CODE: `/class/join-by-code`,
    EXTEND_ROADMAPS: (classId: string) => `/teachers/roadmaps/by-class/${classId}`,
    PICK_ROADMAPS: (classId: string) => `/teachers/classes/${classId}/roadmaps`,
  },
  EXERCISE: {
    GET_ALL: '/exercises',
    CREATE: '/exercises',
    GET_BY_EXERCISE_ID: (exerciseId: string) => `/exercises/${exerciseId}`,
    UPDATE: (id: string) => `/exercises/${id}`,
    DELETE: (id: string) => `/exercises/${id}`,
  },
  WORK_SPACE: {
    GET_ALL: '/workspace',
    GET_BY_ID: (id: string) => `/workspaces/${id}`,
    CREATE_TOPIC: '/workspace/topics',
    UPDATE: (id: string) => `/workspaces/${id}`,
    DELETE: (id: string) => `/workspaces/${id}`,
  },
  AI: {
    GEN_FROM_IMAGE: '/ai/personal-learning',
    AI_SUGGEST_QUIZ: '/ai/suggest-quiz',
  },
  PERSONAL_LEARNING: {
    CREATE: '/personal-learning/create',
    GET_BY_TOPIC: (topicId: string) => `/personal-learning/topic/${topicId}`,
  },
  USER_EXCERCISER_RESULT: {
    POST_RESULT: '/user-exercise-results',
  },
  REPORT: {
    SELF: '/reports/self',
    COURSER_OVER_VIEW: '/reports/course-overview',
    CLASS: (classId: string) => `/reports/class/${classId}`,
    CLASS_TOPIC: (classId: string, topicId: string) =>
      `/reports//class/${classId}/topic/${topicId}`,
    STD: (stdId: string) => `/report/${stdId}`,
    SEND_FEEDBACK: 'teachers/feedback'
  },
  NOTIFICATION: {
    GET_MY: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },
  PARENT: {
    GET_CHILDREN: '/parent/me/children',
    GET_CHILD_REPORT: (stdId: string) => `/reports/std/${stdId}`,
    GET_FEEDBACK: (stdId: string) => `/parent/feedback/${stdId}`,
  }
};
