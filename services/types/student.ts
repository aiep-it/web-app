// types/student.ts

export type Student = {
  id: string;
  fullName: string;
  parentName: string;
  parentPhone: string;
  address: string;
  username: string;
  createdAt: string;
};

export type StudentPayload = {
  fullName: string;
  parentName: string;
  parentPhone: string;
  address: string;
};
