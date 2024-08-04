import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallLoginListPage } from './call-login-list.page';

describe('CallLoginListPage', () => {
  let component: CallLoginListPage;
  let fixture: ComponentFixture<CallLoginListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CallLoginListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
