import { AuthUser } from './authUser';

export interface User extends AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  joiningDate: Date;
  profileImage?: File;
  subtitle?: string;
  about?: string;
}
