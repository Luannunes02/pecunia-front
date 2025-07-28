import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../../services/account.service';
import { Account, AccountType } from '../../../interfaces/transaction.interface';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccountFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Account,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      initialBalance: [0, [positiveNumberValidator()]]
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const account: Partial<Account> = this.form.value;
      
      if (this.data) {
        this.accountService.updateAccount(this.data.id, account).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showMessage('Conta atualizada com sucesso');
          },
          error: (error) => {
            console.error('Erro ao atualizar conta:', error);
            this.showMessage('Erro ao atualizar conta');
          }
        });
      } else {
        this.accountService.createAccount(account).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showMessage('Conta criada com sucesso');
          },
          error: (error) => {
            console.error('Erro ao criar conta:', error);
            this.showMessage('Erro ao criar conta');
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

function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return { required: true };
    }

    const numberValue = Number(value);

    if (isNaN(numberValue) || numberValue <= 0) {
      return { positiveNumber: true };
    }

    return null;
  };
}