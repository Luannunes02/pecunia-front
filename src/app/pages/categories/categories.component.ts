import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from './category-form/category-form.component';
import { Category } from '../../interfaces/transaction.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="categories-container p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Categorias</h1>
        <button
          (click)="openCategoryForm()"
          class="px-4 py-2 bg-pecunia-dark-green text-white rounded-md hover:bg-pecunia-light-green transition-colors duration-200"
        >
          Nova Categoria
        </button>
      </div>

      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-lg shadow overflow-hidden">
        <mat-tab-group (selectedTabChange)="onTabChange($event)">
          <mat-tab label="Receitas">
            <table mat-table [dataSource]="incomeCategories" class="w-full">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let category">{{ category.name }}</td>
              </ng-container>

              <ng-container matColumnDef="icon">
                <th mat-header-cell *matHeaderCellDef>Ícone</th>
                <td mat-cell *matCellDef="let category">
                  <mat-icon [style.color]="category.colorHex">{{ category.iconName }}</mat-icon>
                </td>
              </ng-container>

              <ng-container matColumnDef="color">
                <th mat-header-cell *matHeaderCellDef>Cor</th>
                <td mat-cell *matCellDef="let category">
                  <div class="w-6 h-6 rounded-full" [style.background-color]="category.colorHex"></div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let category">
                  <button
                    (click)="editCategory(category)"
                    class="text-gray-600 hover:text-pecunia-dark-green mr-2"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    (click)="deleteCategory(category)"
                    class="text-gray-600 hover:text-red-600"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-tab>

          <mat-tab label="Despesas">
            <table mat-table [dataSource]="expenseCategories" class="w-full">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nome</th>
                <td mat-cell *matCellDef="let category">{{ category.name }}</td>
              </ng-container>

              <ng-container matColumnDef="icon">
                <th mat-header-cell *matHeaderCellDef>Ícone</th>
                <td mat-cell *matCellDef="let category">
                  <mat-icon [style.color]="category.colorHex">{{ category.iconName }}</mat-icon>
                </td>
              </ng-container>

              <ng-container matColumnDef="color">
                <th mat-header-cell *matHeaderCellDef>Cor</th>
                <td mat-cell *matCellDef="let category">
                  <div class="w-6 h-6 rounded-full" [style.background-color]="category.colorHex"></div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let category">
                  <button
                    (click)="editCategory(category)"
                    class="text-gray-600 hover:text-pecunia-dark-green mr-2"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    (click)="deleteCategory(category)"
                    class="text-gray-600 hover:text-red-600"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
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

    .mat-column-icon {
      @apply w-24 text-center;
    }

    .mat-column-color {
      @apply w-24 text-center;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];
  displayedColumns: string[] = ['name', 'icon', 'color', 'actions'];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterCategories();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.showMessage('Erro ao carregar categorias');
        this.loading = false;
      }
    });
  }

  filterCategories() {
    this.incomeCategories = this.categories.filter(category => category.type === 'INCOME');
    this.expenseCategories = this.categories.filter(category => category.type === 'EXPENSE');
  }

  onTabChange(event: any) {
    // Opcional: implementar lógica adicional ao mudar de aba
  }

  openCategoryForm(category?: Category) {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      data: category,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  editCategory(category: Category) {
    this.openCategoryForm(category);
  }

  deleteCategory(category: Category) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
          this.showMessage('Categoria excluída com sucesso');
        },
        error: (error) => {
          console.error('Erro ao excluir categoria:', error);
          this.showMessage('Erro ao excluir categoria');
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