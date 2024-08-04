import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessoriesSalesPage } from './accessories-sales.page';

const routes: Routes = [
  {
    path: '',
    component: AccessoriesSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessoriesSalesPageRoutingModule {}
