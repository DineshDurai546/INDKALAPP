import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnsiteJobclosedPageRoutingModule } from './onsite-jobclosed-routing.module';

import { OnsiteJobclosedPage } from './onsite-jobclosed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnsiteJobclosedPageRoutingModule
  ],
  declarations: [OnsiteJobclosedPage]
})
export class OnsiteJobclosedPageModule {}
