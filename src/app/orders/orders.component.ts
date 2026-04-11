import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ENDPOINT } from '../endpoint';
import { Navbar2Component } from '../navbar2/navbar2.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const user = sessionStorage.getItem('user');

    if (!user) {
      this.router.navigate(['/customersignin']);
      return;
    }

    const buyer = JSON.parse(user);
    this.fetchOrders(buyer.customer_id);
  }

  fetchOrders(user_id: number) {
    this.loading = true;

    this.http.post<any>(`${ENDPOINT.baseUrl}/getOrders.php`, { user_id })
      .subscribe({
        next: res => {
          if (res.status) {
            this.orders = res.orders;
          } else {
            this.orders = [];
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}