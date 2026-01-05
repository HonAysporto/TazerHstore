import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent {
  private _snackBar = inject(MatSnackBar);
  private platformId: Object = inject(PLATFORM_ID);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  public seller: any = {};

  constructor(private fb: FormBuilder, public http: HttpClient) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phonenumber: ['', [Validators.required, Validators.pattern('^\\d{11}$')]],
      shopname: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedSeller = localStorage.getItem('seller');
      this.seller = storedSeller ? JSON.parse(storedSeller) : {};

      this.profileForm.patchValue({
        firstname: this.seller.firstname,
        lastname: this.seller.lastname,
        email: this.seller.email,
        phonenumber: this.seller.phonenumber,
        shopname: this.seller.shopname,
      });
    }
  }

  updateProfile() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.profileForm.valid) {
      const details = { ...this.profileForm.value, sellerid: this.seller.sellers_id };

      this.http.post('https://tazerhstorephp.onrender.com/updateprofile.php', details).subscribe(
        (data: any) => {
          console.log(data);
          this._snackBar.open(data.msg, 'Continue', { duration: 3000 });

          if (data.status) {
            this.seller = { ...this.seller, ...this.profileForm.value };
            localStorage.setItem('seller', JSON.stringify(this.seller));
            this.profileForm.patchValue(this.seller);

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
        const details = { ...this.passwordForm.value, sellerid: this.seller.sellers_id };

        this.http.post('https://tazerhstorephp.onrender.com/updatepassword.php', details).subscribe(
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
