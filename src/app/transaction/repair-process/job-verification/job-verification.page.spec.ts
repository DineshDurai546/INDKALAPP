import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobVerificationPage } from './job-verification.page';

describe('JobVerificationPage', () => {
  let component: JobVerificationPage;
  let fixture: ComponentFixture<JobVerificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
