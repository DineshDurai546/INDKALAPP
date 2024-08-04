import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessorySalesPage } from './accessory-sales.page';
import { async } from 'rxjs';

describe('AccessorySalesPage', () => {
  let component: AccessorySalesPage;
  let fixture: ComponentFixture<AccessorySalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessorySalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
