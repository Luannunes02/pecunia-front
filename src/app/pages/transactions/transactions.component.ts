import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../interfaces/transaction.interface';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="transactions-container p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Transações</h1>
        <button
          (click)="openTransactionForm()"
          class="px-4 py-2 bg-pecunia-dark-green text-white rounded-md hover:bg-pecunia-light-green transition-colors duration-200"
        >
          Nova Transação
        </button>
      </div>

      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-lg shadow overflow-hidden">
        <table mat-table [dataSource]="transactions" class="w-full">
          <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Data</th>
          <td mat-cell *matCellDef="let transaction">
            {{
              transaction.transactionDate
                ? (createDate(transaction.transactionDate) | date:'dd/MM/yyyy')
                : ''
            }}
          </td>
        </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Descrição</th>
            <td mat-cell *matCellDef="let transaction">{{ transaction.description }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let transaction">
              <span [ngClass]="{
                'text-green-600': transaction.type === 'INCOME',
                'text-red-600': transaction.type === 'EXPENSE',
                'text-blue-600': transaction.type === 'TRANSFER'
              }">
                {{ transaction.type === 'INCOME' ? 'Receita' :
                   transaction.type === 'EXPENSE' ? 'Despesa' : 'Transferência' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Valor</th>
            <td mat-cell *matCellDef="let transaction">
              <span [ngClass]="{
                'text-green-600': transaction.type === 'INCOME',
                'text-red-600': transaction.type === 'EXPENSE',
                'text-blue-600': transaction.type === 'TRANSFER'
              }">
                {{ transaction.amount | currency:'BRL' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="account">
            <th mat-header-cell *matHeaderCellDef>Conta</th>
            <td mat-cell *matCellDef="let transaction">{{ transaction.account?.name }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Categoria</th>
            <td mat-cell *matCellDef="let transaction">
              <span *ngIf="transaction.type !== 'TRANSFER'">
                {{ transaction.category?.name }}
              </span>
              <span *ngIf="transaction.type === 'TRANSFER'" class="text-blue-600">
                Transferência para {{ transaction.destinationAccount?.name }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let transaction">
              <button
                (click)="editTransaction(transaction)"
                class="text-gray-600 hover:text-pecunia-dark-green mr-2"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                (click)="deleteTransaction(transaction)"
                class="text-gray-600 hover:text-red-600"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      @apply min-h-screen bg-gray-50;
    }

    table {
      @apply w-full;
    }

    th.mat-header-cell {
      @apply text-left text-gray-700 font-medium py-4 px-6;
    }

    td.mat-cell {
      @apply py-4 px-6;
    }

    tr.mat-row {
      @apply hover:bg-gray-50 transition-colors duration-200;
    }

    .mat-column-actions {
      @apply w-24 text-center;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  displayedColumns: string[] = ['date', 'description', 'type', 'amount', 'account', 'category', 'actions'];
  loading = true;

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar transações:', error);
        this.showMessage('Erro ao carregar transações');
        this.loading = false;
      }
    });
  }

  createDate(dateArray: number[]): Date | null {
    if (!dateArray || dateArray.length < 3) return null;
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute);
  }

  openTransactionForm(transaction?: Transaction) {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      data: transaction,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  editTransaction(transaction: Transaction) {
    this.openTransactionForm(transaction);
  }

  deleteTransaction(transaction: Transaction) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.transactionService.deleteTransaction(transaction.id).subscribe({
        next: () => {
          this.loadTransactions();
          this.showMessage('Transação excluída com sucesso');
        },
        error: (error) => {
          console.error('Erro ao excluir transação:', error);
          this.showMessage('Erro ao excluir transação');
        }
      });
    }
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
} 