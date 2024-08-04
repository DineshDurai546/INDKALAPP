import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentPopupPage } from './payment-popup.page';

describe('PaymentPopupPage', () => {
  let component: PaymentPopupPage;
  let fixture: ComponentFixture<PaymentPopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
