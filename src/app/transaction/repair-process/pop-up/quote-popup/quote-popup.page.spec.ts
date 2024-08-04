import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotePopupPage } from './quote-popup.page';

describe('QuotePopupPage', () => {
  let component: QuotePopupPage;
  let fixture: ComponentFixture<QuotePopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuotePopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
