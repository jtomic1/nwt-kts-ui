import { Component, Input, OnInit } from '@angular/core';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { Rating } from 'src/app/features/homepage/models/Rating';

@Component({
  selector: 'app-rating-card',
  templateUrl: './rating-card.component.html',
  styleUrls: ['./rating-card.component.css'],
})
export class RatingCardComponent implements OnInit {
  solidStar = solidStar;
  emptyStar = regularStar;

  @Input() rating: Rating = this.getDefaultRating();

  constructor() {}

  getDefaultRating(): Rating {
    return {
      fareId: 0,
      clientId: 0,
      userFullName: 'null',
      userProfilePhoto: 'null',
      vehicleRating: 1,
      driverRating: 1,
      comment: 'null',
    };
  }

  ngOnInit(): void {}
}
