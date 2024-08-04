import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { RepairProcessPage } from './repair-process.page';

const routes: Routes = [
  {
    path: '',
    component: RepairProcessPage
  },
  {
    path: 'hand-over',
    loadChildren: () => import('./hand-over/hand-over.module').then( m => m.HandOverPageModule)
  },
  {
    path: 'inspection',
    loadChildren: () => import('./inspection/inspection.module').then( m => m.InspectionPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./notes/notes.module').then( m => m.NotesPageModule)
  },
  {
    path: 'all-event',
    loadChildren: () => import('./all-event/all-event.module').then( m => m.AllEventPageModule)
  },
  {
    path: 'diagnosis',
    loadChildren: () => import('./diagnosis/diagnosis.module').then( m => m.DiagnosisPageModule)
  },
  {
    path: 'diagnostic',
    loadChildren: () => import('./diagnostic/diagnostic.module').then( m => m.DiagnosticPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'invoice',
    loadChildren: () => import('./invoice/invoice.module').then( m => m.InvoicePageModule)
  },
  {
    path: 'loaner',
    loadChildren: () => import('./loaner/loaner.module').then( m => m.LoanerPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'quote-view',
    loadChildren: () => import('./quote-view/quote-view.module').then( m => m.QuoteViewPageModule)
  },
  {
    path: 'ready-to-pickup',
    loadChildren: () => import('./ready-to-pickup/ready-to-pickup.module').then( m => m.ReadyToPickupPageModule)
  },
  {
    path: 'repair-view',
    loadChildren: () => import('./repair-view/repair-view.module').then( m => m.RepairViewPageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./verification/verification.module').then( m => m.VerificationPageModule)
  },
  {
    path: 'inspection',
    loadChildren: () => import('./inspection/inspection.module').then( m => m.InspectionPageModule)
  },
  {
    path: 'component-issue',
    loadChildren: () => import('./component-issue/component-issue.module').then( m => m.ComponentIssuePageModule)
  },
  {
    path: 'repair-pop',
    loadChildren: () => import('./pop-up/repair-pop/repair-pop.module').then( m => m.RepairPopPageModule)
  },
  {
    path: 'quote-popup',
    loadChildren: () => import('./pop-up/quote-popup/quote-popup.module').then( m => m.QuotePopupPageModule)
  },
  {
    path: 'otp-verification',
    loadChildren: () => import('./pop-up/otp-verification/otp-verification.module').then( m => m.OtpVerificationPageModule)
  },
  {
    path: 'cancellation-request',
    loadChildren: () => import('./pop-up/cancellation-request/cancellation-request.module').then( m => m.CancellationRequestPageModule)
  },
  {
    path: 'cancellation-view',
    loadChildren: () => import('./cancellation-view/cancellation-view.module').then( m => m.CancellationViewPageModule)
  },
  {
    path: 'job-verification',
    loadChildren: () => import('./job-verification/job-verification.module').then( m => m.JobVerificationPageModule)
  },
  {
    path: 'material-popup',
    loadChildren: () => import('./pop-up/material-popup/material-popup.module').then( m => m.MaterialPopupPageModule)
  },
  {
    path: 'partorder',
    loadChildren: () => import('./pop-up/partorder/partorder.module').then( m => m.PartorderPageModule)
  },
  {
    path: 'appointment',
    loadChildren: () => import('./appointment/appointment.module').then( m => m.AppointmentPageModule)
  },
  {
    path: 'visit',
    loadChildren: () => import('./visit/visit.module').then( m => m.VisitPageModule)
  },
  {
    path: 'visit-list-popup',
    loadChildren: () => import('./pop-up/visit-list-popup/visit-list-popup.module').then( m => m.VisitListPopupPageModule)
  },
  {
    path: 'barcode-scanner',
    loadChildren: () => import('./pop-up/barcode-scanner/barcode-scanner.module').then( m => m.BarcodeScannerPageModule)
  },
  {
    path: 'file-viewer',
    loadChildren: () => import('./file-viewer/file-viewer.module').then( m => m.FileViewerPageModule)
  },
  {
    path: 'onsite-jobclosed',
    loadChildren: () => import('./pop-up/onsite-jobclosed/onsite-jobclosed.module').then( m => m.OnsiteJobclosedPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepairProcessPageRoutingModule {}
