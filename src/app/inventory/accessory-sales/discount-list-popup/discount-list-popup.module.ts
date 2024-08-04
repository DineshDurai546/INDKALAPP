import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountListPopupPageRoutingModule } from './discount-list-popup-routing.module';

import { DiscountListPopupPage } from './discount-list-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscountListPopupPageRoutingModule
  ],
  declarations: [DiscountListPopupPage],
  exports:[DiscountListPopupPage]
})
export class DiscountListPopupPageModule {}
