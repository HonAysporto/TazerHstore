import { Component, inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-productdetails-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './productdetails-page.component.html',
  styleUrls: ['./productdetails-page.component.css'] // fixed typo
})
export class ProductdetailsPageComponent  implements AfterViewInit {
  private platformId: Object = inject(PLATFORM_ID);

  public product: any = {};
  public relatedProducts: any[] = [];
  public orderedQuantity: number = 1;


  constructor(
    public activatedroute: ActivatedRoute,
    public productservice: ProductService,
    public http: HttpClient,
    public route: Router,
    public cartService: CartService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.activatedroute.params.subscribe(() => {
        this.loadProduct();
      });
      this.loadProduct();
    }
  }

    ngAfterViewInit() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll('.reveal')
      .forEach(el => observer.observe(el));
  }

  loadProduct() {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedProduct = localStorage.getItem('selectedproduct');
    this.product = storedProduct ? JSON.parse(storedProduct) : {};
    console.log('Loaded product:', this.product);
   

    const payload = {
  category: this.product.category,
  product_id: this.product.productid

};

    this.http.post<any>(
  'https://tazerhstorephp.onrender.com/relatedproducts.php',
  payload
).subscribe(res => {
  console.log(res);

  if (res.status) {
    this.relatedProducts = res.data; 
  } else {
    this.relatedProducts = [];
  }
});


  
  }

  pdetails(product: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    console.log(product);
    

    localStorage.setItem('selectedproduct', JSON.stringify(product));
    // this.route.navigate([`/${product.productname}`]);
      this.loadProduct() 
  }

  addToCart(productId: any, quantity: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    const isLoggedIn = Boolean(sessionStorage.getItem('user'));
    if (isLoggedIn) {
      const userId = JSON.parse(sessionStorage.getItem('user')!).customer_id;
      this.addToCartLoggedIn(userId, productId, quantity);
    } else {
      this.addToCartGuest(productId, quantity);
     
    }
     window.location.reload();
  }

  addToCartGuest(productId: number, quantity: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    let cart = JSON.parse(sessionStorage.getItem('guestCart')!) || [];
    const productIndex = cart.findIndex((item: { productId: any }) => item.productId === productId);

    if (productIndex !== -1) {
      cart[productIndex].orderedQuantity += this.orderedQuantity;
    } else {
      cart.push({ productId, orderedQuantity: this.orderedQuantity });
    }

    sessionStorage.setItem('guestCart', JSON.stringify(cart));
    console.log('Added to guest cart:', cart);
  }

  addToCartLoggedIn(userId: any, productId: number, quantity: number) {
    const details = { userId, productId, orderedQuantity: this.orderedQuantity };
    this.http.post('https://tazerhstorephp.onrender.com/savecart.php', details).subscribe(
      (data: any) => {
        console.log('Cart saved:', data);
      },
      (error: any) => {
        console.error(error);
      }
    );
    // window.location.reload();
  }
}
