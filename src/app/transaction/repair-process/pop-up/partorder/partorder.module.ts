import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartorderPageRoutingModule } from './partorder-routing.module';

import { PartorderPage } from './partorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartorderPageRoutingModule
  ],
  declarations: [PartorderPage]
})
export class PartorderPageModule {}
