// For define constant

export const ENDPOINTS = {
    AUTHEN: {
        ROLE: "/users/update-metadata"
    },
    CATEGORY: {
        GET_ALL: '/categories',
        GET_BY_ID: (id: string) => `/categories/${id}`,
        CREATE: '/categories',
        UPDATE: (id: string) => `/categories/${id}`,
        DELETE: (id: string) => `/categories/${id}`,
    },
    ROAD_MAP: {
        GET_ALL: '',
        GET_BY_ID: (id: string) => `/roadmaps/${id}`,
        CREATE: '/roadmaps',
    },
    NODE: {
        GET_BY_ID: (id: string) => `/node/${id}`,
        CREATE: '/node',
        UPDATE: (id: string) => `/node/${id}`,
    }
}