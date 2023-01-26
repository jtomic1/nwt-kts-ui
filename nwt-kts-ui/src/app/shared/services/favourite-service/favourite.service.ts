import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IsFavourite } from 'src/app/features/homepage/components/client-fare-details/client-fare-details.component';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { FavouriteRouteDTO } from '../../models/FavouriteRouteDTO';

type FavDTO = {
  clientId: number;
  fareId: number;
  favouriteId: number;
};

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private FAVOURITES_URL: string = `${environment.baseUrl}/${ApiPaths.Favourites}`;

  constructor(private http: HttpClient) {}

  getFavouritesForClient(): Observable<FavouriteRouteDTO[]> {
    let url = `${this.FAVOURITES_URL}/getFavouritesForClient`;
    return this.http.get<FavouriteRouteDTO[]>(url);
  }

  isRouteFavourite(fareId: number): Observable<IsFavourite> {
    let url = `${this.FAVOURITES_URL}/isRouteFavourite/${fareId}`;
    return this.http.get<IsFavourite>(url);
  }

  addToFavourites(dto: FavDTO): Observable<IsFavourite> {
    let url = `${this.FAVOURITES_URL}/addFavouriteForClient`;
    return this.http.post<IsFavourite>(url, dto);
  }

  removeFromFavourites(dto: FavDTO): Observable<FavDTO> {
    let url = `${this.FAVOURITES_URL}/removeFavouriteForClient`;
    return this.http.post<FavDTO>(url, dto);
  }
}
