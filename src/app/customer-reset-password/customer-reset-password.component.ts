import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ENDPOINT } from '../endpoint';
import { MatSnackBar } from '@angular/material/snack-bar'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-reset-password.component.html',
  styleUrl: './customer-reset-password.component.css'
})
export class CustomerResetPasswordComponent {
     password = '';
  confirmPassword = '';
  token = '';
    private _snackBar = inject(MatSnackBar);
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,

  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  reset() {

    if (!this.password || !this.confirmPassword) {
      this._snackBar.open('Fill all fields', 'OK', { duration: 3000 });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this._snackBar.open('Passwords do not match', 'OK', { duration: 3000 });
      return;
    }

    this.http.post<any>(`${ENDPOINT.baseUrl}/reset-password-customer.php`, {
      token: this.token,
      password: this.password
    }).subscribe(res => {

      if (res.status) {
        this._snackBar.open('Password updated', 'OK', { duration: 3000 });
        this.router.navigate(['/customersignin']);
      } else {
        this._snackBar.open(res.message, 'OK', { duration: 3000 });
      }

    });
  }
}
