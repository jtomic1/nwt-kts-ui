import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FavouriteRouteDTO } from 'src/app/shared/models/FavouriteRouteDTO';
import { FavouriteService } from 'src/app/shared/services/favourite-service/favourite.service';

@Component({
  selector: 'app-favourite-rides',
  templateUrl: './favourite-rides.component.html',
  styleUrls: ['./favourite-rides.component.css'],
})
export class FavouriteRidesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  favourites: FavouriteRouteDTO[] = [];

  constructor(private favService: FavouriteService) {}

  ngOnInit(): void {
    this.favService
      .getFavouritesForClient()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: FavouriteRouteDTO[]) => {
        this.favourites = res;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
