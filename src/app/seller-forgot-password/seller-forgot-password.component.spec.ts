import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerForgotPasswordComponent } from './seller-forgot-password.component';

describe('SellerForgotPasswordComponent', () => {
  let component: SellerForgotPasswordComponent;
  let fixture: ComponentFixture<SellerForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
