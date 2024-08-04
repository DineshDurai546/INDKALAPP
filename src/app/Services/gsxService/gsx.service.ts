import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Controller } from 'src/app/config/comman.const';
import { ApiService } from 'src/app/core/service/api.service';
import { Columns } from 'src/app/models/column.metadata';

@Injectable({
  providedIn: 'root'
})
export class GsxService {
  

  constructor(private apiService: ApiService) { }
  getDeviceDetails = (data) => {
    return this.apiService.postData(Controller.GSX + 'GetDeviceDetails', data);
  }

  getPartsSummary = (data) => {
    return this.apiService.postData(Controller.GSX + 'GetPartsSummary', data);
  }

  getComponentIssue = (data) => {
    return this.apiService.postData(Controller.GSX + 'GetComponentIssue', data);
  }
  getRepairQuestions=(data) => {
    return this.apiService.postData(Controller.GSX + 'RepairQuestions', data);
  }
  
  getRepairSummary = (fetchAllRepair,data) =>
  {
    return this.apiService.postData(Controller.GSX + 'RepairSummary',data)
  }

  CreateUpdateRepair=(data) => {
    return this.apiService.postData(Controller.GSX + 'CreateUpdateRepair', data);
  }
  
  RepairEligibility=(data) => {
    return this.apiService.postData(Controller.GSX + 'RepairEligibility', data);
  }
  UpdateRepairNotesAndAttachments=(data) => {
    return this.apiService.postData(Controller.GSX + 'UpdateRepairNotesAndAttachments', data);
  }

  AcceptRejectRepair=(data) => {
    return this.apiService.postData(Controller.GSX + 'AcceptRejectRepair', data);
  }

  getStockingPartsSummary = (data) => {
    return this.apiService.postData(Controller.GSX + 'OrderStockingPartsSummary', data);
  }

  getRepairDetails=(LocationCode,CompanyCode,data) => {
    debugger
    return this.apiService.postData(Controller.GSX + 'RepairDetails?LocationCode='+LocationCode+'&CompanyCode=' + CompanyCode, data);
  }

  getReturnsLookup = (data) => {
    return this.apiService.postData(Controller.GSX + 'ReturnsLookup', data);
  }

  getOrderStockingSummary = (data) => {
    return this.apiService.postData(Controller.GSX + 'OrderStockingSummary', data);
  }

  saveOrderStockingCreate = (data) => {
    return this.apiService.postData(Controller.GSX + 'OrderStockingCreate ', data);
  }

  updateOrderStockingUpdate = (data) => {
    return this.apiService.postData(Controller.GSX + 'OrderStockingUpdate ', data);
  }

  deleteOrderStockingDalete = (data) => {
    return this.apiService.postData(Controller.GSX + 'OrderStockingDelete ', data);
  }

 getStockingPartsDetails = (data) => {
  return this.apiService.postData(Controller.GSX + 'OrderStockingDetails', data);
}

getInvoiceLink = (data) => {
  return this.apiService.postData(Controller.GSX + 'DocumentDownloadWithUrl', data);
}


getConsignmentDeliveryLookup = (data) => {
  return this.apiService.postData(Controller.GSX  + 'ConsignmentDeliveryLookup', data)
}

returnConfirmShipment = (data) => {
  return this.apiService.postData(Controller.GSX  + 'ReturnsConfirmShipment', data)
}
downloadDocument = (documentType,data) => {
  var url= Controller.GSX + "DocumentDownloadPost?documentType=" + documentType.toString()
  return this.apiService.postData(url, data);
}

ReturnsManage = (data) => {
  return this.apiService.postData(Controller.GSX + 'ReturnsManage', data);
  }

getConsignmentOrderLookup = (data) => {
  return this.apiService.postData(Controller.GSX + 'ConsignmentOrderLookup', data);
}

gsxSearch = (data) => {
  return this.apiService.postData(Controller.GSX + 'Search', data);
}


getConsignmentLookup = (data) => {
  return this.apiService.postData(Controller.GSX + 'ConsignmentLookup', data);
}
saveConsignmentAcknowldge= (data) => {
  return this.apiService.postData(Controller.GSX + 'ConsignmentDeliveryAcknowledge', data);
}
fetchUserDetail = () => {
  return this.apiService.getData(Controller.GSX + 'fetchGsxTokenDetails')
}
saveGsxTokenDetail = (data) =>{
  return this.apiService.postData(Controller.GSX + 'saveGsxActivationToken', data)
}

fetchDiagnosisSuit = (data) =>{
  return this.apiService.postData(Controller.GSX + 'DiagnosticsSuites', data)
}

fetchDiagnosisStatus = (data) =>{
  return this.apiService.postData(Controller.GSX + 'DiagnosticsStatus', data)
}

fetchDiagnosisLookup = (data) =>{
  return this.apiService.postData(Controller.GSX + 'DiagnosticsLookup', data)
}

InitiateDiagnostics = (data) =>{
  return this.apiService.postData(Controller.GSX + 'DiagnosticsInitiateTest', data)
}

getInvoiceStock = (plantcode,storagelocation) =>{
  return this.apiService.getData(Controller.SAP + 'getAllStockData?plantcode='+plantcode + "&storagelocation="+storagelocation)
}

saveSAPBillingDocument=(data)=>{
  return this.apiService.postData(Controller.SAP + 'saveSAPBillingDocument', data)
}

getSAPSerialNoData = (materialcode,serialno) =>{
  return this.apiService.getData(Controller.SAP + 'getSerialData?materialcode='+materialcode + '&serialno='+serialno)
}

getCostPrice = (materialcode,plantcode,batch) =>{
  return this.apiService.getData(Controller.SAP + 'getCostPrice?materialcode='+materialcode + '&plantcode='+plantcode + '&batch=' + batch)
}

generateEInvoice = (data) =>{
  return this.apiService.postData(Controller.EInvoice + 'saveEinvoice',data)
}

}
