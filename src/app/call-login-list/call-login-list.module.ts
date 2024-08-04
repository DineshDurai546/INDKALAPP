import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallLoginListPageRoutingModule } from './call-login-list-routing.module';

import { CallLoginListPage } from './call-login-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallLoginListPageRoutingModule
  ],
  declarations: [CallLoginListPage]
})
export class CallLoginListPageModule {}
