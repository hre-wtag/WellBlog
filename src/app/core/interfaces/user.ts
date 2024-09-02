import { AuthUser } from './authUser';

export interface User extends AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  joiningDate: Date;
  profileImagePath?: string;
  subtitle?: string;
  about?: string;
}
