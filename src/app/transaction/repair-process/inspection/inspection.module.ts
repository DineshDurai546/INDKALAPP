import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { InspectionPageRoutingModule } from './inspection-routing.module';

import { InspectionPage } from './inspection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InspectionPageRoutingModule
  ],
  declarations: [InspectionPage], 
  exports:[InspectionPage],
  providers: [
    DatePipe,
    // other providers
  ],
})
export class InspectionPageModule {}
