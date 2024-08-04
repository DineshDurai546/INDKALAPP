import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancellationViewPage } from './cancellation-view.page';

const routes: Routes = [
  {
    path: '',
    component: CancellationViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancellationViewPageRoutingModule {}
