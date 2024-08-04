import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDiscountPopupPage } from './request-discount-popup.page';

describe('RequestDiscountPopupPage', () => {
  let component: RequestDiscountPopupPage;
  let fixture: ComponentFixture<RequestDiscountPopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestDiscountPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
