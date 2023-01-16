import { OnWayStation } from "src/app/features/clientpage/model/OnWayStation";

export interface Ride {
    stops: String;
    splitFare: String[];
    vehicleType: number;
    price: number;
    duration: number;
    distance: number;
    isReservation: boolean;
}