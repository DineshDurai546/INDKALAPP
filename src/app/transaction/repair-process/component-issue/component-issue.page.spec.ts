import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentIssuePage } from './component-issue.page';

describe('ComponentIssuePage', () => {
  let component: ComponentIssuePage;
  let fixture: ComponentFixture<ComponentIssuePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ComponentIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
