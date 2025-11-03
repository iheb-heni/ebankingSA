import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    const token = this.getToken();
    const userData = localStorage.getItem('currentUser');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

register(data: RegisterRequest): Observable<any> {
  return this.http.post(`${environment.apiUrl}/auth/register`, data, {
    responseType: 'text' // Accepter du texte au lieu de JSON
  }).pipe(
    tap((response: string) => {
      // Si c'est du texte simple, créer une réponse d'authentification manuellement
      // Ou rediriger directement vers la page de login
      this.router.navigate(['/login']);
    }),
    catchError(error => {
      console.error('Register error:', error);
      throw error;
    })
  );
}
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => this.handleLogout()),
        catchError(() => {
          // Même si l'appel API échoue, on déconnecte localement
          this.handleLogout();
          return of(null);
        })
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const user: User = {
      id: response.id,
      name: response.name,
      email: response.email
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  private handleLogout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}
