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
    this.http.get('https://tazerhstorephp.onrender.com/getallproducts.php')
      .subscribe((data: any) => {
        console.log(data);
        this.products = data.msg;
      }, (error: any) => {
        console.log(error);
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
