import { inject, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const customersguardGuard: CanActivateFn = (route, state) => {
 const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

    if (!isPlatformBrowser(platformId)) {
    return false;
  }

const userStr = sessionStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

 if (!user) {
    router.navigate(['customersignin']);
    return false;
  }

  return true;
};
