import { Injectable } from '@angular/core';
//import { DropDownType, RequestValue } from 'src/app/custom-components/call-login/metadata/request.metadata';
import { DynamicService } from '../dynamicService/dynamic.service';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import xml2js from 'xml2js';
import { DropDownType,RequestValue } from 'src/app/custom-components/request.metadata';

@Injectable({
  providedIn: 'root'
})
export class DropdownDataService {
  private baseurl = "";
  constructor(private dynamicService: DynamicService,
    private http: HttpClient) { }
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseurl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);

  }
  getFiles(): Observable<any> {
    return this.http.get(`${this.baseurl}/files`);
  }
  getPatnerTypeValue(type: DropDownType): String {
    let strType = "";
    switch (type) {
      case DropDownType.CustAccountGroup:
        strType = "RtlCustomer";
        break;
    }
    return strType;
  }
  GetComboTypeValue(type: DropDownType): String {
    let strType = "";
    switch (type) {
      case DropDownType.ItemReceivable:
        strType = "BindItemReceivable";
        break;
      case DropDownType.NoOfDays:
        strType = "MasterContent";
        break;
      case DropDownType.Symptoms:
        strType = "MasterContent";
        break;
      case DropDownType.ELSStatus:
        strType = "MasterContent";
        break;
        case DropDownType.pricetype:
          strType = "MasterContent";
          break;   
      case DropDownType.TransportationCarrier:
        strType = "MasterContent";
        break;  
      case DropDownType.SNRReason:
        strType = "MasterContent";
        break;
      case DropDownType.coverage:
        strType = "MasterContent";
        break;
      case DropDownType.Customer:
        strType = "BindRTLCustomer";
        break;
      case DropDownType.Country:
        strType = "BindCountry";
        break;
      case DropDownType.State:
        strType = "BindState"
        break;
      case DropDownType.WarrantyStatus:
        strType = "MasterContent";
        break;
      case DropDownType.repair:
        strType = "MasterContent";
        break;
      case DropDownType.defect:
        strType = "MasterContent";
        break;
      case DropDownType.CustAccountGroup:
        strType = "BindPartnerAccGroup";
        break;
      case DropDownType.GSTRegistration:
        strType = "MasterContent";
        break;
      case DropDownType.callForm:
        strType = "BindJobType";
        break;
      case DropDownType.materialCode:
        strType = "BindFGMaterial";
        break;
      case DropDownType.Location:
        strType = "BindLocation4Job";
        break;
      case DropDownType.Technician:
        strType = "BindTechnician";
        break;
      case DropDownType.ServiceType:
        strType = "MasterContent";
        break;
      case DropDownType.BomMaterial:
        strType = "BindBomMaterial";
        break;
      case DropDownType.RepairType:
        strType = "MasterContent";
        break;
      case DropDownType.CovarageOption:
        strType = "MasterContent"
        break;
      case DropDownType.TimeSlot:
        strType = "MasterContent"
        break;  
      case DropDownType.Reproducibility:
        strType = "MasterContent"
        break;
      case DropDownType.ProductType:
        strType = "MasterContent";
        break;
      case DropDownType.BillingOption:
        strType = "MasterContent";
        break;
      case DropDownType.DiagStatus:
        strType = "MasterContent";
        break;
      case DropDownType.PartType:
        strType = "MasterContent";
        break;
      case DropDownType.ResourceType:
        strType = "MasterContent";
        break;
      case DropDownType.TaxType:
        strType = "MasterContent";
        break;
      case DropDownType.LocationPriceGroup:
        strType = "MasterContent";
        break;
      case DropDownType.MatPriceGroup:
        strType = "MasterContent"
        break;
      case DropDownType.ProductCategory:
        strType = "MasterContent"
        break;
      case DropDownType.RepairStatus:
        strType = "MasterContent"
        break;
      case DropDownType.ProductCategory:
        strType = "MasterContent"
        break;
      case DropDownType.LocationAccountGroupCode:
        strType = "BindLocation"
        break;
      case DropDownType.MaterialItemCode:
        strType = "BindMaterial"
        break;
      case DropDownType.ResourceItemCode:
        strType = "BindResource"
        break;
      case DropDownType.PaymentTerm:
      strType = "BindPaymentTerm"
      break;
      case DropDownType.GSTGroupCode:
        strType = "BindGSTGroup"
        break;
      case DropDownType.GSTComponentCode:
        strType = "BindGSTComponent"
        break;
      case DropDownType.GSTJuridictionType:
        strType = "MasterContent"
        break;
      case DropDownType.VisitPurpose:
        strType = "MasterContent"
        break;
      case DropDownType.JobStatus:
        strType = "MasterContent"
        break;
      case DropDownType.JobRole:
        strType = "BindJobRole"
        break;
      case DropDownType.OrgRole:
        strType = "BindOrgRole"
        break;
      case DropDownType.TimeZone:
        strType = "BindTimeZone"
        break;
      case DropDownType.Language:
        strType = "BindLanguage"
        break;
      case DropDownType.Company:
        strType = "BindCompany"
        break;
      case DropDownType.SubmissionType:
        strType = "MasterContent"
        break;
      case DropDownType.ProductName:
        strType = "BindProductName"
        break;  
      case DropDownType.QuoteStatus:
        strType = "MasterContent"
        break; 
        case DropDownType.MenuGroup:
        strType = "BindMenuGroup"
        break;
        case DropDownType.DocumentType:
        strType = "BindDocumentType"
        break;
      case DropDownType.StoDocType:
        strType = "BindSTODocumentType"
        break;
      case DropDownType.InvoiceDocType:
        strType = "MasterContent"
        break;
      case DropDownType.modeofpayment:
        strType = "BindAdvanceModeofPayment"
        break;
      case DropDownType.SalesPerson:
        strType="BindSalesPerson"
        break;
      case DropDownType.BindProfileId:
        strType = "BindProfileId";
        break;
        case DropDownType.BindModuleId:
          strType = "BindModuleId";
          break;
      case DropDownType.RefundDocType:
        strType = "MasterContent"
        break;
      case DropDownType.RefundReason:
        strType = "MasterContent"
        break;
      case DropDownType.RefundType:
        strType = "BindRefundRequest";
        break;  
      // case DropDownType.PricingOption:
      //   strType = "BindPricingOption";
      //   break;
      case DropDownType.PricingOption:
        strType = "MasterContent"
        break;
      case DropDownType.Bank:
        strType = "BindBank";
        break;  
      case DropDownType.Disposition:
        strType = "MasterContent";
        break;
      case DropDownType.bindcomponentcode:
        strType = "BindComponentCode";
        break;
      case DropDownType.bindissueCode:
        strType = "BindIssueCode"
        break;
      case DropDownType.AdvancePaymentDocType:
        strType = "MasterContent"
        break;

      case DropDownType.CancellationRequest:
        strType = "MasterContent"
        break;

      case DropDownType.ReplacementType:
        strType = "MasterContent";
        break; 

      case DropDownType.CONSIGNMENTSTOCK:
        strType = "MasterContent";
        break;

      case DropDownType.Material4BrandJob:
        strType = "BindMaterial4BrandJob"
        break;

      case DropDownType.PVRemark:
        strType = "MasterContent";
        break;

      case DropDownType.RepairheaderStatus:
        strType = "MasterContent"
        break;
  
    }
    return strType;
  }
  GetEntityIdValue(type: DropDownType): String {
    let strType = "";
    switch (type) {

      case DropDownType.ItemReceivable:
        strType = "";
        break;
      case DropDownType.SNRReason:
        strType = "SNRREASON"
        break;
      case DropDownType.Symptoms:
        strType = "SYMPTOM";
        break;
      case DropDownType.ELSStatus:
        strType = "ELSSTATUS";
        break;
      case DropDownType.defect:
        strType = "DEFECT";
        break;
      case DropDownType.repair:
        strType = "REPAIR";
        break;
      case DropDownType.GSTRegistration:
        strType = "GSTREGTYPE"
        break;
      case DropDownType.WarrantyStatus:
        strType = "WARRANTYSTATUS"
        break;
      case DropDownType.ServiceType:
        strType = "SERVICETYPE"
        break;
      case DropDownType.RepairType:
        strType = "REPAIRTYPE"
        break;
      case DropDownType.CovarageOption:
        strType = "COVERAGEOPTION"
        break;
      case DropDownType.TimeSlot:
        strType = "TIMESLOT"
        break;
      case DropDownType.Reproducibility:
        strType = "REPRODUCIBILITY"
        break;
      case DropDownType.ProductType:
        strType = "PRODUCTTYPE";
        break;
      case DropDownType.BillingOption:
        strType = "BILLINGOPTION";
        break;
      case DropDownType.DiagStatus:
        strType = "DIAGSTATUS";
        break;
      case DropDownType.NoOfDays:
        strType = "DIAGNOOFDAY";
        break;
      case DropDownType.PartType:
        strType = "PARTTYPE";
        break;
      case DropDownType.ResourceType:
        strType = "RESOURCETYPE";
        break;
      case DropDownType.TaxType:
        strType = "TAXTYPE";
        break;
      case DropDownType.LocationPriceGroup:
        strType = "LOCATIONPRICEGROUP";
        break;
      case DropDownType.MatPriceGroup:
        strType = "MATPRICEGROUP";
        break;
      case DropDownType.MatPriceGroup:
        strType = "PRODUCTCATEGORY";
        break;
      case DropDownType.RepairStatus:
        strType = "ALLREPAIRSTATUSCODES";
        break;
      case DropDownType.VisitPurpose:
        strType = "VISITPURPOSE"
        break;
        case DropDownType.pricetype:
          strType = "PRICETYPE";
          break;
      case DropDownType.GSTJuridictionType:
        strType = "GSTJuridictionType"
        break;
      case DropDownType.PaymentTerm:
        strType = "PAYMENTTERM"
        break;
      case DropDownType.JobStatus:
        strType = "JOBSTATUS"
        break;
      case DropDownType.ProductCategory:
        strType = "PRODUCTCATEGORY"
        break;
      case DropDownType.SubmissionType:
        strType = "SUBMISSIONTYPE"
        break;
      case DropDownType.TransportationCarrier:
        strType = "TRANSPORTCARRIER"
        break;
      case DropDownType.QuoteStatus:
        strType = "QUOTESTATUS"
        break;
      case DropDownType.InvoiceDocType:
        strType = "INVOICEDOCTYPE"
        break;
      case DropDownType.RefundDocType:
        strType = "REFDOCTYPE" // REFUNDDOCTYPE is too long a word for the MasterCode in Master Content List Table
        break;
      case DropDownType.RefundReason:
        strType = "REFREASON"
        break;
      case DropDownType.Disposition:
        strType = "DISPOSITION";
        break;
      case DropDownType.modeofpayment:
        strType = "BindAdvanceModeofPayment"
        break;
        case DropDownType.AdvancePaymentDocType:
          strType = "ADVPAYDOCTYPE"
          break;

        case DropDownType.PricingOption:
          strType = "PRICETYPE";
          break;
          
        case DropDownType.CancellationRequest:
          strType = "CANCELLATIONREQUEST"
          break;

        case DropDownType.ReplacementType:
          strType = "REPLACEMENTTYPE";
          break;
      
        case DropDownType.CONSIGNMENTSTOCK:
          strType = "CONSIGNMENTSTOCK";
          break;

        case DropDownType.PVRemark:
          strType = "PVREJECTIONREMARK"
          break;

        case DropDownType.coverage:
          strType = "COVERAGETYPE";
          break;
  
      case DropDownType.RepairheaderStatus:
        strType = "REPAIRSTATUS";
        break;
    }


    return strType;
  }


  public fetchDropDownData(type: DropDownType, SearchText: String, options?: {
    CountryCode?: string,
    MaterialCode?:string,
    ComponentCode?:string,
    ProductCategory?: string,
    OrgRoleId?: string,
    BrandCode?:string,
    ProductType?:string,
    CompanyCode?: any,
    LocationCode?: string,
    MasterMaterialCode?: string,
    JobType?: string,
    ReturnType?: string,
    CustomerCode?: string,
    DocType?: string,
  }): Observable<DropDownValue> {
    const mainRequest: RequestValue[] = [];
    mainRequest.push(new RequestValue("ComboType", this.GetComboTypeValue(type)));
    mainRequest.push(new RequestValue("EntityId", this.GetEntityIdValue(type)));
    mainRequest.push(new RequestValue("PartnerType", this.getPatnerTypeValue(type)));
    if (options?.CountryCode != null) {
      mainRequest.push(new RequestValue("CountryCode", options.CountryCode));
    }
    if (options?.CompanyCode != null) {
      mainRequest.push(new RequestValue("CompanyCode", options.CompanyCode));
    }
    if(options?.ComponentCode !=null){
      mainRequest.push(new RequestValue("ComponentCode", options.ComponentCode));
      console.log("Drpdown ComponentCode:,",mainRequest)
    }
 
    if (options?.OrgRoleId != null) {
      mainRequest.push(new RequestValue("OrgRoleId", options.OrgRoleId));
    }

     
    if (options?.BrandCode != null) {
      mainRequest.push(new RequestValue("BrandCode", options.BrandCode));
    }

    if (options?.ProductType != null) {
      mainRequest.push(new RequestValue("ProductType", options.ProductType));
    }
    
    if (options?.MaterialCode != null) {
      mainRequest.push(new RequestValue("MaterialCode", options.MaterialCode));
    };

    if (options?.ProductCategory != null) {
      mainRequest.push(new RequestValue("ProductCategory", options.ProductCategory))
    }
    if (options?.MasterMaterialCode != null) {
      mainRequest.push(new RequestValue("MasterMaterialCode", options.MasterMaterialCode));
    }
    mainRequest.push(new RequestValue("SearchTerm", SearchText));
    if (options?.JobType != null) {
      mainRequest.push(new RequestValue("JobType", options.JobType));
    }
    if (options?.LocationCode != null) {
      mainRequest.push(new RequestValue("LocationCode", options.LocationCode));
    }
    if (options?.CustomerCode != null) {
      mainRequest.push(new RequestValue("CustomerCode", options.CustomerCode));
    }
    if (options?.DocType != null) {
      mainRequest.push(new RequestValue("DocType", options.DocType));
    }
    if (options?.ReturnType != null) {
      mainRequest.push(new RequestValue("ReturnType", options.ReturnType));
    }

    
    let subject = new BehaviorSubject<DropDownValue>(null);
    this.dynamicService.getDropdownExtraData({
      Content: JSON.stringify(mainRequest)
    }).subscribe({
      next: (value) => {
        try {
          let ddv = DropDownValue.parse(value);
          subject.next(ddv);
        } catch (e) {
          subject.error(e);
        }
      },
      error: err => {
        subject.error(err);
      },
      complete: () => {
        subject.complete();
      }
    });
    return subject.asObservable();
  }
}

export class DropDownValue {
  TotalRecord: number;
  Data: any[];
  extraData: any;

  static parse(json): DropDownValue {
    let ddv = new DropDownValue();
    let jsonValue = JSON.parse(json);
    ddv.TotalRecord = jsonValue['TotalRecord'];
    ddv.Data = JSON.parse(jsonValue['Data']);
    for (let d of ddv.Data) {
      let parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
      parser.parseString(d['extraData'], function (err, result) {
        d['extraDataJson'] = result;
      });
    }
    return ddv;
  }

  static getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }

}
