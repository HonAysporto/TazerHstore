import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from '../endpoint';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.css'
})
export class SellerOrdersComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  private _snackBar = inject(MatSnackBar)

  constructor(
    private http: HttpClient,
    

  ) {}

  ngOnInit() {
   
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
     const seller = JSON.parse(localStorage.getItem('seller')!);
    const seller_id = seller.sellers_id;

    this.http.post<any>(`${ENDPOINT.baseUrl}/getsellerorder.php`, { seller_id })
      .subscribe({
        next: res => {
          this.orders = res.orders || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this._snackBar.open('Error loading orders', 'Continue', { duration: 3000 });
        }
      });
  }

  updateStatus(order_id: number, status: string) {
    this.http.post(`${ENDPOINT.baseUrl}/updateorderstatus.php`, {
      order_id,
      status
    }).subscribe(() => {
      this._snackBar.open(`Order updated to ${status}`, 'Continue', { duration: 3000 });
      this.fetchOrders();
    });
  }
}