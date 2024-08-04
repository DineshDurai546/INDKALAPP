import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepairProcessPage } from './repair-process.page';

describe('RepairProcessPage', () => {
  let component: RepairProcessPage;
  let fixture: ComponentFixture<RepairProcessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RepairProcessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
