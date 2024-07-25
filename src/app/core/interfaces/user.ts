import { AuthUser } from './authUser';

export interface User extends AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  joiningDate: Date;
  profileImage?: File;
  subtitle?: string;
  about?: string;
}
