import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentPopupPage } from './payment-popup.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentPopupPageRoutingModule {}
