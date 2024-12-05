import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-productdetails-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './productdetails-page.component.html',
  styleUrl: './productdetails-page.component.css'
})
export class ProductdetailsPageComponent {
public product:any = {}
public relatedProducts:any = []
  constructor(public activatedroute: ActivatedRoute, public productservice: ProductService, public http:HttpClient, public route : Router ) {}

 
 

  ngOnInit() {
   
    this.activatedroute.params.subscribe(()=> {
      this.loadProduct();
    })

    this.loadProduct();
    
    
  }

  loadProduct() {
    this.product =JSON.parse(localStorage.getItem('selectedproduct')!)
    console.log(this.product);
    this.http.get('https://fakestoreapi.com/products').subscribe((data:any)=>{
      console.log(data);
      this.relatedProducts = data
      
    }, (error:any)=> {
      console.log(error);
      
    })
  }

  pdetails(product:any) {
    // this.productservice.setProduct(product)
    localStorage.setItem('selectedproduct', JSON.stringify(product));
    this.route.navigate([`/${product.title}`])
    
  }

}
