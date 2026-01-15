import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from 'src/app/shared/material/material.imports';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterRequest } from 'src/app/core/models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ...MATERIAL_MODULES],
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  signupForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]], 
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  hidePassword = true;
  isLoading = false;

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true

      const payload: RegisterRequest = {
        fullName: this.signupForm.value.fullName!,
        email: this.signupForm.value.email!,
        password: this.signupForm.value.password!
      }
      this.authService.register(payload).subscribe({
        next: (response) => {
          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Erro ao realizar cadastro. Tente novamente.', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Erro no registro:', err);
        }
      })
    }
  }
}
