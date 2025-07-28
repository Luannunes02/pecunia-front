import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from '../../services/account.service';
import { Account } from '../../interfaces/transaction.interface';
import { AccountFormComponent } from './account-form/account-form.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="accounts-container p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Contas</h1>
        <button
          (click)="openAccountForm()"
          class="px-4 py-2 bg-pecunia-dark-green text-white rounded-md hover:bg-pecunia-light-green transition-colors duration-200 flex items-center space-x-2"
        >
          <mat-icon>add</mat-icon>
          <span>Nova Conta</span>
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let account of accounts" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{account.name}}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{account.type}}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{account.balance | currency:'BRL'}}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  [class]="account.isActive ? 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' : 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'"
                >
                  {{account.isActive ? 'Ativa' : 'Inativa'}}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  (click)="editAccount(account)"
                  class="text-pecunia-dark-green hover:text-pecunia-light-green mr-4"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  (click)="deleteAccount(account)"
                  class="text-red-600 hover:text-red-800"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <mat-spinner></mat-spinner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .accounts-container {
      position: relative;
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading = true;
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contas:', error);
        this.loading = false;
        this.showMessage('Erro ao carregar contas');
      }
    });
  }

  openAccountForm(account?: Account) {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      width: '500px',
      data: account
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  editAccount(account: Account) {
    this.openAccountForm(account);
  }

  deleteAccount(account: Account) {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      this.accountService.deleteAccount(account.id).subscribe({
        next: () => {
          this.loadAccounts();
          this.showMessage('Conta excluída com sucesso');
        },
        error: (error) => {
          console.error('Erro ao excluir conta:', error);
          this.showMessage('Erro ao excluir conta');
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