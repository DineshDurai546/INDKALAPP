import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobVerificationPageRoutingModule } from './job-verification-routing.module';

import { JobVerificationPage } from './job-verification.page';
import { ImageViewPageModule } from './image-view/image-view.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JobVerificationPageRoutingModule,
    ImageViewPageModule
  ],
  declarations: [JobVerificationPage],
  exports:[JobVerificationPage]
})
export class JobVerificationPageModule {}
