import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllEventPage } from './all-event.page';

describe('AllEventPage', () => {
  let component: AllEventPage;
  let fixture: ComponentFixture<AllEventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
