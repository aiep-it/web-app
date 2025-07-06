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
    GET_ALL: "",
    GET_BY_ID: (id: string) => `/roadmaps/${id}`,
    CREATE: "/roadmaps",
  },
  NODE: {
    GET_BY_ROADMAP_ID: (roadMapId: string) => `/node/list/${roadMapId}`,
    GET_BY_ID: (id: string) => `/node/${id}`,
    CREATE: '/node',
    UPDATE: (id: string) => `/node/${id}`,
  },
  VOCAB: {
    SEARCH: "/vocabs/search",
    CREATE: "/vocabs",
    UPDATE: (id: string) => `/vocabs/${id}`,
    DELETE: (id: string) => `/vocabs/${id}`,
  },
};
