import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancePaymentPage } from './advance-payment.page';

const routes: Routes = [
  {
    path: '',
    component: AdvancePaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancePaymentPageRoutingModule {}
