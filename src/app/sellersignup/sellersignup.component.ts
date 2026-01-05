import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sellersignup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sellersignup.component.html',
  styleUrl: './sellersignup.component.css'
})
export class SellersignupComponent {

  private _snackBar = inject(MatSnackBar)

  formone:FormGroup

  constructor( public builder:FormBuilder, public http: HttpClient, public route:Router) {
    this.formone = this.builder.group({
      firstname:['', Validators.required],
      lastname:['', Validators.required],
      email:['', Validators.required],
      password:['', Validators.required],
   confirmPassword:['', Validators.required],
   contact:['', Validators.required],
   shopname:['', Validators.required],
    })
  }

signup() {
  if(this.formone.value['password'] !== this.formone.value['confirmPassword']){
    this._snackBar.open('password mismatched', 'continue', {
      duration: 3000
    })
  } else {
  let details = {
    ...this.formone.value
  }
  // console.log(details);
  
  
  this.http.post('https://tazerhstorephp.onrender.com/sellersignup.php', details).subscribe((data:any)=> {
    // console.log(data);
    this.formone.reset()
    this._snackBar.open(data.msg, 'continue', {
      duration: 3000
    })
    if (data.status == true) {
      this.route.navigate(['sellerlogin'])
    }
  }, (error:any)=> {
    console.log(error);
    
  })
  
}

}



}
