import { User } from 'src/app/shared/models/User';

export interface Rating {
  userFullName: string;
  userProfilePhoto: string;
  vehicleRating: number;
  driverRating: number;
  comment: string;
}
