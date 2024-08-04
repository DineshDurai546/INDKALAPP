import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllEventPage } from './all-event.page';

const routes: Routes = [
  {
    path: '',
    component: AllEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllEventPageRoutingModule {}
