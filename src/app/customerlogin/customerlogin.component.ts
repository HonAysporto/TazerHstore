import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-customerlogin',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './customerlogin.component.html',
  styleUrls: ['./customerlogin.component.css']
})
export class CustomerloginComponent {

  private _snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  formone: FormGroup;

  constructor(
    public builder: FormBuilder,
    public http: HttpClient,
    public route: Router,
    public authservice: AuthserviceService,
  ) {
    this.formone = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signin() {
    let customerinfo = {
      ...this.formone.value
    };

    this.http.post('https://tazerhstorephp.onrender.com/customersignin.php', customerinfo)
      .subscribe((data: any) => {
        console.log(data);
        this._snackBar.open(data.msg, 'continue', { duration: 3000 });
        this.formone.reset();

        if (data.status === true) {
          this.authservice.login(data.user);
          this.handleLoginTransition();
          this.route.navigate(['']);
        }
      }, (error: any) => {
        console.log(error);
      });
  }

  handleLoginTransition() {
    if (!isPlatformBrowser(this.platformId)) return; // guard for SSR

    const userStr = sessionStorage.getItem('user');
    const guestCartStr = sessionStorage.getItem('guestCart');

    if (!userStr) return;

    const userId = JSON.parse(userStr).customer_id;
    const guestCart = guestCartStr ? JSON.parse(guestCartStr) : [];

    if (guestCart.length > 0) {
      this.http.post('https://tazerhstorephp.onrender.com/cart.php', { userId })
        .subscribe((data: any) => {
          console.log(data);
          const userCart = data.msg || [];
          const mergedCart = this.mergeCarts(guestCart, userCart);
          console.log('This is the merged cart:', mergedCart);
          this.saveMergedCart(userId, mergedCart);
        }, (error) => {
          console.log(error);
        });
    }
  }

  mergeCarts(guestCart: any[], userCart: any[]) {
    const cartMap = new Map<number, number>();

    // Add user cart items to the map
    userCart.forEach(item => cartMap.set(item.productId, item.orderedQuantity));

    // Merge guest cart items
    guestCart.forEach(item => {
      if (cartMap.has(item.productId)) {
        cartMap.set(item.productId, cartMap.get(item.productId)! + item.orderedQuantity);
      } else {
        cartMap.set(item.productId, item.orderedQuantity);
      }
    });

    // Clear guestCart from sessionStorage
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('guestCart');
    }

    // Convert map back to array
    return Array.from(cartMap, ([productId, orderedQuantity]) => ({ productId, orderedQuantity }));
  }

  saveMergedCart(userId: any, mergedCart: any) {
    this.http.post('http://localhost/tazerhstore/updatecart.php', { userId, cart: mergedCart })
      .subscribe((data: any) => {
        console.log(data);
      }, (error) => {
        console.log(error);
      });
  }

}
