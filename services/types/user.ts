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