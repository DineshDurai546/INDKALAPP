import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DiscountListPopupPage } from './discount-list-popup.page';

describe('DiscountListPopupPage', () => {
  let component: DiscountListPopupPage;
  let fixture: ComponentFixture<DiscountListPopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DiscountListPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
