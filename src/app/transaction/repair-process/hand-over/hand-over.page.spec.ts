import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandOverPage } from './hand-over.page';

describe('HandOverPage', () => {
  let component: HandOverPage;
  let fixture: ComponentFixture<HandOverPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HandOverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
