import { RegistrationData } from '../../startpage/models/RegistrationData';

export interface AdminRegistrationData extends RegistrationData {
  vehicleName: string;
  plateNumber: string;
  capacity: number;
  vehicleType: string;
}
