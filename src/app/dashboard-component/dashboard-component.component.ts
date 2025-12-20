import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './dashboard-component.component.html',
  styleUrls: ['./dashboard-component.component.css']
})
export class DashboardComponentComponent {

  public seller: any = {};
  private platformId = inject(PLATFORM_ID);

  constructor(public route: Router) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const sellerData = localStorage.getItem('seller');
      if (sellerData) {
        this.seller = JSON.parse(sellerData);
      }
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('seller');
    }
    this.route.navigate(['sellerlogin']);
  }

}
