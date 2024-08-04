import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialPopupPage } from './material-popup.page';

describe('MaterialPopupPage', () => {
  let component: MaterialPopupPage;
  let fixture: ComponentFixture<MaterialPopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MaterialPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
