import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentIssuePageRoutingModule } from './component-issue-routing.module';

import { ComponentIssuePage } from './component-issue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentIssuePageRoutingModule
  ],
  declarations: [ComponentIssuePage],
  exports:[ComponentIssuePage]
})
export class ComponentIssuePageModule {}
