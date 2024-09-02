import { AuthUser } from './authUser';

export interface User extends AuthUser {
  firstName: string;
  lastName: string;
  email: string;
}
