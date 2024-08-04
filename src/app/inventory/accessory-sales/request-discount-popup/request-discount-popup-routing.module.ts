import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestDiscountPopupPage } from './request-discount-popup.page';

const routes: Routes = [
  {
    path: '',
    component: RequestDiscountPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestDiscountPopupPageRoutingModule {}
