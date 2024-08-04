import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadyToPickupPage } from './ready-to-pickup.page';

const routes: Routes = [
  {
    path: '',
    component: ReadyToPickupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadyToPickupPageRoutingModule {}
