import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepairViewPageRoutingModule } from './repair-view-routing.module';

import { RepairViewPage } from './repair-view.page';
import { RepairPopPageModule } from '../pop-up/repair-pop/repair-pop.module'; 
import { RepairPopPage } from '../pop-up/repair-pop/repair-pop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RepairViewPageRoutingModule,
    RepairPopPageModule
  ],
  declarations: [RepairViewPage],
  exports:[RepairViewPage]
})
export class RepairViewPageModule {}
