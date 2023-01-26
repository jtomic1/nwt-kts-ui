import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { Note } from '../../models/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  url: string = `${environment.baseUrl}/${ApiPaths.Note}`;

  constructor(private httpClient: HttpClient) { }

  public sendNote(note: Note) {
    let url = `${this.url}/save`;
    return this.httpClient.post(url, note);
  }

  public getBlockNote(offenderId: number): Observable<Note> {
    let url = `${this.url}/get/block`;
    return this.httpClient.get<Note>(url, {params : {id: offenderId}});
  }

}
