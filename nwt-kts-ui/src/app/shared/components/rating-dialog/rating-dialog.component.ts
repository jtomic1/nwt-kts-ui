import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { Rating } from 'src/app/features/homepage/models/Rating';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';

type Mode = 'driver' | 'vehicle';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css'],
})
export class RatingDialogComponent  {
  solidStar = solidStar;
  emptyStar = regularStar;

  driverRatingPlaceholder: number | null = null;
  vehicleRatingPlaceholder: number | null = null;

  rating: Rating = this.createEmptyRating();

  constructor(
    public dialogRef: MatDialogRef<RatingDialogComponent>,
    private loginService: LoginService
  ) {}

  

  get driverRating(): number {
    if (this.driverRatingPlaceholder !== null)
      return this.driverRatingPlaceholder;
    return this.rating.driverRating;
  }

  get vehicleRating(): number {
    if (this.vehicleRatingPlaceholder !== null)
      return this.vehicleRatingPlaceholder;
    return this.rating.vehicleRating;
  }

  get disableSubmit(): boolean {
    return this.rating.driverRating === 0 || this.rating.vehicleRating === 0;
  }

  onMouseEnter(j: number, mode: Mode) {
    if (mode === 'driver') this.driverRatingPlaceholder = j;
    else this.vehicleRatingPlaceholder = j;
  }

  onMouseLeave(mode: Mode) {
    if (mode === 'driver') this.driverRatingPlaceholder = null;
    else this.vehicleRatingPlaceholder = null;
  }

  onClick(j: number, mode: Mode) {
    if (mode === 'driver') this.rating.driverRating = j;
    else this.rating.vehicleRating = j;
  }

  onCloseClick() {
    this.dialogRef.close(null);
  }

  onConfirmClick() {
    this.dialogRef.close(this.rating);
  }

  createEmptyRating(): Rating {
    return {
      clientId: this.loginService.user!.id,
      fareId: 0,
      userFullName:
        this.loginService.user!.name + ' ' + this.loginService.user!.lastName,
      userProfilePhoto: this.loginService.user!.profilePhoto,
      driverRating: 0,
      vehicleRating: 0,
      comment: '',
    };
  }
}
