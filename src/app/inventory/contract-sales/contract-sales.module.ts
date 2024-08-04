import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractSalesPageRoutingModule } from './contract-sales-routing.module';

import { ContractSalesPage } from './contract-sales.page'; 
import { AccessorySalesPageModule } from 'src/app/inventory/accessory-sales/accessory-sales.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractSalesPageRoutingModule, 
    AccessorySalesPageModule
  ],
  declarations: [ContractSalesPage],
  exports:[ContractSalesPage]
})
export class ContractSalesPageModule {}
