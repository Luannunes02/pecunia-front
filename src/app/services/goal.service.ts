import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal } from '../interfaces/transaction.interface';
import { environment } from '../../environments/environment';
import { requestHeaders } from '@app/_helpers/requestHeaders';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = `${environment.apiUrl}/goals`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl, requestHeaders());
  }

  getGoal(id: number): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/${id}`, requestHeaders());
  }

  createGoal(goal: Partial<Goal>): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal, requestHeaders());
  }

  updateGoal(id: number, goal: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, goal, requestHeaders());
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, requestHeaders());
  }
} 