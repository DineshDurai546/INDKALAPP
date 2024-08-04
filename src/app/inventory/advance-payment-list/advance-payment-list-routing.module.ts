import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancePaymentListPage } from './advance-payment-list.page';

const routes: Routes = [
  {
    path: '',
    component: AdvancePaymentListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancePaymentListPageRoutingModule {}
