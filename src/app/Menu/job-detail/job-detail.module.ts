import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobDetailPageRoutingModule } from './job-detail-routing.module';

import { JobDetailPage } from './job-detail.page';
import { TicketDetailsPageModule } from './ticket-details/ticket-details.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    JobDetailPageRoutingModule,
    NgSelectModule,
    FormsModule
  ],
  declarations: [JobDetailPage]
})
export class JobDetailPageModule {}
