import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ENDPOINT } from '../endpoint';
import { FormsModule } from '@angular/forms';
import PaystackPop from '@paystack/inline-js';

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

pay() {

  if (!this.address) {
    alert('Please enter delivery address');
    return;
  }

  const buyer = JSON.parse(sessionStorage.getItem('user')!);

  const paystack = new PaystackPop();

  paystack.newTransaction({
    key: 'pk_test_3e8e875473b3eeaba511a603ebc32603208c6282', // 🔥 replace with your key
    email: buyer.email,
    amount: this.total * 100, // Paystack uses kobo

    onSuccess: (transaction: any) => {
      alert('Payment successful! Ref: ' + transaction.reference);

      // 🔥 Save order after payment
      this.placeOrder(transaction.reference);
    },

    onCancel: () => {
      alert('Payment cancelled');
    }
  });
}

placeOrder(reference: string) {

  const buyer = JSON.parse(sessionStorage.getItem('user')!);

  const payload = {
    buyer_id: buyer.customer_id,
    address: this.address,
    reference: reference
  };

  this.http.post(`${ENDPOINT.baseUrl}/placeorder.php`, payload)
    .subscribe({
      next: () => {
        alert('Order saved successfully!');
        this.router.navigate(['orders']); // or success page
      },
      error: () => {
        alert('Error saving order');
      }
    });
}


  
}