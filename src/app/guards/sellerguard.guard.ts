import { inject, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const sellerguardGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // If not in browser, deny access by default (or allow? depends on your use case)
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const sellerStr = localStorage.getItem('seller');
  const seller = sellerStr ? JSON.parse(sellerStr) : null;

  if (!seller) {
    router.navigate(['sellerlogin']);
    return false;
  }

  return true;
};
