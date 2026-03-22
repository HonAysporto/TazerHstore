import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerResetPasswordComponent } from './seller-reset-password.component';

describe('SellerResetPasswordComponent', () => {
  let component: SellerResetPasswordComponent;
  let fixture: ComponentFixture<SellerResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerResetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
