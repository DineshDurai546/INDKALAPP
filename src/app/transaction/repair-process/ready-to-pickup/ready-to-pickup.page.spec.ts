import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadyToPickupPage } from './ready-to-pickup.page';

describe('ReadyToPickupPage', () => {
  let component: ReadyToPickupPage;
  let fixture: ComponentFixture<ReadyToPickupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReadyToPickupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
