import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ReportRequest {
  startDate: string;
  endDate: string;
  format: 'PDF' | 'EXCEL';
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  generateReport(request: ReportRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate`, request, {
      responseType: 'blob'
    });
  }
} 