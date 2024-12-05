import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../product.service';


@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {

  public products:any = []

  constructor(public http:HttpClient, public route:Router, public productservice: ProductService) {}

  ngOnInit() {
    this.http.get('https://fakestoreapi.com/products').subscribe((data:any)=>{
      console.log(data);
      this.products = data
      
    }, (error:any)=> {
      console.log(error);
      
    })
  }

  pdetails(product:any) {
    this.productservice.setProduct(product)
    localStorage.setItem('selectedproduct', JSON.stringify(product));
    this.route.navigate([`${product.title}`])
    
  }

}
