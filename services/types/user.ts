import { UserClass } from './class';

export interface UpdateRoleRequest {
  userId: string;
  role: string;
}

export interface Teacher {
  // export interface UserData {
  // >>>>>>> 10b7c8cd1f89bba9dec2615d742a1394fae86421
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;

  // fullName: string;
  // createdAt: string;

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

export interface StudentData extends UserData {
  status?: string;
  userClasses: UserClass;
  _count?: any;
}

export interface FeedbackData {
  classId: string;
  studentId: string;
  classInfo: {
    name: string;
    code: string;
  };
  feedbacks: Array<{
    teacher: {
      id: string;
      fullName: string;
      email: string;
    };

    id: string;
    content: string;
    created_at: string;
    updated_at: string;
  }>;
}
export interface TeacherFeedback {
  id: string;
  studentId: string;
  teacherId: string;
  classId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    fullName: string;
    email: string;
  };
  class: {
    id: string;
    name: string;
    code: string;
  };
}