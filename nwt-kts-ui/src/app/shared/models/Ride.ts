import { OnWayStation } from "src/app/features/clientpage/model/OnWayStation";

export interface Ride {
    rideId:number | undefined,
    driverId:number | undefined,
    vehiclePlateNumber: string | undefined,
    clientId:number,
    stops: string,
    splitFare: String[],
    vehicleType: number,
    price: number,
    duration: number,
    distance: number,
    reservation: boolean,
    deniedDrivers:number[],
    startTime:string,
    endTime:string,
    pathForRide:string,
    routeIndex: string
}