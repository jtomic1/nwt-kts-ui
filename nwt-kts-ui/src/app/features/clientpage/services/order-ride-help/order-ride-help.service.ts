import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderRideHelpService {

  constructor() { }

  getStartTimeForReservationRide(userInput:string):Date{
    let result:Date = new Date();
    let userHours = userInput.split(":")[0];
    let userMinutes = userInput.split(":")[1];
    result.setHours(+userHours +1);
    result.setMinutes(+userMinutes);
    if( result.getTime() < Date.now()){
      result.setDate(result.getDate() + 1)
    }
    return result;
  }

  getEndTime(startTime : Date,  duration:number) : Date{
    let endTime : Date = new Date(startTime);
    endTime.setMinutes( startTime.getMinutes() + duration);
    return endTime;
  }
}
