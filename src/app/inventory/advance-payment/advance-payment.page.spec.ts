import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancePaymentPage } from './advance-payment.page';

describe('AdvancePaymentPage', () => {
  let component: AdvancePaymentPage;
  let fixture: ComponentFixture<AdvancePaymentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdvancePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
