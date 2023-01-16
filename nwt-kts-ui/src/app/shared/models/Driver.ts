import { DriverStatus } from "./enums/DriverStatus";
import { VehicleType } from "./enums/VehicleType";
import { User } from "./User";

export interface Driver extends User {
    positionId : number;
    positionLatitude : number;
    positionLongitude : number;
    positionName : string;
    vehicleId : number;
    vehicleName : string;
    vehiclePlateNumber : string;
    vehicleCapacity : number;
    vehicleType : VehicleType;
    driverStatus : DriverStatus;
}