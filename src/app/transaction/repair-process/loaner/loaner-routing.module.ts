import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoanerPage } from './loaner.page';

const routes: Routes = [
  {
    path: '',
    component: LoanerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanerPageRoutingModule {}
