import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailPage } from './company-detail.page';

describe('CompanyDetailPage', () => {
  let component: CompanyDetailPage;
  let fixture: ComponentFixture<CompanyDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompanyDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
