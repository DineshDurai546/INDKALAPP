import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'; 
 import { TicketDetailsPage } from './Menu/job-detail/ticket-details/ticket-details.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  }, 
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'company',
    loadChildren: () => import('./login/company-detail/company-detail.module').then( m => m.CompanyDetailPageModule)
  },

  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'call-login-list',
    loadChildren: () => import('./call-login-list/call-login-list.module').then( m => m.CallLoginListPageModule)
  },
  {
    path: 'Menu/attendance',
    loadChildren: () => import('./Menu/attendance/attendance.module').then( m => m.AttendancePageModule)
  },
  // {
  //   path: 'Menu/job-details',
  //   loadChildren: () => import('./Menu/job-details/job-details.module').then( m => m.JobDetailsPageModule)
  // },
  {
    path: 'Menu/chat',
    loadChildren: () => import('./Menu/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'Menu/profile',
    loadChildren: () => import('./Menu/profile/profile.module').then( m => m.ProfilePageModule)
  },
  { path: 'ticket-details', component: TicketDetailsPage },
  {
    path: 'Menu/dashboard',
    loadChildren: () => import('./Menu/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'Menu/logout',
    loadChildren: () => import('./Menu/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'Menu/job-detail',
    loadChildren: () => import('./Menu/job-detail/job-detail.module').then( m => m.JobDetailPageModule)
  },
  {
    path: 'repair-process',
    loadChildren: () => import('./transaction/repair-process/repair-process.module').then( m => m.RepairProcessPageModule)
  },
  {
    path: 'Menu/accessories-sales',
    loadChildren: () => import('./Menu/accessories-sales/accessories-sales-routing.module').then( m => m.AccessoriesSalesPageRoutingModule)
  },
  {
    path: 'discount-list-popup',
    loadChildren: () => import('./inventory/accessory-sales/discount-list-popup/discount-list-popup.module').then( m => m.DiscountListPopupPageModule)
  },
  {
    path: 'request-discount-popup',
    loadChildren: () => import('./inventory/accessory-sales/request-discount-popup/request-discount-popup.module').then( m => m.RequestDiscountPopupPageModule)
  },
  {
    path: 'contract-sales',
    loadChildren: () => import('./inventory/contract-sales/contract-sales.module').then( m => m.ContractSalesPageModule)
  },
  {
    path: 'accessories-sales',
    loadChildren: () => import('./Menu/accessories-sales/accessories-sales.module').then( m => m.AccessoriesSalesPageModule)
  },
  {
    path: 'advance-payment-list',
    loadChildren: () => import('./inventory/advance-payment-list/advance-payment-list.module').then( m => m.AdvancePaymentListPageModule)
  },
  {
    path: 'advance-payment',
    loadChildren: () => import('./inventory/advance-payment/advance-payment.module').then( m => m.AdvancePaymentPageModule)
  },
  {
    path: 'cancellation-view',
    loadChildren: () => import('./transaction/repair-process/cancellation-view/cancellation-view.module').then( m => m.CancellationViewPageModule)
  },
  {
    path: 'appointment',
    loadChildren: () => import('./transaction/repair-process/appointment/appointment.module').then( m => m.AppointmentPageModule)
  }
 
 

 
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
