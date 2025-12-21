import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cartpage',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './cartpage.component.html',
  styleUrl: './cartpage.component.css'
})
export class CartpageComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const buyer = sessionStorage.getItem('user');

    if (!buyer) {
      this.router.navigate(['/customersignin']);
      return;
    }

    this.fetchCart();
  }

  fetchCart() {
    const buyer = JSON.parse(sessionStorage.getItem('user')!);
    const buyer_id = buyer.customer_id;
    this.loading = true;

    this.http.post<any>('http://localhost/tazerhstore/displaycart.php', { buyer_id })
      .subscribe({
        next: res => {
          if (res.status) {
            this.cartItems = res.cart;
            this.calculateTotal();
          } else {
            this.cartItems = [];
            this.cartService.updateCartCount(); // update navbar
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.cartItems = [];
          this.cartService.updateCartCount(); // update navbar
        }
      });
  }

  increaseQty(item: any) {
    item.quantity++;
    this.updateQuantity(item);
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateQuantity(item);
    }
  }

  updateQuantity(item: any) {
    this.http.post('http://localhost/tazerhstore/updateusercart.php', {
      cart_id: item.cart_id,
      quantity: item.quantity
    }).subscribe(() => {
      this.calculateTotal();
      this.cartService.updateCartCount(); // 🔥 update navbar immediately
    });
  }

  removeItem(cart_id: number) {
    this.http.post('http://localhost/tazerhstore/deletecart.php', { cart_id })
      .subscribe(() => {
        this.fetchCart();
        this.cartService.updateCartCount(); // 🔥 update navbar immediately
      });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity, 0
    );
    // update navbar with total quantity
    const totalQuantity = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.cartService.updateCartCount(); // 🔥 ensures navbar quantity is always synced
  }
}
