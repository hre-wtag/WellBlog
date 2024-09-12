import { AuthUser } from './authUser';

export interface User extends AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  joiningdate: Date;
  profileimage?: File;
  subtitle?: string;
  about?: string;
}
