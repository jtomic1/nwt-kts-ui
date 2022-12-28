import { User } from 'src/app/shared/models/User';

export interface LoginResponseData {
  accessToken: string;
  expiresIn: number;
  user: User;
}
