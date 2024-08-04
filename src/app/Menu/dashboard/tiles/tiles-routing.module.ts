import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TilesPage } from './tiles.page';

const routes: Routes = [
  {
    path: '',
    component: TilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TilesPageRoutingModule {}
