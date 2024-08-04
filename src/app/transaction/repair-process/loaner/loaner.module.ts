import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanerPageRoutingModule } from './loaner-routing.module';

import { LoanerPage } from './loaner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoanerPageRoutingModule
  ],
  declarations: [LoanerPage]
})
export class LoanerPageModule {}
