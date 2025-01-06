import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const sellerguardGuard: CanActivateFn = (route, state) => {
  let seller = JSON.parse(localStorage.getItem('seller')!)
  let router = inject(Router)

  if (!seller) {
    router.navigate([''])
  } 
  return true;
};
