import { OnWayStation } from "src/app/features/clientpage/model/OnWayStation";

export interface Ride {
    rideId:number | undefined,
    driverId:number | undefined,
    vehiclePlateNumber: string | undefined,
    clientId:number,
    stops: String,
    splitFare: String[],
    vehicleType: number,
    price: number,
    duration: number,
    distance: number,
    isReservation: boolean,
    deniedDrivers:number[],
}