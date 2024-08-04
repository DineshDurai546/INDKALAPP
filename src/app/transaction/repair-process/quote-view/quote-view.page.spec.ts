import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteViewPage } from './quote-view.page';

describe('QuoteViewPage', () => {
  let component: QuoteViewPage;
  let fixture: ComponentFixture<QuoteViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuoteViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
