import { User } from 'src/app/shared/models/User';

export interface ChangeRequestDTO {
  id: number;
  name: string;
  lastName: string;
  town: string;
  phone: string;
  profilePhoto: string;
  resolved: boolean;
  driver: User;
}
