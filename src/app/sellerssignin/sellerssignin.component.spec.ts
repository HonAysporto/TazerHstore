import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerssigninComponent } from './sellerssignin.component';

describe('SellerssigninComponent', () => {
  let component: SellerssigninComponent;
  let fixture: ComponentFixture<SellerssigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerssigninComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerssigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
