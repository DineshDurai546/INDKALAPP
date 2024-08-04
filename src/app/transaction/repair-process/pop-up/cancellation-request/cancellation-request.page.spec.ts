import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancellationRequestPage } from './cancellation-request.page';

describe('CancellationRequestPage', () => {
  let component: CancellationRequestPage;
  let fixture: ComponentFixture<CancellationRequestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CancellationRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
