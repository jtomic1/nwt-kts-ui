import { UserDTO } from 'src/app/shared/models/UserDTO';
import { Rating } from './Rating';
import * as L from 'leaflet';

export interface FareDTO {
  fareId: number;
  startTime: string;
  endTime: string;
  startAddress: string;
  endAddress: string;
  price: number;
  driverFullName: string;
  driverProfilePhoto: string;
  vehicle: string;
  ratings: Rating[];
  users: UserDTO[];
  stops: string;
  startCoord: L.LatLng;
  endCoord: L.LatLng;
  onWayStations: L.LatLng[];
}
