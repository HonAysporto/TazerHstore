import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';

// 🔥 Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA71pn5B7Afu9f68Ye6IwUAoDGrPwC3d5g",
  authDomain: "tazerhstore.firebaseapp.com",
  projectId: "tazerhstore",
  storageBucket: "tazerhstore.firebasestorage.app",
  messagingSenderId: "484627083736",
  appId: "1:484627083736:web:2aed7b558e8253c63542ad"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),

    // ✅ Clean HttpClient with interceptors
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        errorInterceptor
      ])
    ),

    // 🔥 Firebase setup
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};