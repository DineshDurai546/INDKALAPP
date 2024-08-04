import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TilesPage } from './tiles.page';

describe('TilesPage', () => {
  let component: TilesPage;
  let fixture: ComponentFixture<TilesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
