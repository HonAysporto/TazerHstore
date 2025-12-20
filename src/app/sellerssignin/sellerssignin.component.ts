import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sellerssignin',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sellerssignin.component.html',
  styleUrls: ['./sellerssignin.component.css']
})
export class SellerssigninComponent {

  private _snackBar = inject(MatSnackBar);
  public seller: any = {};

  formone: FormGroup;

  constructor(
    private builder: FormBuilder,
    private http: HttpClient,
    private route: Router
  ) {
    this.formone = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (!this.formone.valid) {
      this._snackBar.open('Please fill in all fields correctly', 'Dismiss', { duration: 3000 });
      return;
    }

    const details = { ...this.formone.value };

    this.http.post('http://localhost/tazerhstore/sellersignin.php', details)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this._snackBar.open(data.msg, 'Continue', { duration: 3000 });

          if (data.status) {
            this.seller = data.seller;

            // Save seller info safely
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('seller', JSON.stringify(this.seller));
            }

            this.formone.reset();
            this.route.navigate(['dashboard']);
          }
        },
        error: (error) => {
          console.error(error);
          this._snackBar.open('Login failed. Please try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }
}
