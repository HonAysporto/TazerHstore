import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './dashboard-component.component.html',
  styleUrl: './dashboard-component.component.css'
})
export class DashboardComponentComponent {

public seller:any = {}

 constructor( public route:Router){}

  ngOnInit() {
    this.seller  = JSON.parse(localStorage.getItem('seller')!)
  }

  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['sellerlogin'])

  }

}
