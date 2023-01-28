import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { MapComponent } from 'src/app/shared/components/map/map.component';
import { Role } from 'src/app/shared/models/enums/Role';
import { FareService } from 'src/app/shared/services/fare-service/fare.service';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import { FareDTO } from '../../models/FareDTO';
import { FareHistoryDTO } from '../../models/FareHistoryDTO';

@Component({
  selector: 'app-fare-history',
  templateUrl: './fare-history.component.html',
  styleUrls: ['./fare-history.component.css'],
})
export class FareHistoryComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild(MapComponent) map!: MapComponent;

  count: number = 0;
  items: any[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'startTime',
    'startAddress',
    'endTime',
    'endAddress',
    'price',
  ];

  currentPage: number = 0;
  currentSort: string = 'startTime-desc';

  focusedFare: FareDTO | null = null;

  constructor(
    private fareService: FareService,
    private loginService: LoginService,
    private mapService: MapService,
    private cdr: ChangeDetectorRef
  ) {}

  get userId(): number {
    return this.loginService.user!.id;
  }

  get userRole(): Role {
    return this.loginService.user!.role;
  }

  ngOnInit(): void {
    this.fetchData(0);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.fetchData(this.currentPage);
  }

  announceSortChange(event: Sort) {
    this.currentSort = `${event.active}-${event.direction}`;
    this.fetchData(0);
  }

  rowClick(row: FareDTO) {
    let stops: L.LatLng[] = this.mapService.getLatLngFromStopsString(row.stops);
    this.focusedFare = row;
    this.focusedFare!.startCoord = stops[0];
    this.focusedFare!.endCoord = stops[stops.length - 1];
    this.focusedFare!.onWayStations = stops.slice(1, stops.length - 1);
    this.cdr.detectChanges();
    this.map.centerView();
    this.map.setStartingMarker();
    this.map.setDestinationMarker();
    this.map.addOnWayStations();
  }

  fetchData(pageNumber: number) {
    switch (this.loginService.user!.role) {
      case Role.USER:
        this.fareService
          .getFaresByClient(this.userId, pageNumber, this.currentSort)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: FareHistoryDTO) => {
              this.dataSource.data = res.fares;
              this.count = res.count;
            },
          });
        break;

      case Role.DRIVER:
        this.fareService
          .getFaresByDriver(this.userId, pageNumber, this.currentSort)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: FareHistoryDTO) => {
              this.dataSource.data = res.fares;
              this.count = res.count;
            },
          });
        break;

      case Role.ADMIN:
        this.fareService
          .getFaresAdmin(pageNumber, this.currentSort)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: FareHistoryDTO) => {
              this.dataSource.data = res.fares;
              this.count = res.count;
            },
          });
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
