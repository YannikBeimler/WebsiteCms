import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatCardModule, MatFormFieldModule],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onEmailLogin()">
            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>
            <mat-form-field appearance="fill">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid">Login with Email</button>
          </form>
          <div class="divider">OR</div>
          <button mat-raised-button color="accent" (click)="onGoogleLogin()">Login with Google</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
    mat-card { width: 300px; padding: 20px; }
    form { display: flex; flex-direction: column; gap: 15px; }
    .divider { text-align: center; margin: 15px 0; color: #666; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onEmailLogin() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.loginWithEmail(email!, password!);
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Login failed', error);
        // Handle error (e.g., show snackbar)
      }
    }
  }

  async onGoogleLogin() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Google login failed', error);
      // Handle error
    }
  }
}
