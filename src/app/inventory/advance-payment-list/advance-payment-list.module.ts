import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvancePaymentListPageRoutingModule } from './advance-payment-list-routing.module';

import { AdvancePaymentListPage } from './advance-payment-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvancePaymentListPageRoutingModule
  ],
  declarations: [AdvancePaymentListPage],
  exports:[AdvancePaymentListPage]
})
export class AdvancePaymentListPageModule {}
