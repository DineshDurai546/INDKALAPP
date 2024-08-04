import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyDetailPageRoutingModule } from './company-detail-routing.module';

import { CompanyDetailPage } from './company-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyDetailPageRoutingModule
  ],
  declarations: [CompanyDetailPage],
  exports:[CompanyDetailPage]
})
export class CompanyDetailPageModule {}
