
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- En-tête de bienvenue -->
      <div class="welcome-section bg-gradient-primary text-white py-5 mb-4">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="display-6 fw-bold mb-3">
                <i class="fas fa-sun me-3 text-warning"></i>
                Bonjour {{ currentUser?.name }} !
              </h1>
              <p class="lead mb-0 opacity-75">
                Bienvenue dans votre espace client SecureBank
              </p>
              <small class="opacity-50">Dernière connexion : {{ getCurrentDate() }}</small>
            </div>
            <div class="col-md-4 text-end">
              <div class="d-inline-flex align-items-center bg-white bg-opacity-10 rounded-pill px-4 py-2">
                <i class="fas fa-shield-alt me-2 text-success"></i>
                <span class="small fw-semibold">Compte sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Cartes de résumé des comptes -->
        <div class="row mb-5">
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="card account-card h-100 border-0 shadow-sm hover-lift">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 class="card-subtitle text-muted mb-1">Compte Courant</h6>
                    <p class="card-text small text-muted mb-0">**** **** **** 1234</p>
                  </div>
                  <div class="account-type-badge bg-primary">
                    <i class="fas fa-credit-card text-white"></i>
                  </div>
                </div>
                <h3 class="card-title text-dark mb-3">2 450,75 €</h3>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="small text-success">
                    <i class="fas fa-arrow-up me-1"></i>
                    +125,50 € ce mois
                  </span>
                  <button class="btn btn-outline-primary btn-sm rounded-pill">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-6 mb-4">
            <div class="card account-card h-100 border-0 shadow-sm hover-lift">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 class="card-subtitle text-muted mb-1">Épargne</h6>
                    <p class="card-text small text-muted mb-0">**** **** **** 5678</p>
                  </div>
                  <div class="account-type-badge bg-success">
                    <i class="fas fa-piggy-bank text-white"></i>
                  </div>
                </div>
                <h3 class="card-title text-dark mb-3">8 920,30 €</h3>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="small text-success">
                    <i class="fas fa-percentage me-1"></i>
                    +2,1% annuel
                  </span>
                  <button class="btn btn-outline-success btn-sm rounded-pill">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-12 mb-4">
            <div class="card account-card h-100 border-0 shadow-sm hover-lift">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 class="card-subtitle text-muted mb-1">Crédit Auto</h6>
                    <p class="card-text small text-muted mb-0">Échéance dans 24 mois</p>
                  </div>
                  <div class="account-type-badge bg-warning">
                    <i class="fas fa-car text-white"></i>
                  </div>
                </div>
                <h3 class="card-title text-dark mb-3">-5 240,15 €</h3>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="small text-info">
                    <i class="fas fa-calendar me-1"></i>
                    Mensualité : 245€
                  </span>
                  <button class="btn btn-outline-warning btn-sm rounded-pill">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="row mb-5">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-transparent border-0 pt-4 px-4">
                <h5 class="card-title mb-0">
                  <i class="fas fa-bolt me-2 text-primary"></i>
                  Actions rapides
                </h5>
              </div>
              <div class="card-body p-4">
                <div class="row g-3">
                  <div class="col-lg-3 col-md-6">
                    <button class="btn btn-outline-primary w-100 h-100 py-3 border-2 hover-lift">
                      <i class="fas fa-exchange-alt fa-2x mb-2 d-block"></i>
                      <div class="fw-semibold">Virement</div>
                      <small class="text-muted">Instantané</small>
                    </button>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <button class="btn btn-outline-success w-100 h-100 py-3 border-2 hover-lift">
                      <i class="fas fa-mobile-alt fa-2x mb-2 d-block"></i>
                      <div class="fw-semibold">Recharge Mobile</div>
                      <small class="text-muted">Tous opérateurs</small>
                    </button>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <button class="btn btn-outline-info w-100 h-100 py-3 border-2 hover-lift">
                      <i class="fas fa-file-invoice fa-2x mb-2 d-block"></i>
                      <div class="fw-semibold">Payer Facture</div>
                      <small class="text-muted">Eau, électricité...</small>
                    </button>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <button class="btn btn-outline-warning w-100 h-100 py-3 border-2 hover-lift">
                      <i class="fas fa-chart-line fa-2x mb-2 d-block"></i>
                      <div class="fw-semibold">Investir</div>
                      <small class="text-muted">Actions, obligations</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dernières transactions et notifications -->
        <div class="row">
          <!-- Dernières transactions -->
          <div class="col-lg-8 mb-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-transparent border-0 pt-4 px-4">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">
                    <i class="fas fa-history me-2 text-primary"></i>
                    Dernières transactions
                  </h5>
                  <a href="#" class="text-primary text-decoration-none small fw-semibold">
                    Voir tout <i class="fas fa-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 px-4 py-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex align-items-center">
                        <div class="transaction-icon bg-success bg-opacity-10 text-success me-3">
                          <i class="fas fa-arrow-down"></i>
                        </div>
                        <div>
                          <div class="fw-semibold">Salaire - Entreprise ABC</div>
                          <small class="text-muted">Aujourd'hui, 08:30</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-success">+2 500,00 €</div>
                        <small class="text-muted">Virement reçu</small>
                      </div>
                    </div>
                  </div>

                  <div class="list-group-item border-0 px-4 py-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex align-items-center">
                        <div class="transaction-icon bg-danger bg-opacity-10 text-danger me-3">
                          <i class="fas fa-arrow-up"></i>
                        </div>
                        <div>
                          <div class="fw-semibold">Loyer - Agence Immobilière</div>
                          <small class="text-muted">Hier, 14:25</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-danger">-850,00 €</div>
                        <small class="text-muted">Virement émis</small>
                      </div>
                    </div>
                  </div>

                  <div class="list-group-item border-0 px-4 py-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex align-items-center">
                        <div class="transaction-icon bg-info bg-opacity-10 text-info me-3">
                          <i class="fas fa-credit-card"></i>
                        </div>
                        <div>
                          <div class="fw-semibold">Supermarché Carrefour</div>
                          <small class="text-muted">Hier, 18:45</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-danger">-67,30 €</div>
                        <small class="text-muted">Paiement carte</small>
                      </div>
                    </div>
                  </div>

                  <div class="list-group-item border-0 px-4 py-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex align-items-center">
                        <div class="transaction-icon bg-warning bg-opacity-10 text-warning me-3">
                          <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div>
                          <div class="fw-semibold">Recharge Orange</div>
                          <small class="text-muted">2 jours, 10:15</small>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-danger">-20,00 €</div>
                        <small class="text-muted">Recharge mobile</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications et conseils -->
          <div class="col-lg-4 mb-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-transparent border-0 pt-4 px-4">
                <h5 class="card-title mb-0">
                  <i class="fas fa-bell me-2 text-warning"></i>
                  Notifications
                </h5>
              </div>
              <div class="card-body p-4">
                <div class="notification-item mb-4 p-3 bg-light rounded-3">
                  <div class="d-flex align-items-start">
                    <i class="fas fa-info-circle text-primary me-3 mt-1"></i>
                    <div>
                      <div class="fw-semibold mb-1">Nouveau service</div>
                      <p class="small text-muted mb-0">
                        Découvrez notre nouvelle fonction de paiement sans contact.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="notification-item mb-4 p-3 bg-light rounded-3">
                  <div class="d-flex align-items-start">
                    <i class="fas fa-chart-pie text-success me-3 mt-1"></i>
                    <div>
                      <div class="fw-semibold mb-1">Conseil épargne</div>
                      <p class="small text-muted mb-0">
                        Vous pourriez économiser 150€/mois. Consultez nos conseils.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="notification-item mb-4 p-3 bg-light rounded-3">
                  <div class="d-flex align-items-start">
                    <i class="fas fa-shield-alt text-warning me-3 mt-1"></i>
                    <div>
                      <div class="fw-semibold mb-1">Sécurité</div>
                      <p class="small text-muted mb-0">
                        Activez l'authentification à deux facteurs pour plus de sécurité.
                      </p>
                    </div>
                  </div>
                </div>

                <button class="btn btn-primary w-100 rounded-pill">
                  <i class="fas fa-envelope me-2"></i>
                  Voir tous les messages
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques et graphiques -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-transparent border-0 pt-4 px-4">
                <h5 class="card-title mb-0">
                  <i class="fas fa-chart-area me-2 text-success"></i>
                  Évolution de vos comptes
                </h5>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <div class="text-center p-3 bg-primary bg-opacity-10 rounded-3">
                      <i class="fas fa-wallet fa-2x text-primary mb-2"></i>
                      <div class="h4 mb-1">11 370,05 €</div>
                      <small class="text-muted">Total des avoirs</small>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="text-center p-3 bg-success bg-opacity-10 rounded-3">
                      <i class="fas fa-arrow-trend-up fa-2x text-success mb-2"></i>
                      <div class="h4 mb-1">+8,3%</div>
                      <small class="text-muted">Cette année</small>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="text-center p-3 bg-warning bg-opacity-10 rounded-3">
                      <i class="fas fa-calendar-day fa-2x text-warning mb-2"></i>
                      <div class="h4 mb-1">245,00 €</div>
                      <small class="text-muted">Charges mensuelles</small>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="text-center p-3 bg-info bg-opacity-10 rounded-3">
                      <i class="fas fa-star fa-2x text-info mb-2"></i>
                      <div class="h4 mb-1">Premium</div>
                      <small class="text-muted">Statut du compte</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    }

    .welcome-section {
      position: relative;
      overflow: hidden;
    }

    .welcome-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><circle cx="100" cy="100" r="50" fill="rgba(255,255,255,0.05)"/><circle cx="900" cy="200" r="80" fill="rgba(255,255,255,0.03)"/><circle cx="300" cy="600" r="60" fill="rgba(255,255,255,0.04)"/></svg>');
    }

    .account-card {
      transition: all 0.3s ease;
    }

    .hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }

    .account-type-badge {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .transaction-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      border-radius: 15px !important;
    }

    .card-header {
      border-radius: 15px 15px 0 0 !important;
    }

    .btn {
      transition: all 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .notification-item {
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .notification-item:hover {
      border-color: #dee2e6;
      background-color: #ffffff !important;
      transform: translateY(-2px);
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }

    .list-group-item {
      transition: all 0.3s ease;
    }

    .list-group-item:hover {
      background-color: #f8f9fa;
    }

    .rounded-pill {
      border-radius: 50rem !important;
    }

    .text-success {
      color: #28a745 !important;
    }

    .text-danger {
      color: #dc3545 !important;
    }

    .text-primary {
      color: #667eea !important;
    }

    .bg-primary {
      background-color: #667eea !important;
    }

    .btn-outline-primary {
      color: #667eea;
      border-color: #667eea;
    }

    .btn-outline-primary:hover {
      background-color: #667eea;
      border-color: #667eea;
    }

    .btn-primary {
      background-color: #667eea;
      border-color: #667eea;
    }

    @media (max-width: 768px) {
      .welcome-section {
        padding: 3rem 0 !important;
      }

      .display-6 {
        font-size: 1.75rem;
      }

      .account-card {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);

  currentUser: User | null = null;

  constructor() {
    this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
