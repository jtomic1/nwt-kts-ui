import { Rating } from './Rating';

export interface FareDTO {
  startTime: string;
  endTime: string;
  startAddress: string;
  endAddress: string;
  price: number;
  driverFullName: string;
  driverProfilePhoto: string;
  vehicle: string;
  ratings: Rating[];
}
