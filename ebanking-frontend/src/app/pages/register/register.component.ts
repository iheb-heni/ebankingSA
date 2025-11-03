import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-gradient-primary">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-5 col-lg-6 col-md-7">
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div class="card-body p-5">
                <!-- En-tête -->
                <div class="text-center mb-5">
                  <div class="logo-container mb-3">
                    <i class="fas fa-user-plus fa-3x text-primary"></i>
                  </div>
                  <h2 class="h3 fw-bold text-dark mb-2">Ouvrir votre compte</h2>
                  <p class="text-muted">Rejoignez SecureBank en quelques minutes</p>
                </div>

                <!-- Formulaire d'inscription -->
                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                  <div class="mb-4">
                    <label for="name" class="form-label fw-semibold text-dark">
                      <i class="fas fa-user me-2 text-primary"></i>Nom complet
                    </label>
                    <input
                      type="text"
                      class="form-control form-control-lg rounded-pill px-4"
                      [class.is-invalid]="isFieldInvalid('name')"
                      id="name"
                      formControlName="name"
                      placeholder="Jean Dupont">
                    @if (isFieldInvalid('name')) {
                      <div class="invalid-feedback">
                        @if (registerForm.get('name')?.errors?.['required']) {
                          Le nom est requis
                        }
                        @if (registerForm.get('name')?.errors?.['minlength']) {
                          Le nom doit contenir au moins 2 caractères
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-4">
                    <label for="email" class="form-label fw-semibold text-dark">
                      <i class="fas fa-envelope me-2 text-primary"></i>Adresse email
                    </label>
                    <input
                      type="email"
                      class="form-control form-control-lg rounded-pill px-4"
                      [class.is-invalid]="isFieldInvalid('email')"
                      id="email"
                      formControlName="email"
                      placeholder="jean.dupont@example.com">
                    @if (isFieldInvalid('email')) {
                      <div class="invalid-feedback">
                        @if (registerForm.get('email')?.errors?.['required']) {
                          L'email est requis
                        }
                        @if (registerForm.get('email')?.errors?.['email']) {
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
                        @if (registerForm.get('password')?.errors?.['required']) {
                          Le mot de passe est requis
                        }
                        @if (registerForm.get('password')?.errors?.['minlength']) {
                          Le mot de passe doit contenir au moins 6 caractères
                        }
                      </div>
                    }
                    <!-- Indicateur de force du mot de passe -->
                    @if (registerForm.get('password')?.value) {
                      <div class="password-strength mt-2">
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1" style="height: 4px;">
                            <div class="progress-bar"
                                 [style.width.%]="getPasswordStrength()"
                                 [ngClass]="getPasswordStrengthClass()"></div>
                          </div>
                          <span class="ms-2 small text-muted">{{ getPasswordStrengthText() }}</span>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="mb-4">
                    <label for="confirmPassword" class="form-label fw-semibold text-dark">
                      <i class="fas fa-check-circle me-2 text-primary"></i>Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      class="form-control form-control-lg rounded-pill px-4"
                      [class.is-invalid]="isFieldInvalid('confirmPassword')"
                      id="confirmPassword"
                      formControlName="confirmPassword"
                      placeholder="••••••••">
                    @if (isFieldInvalid('confirmPassword')) {
                      <div class="invalid-feedback">
                        @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                          La confirmation du mot de passe est requise
                        }
                        @if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                          Les mots de passe ne correspondent pas
                        }
                      </div>
                    }
                  </div>

                  <!-- Conditions d'utilisation -->
                  <div class="mb-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="acceptTerms"
                        formControlName="acceptTerms">
                      <label class="form-check-label text-muted small" for="acceptTerms">
                        J'accepte les
                        <a href="#" class="text-primary text-decoration-none">conditions d'utilisation</a>
                        et la
                        <a href="#" class="text-primary text-decoration-none">politique de confidentialité</a>
                      </label>
                    </div>
                    @if (isFieldInvalid('acceptTerms')) {
                      <div class="text-danger small mt-1">
                        Vous devez accepter les conditions d'utilisation
                      </div>
                    }
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
                    [disabled]="registerForm.invalid || loading">
                    @if (loading) {
                      <div class="d-flex align-items-center justify-content-center">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Création du compte...
                      </div>
                    } @else {
                      <i class="fas fa-user-plus me-2"></i>
                      Créer mon compte
                    }
                  </button>
                </form>

                <!-- Lien de connexion -->
                <div class="text-center">
                  <div class="border-top pt-4">
                    <p class="text-muted mb-0">
                      Déjà client ?
                      <a routerLink="/login" class="text-primary text-decoration-none fw-semibold">
                        Se connecter
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Avantages -->
            <div class="row mt-4">
              <div class="col-4 text-center">
                <div class="text-white-50 mb-2">
                  <i class="fas fa-shield-alt fa-2x"></i>
                </div>
                <small class="text-white-50">Sécurisé</small>
              </div>
              <div class="col-4 text-center">
                <div class="text-white-50 mb-2">
                  <i class="fas fa-clock fa-2x"></i>
                </div>
                <small class="text-white-50">Rapide</small>
              </div>
              <div class="col-4 text-center">
                <div class="text-white-50 mb-2">
                  <i class="fas fa-mobile-alt fa-2x"></i>
                </div>
                <small class="text-white-50">Mobile</small>
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
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
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

    .text-primary {
      color: #667eea !important;
    }

    .position-relative .btn-link {
      border: none;
      background: none;
      padding: 0;
      z-index: 10;
    }

    .position-relative .btn-link:focus {
      box-shadow: none;
    }

    .progress {
      border-radius: 2px;
      background-color: #e9ecef;
    }

    .progress-bar {
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    .progress-bar.bg-danger { background-color: #dc3545 !important; }
    .progress-bar.bg-warning { background-color: #ffc107 !important; }
    .progress-bar.bg-success { background-color: #28a745 !important; }

    .form-check-input:checked {
      background-color: #667eea;
      border-color: #667eea;
    }

    .form-check-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;

    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;

    return strength;
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'bg-danger';
    if (strength < 75) return 'bg-warning';
    return 'bg-success';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'Faible';
    if (strength < 75) return 'Moyen';
    return 'Fort';
  }

onSubmit(): void {
  if (this.registerForm.valid) {
    this.loading = true;
    this.errorMessage = '';

    const { confirmPassword, acceptTerms, ...registerData } = this.registerForm.value;
    const data: RegisterRequest = registerData;

    this.authService.register(data).subscribe({
      next: () => {
        this.loading = false;
        // Redirection vers la page login après inscription réussie
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création du compte. Veuillez réessayer.';
      }
    });
  }
}
}
