import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartorderPage } from './partorder.page';

describe('PartorderPage', () => {
  let component: PartorderPage;
  let fixture: ComponentFixture<PartorderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PartorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
