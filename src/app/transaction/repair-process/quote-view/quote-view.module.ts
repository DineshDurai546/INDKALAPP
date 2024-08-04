import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuoteViewPageRoutingModule } from './quote-view-routing.module';

import { QuoteViewPage } from './quote-view.page';
import { QuotePopupPageModule } from '../pop-up/quote-popup/quote-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuoteViewPageRoutingModule,
    QuotePopupPageModule
  ],
  declarations: [QuoteViewPage],
  exports:[QuoteViewPage]
})
export class QuoteViewPageModule {}
