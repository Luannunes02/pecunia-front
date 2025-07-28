import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { CategoryService } from '../../../services/category.service';
import { Transaction, Account, Category } from '../../../interfaces/transaction.interface';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">
        {{ data ? 'Editar' : 'Nova' }} Transação
      </h2>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- Tipo -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Tipo</mat-label>
            <mat-select formControlName="type">
              <mat-option value="INCOME">Receita</mat-option>
              <mat-option value="EXPENSE">Despesa</mat-option>
              <mat-option value="TRANSFER">Transferência</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Valor -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Valor</mat-label>
            <input matInput type="number" formControlName="amount" placeholder="0.00">
            <span matPrefix>R$&nbsp;</span>
          </mat-form-field>
        </div>

        <!-- Descrição -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Descrição</mat-label>
          <input matInput formControlName="description" placeholder="Digite a descrição">
        </mat-form-field>

        <div class="grid grid-cols-2 gap-4">
          <!-- Data -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Data</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="transactionDate" [value]="form.get('transactionDate')?.value">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker startView="month" [startAt]="form.get('transactionDate')?.value"></mat-datepicker>
          </mat-form-field>

          <!-- Conta -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Conta</mat-label>
            <mat-select formControlName="accountId">
              <mat-option *ngFor="let account of accounts" [value]="account.id">
                {{ account.name }} ({{ account.type }})
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Categoria (se não for transferência) -->
        <mat-form-field appearance="fill" class="w-full" *ngIf="form.get('type')?.value !== 'TRANSFER'">
          <mat-label>Categoria</mat-label>
          <mat-select formControlName="categoryId">
            <mat-option *ngFor="let category of categories" [value]="category.id">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" [style.background-color]="category.color"></div>
                {{ category.name }}
              </div>
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Conta de Destino (se for transferência) -->
        <mat-form-field appearance="fill" class="w-full" *ngIf="form.get('type')?.value === 'TRANSFER'">
          <mat-label>Conta de Destino</mat-label>
          <mat-select formControlName="destinationAccountId">
            <mat-option *ngFor="let account of accounts" [value]="account.id" [disabled]="account.id === form.get('accountId')?.value">
              {{ account.name }} ({{ account.type }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="flex items-center space-x-6">
          <mat-checkbox formControlName="isPaid" color="primary">Transação já paga</mat-checkbox>
          <mat-checkbox formControlName="isRecurring" color="primary">Transação recorrente</mat-checkbox>
        </div>

        <!-- Frequência (se for recorrente) -->
        <mat-form-field appearance="fill" class="w-full" *ngIf="form.get('isRecurring')?.value">
          <mat-label>Frequência</mat-label>
          <mat-select formControlName="recurringFrequency">
            <mat-option value="DAILY">Diária</mat-option>
            <mat-option value="WEEKLY">Semanal</mat-option>
            <mat-option value="MONTHLY">Mensal</mat-option>
            <mat-option value="YEARLY">Anual</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            mat-button
            (click)="onCancel()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            mat-raised-button
            color="primary"
            [disabled]="form.invalid"
          >
            {{ data ? 'Salvar' : 'Criar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    mat-form-field {
      width: 100%;
    }

    .mat-mdc-form-field {
      margin-bottom: -1.25em;
    }

    .mat-mdc-form-field-appearance-fill .mat-mdc-form-field-flex {
      background-color: #f8fafc;
    }

    .mat-mdc-form-field-appearance-fill .mat-mdc-form-field-flex:hover {
      background-color: #f1f5f9;
    }

    .mat-mdc-form-field-appearance-fill .mat-mdc-form-field-flex:focus-within {
      background-color: #f1f5f9;
    }

    .mat-mdc-form-field-appearance-fill .mat-mdc-form-field-infix {
      padding-top: 0.5em;
      padding-bottom: 0.5em;
    }

    .mat-mdc-form-field-appearance-fill .mat-mdc-form-field-subscript-wrapper {
      padding: 0;
    }

    .mat-mdc-checkbox {
      margin-right: 0;
    }
  `]
})
export class TransactionFormComponent implements OnInit {
  form: FormGroup;
  accounts: Account[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      transactionDate: ['', Validators.required],
      accountId: ['', Validators.required],
      categoryId: [''],
      destinationAccountId: [''],
      isPaid: [true],
      isRecurring: [false],
      recurringFrequency: ['']
    });

    if (data) {
      this.form.patchValue({
        ...data,
        transactionDate: Array.isArray(data.transactionDate)
          ? new Date(
              data.transactionDate[0],
              data.transactionDate[1] - 1, // JS Date usa mês 0-based
              data.transactionDate[2],
              data.transactionDate[3] || 0,
              data.transactionDate[4] || 0
            )
          : data.transactionDate
      });
    }
  }

  ngOnInit() {
    this.loadAccounts();
    this.loadCategories();

    this.form.get('type')?.valueChanges.subscribe(type => {
      if (type === 'TRANSFER') {
        this.form.get('categoryId')?.clearValidators();
        this.form.get('destinationAccountId')?.setValidators(Validators.required);
      } else {
        this.form.get('categoryId')?.setValidators(Validators.required);
        this.form.get('destinationAccountId')?.clearValidators();
      }
      this.form.get('categoryId')?.updateValueAndValidity();
      this.form.get('destinationAccountId')?.updateValueAndValidity();
    });

    this.form.get('isRecurring')?.valueChanges.subscribe(isRecurring => {
      if (isRecurring) {
        this.form.get('recurringFrequency')?.setValidators(Validators.required);
      } else {
        this.form.get('recurringFrequency')?.clearValidators();
      }
      this.form.get('recurringFrequency')?.updateValueAndValidity();
    });
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error) => {
        console.error('Erro ao carregar contas:', error);
        this.showMessage('Erro ao carregar contas');
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.showMessage('Erro ao carregar categorias');
        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.patchValue({ destinationAccountId: this.form.value.accountId });
      const transaction: Partial<Transaction> = this.form.value;
      
      if (this.data) {
        this.transactionService.updateTransaction(this.data.id, transaction).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showMessage('Transação atualizada com sucesso');
          },
          error: (error) => {
            console.error('Erro ao atualizar transação:', error);
            this.showMessage('Erro ao atualizar transação');
            if (error.status === 403) {
              this.router.navigate(['/login']);
            }
          }
        });
      } else {
        this.transactionService.createTransaction(transaction).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showMessage('Transação criada com sucesso');
          },
          error: (error) => {
            console.error('Erro ao criar transação:', error);
            this.showMessage('Erro ao criar transação');
            if (error.status === 403) {
              this.router.navigate(['/login']);
            }
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
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