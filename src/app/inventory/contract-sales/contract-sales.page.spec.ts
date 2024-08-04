import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractSalesPage } from './contract-sales.page';

describe('ContractSalesPage', () => {
  let component: ContractSalesPage;
  let fixture: ComponentFixture<ContractSalesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ContractSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
