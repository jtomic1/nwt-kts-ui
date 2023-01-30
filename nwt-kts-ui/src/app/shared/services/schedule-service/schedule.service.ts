import { Injectable } from '@angular/core';

type MapDTO = {
  startCoord: L.LatLng;
  endCoord: L.LatLng;
  onWayStations: L.LatLng[];
};

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private _mapData: MapDTO | null = null;

  constructior() {}

  set mapData(value: MapDTO | null) {
    this._mapData = value;
  }

  get mapData(): MapDTO | null {
    return this._mapData;
  }

  public reset() {
    this._mapData = null;
  }
}
