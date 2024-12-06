import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router, RouterLink } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-customerlogin',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './customerlogin.component.html',
  styleUrl: './customerlogin.component.css'
})
export class CustomerloginComponent {

  private _snackBar = inject(MatSnackBar)

formone:FormGroup
  constructor(public builder:FormBuilder, public http: HttpClient, public route: Router, public authservice : AuthserviceService, ) {
    this.formone = this.builder.group({
      email:['', Validators.required],
      password:['', Validators.required],
    })
  }

  signin() {
    let customerinfo = {
      ...this.formone.value
    }
    this.http.post('http://localhost/tazerhstore/customersignin.php', customerinfo).subscribe((data:any)=> {
      console.log(data);
      this._snackBar.open(data.msg, 'continue', {
        duration: 3000
      })
      this.formone.reset()

      if (data.status == true) {
        this.authservice.login(data.user);
        this.route.navigate([''])
      }
    }, (error:any)=> {
      console.log(error)
    })



    
    
  }

}
