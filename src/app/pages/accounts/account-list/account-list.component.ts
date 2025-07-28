import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountService } from '../../../services/account.service';
import { Account, AccountType } from '../../../interfaces/transaction.interface';
import { AccountFormComponent } from '../account-form/account-form.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Contas</h2>
        <button mat-raised-button color="primary" (click)="openAccountForm()">
          Nova Conta
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let account of accounts" 
             class="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">{{ account.name }}</h3>
              <p class="text-sm text-gray-500">{{ getAccountTypeLabel(account.type) }}</p>
            </div>
            <button mat-icon-button [matMenuTriggerFor]="menu" class="text-gray-400 hover:text-gray-600">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="openAccountForm(account)">
                <mat-icon>edit</mat-icon>
                <span>Editar</span>
              </button>
              <button mat-menu-item (click)="deleteAccount(account)">
                <mat-icon>delete</mat-icon>
                <span>Excluir</span>
              </button>
            </mat-menu>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Saldo Atual</span>
              <span class="text-xl font-bold" [ngClass]="{
                'text-green-600': account.balance > 0,
                'text-red-600': account.balance < 0,
                'text-gray-600': account.balance === 0
              }">
                {{ account.balance | currency:'BRL' }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Saldo Inicial</span>
              <span class="text-lg">{{ account.initialBalance | currency:'BRL' }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>Status: {{ account.isActive ? 'Ativa' : 'Inativa' }}</span>
              <span>{{ account.updatedAt | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mat-icon {
      @apply transition-colors duration-200;
    }

    button {
      @apply transition-all duration-200;
    }

    button:hover {
      @apply transform scale-105;
    }
  `]
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error) => {
        console.error('Erro ao carregar contas:', error);
        this.snackBar.open('Erro ao carregar contas. Tente novamente.', 'Fechar', {
          duration: 3000
        });
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

  deleteAccount(account: Account) {
    if (confirm(`Tem certeza que deseja excluir a conta "${account.name}"?`)) {
      this.accountService.deleteAccount(account.id).subscribe({
        next: () => {
          this.snackBar.open('Conta excluída com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.loadAccounts();
        },
        error: (error) => {
          console.error('Erro ao excluir conta:', error);
          this.snackBar.open('Erro ao excluir conta. Tente novamente.', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  getAccountTypeLabel(type: AccountType): string {
    const types = {
      'CHECKING': 'Conta Corrente',
      'SAVINGS': 'Conta Poupança',
      'CREDIT_CARD': 'Cartão de Crédito',
      'INVESTMENT': 'Investimento'
    };
    return types[type] || type;
  }
} 