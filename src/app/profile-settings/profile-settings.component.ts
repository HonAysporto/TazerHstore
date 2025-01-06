import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent {
  
  private _snackBar = inject(MatSnackBar)
  profileForm: FormGroup;
  passwordForm: FormGroup;
  public seller:any = {}


  constructor(private fb: FormBuilder, public http: HttpClient) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: [{ value: '', disabled: true }], // 
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

   this.seller = JSON.parse(localStorage.getItem('seller')!)

    this.profileForm.patchValue({
      firstname: this.seller.firstname,
      lastname: this.seller.lastname,
      email: this.seller.email,
      phonenumber: this.seller.phonenumber,
      shopname: this.seller.shopname,
    });
    
  }

  updateProfile() {
    if (this.profileForm.valid) {
      let details = {
        ...this.profileForm.value,
        sellerid: this.seller.sellers_id
      };
  
      this.http.post('http://localhost/tazerhstore/updateprofile.php', details).subscribe(
        (data: any) => {
          console.log(data);
          this._snackBar.open(data.msg, 'Continue', { duration: 3000 });
  
          if (data.status) {
            // Update the local seller object
            this.seller = { ...this.seller, ...this.profileForm.value };
  
            // Update localStorage
            localStorage.setItem('seller', JSON.stringify(this.seller));
  
            // Update the form with the new values
            this.profileForm.patchValue(this.seller);
            window.location.reload()
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
  

  changePassword() {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword === confirmPassword) {
        let details = {
          ...this.passwordForm.value,
          sellerid: this.seller.sellers_id
        };
        this.http.post('http://localhost/tazerhstore/updatepassword.php', details).subscribe((data:any)=> {
          console.log(data);
          this._snackBar.open(data.msg, 'Continue', { duration: 3000 });
          this.passwordForm.reset()

        }, (error:any)=> {
          console.error(error);
          
        })
        
        
        
      } else {
        console.error('Passwords do not match');
      }
    }
  }
}
