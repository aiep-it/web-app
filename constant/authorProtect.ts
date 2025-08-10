export enum USER_ROLE {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  ANONYMUS = 'ANONYMUS',
}
enum PERMISSION {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}
type RouterProtect = {
  routerUrl: string;
  role: USER_ROLE[];
  permission?: string[];
};

export const AUTHOR_PROTECT: RouterProtect[] = [
  {
    routerUrl: '/admin(.*)',
    role: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
    permission: [PERMISSION.READ, PERMISSION.WRITE],
  },
  {
    routerUrl: '^(?!/admin).*',
    role: [USER_ROLE.STUDENT, USER_ROLE.PARENT, USER_ROLE.TEACHER],
    permission: [PERMISSION.READ, PERMISSION.WRITE],
  },
];

export const PUBLIC_ROUTES = [
    "/",
    "/about",
    "/contact",
    "/sign-in",
    "/sign-up",
    "/403",
  ];
  
