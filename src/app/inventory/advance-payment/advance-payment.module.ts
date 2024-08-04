import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvancePaymentPageRoutingModule } from './advance-payment-routing.module';

import { AdvancePaymentPage } from './advance-payment.page';
import { PaymentPopupPageModule } from '../accessory-sales/payment-popup/payment-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvancePaymentPageRoutingModule,
    PaymentPopupPageModule
  ],
  declarations: [AdvancePaymentPage]
})
export class AdvancePaymentPageModule {}
