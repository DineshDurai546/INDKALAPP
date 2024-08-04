import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessorySalesPageRoutingModule } from './accessory-sales-routing.module';

import { AccessorySalesPage } from './accessory-sales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccessorySalesPageRoutingModule
  ],
  declarations: [AccessorySalesPage],
  exports:[AccessorySalesPage]
})
export class AccessorySalesPageModule {}
