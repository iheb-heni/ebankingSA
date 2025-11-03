import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-gradient-primary">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-4 col-lg-5 col-md-6">
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div class="card-body p-5">
                <!-- Logo et titre -->
                <div class="text-center mb-5">
                  <div class="logo-container mb-3">
                    <i class="fas fa-university fa-3x text-primary"></i>
                  </div>
                  <h2 class="h3 fw-bold text-dark mb-2">Bienvenue sur SecureBank</h2>
                  <p class="text-muted">Connectez-vous à votre espace client</p>
                </div>

                <!-- Formulaire de connexion -->
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="mb-4">
                    <label for="email" class="form-label fw-semibold text-dark">
                      <i class="fas fa-envelope me-2 text-primary"></i>Email
                    </label>
                    <input
                      type="email"
                      class="form-control form-control-lg rounded-pill px-4"
                      [class.is-invalid]="isFieldInvalid('email')"
                      id="email"
                      formControlName="email"
                      placeholder="votre.email@example.com">
                    @if (isFieldInvalid('email')) {
                      <div class="invalid-feedback">
                        @if (loginForm.get('email')?.errors?.['required']) {
                          L'email est requis
                        }
                        @if (loginForm.get('email')?.errors?.['email']) {
                          Format d'email invalide
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-4">
                    <label for="password" class="form-label fw-semibold text-dark">
                      <i class="fas fa-lock me-2 text-primary"></i>Mot de passe
                    </label>
                    <div class="position-relative">
                      <input
                        [type]="showPassword ? 'text' : 'password'"
                        class="form-control form-control-lg rounded-pill px-4 pe-5"
                        [class.is-invalid]="isFieldInvalid('password')"
                        id="password"
                        formControlName="password"
                        placeholder="••••••••">
                      <button
                        type="button"
                        class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                        (click)="togglePassword()">
                        <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
                      </button>
                    </div>
                    @if (isFieldInvalid('password')) {
                      <div class="invalid-feedback">
                        Le mot de passe est requis
                      </div>
                    }
                  </div>

                  <!-- Options -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="rememberMe">
                      <label class="form-check-label text-muted small" for="rememberMe">
                        Se souvenir de moi
                      </label>
                    </div>
                    <a href="#" class="text-primary text-decoration-none small">
                      Mot de passe oublié ?
                    </a>
                  </div>

                  @if (errorMessage) {
                    <div class="alert alert-danger rounded-pill d-flex align-items-center mb-4">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      {{ errorMessage }}
                    </div>
                  }

                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100 rounded-pill fw-semibold mb-4 btn-gradient"
                    [disabled]="loginForm.invalid || loading">
                    @if (loading) {
                      <div class="d-flex align-items-center justify-content-center">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Connexion en cours...
                      </div>
                    } @else {
                      <i class="fas fa-sign-in-alt me-2"></i>
                      Se connecter
                    }
                  </button>
                </form>

                <!-- Lien d'inscription -->
                <div class="text-center">
                  <div class="border-top pt-4">
                    <p class="text-muted mb-0">
                      Nouveau client ?
                      <a routerLink="/register" class="text-primary text-decoration-none fw-semibold">
                        Ouvrir un compte
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer sécurité -->
            <div class="text-center mt-4">
              <div class="d-flex justify-content-center align-items-center text-white-50 small">
                <i class="fas fa-shield-alt me-2"></i>
                <span>Connexion sécurisée SSL 256-bit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient-primary {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
      position: relative;
      overflow: hidden;
    }

    .bg-gradient-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><circle cx="200" cy="300" r="100" fill="rgba(255,255,255,0.03)"/><circle cx="800" cy="200" r="150" fill="rgba(255,255,255,0.02)"/><circle cx="600" cy="700" r="120" fill="rgba(255,255,255,0.03)"/></svg>');
    }

    .card {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-container {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .logo-container i {
      color: white !important;
    }

    .form-control {
      border: 2px solid #e3e6f0;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .btn-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-gradient:active {
      transform: translateY(0);
    }

    .form-label {
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .alert {
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.2);
      color: #dc3545;
    }

    .form-check-input:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
    .form-check-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private router = inject(Router);
  loginForm: FormGroup;
  showPassword = false

  loading = false;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      const loginData: LoginRequest = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        }
        , error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur de connexion. Veuillez réessayer.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
