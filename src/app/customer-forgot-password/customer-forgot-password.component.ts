import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENDPOINT } from '../endpoint';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-forgot-password.component.html',
  styleUrl: './customer-forgot-password.component.css'
})
export class CustomerForgotPasswordComponent {

  email = '';
  private _snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient) {}

  submit() {
    if (!this.email) {
      this._snackBar.open('Enter your email', 'OK', { duration: 3000 });
      return;
    }

    // ✅ FIX: prevent CORS preflight by NOT using JSON
    const body = new URLSearchParams();
    body.set('email', this.email);

    this.http.post<any>(
      `${ENDPOINT.baseUrl}/forgot-password-customer.php`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).subscribe({
      next: (res) => {
        if (res.status) {
          this._snackBar.open('Reset link sent to your email 📧', 'OK', {
            duration: 3000
          });
        } else {
          this._snackBar.open(res.message || 'Something went wrong', 'OK', {
            duration: 3000
          });
        }
      },
      error: (err) => {
        console.error(err);
        this._snackBar.open('Server error. Try again later.', 'OK', {
          duration: 3000
        });
      }
    });
  }
}