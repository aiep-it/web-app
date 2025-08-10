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
  role: string;
  createdAt: string;
  updatedAt: string;
  address?: string;
  fullName?: string;
  password?: string;
  username?: string;
}

export interface UserData {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  address?: string;
  fullName?: string;
  parentName?: string;
  parentPhone?: string;
  password?: string;
  username?: string;

}