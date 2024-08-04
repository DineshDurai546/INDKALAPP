import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HandOverPage } from './hand-over.page';

const routes: Routes = [
  {
    path: '',
    component: HandOverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HandOverPageRoutingModule {}
