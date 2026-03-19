import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// 🔥 Firebase imports
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private user: any = null;
  private provider = new GoogleAuthProvider();

  constructor(private router: Router, private auth: Auth) {

  }

  // ✅ Existing login (keep it)
  login(userData: any) {
    this.user = userData;
    sessionStorage.setItem('user', JSON.stringify(userData));
  }

  // 🔥 NEW: Google Login
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.provider);

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL
      };

      this.login(userData); // reuse your logic

      return userData;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(sessionStorage.getItem('user') || 'null');
    }
    return this.user;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  // 🔥 Updated logout
  async logout() {
    this.user = null;
    sessionStorage.removeItem('user');

    try {
      await signOut(this.auth); // Firebase logout
    } catch (e) {
      console.log('Firebase logout skipped');
    }

    this.router.navigate(['customersignin']);
  }
}