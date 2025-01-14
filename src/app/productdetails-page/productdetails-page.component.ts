import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../services/cart.service';

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
public orderedQuantity:number = 1
  constructor(public activatedroute: ActivatedRoute, public productservice: ProductService, public http:HttpClient, public route : Router, public cartService: CartService ) {}

 
 

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


  addToCart(productId:any, quantity:any) {
    console.log(productId, quantity);
    
    const isLoggedIn = Boolean(sessionStorage.getItem('user')); 
    if (isLoggedIn) {      
        const userId = JSON.parse(sessionStorage.getItem('user')!).customer_id;
        console.log(userId);
        
        this.addToCartLoggedIn(userId, productId, quantity);
       
    }
     else {
        this.addToCartGuest(productId, quantity);
        window.location.reload()
    }
  }



 addToCartGuest(productId:number, quantity:any) {
    let cart = JSON.parse(sessionStorage.getItem('guestCart')!) || [];

    
    const productIndex = cart.findIndex((item: { productId: any; }) => item.productId === productId);
console.log('productIndex', productIndex);

    if (productIndex !== -1) {
       
        cart[productIndex].orderedQuantity += this.orderedQuantity;
    } else {
      
        cart.push({ productId, "orderedQuantity":this.orderedQuantity });
    }

   
    sessionStorage.setItem('guestCart', JSON.stringify(cart));
    console.log('Added to guest cart:', cart);
}


addToCartLoggedIn(userId:any, productId:number, quantity:number) {
  let details = {
    userId, productId, "orderedQuantity":this.orderedQuantity
  }
 this.http.post('http://localhost/tazerhstore/savecart.php', details).subscribe((data:any)=> {
    console.log(data);
    
 }, (error) => {
    console.log(error);
 })
 window.location.reload()
}





}
