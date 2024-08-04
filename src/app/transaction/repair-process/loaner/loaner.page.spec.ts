import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanerPage } from './loaner.page';

describe('LoanerPage', () => {
  let component: LoanerPage;
  let fixture: ComponentFixture<LoanerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoanerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
