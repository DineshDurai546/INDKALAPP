import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountListPopupPage } from './discount-list-popup.page';

const routes: Routes = [
  {
    path: '',
    component: DiscountListPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountListPopupPageRoutingModule {}
