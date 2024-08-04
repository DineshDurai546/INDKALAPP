import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagnosisPageRoutingModule } from './diagnosis-routing.module';

import { DiagnosisPage } from './diagnosis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagnosisPageRoutingModule
  ],
  declarations: [DiagnosisPage]
})
export class DiagnosisPageModule {}
