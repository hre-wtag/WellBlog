import { AuthUser } from './authUser';

export interface User extends AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  joiningDate: Date;
  profileImage?: string;
  subtitle?: string;
  about?: string;
}
