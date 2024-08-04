import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialPopupPageRoutingModule } from './material-popup-routing.module';

import { MaterialPopupPage } from './material-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialPopupPageRoutingModule
  ],
  declarations: [MaterialPopupPage],
  exports:[MaterialPopupPage]
})
export class MaterialPopupPageModule {}
