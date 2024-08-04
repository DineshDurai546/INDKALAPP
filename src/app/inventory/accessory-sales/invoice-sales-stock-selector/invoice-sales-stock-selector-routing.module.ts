import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceSalesStockSelectorPage } from './invoice-sales-stock-selector.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceSalesStockSelectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceSalesStockSelectorPageRoutingModule {}
