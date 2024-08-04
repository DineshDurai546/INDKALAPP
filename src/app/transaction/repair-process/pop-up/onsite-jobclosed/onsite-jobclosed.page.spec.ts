import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnsiteJobclosedPage } from './onsite-jobclosed.page';

describe('OnsiteJobclosedPage', () => {
  let component: OnsiteJobclosedPage;
  let fixture: ComponentFixture<OnsiteJobclosedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OnsiteJobclosedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
