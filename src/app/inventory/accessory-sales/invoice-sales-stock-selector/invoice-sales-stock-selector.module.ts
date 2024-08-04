import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceSalesStockSelectorPageRoutingModule } from './invoice-sales-stock-selector-routing.module';

import { InvoiceSalesStockSelectorPage } from './invoice-sales-stock-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceSalesStockSelectorPageRoutingModule
  ],
  declarations: [InvoiceSalesStockSelectorPage]
})
export class InvoiceSalesStockSelectorPageModule {}
