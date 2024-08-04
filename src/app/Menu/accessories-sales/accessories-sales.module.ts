import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessoriesSalesPageRoutingModule } from './accessories-sales-routing.module';

import { AccessoriesSalesPage } from './accessories-sales.page';
import { AccessorySalesPageModule } from 'src/app/inventory/accessory-sales/accessory-sales.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessoriesSalesPageRoutingModule,
    AccessorySalesPageModule
  ],
  declarations: [AccessoriesSalesPage]
})
export class AccessoriesSalesPageModule {}
