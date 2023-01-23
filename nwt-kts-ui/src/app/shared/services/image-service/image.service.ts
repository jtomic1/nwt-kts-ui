import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { ImageUrlDTO } from '../../models/ImageUrlDTO';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  sendImageRequest(file: File): Observable<ImageUrlDTO> {
    let url = `${environment.baseUrl}/${ApiPaths.Images}/upload`;

    const formData = new FormData();
    formData.append('image', file);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<ImageUrlDTO>(url, formData, {
      headers: headers,
    });
  }
}
