import { User } from 'src/app/shared/models/User';

export interface Rating {
  clientId: number;
  fareId: number;
  userFullName: string;
  userProfilePhoto: string;
  vehicleRating: number;
  driverRating: number;
  comment: string;
}
