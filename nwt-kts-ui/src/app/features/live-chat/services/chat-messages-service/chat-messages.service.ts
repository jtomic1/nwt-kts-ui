import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { MessageDTO } from '../../models/MessageDTO';

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService {
  url:string =`${environment.baseUrl}/${ApiPaths.ChatMessages}`;  
  constructor(private http: HttpClient) {}

  getMessagesForUser( userId:number ):Observable<MessageDTO[]>{
    let url =`${this.url}/forUser/${userId}`;
    return this.http.get<MessageDTO[]>(url);
  }

  addNewMessage( messageDTO:MessageDTO ): Observable<MessageDTO>{
    let url = `${this.url}/newMessage`;
    return this.http.post<MessageDTO>(url,messageDTO);
  }
}
