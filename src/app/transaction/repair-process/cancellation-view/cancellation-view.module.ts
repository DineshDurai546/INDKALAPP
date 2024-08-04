import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancellationViewPageRoutingModule } from './cancellation-view-routing.module';

import { CancellationViewPage } from './cancellation-view.page';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgSelectModule,
    CancellationViewPageRoutingModule
  ],
  declarations: [CancellationViewPage],
  exports:[CancellationViewPage]
})
export class CancellationViewPageModule {}
