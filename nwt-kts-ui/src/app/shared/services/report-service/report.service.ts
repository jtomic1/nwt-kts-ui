import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaths } from 'src/environments/ApiPaths';
import { environment } from 'src/environments/environment';
import { Report } from '../../models/Report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  url: string = `${environment.baseUrl}/${ApiPaths.Report}`;

  constructor(private httpClient: HttpClient) { }

  public getReports(report: Report) {
    let url = `${this.url}/reports`;
    return this.httpClient.post(url, report);
  }
}

