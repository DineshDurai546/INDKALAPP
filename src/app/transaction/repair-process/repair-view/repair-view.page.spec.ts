import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepairViewPage } from './repair-view.page';

describe('RepairViewPage', () => {
  let component: RepairViewPage;
  let fixture: ComponentFixture<RepairViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RepairViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
