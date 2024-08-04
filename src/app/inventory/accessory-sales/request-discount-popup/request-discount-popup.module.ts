import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestDiscountPopupPageRoutingModule } from './request-discount-popup-routing.module';

import { RequestDiscountPopupPage } from './request-discount-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestDiscountPopupPageRoutingModule
  ],
  declarations: [RequestDiscountPopupPage]
})
export class RequestDiscountPopupPageModule {}
