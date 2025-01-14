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
        this.handleLoginTransition();
        this.route.navigate(['']);
      }
    }, (error:any)=> {
      console.log(error)
    })



    
    
  }

handleLoginTransition() {
  const userId = JSON.parse(sessionStorage.getItem('user')!).customer_id;
    const guestCart = JSON.parse(sessionStorage.getItem('guestCart')!) || [];
    
    // if (guestCart.length > 0) {
    //     // Fetch logged-in user's cart
    //     fetch(`/api/getUserCart?userId=${userId}`)
    //         .then(response => response.json())
    //         .then(userCart => {
    //             // Merge carts
    //             const mergedCart = this.mergeCarts(guestCart, userCart);
                
    //             // Save merged cart to the server
    //             fetch(`/api/saveUserCart`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({ userId, cart: mergedCart })
    //             })
    //             .then(() => {
    //                 // Clear guest cart
    //                 localStorage.removeItem('guestCart');
    //             });
    //         });
    // }

    if (guestCart.length > 0) {
      this.http.post('http://localhost/tazerhstore/cart.php', {'userId':userId}).subscribe((data:any)=> {
        console.log(data);
        let userCart = data.msg || [];

        const mergedCart = this.mergeCarts(guestCart, userCart);
        console.log('This is the merged', mergedCart);

        this.saveMergrCart(userId, mergedCart);
        
      }, (error)=> {
        console.log(error);
        
      })

      
    }
}

mergeCarts(guestCart:any, userCart:any) {
    const cartMap = new Map();

    // Add user cart items to the map
    userCart.forEach((item: { productId: number, orderedQuantity: number })  =>  cartMap.set(item.productId, item.orderedQuantity));

    console.log('this is the cartMap', cartMap);
    

    // Merge guest cart items
    guestCart.forEach((item: { productId: number, orderedQuantity: number })=> {
        if (cartMap.has(item.productId)) {
            cartMap.set(item.productId, cartMap.get(item.productId) + item.orderedQuantity);
        } else { 
            cartMap.set(item.productId, item.orderedQuantity);
        }
        sessionStorage.removeItem('guestCart')
    });

    // Convert map back to an array
    return Array.from(cartMap, ([productId, orderedQuantity]) => ({ productId, orderedQuantity }));
}


saveMergrCart(userId:any, mergedCart:any) {
  this.http.post('http://localhost/tazerhstore/updatecart.php', {userId, cart: mergedCart}).subscribe((data:any)=> {
    console.log(data);
    
  }, (error) => {
    console.log(error);
    
  })
}


}
