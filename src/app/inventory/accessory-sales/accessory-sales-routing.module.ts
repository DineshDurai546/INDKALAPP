import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessorySalesPage } from './accessory-sales.page';

const routes: Routes = [
  {
    path: '',
    component: AccessorySalesPage
  },
  {
    path: 'invoice-sales-stock-selector',
    loadChildren: () => import('./invoice-sales-stock-selector/invoice-sales-stock-selector.module').then( m => m.InvoiceSalesStockSelectorPageModule)
  },
  {
    path: 'payment-popup',
    loadChildren: () => import('./payment-popup/payment-popup.module').then( m => m.PaymentPopupPageModule)
  },
  {
    path: 'discount-list-popup',
    loadChildren: () => import('./discount-list-popup/discount-list-popup.module').then( m => m.DiscountListPopupPageModule)
  },
  {
    path: 'request-discount-popup',
    loadChildren: () => import('./request-discount-popup/request-discount-popup.module').then( m => m.RequestDiscountPopupPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessorySalesPageRoutingModule {}
