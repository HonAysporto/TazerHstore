import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { customersguardGuard } from './customersguard.guard';

describe('customersguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => customersguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
