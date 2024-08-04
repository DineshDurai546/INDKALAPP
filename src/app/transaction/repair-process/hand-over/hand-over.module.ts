import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HandOverPageRoutingModule } from './hand-over-routing.module';

import { HandOverPage } from './hand-over.page';
import { OtpVerificationPageModule } from '../pop-up/otp-verification/otp-verification.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OtpVerificationPageModule,
    FormsModule,
    IonicModule,
    HandOverPageRoutingModule
  ],
  declarations: [HandOverPage],
  exports: [HandOverPage]
})
export class HandOverPageModule {}
