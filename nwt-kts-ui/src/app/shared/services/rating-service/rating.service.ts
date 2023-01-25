import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rating } from 'src/app/features/homepage/models/Rating';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private RATING_URL: string = `${environment.baseUrl}/${ApiPaths.Rating}`;

  constructor(private http: HttpClient) {}

  sendRating(rating: Rating): Observable<Rating> {
    let url = `${this.RATING_URL}/postRating`;
    return this.http.post<Rating>(url, rating);
  }
}
