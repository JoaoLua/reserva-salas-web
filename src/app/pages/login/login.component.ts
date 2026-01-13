import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from 'src/app/shared/material/material.imports';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest } from 'src/app/core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ...MATERIAL_MODULES],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  hidePassword = true;
  isloading = false

  onSubmit() {
    if (this.loginForm.valid) {
      this.isloading = true
      const payload: LoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      }

      this.authService.login(payload).subscribe({
        next: (response) => {
          this.isloading = false
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          this.isloading = false
          this.snackBar.open('Email ou senha incorretos.', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          })
        }
      })
    }
  }
}
