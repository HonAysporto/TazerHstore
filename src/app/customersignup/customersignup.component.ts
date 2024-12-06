import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-customersignup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './customersignup.component.html',
  styleUrl: './customersignup.component.css'
})
export class CustomersignupComponent {

  private _snackBar = inject(MatSnackBar)

  formone:FormGroup

  constructor(public builder:FormBuilder, public http: HttpClient, public route:Router) {
    this.formone = this.builder.group({
      fname:['', Validators.required],
      lname:['', Validators.required],
      email:['', Validators.required],
      pnumber: ['', Validators.required],
      password:['', Validators.required],
      cpassword:['', Validators.required],
    })
  }

 

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action);
  // }

  signup() {
    if(this.formone.value['password'] !== this.formone.value['cpassword']){
      alert('password mismatch')
    } else {
      let customerinfo = {
        ...this.formone.value
      }
    

    
     this.http.post('http://localhost/tazerhstore/customersignup.php', customerinfo).subscribe((data:any)=> {
      console.log(data);
      this._snackBar.open(data.msg, 'continue', {
        duration: 3000
      })
      this.formone.reset()
      if (data.status == true) {
        this.route.navigate(['customersignin'])
      } 
      
     }, (error:any)=> {
      console.log(error);
      
    })

      
    }



  
  }

}
