import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TilesPageRoutingModule } from './tiles-routing.module';

import { TilesPage } from './tiles.page'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TilesPageRoutingModule, 
  ],
  exports: [TilesPage],
  declarations: [TilesPage]
})
export class TilesPageModule {}
