import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, ElementRef, inject, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements AfterViewInit {

  public products: any[] = [];
  private platformId: Object = inject(PLATFORM_ID);

  public productsLoading: boolean = true;


public dummyProducts = Array(8).fill({
  productname: '',
  description: '',
  price: 0,
  image: '',
  shopname: ''
});

  constructor(
    public http: HttpClient,
    public route: Router,
    public productservice: ProductService
  ) {}

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

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

 ngOnInit() {
  this.productsLoading = true;

  this.http.get('https://tazerhstorephp.onrender.com/getallproducts.php')
    .subscribe({
      next: (data: any) => {
        this.products = data.msg || [];
        this.productsLoading = false;
      },
      error: () => {
        this.products = [];
        this.productsLoading = false;
      }
    });
}


  pdetails(product: any) {
    this.productservice.setProduct(product);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedproduct', JSON.stringify(product));
    }

    this.route.navigate([`${product.productname}`]);
  }

   @ViewChild('featuredProducts') featuredProducts!: ElementRef;

   scrollToProducts() {
    this.featuredProducts.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  @HostListener('window:scroll')
onScroll() {
  const offset = window.scrollY * 0.15;
  document.documentElement.style.setProperty('--scroll', `${offset}px`);
}


}
