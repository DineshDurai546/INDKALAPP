import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InspectionPageModule } from './inspection/inspection.module';
import { RepairProcessPageRoutingModule } from './repair-process-routing.module';
import { RepairProcessPage } from './repair-process.page'; 

import { InvoicePageModule } from './invoice/invoice.module';
import { QuoteViewPageModule } from './quote-view/quote-view.module';
import { RepairViewPageModule } from './repair-view/repair-view.module'; 
import { ContractSalesPageModule } from 'src/app/inventory/contract-sales/contract-sales.module';
import { AdvancePaymentListPageModule } from 'src/app/inventory/advance-payment-list/advance-payment-list.module';
import { PaymentPageModule } from './payment/payment.module';  
import { HandOverPageModule } from './hand-over/hand-over.module'; 
import { VerificationPageModule } from './verification/verification.module';
import { CancellationRequestPageModule } from './pop-up/cancellation-request/cancellation-request.module';
import { CancellationViewPageModule } from './cancellation-view/cancellation-view.module';
import { JobVerificationPageModule } from './job-verification/job-verification.module';
import { AppointmentPageModule } from './appointment/appointment.module';
import { VisitPageModule } from './visit/visit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepairProcessPageRoutingModule,
    HandOverPageModule, 
    InspectionPageModule,
    InvoicePageModule,
    QuoteViewPageModule,
    RepairViewPageModule,
    ContractSalesPageModule,
    AdvancePaymentListPageModule,
    PaymentPageModule,
    VerificationPageModule,
    CancellationRequestPageModule,
    CancellationViewPageModule,
    JobVerificationPageModule,
    AppointmentPageModule,
    VisitPageModule
  ],
  declarations: [RepairProcessPage]
})
export class RepairProcessPageModule {}
