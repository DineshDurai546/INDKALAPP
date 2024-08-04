import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessoriesSalesPage } from './accessories-sales.page';

describe('AccessoriesSalesPage', () => {
  let component: AccessoriesSalesPage;
  let fixture: ComponentFixture<AccessoriesSalesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AccessoriesSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
