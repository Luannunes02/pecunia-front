import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/transaction.interface';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['EXPENSE', Validators.required],
      colorHex: ['#7b2cbf']
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const category: Partial<Category> = this.form.value;
      
      if (this.data) {
        this.categoryService.updateCategory(this.data.id, category).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showMessage('Categoria atualizada com sucesso');
          },
          error: (error) => {
            console.error('Erro ao atualizar categoria:', error);
            this.showMessage('Erro ao atualizar categoria', 'error');
          }
        });
      } else {
        this.categoryService.createCategory(category).subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.showMessage('Categoria criada com sucesso');
          },
          error: (error) => {
            console.error('Erro ao criar categoria:', error);
            this.showMessage('Erro ao criar categoria', 'error');
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
    });
  }
}