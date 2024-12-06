import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authserviceService: AuthserviceService) {}

  public user:any = {}

  public mobileMenuOpen: boolean = false;

toggleMobileMenu() {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}


  ngOnInit() {
   this.user = this.authserviceService.getUser()
  }

  logout() {
    this.authserviceService.logout()
  }

}
