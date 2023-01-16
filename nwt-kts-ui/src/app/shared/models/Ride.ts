import { OnWayStation } from "src/app/features/clientpage/model/OnWayStation";

export interface Ride {
    rideId:number | undefined,
    driverId:number | undefined,
    vehiclePlateNumber: string | undefined,
    stops: String;
    splitFare: String[];
    vehicleType: number;
    price: number;
    duration: number;
    isReservation: boolean;
}