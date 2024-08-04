import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadyToPickupPageRoutingModule } from './ready-to-pickup-routing.module';

import { ReadyToPickupPage } from './ready-to-pickup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadyToPickupPageRoutingModule
  ],
  declarations: [ReadyToPickupPage]
})
export class ReadyToPickupPageModule {}
