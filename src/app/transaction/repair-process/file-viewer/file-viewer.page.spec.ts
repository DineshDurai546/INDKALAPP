import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileViewerPage } from './file-viewer.page';

describe('FileViewerPage', () => {
  let component: FileViewerPage;
  let fixture: ComponentFixture<FileViewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FileViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
