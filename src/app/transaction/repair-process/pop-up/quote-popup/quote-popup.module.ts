import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotePopupPageRoutingModule } from './quote-popup-routing.module';

import { QuotePopupPage } from './quote-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotePopupPageRoutingModule
  ],
  declarations: [QuotePopupPage],
  exports:[QuotePopupPage]
})
export class QuotePopupPageModule {}
