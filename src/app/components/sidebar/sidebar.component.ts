import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="h-full flex flex-col bg-white border-r border-gray-200">
      <!-- Menu Items -->
      <nav class="flex-1 p-4 space-y-2">
        <a
          routerLink="/home"
          class="flex items-center px-4 py-2"
        >
          <img class="mx-auto h-12 w-auto" src="assets/logo.png" alt="Pecunia">
        </a>

        <a
          routerLink="/dashboard"
          routerLinkActive="bg-pecunia-light-green text-pecunia-dark-green"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <mat-icon class="mr-3">dashboard</mat-icon>
          Dashboard
        </a>

        <a
          routerLink="/transactions"
          routerLinkActive="bg-pecunia-light-green text-pecunia-dark-green"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <mat-icon class="mr-3">swap_horiz</mat-icon>
          Transações
        </a>

        <a
          routerLink="/accounts"
          routerLinkActive="bg-pecunia-light-green text-pecunia-dark-green"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <mat-icon class="mr-3">account_balance</mat-icon>
          Contas
        </a>

        <a
          routerLink="/categories"
          routerLinkActive="bg-pecunia-light-green text-pecunia-dark-green"
          class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <mat-icon class="mr-3">category</mat-icon>
          Categorias
        </a>
      </nav>

      <!-- Logout Button -->
      <div class="p-4 border-t border-gray-200">
        <button
          mat-button
          class="w-full flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          (click)="logout()"
          matTooltip="Sair"
        >
          <mat-icon class="mr-2">logout</mat-icon>
          Sair
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
} 