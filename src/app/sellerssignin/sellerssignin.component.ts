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
  styleUrl: './sellerssignin.component.css'
})
export class SellerssigninComponent {

  private _snackBar = inject(MatSnackBar)
  public seller:any = {}


  formone:FormGroup

  constructor(public builder:FormBuilder, public http: HttpClient, public route : Router) {
    this.formone = this.builder.group({
      email:['', Validators.required],
      password:['', Validators.required]
    })
  }


  login() {
    let details = {
      ...this.formone.value
    }
    this.http.post('http://localhost/tazerhstore/sellersignin.php', details).subscribe((data:any)=> {
      console.log(data);
      this._snackBar.open(data.msg, 'continue', {
        duration: 3000
      })
      console.log(data);
      if (data.status) {
        this.route.navigate(['dashboard'])
      }
      
      localStorage.setItem('seller', JSON.stringify(data.seller))
      this.formone.reset()
    }, (error:any)=> {
      console.log(error);
      
    })
  }

}
