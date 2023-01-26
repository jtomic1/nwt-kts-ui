import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { mergeMap, of, Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { RatingDialogComponent } from 'src/app/shared/components/rating-dialog/rating-dialog.component';
import { Role } from 'src/app/shared/models/enums/Role';
import { FavouriteService } from 'src/app/shared/services/favourite-service/favourite.service';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { RatingService } from 'src/app/shared/services/rating-service/rating.service';
import { FareDTO } from '../../models/FareDTO';
import { Rating } from '../../models/Rating';

export type IsFavourite = {
  isFavourite: boolean;
  favouriteId: number;
};

@Component({
  selector: 'app-client-fare-details',
  templateUrl: './client-fare-details.component.html',
  styleUrls: ['./client-fare-details.component.css'],
})
export class ClientFareDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() fareData!: FareDTO;
  @Input() role: Role = Role.USER;

  isFavourite: IsFavourite = { isFavourite: false, favouriteId: -1 };

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private ratingService: RatingService,
    private loginService: LoginService,
    private favouriteService: FavouriteService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(change: SimpleChanges) {
    let fareData = change['fareData'].currentValue;
    this.favouriteService
      .isRouteFavourite(fareData.fareId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: IsFavourite) => {
        this.isFavourite.isFavourite = res.isFavourite;
        this.isFavourite.favouriteId = res.favouriteId;
      });
  }

  get userRole(): Role {
    return this.loginService.user!.role;
  }

  get Role(): typeof Role {
    return Role;
  }

  get justifyCondition(): boolean {
    if (this.userRole === Role.ADMIN) return this.fareData.users.length > 1;
    else if (this.userRole === Role.DRIVER)
      return this.fareData.users.length > 2;
    else return false;
  }

  get rateButtonDetails(): { enable: boolean; displayText: string } {
    for (let rating of this.fareData.ratings) {
      if (rating.clientId === this.loginService.user!.id)
        return { enable: false, displayText: 'OCENILI STE VOŽNJU' };
    }

    let customParseFormat = require('dayjs/plugin/customParseFormat');
    dayjs.extend(customParseFormat);
    const date: dayjs.Dayjs = dayjs(this.fareData.endTime, 'DD.MM.YYYY. hh:mm');

    if (date.add(3, 'day').isBefore(dayjs()))
      return { enable: false, displayText: 'OCENI VOŽNJU' };
    return { enable: true, displayText: 'OCENI VOŽNJU' };
  }

  openRatingDialog() {
    const dialogRef = this.dialog.open(RatingDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(
        mergeMap((response: Rating | undefined | null) => {
          if (response !== undefined && response !== null) {
            response.fareId = this.fareData.fareId;
            return this.ratingService.sendRating(response);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((finalResponse: Rating | null) => {
        if (finalResponse !== null) {
          this.messageService.showMessage(
            'Ocena uspešno zabeležena!',
            MessageType.SUCCESS
          );
          this.fareData.ratings.push(finalResponse);
        }
      });
  }

  onFavouriteButtonClick() {
    if (this.isFavourite.isFavourite) {
      this.favouriteService
        .removeFromFavourites({
          clientId: this.loginService.user!.id,
          fareId: this.fareData.fareId,
          favouriteId: this.isFavourite.favouriteId,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.isFavourite.isFavourite = false;
          this.isFavourite.favouriteId = -1;
        });
    } else {
      this.favouriteService
        .addToFavourites({
          clientId: this.loginService.user!.id,
          fareId: this.fareData.fareId,
          favouriteId: -1,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: IsFavourite) => {
          this.isFavourite.isFavourite = res.isFavourite;
          this.isFavourite.favouriteId = res.favouriteId;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
