import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepairPopPageRoutingModule } from './repair-pop-routing.module';

import { RepairPopPage } from './repair-pop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepairPopPageRoutingModule
  ],
  declarations: [RepairPopPage],
  exports:[RepairPopPage]
})
export class RepairPopPageModule {}
