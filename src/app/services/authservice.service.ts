import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private user:any = null;

  constructor(private router: Router) { }

  login(userData: any) {
    this.user = userData
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }
    return this.user;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }


  logout() {
    this.user = null;
    localStorage.removeItem('user');
    this.router.navigate(['customersignin']);
  }



}
