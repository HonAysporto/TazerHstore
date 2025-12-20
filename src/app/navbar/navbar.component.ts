import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, MatBadgeModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public countno: number = 0;
  public user: any = {};
  public mobileMenuOpen: boolean = false;
  private cartSub!: Subscription;

  constructor(
    public authserviceService: AuthserviceService,
    public activatedroute: ActivatedRoute,
    public cartservice: CartService
  ) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngOnInit() {
    // Subscribe to cart count observable for real-time updates
    this.cartSub = this.cartservice.cartCount$.subscribe(count => {
      this.countno = count;
    
    });

    // Initialize user
    this.user = this.authserviceService.getUser();
  }

  logout() {
    this.authserviceService.logout();
  }

  ngOnDestroy() {
    // Prevent memory leaks
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
