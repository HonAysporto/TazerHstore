import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ENDPOINT } from '../endpoint';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout-component',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './checkout-component.component.html',
  styleUrls: ['./checkout-component.component.css']
})
export class CheckoutComponentComponent implements OnInit {
  user: any = {};
  cartItems: any[] = [];
  total = 0;
  address = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const buyer = sessionStorage.getItem('user');
    if (!buyer) {
      this.router.navigate(['/customersignin']);
      return;
    }

    this.user = JSON.parse(buyer);
    this.fetchCart();
  }

  // 🔥 fetch cart and total from backend
  fetchCart() {
    this.loading = true;
    const buyer_id = this.user.customer_id;

    this.http.post<any>(`${ENDPOINT.baseUrl}/displaycart.php`, { buyer_id })
      .subscribe({
        next: res => {
          if (res.status) {
            this.cartItems = res.cart;

            // Let backend calculate total instead of frontend
            this.calculateTotalBackend(buyer_id);

          } else {
            this.cartItems = [];
            this.total = 0;
          }
          this.loading = false;
        },
        error: () => {
          this.cartItems = [];
          this.total = 0;
          this.loading = false;
        }
      });
  }

  // 🔥 call backend to calculate total
  calculateTotalBackend(buyer_id: number) {
     console.log(buyer_id);
    this.http.post<any>(`${ENDPOINT.baseUrl}/calculateTotal.php`, { buyer_id })
      .subscribe({
        next: res => {
          if (res.status) {
            this.total = res.total;
          } else {
            this.total = 0;
          }
        },
        error: () => { this.total = 0; }
      });
  }

  proceedToPayment() {
    if (!this.address) {
      alert('Please enter delivery address');
      return;
    }

    this.router.navigate(['/payment'], { state: { address: this.address } });
  }
}