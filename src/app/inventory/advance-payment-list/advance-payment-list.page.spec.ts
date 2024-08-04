import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancePaymentListPage } from './advance-payment-list.page';

describe('AdvancePaymentListPage', () => {
  let component: AdvancePaymentListPage;
  let fixture: ComponentFixture<AdvancePaymentListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdvancePaymentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
