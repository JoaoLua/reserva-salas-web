import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroments';
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '../models/auth.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`

  private readonly urlRegister = `${this.apiUrl}/users/register`
  private readonly urlLogin = `${this.apiUrl}/auth/login`

  tokenKey = 'access_token'

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken())
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.urlLogin, data)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.accessToken)

          const expiresAt = Date.now() + (response.expiresIn * 1000);
          localStorage.setItem('expires_at', expiresAt.toString());

          this.isAuthenticatedSubject.next(true)
          console.log("Login Response: ", response)

        })
      )
  }

  register(data: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.urlRegister, data)
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem('expires_at');
    this.isAuthenticatedSubject.next(false)
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  public hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

}
