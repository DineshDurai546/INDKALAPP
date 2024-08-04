import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Controller } from 'src/app/config/comman.const';
// import { Controller } from '../config/global';
import { ApiService } from 'src/app/core/service/api.service';
// import { ApiService } from '../core/service/api.service';
import { Columns } from 'src/app/models/column.metadata';
// import { Columns } from '../models/column.metadata';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private apiService: ApiService) { }
  downloadServiceReport = (reportType,data) => {
    debugger;
    if(reportType=='SERVICE')
    {
      return this.apiService.postData(Controller.Report + 'DownloadServiceReport', data);
    }
    else if(reportType=='DIAGNOSIS')
    {
      return this.apiService.postData(Controller.Report + 'DownloadDiagnosisReport', data);
    }
    else if(reportType=='DELIVERY')
    {
      return this.apiService.postData(Controller.Report + 'DownloadDeliveryReport', data);
    }
    else if(reportType=='PAYMENT')
    {
      return this.apiService.postData(Controller.Report + 'DownloadPaymentReport', data);
    }
    else if(reportType=='INVOICE')
    {
      return this.apiService.postData(Controller.Report + 'DownloadInvoiceReport', data);
    }
    else if(reportType=='QUOTE')
    {
      return this.apiService.postData(Controller.Report + 'DownloadQuoteReport', data);
    }
    else if(reportType=='TOKEN')
    {
      return this.apiService.postData(Controller.Report + 'ExportReport', data);
    }
    else if(reportType=='JOB')
    {
      return this.apiService.postData(Controller.Report + 'ExportJobReport', data);
    }

    else if(reportType=='COMMUNICATION')
    { 
      return this.apiService.postData(Controller.Report + 'ExportCommunicationReport', data);
    }


    else if(reportType=='SALES')
    {
      return this.apiService.postData(Controller.Report + 'ExportSalesReport', data);
    }
    else if(reportType=='EXPORTPAYMENT')
    {
      return this.apiService.postData(Controller.Report + 'ExportPaymentReport', data);
    }
    else if(reportType=='downloadBulkReturnDC')
    {
      return this.apiService.postData(Controller.Report + 'downloadBulkReturnDC', data);
    }
    else if(reportType=='SALESRETURN')
    {
      return this.apiService.postData(Controller.Report + 'downloadSalesReturnReport', data);
    }
    return null;
  }
}
