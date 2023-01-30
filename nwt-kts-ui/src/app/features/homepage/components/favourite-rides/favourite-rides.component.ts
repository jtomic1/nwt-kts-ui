import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FavouriteRouteDTO } from 'src/app/shared/models/FavouriteRouteDTO';
import { FavouriteService } from 'src/app/shared/services/favourite-service/favourite.service';
import { MapService } from 'src/app/shared/services/map-service/map.service';

type FavouriteRoute = {
  routeName: string;
  startCoord: L.LatLng;
  endCoord: L.LatLng;
  onWayStations: L.LatLng[];
};

@Component({
  selector: 'app-favourite-rides',
  templateUrl: './favourite-rides.component.html',
  styleUrls: ['./favourite-rides.component.css'],
})
export class FavouriteRidesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  favourites: FavouriteRoute[] = [];
  focusedRoute: FavouriteRoute | null = null;

  constructor(
    private favService: FavouriteService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.favService
      .getFavouritesForClient()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: FavouriteRouteDTO[]) => {
        for (let elem of res) {
          let stops: L.LatLng[] = this.mapService.getLatLngFromStopsString(
            elem.stops
          );
          this.favourites.push({
            routeName: elem.routeName,
            startCoord: stops[0],
            endCoord: stops[stops.length - 1],
            onWayStations: stops.slice(1, stops.length - 1),
          });
        }
        console.log(this.favourites);
      });
  }

  rowClick(route: FavouriteRoute) {
    this.focusedRoute = route;
  }

  removeRoute(route: FavouriteRoute) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
