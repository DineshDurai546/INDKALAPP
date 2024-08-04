import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallLoginListPage } from './call-login-list.page';

const routes: Routes = [
  {
    path: '',
    component: CallLoginListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallLoginListPageRoutingModule {}
