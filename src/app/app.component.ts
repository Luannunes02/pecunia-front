import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <ng-container *ngIf="isLoggedIn">
        <div class="flex h-screen">
          <app-sidebar></app-sidebar>
          <main class="flex-1 p-6 overflow-auto">
            <router-outlet></router-outlet>
          </main>
        </div>
      </ng-container>
      <ng-container *ngIf="!isLoggedIn">
        <main class="w-full">
          <router-outlet></router-outlet>
        </main>
      </ng-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {
    this.checkAuth();
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.getAuthState().subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkAuth(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }
}
