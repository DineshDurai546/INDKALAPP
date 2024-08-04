import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitListPopupPage } from './visit-list-popup.page';

describe('VisitListPopupPage', () => {
  let component: VisitListPopupPage;
  let fixture: ComponentFixture<VisitListPopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VisitListPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
