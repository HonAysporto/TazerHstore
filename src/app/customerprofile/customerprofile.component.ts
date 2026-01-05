import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-customerprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './customerprofile.component.html',
  styleUrl: './customerprofile.component.css'
})
export class CustomerprofileComponent {
   private _snackBar = inject(MatSnackBar);
  private platformId: Object = inject(PLATFORM_ID);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  public buyer: any = {};

  constructor(private fb: FormBuilder, public http: HttpClient) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phonenumber: ['', [Validators.required, Validators.pattern('^\\d{11}$')]],
      
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedbuyer = sessionStorage.getItem('user');
      this.buyer = storedbuyer ? JSON.parse(storedbuyer) : {};

      this.profileForm.patchValue({
        firstname: this.buyer.firstname,
        lastname: this.buyer.lastname,
        email: this.buyer.email,
        phonenumber: this.buyer.phonenumber
        
      });
    }
  }

  updateProfile() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.profileForm.valid) {
      const details = { ...this.profileForm.value, buyerid: this.buyer.customer_id };

      this.http.post('https://tazerhstorephp.onrender.com/updatecustomerprofile.php', details).subscribe(
        (data: any) => {
          console.log(data);
          this._snackBar.open(data.msg, 'Continue', { duration: 3000 });

          if (data.status) {
            this.buyer = { ...this.buyer, ...this.profileForm.value };
            sessionStorage.setItem('user', JSON.stringify(this.buyer));
            this.profileForm.patchValue(this.buyer);

            // Avoid full page reload for better UX; instead update component state
            // window.location.reload(); // optional, but not recommended
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }

  changePassword() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword === confirmPassword) {
        const details = { ...this.passwordForm.value, buyerid: this.buyer.customer_id };

        this.http.post('http://localhost/tazerhstore/updatecustomerpassword.php', details).subscribe(
          (data: any) => {
            console.log(data);
            this._snackBar.open(data.msg, 'Continue', { duration: 3000 });
            this.passwordForm.reset();
          },
          (error: any) => {
            console.error(error);
          }
        );
      } else {
        console.error('Passwords do not match');
        this._snackBar.open('Passwords do not match', 'Dismiss', { duration: 3000 });
      }
    }
  }
}
