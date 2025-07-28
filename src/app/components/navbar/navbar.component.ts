import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary" class="bg-white border-b border-gray-200">
      <span class="text-gray-800 font-medium">Pecunia</span>
      <span class="flex-1"></span>
      <button mat-icon-button class="text-gray-600">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button class="text-gray-600">
        <mat-icon>settings</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent {} 