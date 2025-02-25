import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersignupComponent } from './customersignup.component';

describe('CustomersignupComponent', () => {
  let component: CustomersignupComponent;
  let fixture: ComponentFixture<CustomersignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
