import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customersignup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './customersignup.component.html',
  styleUrl: './customersignup.component.css'
})
export class CustomersignupComponent {

  formone:FormGroup

  constructor(public builder:FormBuilder, public http: HttpClient) {
    this.formone = this.builder.group({
      fname:['', Validators.required],
      lname:['', Validators.required],
      email:['', Validators.required],
      pnumber: ['', Validators.required],
      password:['', Validators.required],
      cpassword:['', Validators.required],
    })
  }

  signup() {
    if(this.formone.value['password'] !== this.formone.value['cpassword']){
      alert('password mismatch')
    } else {
      let customerinfo = {
        ...this.formone.value
      }
      // let anothercustomer = {
      //   fname: 'Ayomide',
      //   lname: 'Adewale',
      //   email: 'ayomideoluwafemi2019@gmail.com',
      //   pnumber: '09034526764',
      //   password: 'fish'
      // }
     this.http.post('http://localhost/tazerhstore/customersignup.php', customerinfo).subscribe((data:any)=> {
      console.log(data);
      
     }, (error:any)=> {
      console.log(error);
      
    })

      
    }

  
  }

}
