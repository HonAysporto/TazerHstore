import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private user: any = JSON.parse(localStorage.getItem('user') || 'null');
  private cart: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
  private cartCountSubject = new BehaviorSubject<number>(this.cart.length);

  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.user) {
      this.syncCartWithServer();
    }
  }

  private syncCartWithServer() {
    // Fetch cart from server
    this.http.post('http://localhost/tazerhstore/cart.php', { userId: this.user.customer_id })
      .subscribe((data: any) => {
        this.cart = data.cart || [];
        this.cartCountSubject.next(this.cart.length);
        localStorage.removeItem('cart'); // Clear local storage after sync
      }, (error: any) => {
        console.error('Error syncing cart with server:', error);
      });
  }

  private saveCartToServer() {
    this.http.post('http://localhost/tazerhstore/savecart.php', { userId: this.user.customer_id, cart: this.cart })
      .subscribe((data: any) => {
        console.log(data)
        console.log('Cart saved to server successfully.');
      }, (error: any) => {
        console.error('Error saving cart to server:', error);
      });
  }

  addToCart(product: any) {
    this.cart.push(product.id);

    if (this.user) {
      this.saveCartToServer();
    } else {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    this.cartCountSubject.next(this.cart.length);
  }

  getCartCount(): number {
    return this.cart.length;
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.cartCountSubject.next(0);

    if (this.user) {
      this.saveCartToServer();
    } else {
      localStorage.removeItem('cart');
    }
  }
}
