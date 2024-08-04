import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepairPopPage } from './repair-pop.page';

describe('RepairPopPage', () => {
  let component: RepairPopPage;
  let fixture: ComponentFixture<RepairPopPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RepairPopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
