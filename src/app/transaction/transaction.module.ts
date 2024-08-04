import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandOverPageModule } from './repair-process/hand-over/hand-over.module'; 
import { InspectionPageModule } from './repair-process/inspection/inspection.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HandOverPageModule, 
    InspectionPageModule
  ]
})
export class TransactionModule { }
