import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartorderPage } from './partorder.page';

const routes: Routes = [
  {
    path: '',
    component: PartorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartorderPageRoutingModule {}
