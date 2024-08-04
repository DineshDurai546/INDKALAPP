import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllEventPageRoutingModule } from './all-event-routing.module';

import { AllEventPage } from './all-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllEventPageRoutingModule
  ],
  declarations: [AllEventPage]
})
export class AllEventPageModule {}
