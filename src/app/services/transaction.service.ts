import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction } from '../interfaces/transaction.interface';
import { environment } from '../../environments/environment';
import { requestHeaders } from '@app/_helpers/requestHeaders';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  getTransactions(): Observable<Transaction[]> {
    try {
      return this.http.get<Transaction[]>(this.apiUrl, requestHeaders()).pipe(
        catchError(error => {
          console.error('Erro ao buscar transações:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Erro ao preparar requisição:', error);
      return throwError(() => error);
    }
  }

  getTransaction(id: number): Observable<Transaction> {
    try {
      return this.http.get<Transaction>(`${this.apiUrl}/${id}`, requestHeaders()).pipe(
        catchError(error => {
          console.error('Erro ao buscar transação:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Erro ao preparar requisição:', error);
      return throwError(() => error);
    }
  }

  createTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    try {
      return this.http.post<Transaction>(this.apiUrl, transaction, requestHeaders()).pipe(
        catchError(error => {
          console.error('Erro ao criar transação:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Erro ao preparar requisição:', error);
      return throwError(() => error);
    }
  }

  updateTransaction(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    try {
      return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction, requestHeaders()).pipe(
        catchError(error => {
          console.error('Erro ao atualizar transação:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Erro ao preparar requisição:', error);
      return throwError(() => error);
    }
  }

  deleteTransaction(id: number): Observable<void> {
    try {
      return this.http.delete<void>(`${this.apiUrl}/${id}`, requestHeaders()).pipe(
        catchError(error => {
          console.error('Erro ao excluir transação:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Erro ao preparar requisição:', error);
      return throwError(() => error);
    }
  }
} 