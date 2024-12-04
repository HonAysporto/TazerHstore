import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {

  public products:any = []

  constructor(public http:HttpClient) {}

  ngOnInit() {
    this.http.get('https://fakestoreapi.com/products').subscribe((data:any)=>{
      console.log(data);
      this.products = data
      
    }, (error:any)=> {
      console.log(error);
      
    })
  }

}
