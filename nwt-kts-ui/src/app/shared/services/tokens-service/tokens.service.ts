import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { TokensDTO } from '../../models/ToknesDTO';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  url:string =`${environment.baseUrl}/${ApiPaths.Tokens}`; 

  public currentUserTokensChangedSubject =new Subject();
  public currentUserTokensChanged = this.currentUserTokensChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTokensForUser(userId:number):Observable<number>{
    let url = `${this.url}/forUser/${userId}`;
    return this.http.get<number>(url);
  }

  addTokensForUser(tokensDTO:TokensDTO):Observable<number>{
    let url = `${this.url}/addTokens`;
    return this.http.post<number>(url,tokensDTO);
    
  }

}
