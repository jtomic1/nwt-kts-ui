import { Role } from './enums/Role';

export interface User {
  active: boolean;
  blocked: boolean;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  username: string;
  role: Role;
  roleString: string;
}
