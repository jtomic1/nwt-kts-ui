import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, of, Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { RatingDialogComponent } from 'src/app/shared/components/rating-dialog/rating-dialog.component';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { RatingService } from 'src/app/shared/services/rating-service/rating.service';
import { FareDTO } from '../../models/FareDTO';
import { Rating } from '../../models/Rating';

@Component({
  selector: 'app-client-fare-details',
  templateUrl: './client-fare-details.component.html',
  styleUrls: ['./client-fare-details.component.css'],
})
export class ClientFareDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() fareData!: FareDTO;

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private ratingService: RatingService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  get enableRateButton(): boolean {
    for (let rating of this.fareData.ratings) {
      if (rating.clientId === this.loginService.user!.id) return false;
    }
    return true;
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
        console.log(finalResponse);
        if (finalResponse !== null) {
          this.messageService.showMessage(
            'Ocena uspešno zabeležena!',
            MessageType.SUCCESS
          );
          this.fareData.ratings.push(finalResponse);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
