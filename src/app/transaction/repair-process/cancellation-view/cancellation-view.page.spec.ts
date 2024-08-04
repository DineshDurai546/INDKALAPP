import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancellationViewPage } from './cancellation-view.page';

describe('CancellationViewPage', () => {
  let component: CancellationViewPage;
  let fixture: ComponentFixture<CancellationViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CancellationViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
