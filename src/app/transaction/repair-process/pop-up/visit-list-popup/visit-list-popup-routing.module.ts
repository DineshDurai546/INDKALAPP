import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitListPopupPage } from './visit-list-popup.page';

const routes: Routes = [
  {
    path: '',
    component: VisitListPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitListPopupPageRoutingModule {}
