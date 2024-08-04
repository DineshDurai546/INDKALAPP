import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileViewerPage } from './file-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: FileViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileViewerPageRoutingModule {}
