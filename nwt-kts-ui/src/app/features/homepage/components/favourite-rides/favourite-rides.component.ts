import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { MapComponent } from 'src/app/shared/components/map/map.component';
import { FavouriteRouteDTO } from 'src/app/shared/models/FavouriteRouteDTO';
import { FavouriteService } from 'src/app/shared/services/favourite-service/favourite.service';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { ScheduleService } from 'src/app/shared/services/schedule-service/schedule.service';

type FavouriteRoute = {
  routeName: string;
  startCoord: L.LatLng;
  endCoord: L.LatLng;
  onWayStations: L.LatLng[];
  favouriteId: number;
};

@Component({
  selector: 'app-favourite-rides',
  templateUrl: './favourite-rides.component.html',
  styleUrls: ['./favourite-rides.component.css'],
})
export class FavouriteRidesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild(MapComponent) map!: MapComponent;

  favourites: FavouriteRoute[] = [];
  focusedRoute: FavouriteRoute | null = null;

  constructor(
    private favService: FavouriteService,
    private mapService: MapService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef
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
            favouriteId: elem.favouriteId,
          });
        }
      });
  }

  rowClick(route: FavouriteRoute) {
    this.focusedRoute = route;
    this.cdr.detectChanges();
    this.map.centerView();
    this.map.setStartingMarker();
    this.map.setDestinationMarker();
    this.map.addOnWayStations();
  }

  scheduleRoute(route: FavouriteRoute) {
    let data = {
      startCoord: route.startCoord,
      endCoord: route.endCoord,
      onWayStations: route.onWayStations,
    };
    this.scheduleService.mapData = data;
    this.router.navigate(['../clientmap']);
  }

  removeRoute(route: FavouriteRoute) {
    this.favService
      .removeFromFavourites({
        clientId: this.loginService.user!.id,
        fareId: -1,
        favouriteId: route.favouriteId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.favourites = this.favourites.filter(
          (e) => e.favouriteId !== route.favouriteId
        );
        if (route.favouriteId === this.focusedRoute?.favouriteId)
          this.focusedRoute = null;
        this.messageService.showMessage(
          'Ruta izbačena iz omiljenih!',
          MessageType.SUCCESS
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
