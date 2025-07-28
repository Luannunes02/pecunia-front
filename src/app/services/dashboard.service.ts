import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../interfaces/transaction.interface';
import { environment } from '../../environments/environment';
import { requestHeaders } from '@app/_helpers/requestHeaders';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.apiUrl, requestHeaders());
  }
} 