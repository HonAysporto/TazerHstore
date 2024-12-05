import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductdetailsPageComponent } from './productdetails-page.component';

describe('ProductdetailsPageComponent', () => {
  let component: ProductdetailsPageComponent;
  let fixture: ComponentFixture<ProductdetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductdetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductdetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
