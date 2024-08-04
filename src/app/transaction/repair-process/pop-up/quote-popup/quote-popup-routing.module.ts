import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotePopupPage } from './quote-popup.page';

const routes: Routes = [
  {
    path: '',
    component: QuotePopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotePopupPageRoutingModule {}
