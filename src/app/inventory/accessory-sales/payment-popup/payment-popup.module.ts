import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPopupPageRoutingModule } from './payment-popup-routing.module';

import { PaymentPopupPage } from './payment-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPopupPageRoutingModule
  ],
  declarations: [PaymentPopupPage],
  exports:[PaymentPopupPage]
})
export class PaymentPopupPageModule {}
