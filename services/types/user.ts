export interface UpdateRoleRequest {
  userId: string;
  role: string;
}
export interface Teacher {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
}