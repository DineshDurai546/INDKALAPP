import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepairPopPage } from './repair-pop.page';

const routes: Routes = [
  {
    path: '',
    component: RepairPopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepairPopPageRoutingModule {}
