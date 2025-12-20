import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public user: any = null;
  public guestCart: any[] = [];
  public logcart: any[] = [];

  // ✅ Observable to track cart count
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    public http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.user = JSON.parse(sessionStorage.getItem('user') || 'null');
      this.guestCart = JSON.parse(sessionStorage.getItem('guestCart') || '[]');

      // Initialize cart count on service load
      this.updateCartCount();
      
    }
  }

  // Call this to calculate cart count and notify subscribers
  public updateCartCount() {
    if (!this.user) {
      const totalQuantity = this.guestCart.reduce(
        (total: number, order: any) => total + order.orderedQuantity,
        0
      );
      this.cartCountSubject.next(totalQuantity);
    } else {
      this.logCartcount((totalQuantity: number) => {
        this.cartCountSubject.next(totalQuantity);
      });
    }
  }

  // Fetch logged-in user's cart and calculate total quantity
  public logCartcount(callback: (totalQuantity: number) => void) {
    if (!isPlatformBrowser(this.platformId)) {
      callback(0);
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('user') || 'null');

    if (!user) {
      callback(0);
      return;
    }

    const userId = user.customer_id;

    this.http.post('http://localhost/tazerhstore/cart.php', { userId })
      .subscribe(
        (data: any) => {
          this.logcart = data.msg || [];
          const totalQuantity = this.logcart.reduce(
            (total: number, order: any) => total + order.orderedQuantity,
            0
          );
          callback(totalQuantity);
        },
        (error: any) => {
          console.log(error);
          callback(0);
        }
      );
  }

  // ✅ Optional helper to increase/decrease cart for guests and update observable
  public setGuestCart(cart: any[]) {
    this.guestCart = cart;
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('guestCart', JSON.stringify(this.guestCart));
    }
    this.updateCartCount();
  }
}
