import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { TilesPageModule } from './tiles/tiles.module';
import { JobDetailPageModule } from '../job-detail/job-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    TilesPageModule,
    JobDetailPageModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
