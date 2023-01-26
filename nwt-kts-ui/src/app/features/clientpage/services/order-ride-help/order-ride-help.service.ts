import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderRideHelpService {

  constructor() { }

  getStartTimeForReservationRide(userInput:string):string{
    const now = new Date();
    let tomorow:boolean = false;
    let result:Date = new Date(now);
    let userHours = userInput.split(":")[0];
    let userMinutes = userInput.split(":")[1];
    console.log(+userHours);
    console.log(+userMinutes);

    // if( userInput < `${now.getHours()}:${now.getMinutes()}`){
    //   tomorow = true;
    // }
    // if(tomorow){
    //   result.setDate(result.getDate() + 1);
    // }
    result.setHours(+userHours+1);
    result.setMinutes(+userMinutes);
    console.log(result.toISOString());
    return result.toISOString();
  }

  getEndTime(startTimeISO : string,  duration:number){
    const startTime = new Date(startTimeISO);
    startTime.setMinutes( startTime.getMinutes() + duration);
    console.log(startTime.toISOString());
    return startTime.toISOString();
  }
}
