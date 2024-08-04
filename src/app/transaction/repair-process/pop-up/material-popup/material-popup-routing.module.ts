import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialPopupPage } from './material-popup.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialPopupPageRoutingModule {}
