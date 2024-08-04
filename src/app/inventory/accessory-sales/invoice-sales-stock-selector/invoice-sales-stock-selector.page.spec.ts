import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceSalesStockSelectorPage } from './invoice-sales-stock-selector.page';

describe('InvoiceSalesStockSelectorPage', () => {
  let component: InvoiceSalesStockSelectorPage;
  let fixture: ComponentFixture<InvoiceSalesStockSelectorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InvoiceSalesStockSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
