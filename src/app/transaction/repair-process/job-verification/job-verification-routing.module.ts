import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobVerificationPage } from './job-verification.page';

const routes: Routes = [
  {
    path: '',
    component: JobVerificationPage
  },
  {
    path: 'image-view',
    loadChildren: () => import('./image-view/image-view.module').then( m => m.ImageViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobVerificationPageRoutingModule {}
