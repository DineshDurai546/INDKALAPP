import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancellationRequestPageRoutingModule } from './cancellation-request-routing.module';

import { CancellationRequestPage } from './cancellation-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancellationRequestPageRoutingModule
  ],
  declarations: [CancellationRequestPage],
  exports:[CancellationRequestPage]
})
export class CancellationRequestPageModule {}
