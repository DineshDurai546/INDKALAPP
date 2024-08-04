import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnsiteJobclosedPage } from './onsite-jobclosed.page';

const routes: Routes = [
  {
    path: '',
    component: OnsiteJobclosedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnsiteJobclosedPageRoutingModule {}
