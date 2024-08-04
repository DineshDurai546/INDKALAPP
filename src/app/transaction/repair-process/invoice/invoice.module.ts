import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoicePageRoutingModule } from './invoice-routing.module';

import { InvoicePage } from './invoice.page';
import { AccessorySalesPageModule } from 'src/app/inventory/accessory-sales/accessory-sales.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoicePageRoutingModule,
    AccessorySalesPageModule
  ],
  declarations: [InvoicePage],
  exports:[InvoicePage]
})
export class InvoicePageModule {}
