import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import xml2js from 'xml2js';
import { v4 as uuidv4, parse } from 'uuid';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { ActionSheetController, AnimationController, IonModal, ModalController, NavParams, ToastController } from '@ionic/angular';
import { InvoiceSalesStockSelectorPageModule } from './invoice-sales-stock-selector/invoice-sales-stock-selector.module';
import { InvoiceSalesStockSelectorPage } from './invoice-sales-stock-selector/invoice-sales-stock-selector.page';
import { PaymentPopupPage } from './payment-popup/payment-popup.page';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { DiscountListPopupPage } from './discount-list-popup/discount-list-popup.page';
import { ReportService } from 'src/app/Services/gsxService/report.service';
import { GsxService } from 'src/app/Services/gsxService/gsx.service';
import * as glob from "../../config/global";
import { RepairProcessPage } from 'src/app/transaction/repair-process/repair-process.page';
 
 


@Component({
  selector: 'app-accessory-sales',
  templateUrl: './accessory-sales.page.html',
  styleUrls: ['./accessory-sales.page.scss'],
})
export class AccessorySalesPage implements OnInit {

  @Input() accessoryData: any;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(RepairProcessPage) repairProcess: RepairProcessPage


  CustomerObject: any[] = []
  LocationObject: any[] = []
  addedPartCount: number = 0;
  typeSelected = 'ball-clip-rotate';
  isPartSelector: boolean = false;
  partList: any[] = [];
  finalSelectedElements: any[] = []
  netPrice: number;
  taxPrice: number;
  LocationForJob: DropDownValue = DropDownValue.getBlankObject();
  // GLCode: DropDownValue = DropDownValue.getBlankObject();
  InvoiceDocType: DropDownValue = DropDownValue.getBlankObject();
  PricingOptionDD: DropDownValue = DropDownValue.getBlankObject();
  SalesPersonDD: DropDownValue = DropDownValue.getBlankObject();
  companyCode: DropDownValue = DropDownValue.getBlankObject();
  errorMessage: any;
  locationData: string;
  InvoiceGuid: any;
  InvoiceDocTypeData: string;
  params: any;
  title: string = ''
  productCategory: any;
  currentDate: Date;

  totalBaseAmount: number = 0;
  totalDiscountAmount: number = 0;
  totalTaxableAmount: number = 0;
  totalTaxAmount: number = 0;
  totalNetAmount: number = 0;
  isEdit: boolean = false;
  Amount: number = 0.00;
  ModeofPayment: DropDownValue = DropDownValue.getBlankObject();
  modeofPaymentData: string = '';
  AccountNo: string = '';
  UPITransactionId: string = '';
  AuthNo: string = '';
  CardType: any = ['Visa', 'Master Card']
  CardTypeData: string = '';
  CardNo: string = '';
  Adjudication: string = '';
  TerminalId: string = ''
  RequestedAmt: any;
  AccountHolderName: string = ''
  BankCode: string = ''
  BankAccountNo: number;
  paymentDetailArray: any[] = []
  totalPaidAmount: number = 0.00;
  // GLCodeData: string;
  invoiceCode: string = '';
  invoiceDate: string = '' 
  
  companyObject: any[] = [];
  
  salesPersonName: string = ''
  Remarks: string = ''

  DeliveryUpdateSuccess: boolean = false;
  DeliveryHeaderSuccess: boolean = false;
  PickingSuccess: boolean = false;
  PGISuccess: boolean = false;
  SerialUpdate: boolean = false;
  ETag: string = "";
  houseofBank: string = '';
  storageLocationResponse: string = '';
  IRNNumber:string = ''
  refundObject: any[]=[];
  totalRefundAmount: number=0;
  hideDiscountForm: boolean = true;
  hidePopup: boolean = true;
  discountMaterialCode: string = '';
  discountPartUnitPrice: number = 0;
  popUpArray: any[] = [];
  discountAmountRequested: number = 0;
  submitClicked :boolean=false;
  CreditAmount: number = 0;
  DebitAmount:  number = 0;
  TotalCustomerAdvance : number = 0;
  ARAgainstJob: number = 0;
  invoiceGUID;
  hideDiscountPopup: boolean = true;
  presentingElement = undefined;
  private canDismissOverride = false;
  CustomerMobileNo:any;
  modeofpayment = []
  paymentArray=[]
  acceptedPaymentArray=[]

  @Output() invoiceSuccessObjt = new EventEmitter<any>();
  @Output() contractSuccessObjt =new EventEmitter<any>();


  constructor(
    private dynamicService: DynamicService,
    private dropdownDataService: DropdownDataService,
    private modalController: ModalController,
    private animationCtrl: AnimationController,
    private route: ActivatedRoute, 
    private navParams: NavParams,
    private gsxService: GsxService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private reportService: ReportService
  ) { }
   

  accessoryDataList:any;
  
  ngOnInit()
   { 

    this.presentingElement = document.querySelector('.ion-page'); 
    this.currentDate = new Date();

    
    //this.params = this.activatedRoute.snapshot.queryParams;
    //From accessories List
    this.accessoryDataList = this.navParams.get('accessoryData'); 
    this.params=this.accessoryDataList 
    console.log("accessoryDataList===",this.accessoryDataList)
 
    this.submitClicked=false; 
    this.onModeofPaymentSearch({ term: "", item: [] });
    this.onInvoiceDocTypeSearch({ term: "", item: [] });
    this.onPricingOptionSearch({ term: "", item: [] });
    this.onSalesPersonSearch({ term: "", item: [] });

    if (this.params.LocationCode != null && this.params.LocationCode != undefined) 
    {
      this.locationData = this.params.LocationCode
      this.getLocationData()
      this.getCompanyObject()
    }
    else 
    {
     alert("Location Details not found")
    //  this.route.navigate(['auth/' + glob.getCompanyCode() + '/accessory-sales-list'])
    } 
    if (this.params.RetailCustomerCode != null && this.params.RetailCustomerCode != undefined) 
    {
      this.getCustomerObject()
    }
    else 
    {
     alert("Customer Details not found")
    }
    this.InvoiceGuid = uuidv4()

    if (this.params.InvoiceDocType == "RSALES") 
    {  
      if (this.params.headerguid != null && this.params.headerguid != undefined)
      {
        this.isEdit = true; 
        this.getSalesObject()
      }
      else if (this.params.caseguid == null || this.params.caseguid == undefined) 
      {
       alert("CaseGuid Not Found!")
       // this.route.navigate(['auth/' + glob.getCompanyCode() + '/accessory-sales-list'])
      }
      else 
      {
        this.getRepairSalesDetails()
      }
    }
    else 
    {
        if (this.params.headerguid != null && this.params.headerguid != undefined) 
        {
          this.isEdit = true; 
          this.getSalesObject()
        }
    } 

  
   
  }


  getBlankObject(): DropDownValue
  {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }

  showAddParts(item)
  {
    this.hidePopup = !this.hidePopup; 
    this.isOpen=true
    this.isDiscountModalOpen = this.isOpen;
   // this.ngxSpinnerService.show()
    this.discountMaterialCode = item.MaterialCode
    this.discountPartUnitPrice = item.UnitPrice
    let requestData = []
    requestData.push({
      "Key":"APIType",
      "Value":"GetDiscount4Customer"
    })
    requestData.push({
      "Key":"CustomerCode",
      "Value":this.CustomerObject[0].CustomerCode
    })
    requestData.push({
      "Key":"MaterialCode",
      "Value":item.MaterialCode
    })
    requestData.push({
      "Key":"LocationCode",
      "Value":this.params.LocationCode
    })
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
          this.popUpArray = []
       //   this.ngxSpinnerService.hide()
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              if (data.Totalrecords == "0") {
                alert("No Discount Available")
              }
              else {
                if (Array.isArray(data?.DiscountCouponList?.DiscountCoupon)) {
                  this.popUpArray = data?.DiscountCouponList?.DiscountCoupon
                }
                else {
                  this.popUpArray.push(data?.DiscountCouponList?.DiscountCoupon)
                }
              }
            }
          } catch (ext) {
          }
        },
        error: err => {
       //   this.ngxSpinnerService.hide()
          console.log(err)
        }

      }
    ); 
  }

  getCustomerObject() {  
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetRtlCustomerObject"
    });
    requestData.push({
      "Key": "CustomerCode",
      "Value": this.params.RetailCustomerCode
    });
    requestData.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
          try {
            let response = JSON.parse(Value.toString());
            console.log(response)
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              console.log("Customer Object ", data)
              if (Array.isArray(data?.Customer)) {
                this.CustomerObject.push(data?.Customer)
              }
              else {
                this.CustomerObject.push(data?.Customer)
                this.errorMessage = "";
              }
              console.log("CUSTOMER===",this.CustomerObject)
              this.CreditAmount = this.CustomerObject[0].CreditAmount
              this.DebitAmount = this.CustomerObject[0].DebitAmount
              let CustomerMobileNo =this.CustomerObject[0].MobileNo
              this.GetProductDetails(CustomerMobileNo)
              this.TotalCustomerAdvance = parseFloat( (this.CreditAmount - this.DebitAmount).toFixed(2));
            }
          } catch (ext) {
          }
        },
        error: err => {
          console.log(err)
        }

      }
    );

    
  }


  getCompanyObject() {
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetCompanyMasterObject"
    });
    requestData.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              if (data.Totalrecords == "0") {
                this.presentToast('Company details not found','danger')  
              }
              else {
                if (Array.isArray(data.Company)) {
                  this.companyObject = data.Company
                }
                else {
                  this.companyObject.push(data.Company)
                }
              }
            }
          } catch (ext) {
          }
        },
        error: err => {
          console.log(err)
        }

      }
    );
  }

  getSalesObject() { 
  //  this.ngxSpinnerService.show()
    let requestdata = []
    requestdata.push({
      "Key": "ApiType",
      "Value": "GetInvoiceObject"
    })
    requestdata.push({
      "Key": "InvoiceGUID", 
      "Value": this.params.headerguid

      // "Value": this.params.headerguid
    })
    let strRequestData = JSON.stringify(requestdata);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
        //  this.ngxSpinnerService.hide()
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
               ;
              let data = JSON.parse(response?.ExtraData);
              if (data.Totalrecords == "0") { 
              this.presentToast('No parts found','danger')  

              }
              else { 
                console.log("==DATA==",data)
                this.IRNNumber = data.IRN == null || data.IRN == undefined?'':data.IRN
                this.invoiceCode = data.InvoiceCode;
                this.invoiceDate = data.InvoiceDate;
                
                this.salesPersonName = data?.SalesPersonName == null ? "" : data?.SalesPersonName
               
                this.DeliveryUpdateSuccess = (data.DeliveryUpdateSuccess == null || data.DeliveryUpdateSuccess == undefined) ? false : (data.DeliveryUpdateSuccess == "0" || data.DeliveryUpdateSuccess == "") ? false : true;
                this.DeliveryHeaderSuccess = (data.DeliveryHeaderSuccess == null || data.DeliveryHeaderSuccess == undefined) ? false : (data.DeliveryHeaderSuccess == "0" || data.DeliveryHeaderSuccess == "") ? false : true;
                this.PickingSuccess = (data.PickingSuccess == null || data.PickingSuccess == undefined) ? false : (data.PickingSuccess == "0" || data.PickingSuccess == "") ? false : true;
                this.PGISuccess = (data.PGISuccess == null || data.PGISuccess == undefined) ? false : (data.PGISuccess == "0" || data.PGISuccess == "") ? false : true;
                this.SerialUpdate = (data.SerialUpdateSuccess == null || data.SerialUpdateSuccess == undefined) ? false : (data.SerialUpdateSuccess == "0" || data.SerialUpdateSuccess == "") ? false : true;
                this.ETag = (data.ETag == null || data.ETag == undefined) ? "" : data.ETag;
                if (this.PGISuccess == false) {
                  
                }

    
                let detailobject = data?.InvoiceDetailObject?.InvoiceDetail
                if (!(data?.PaymentObject == null || data?.PaymentObject == undefined)) { 
                  let paymentobject = data?.PaymentObject?.PaymentDetail
                  if (Array.isArray(paymentobject)) {
                    for (let item of paymentobject) {
                      this.paymentDetailArray.push(item)
                    }
                  }
                  else { 
                    this.paymentDetailArray.push(paymentobject)
                  } 
                  this.paymentDetailArray.forEach((payment)=>{
                    this.totalPaidAmount += parseFloat(payment.Amount)
                  })
                }
                if (Array.isArray(detailobject)) { 
                  for (let item of detailobject) {
                    this.finalSelectedElements.push(item)
                    console.log("FINALLY SELECTED 1",this.finalSelectedElements)
                  //  this.TotalNetAmount()
                  }

                }
                else { 
                  this.finalSelectedElements.push(detailobject) 
                  console.log("FINALLY SELECTED 2",this.finalSelectedElements)

                 // this.TotalNetAmount()
                } 
                this.TotalNetAmount()
              }
            }
          } catch (ext) {
          }
        },
        error: err => {
       //   this.ngxSpinnerService.hide()
          console.log(err)
        }

      }
    );
  }

  getLocationData() {  
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "GetLocationObject"
    });

    requestData.push({
      "Key": "CompanyCode",
      "Value":glob.getCompanyCode()
    });
    requestData.push({
      "Key": "LocationCode",
      "Value": this.params.LocationCode
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (value) => {
          let response = JSON.parse(value.toString());
          if (response.ReturnCode == '0') {
            let data = JSON.parse(response.ExtraData)?.Location;
            this.LocationObject.push(data)
                     }
          else {
            console.log("error");
          }

        },
        error: err => {
          console.log(err);
        }
      });
  }




  getRepairSalesDetails() { 
    let requestdata = []
    requestdata.push({
      "Key": "ApiType",
      "Value": "GetRepairSalesObject"
    })
    requestdata.push({
      "Key": "CaseGUID",
      "Value": this.params.caseguid
    })
    requestdata.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    })
    let strRequestData = JSON.stringify(requestdata);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
         // this.ngxSpinnerService.hide()
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              console.log(data)
              if (data.Totalrecords == "0") { 
              this.presentToast('No parts found','danger')  

              }
              else {
                if (Array.isArray(data.RepairDetail.Repair)) {
                  this.finalSelectedElements = data?.RepairDetail?.Repair
                 this.finalSelectedElements.forEach(item=>{
                  item.MaterialName=data.RepairDetail.Repair.MaterialObject.MaterialName
                 })
                  //this.getRepairPaymentObject()
                  this.fetchGSTDetails()
                }
                else {
                  this.finalSelectedElements.push(data?.RepairDetail?.Repair)
                  //this.getRepairPaymentObject()
                  this.finalSelectedElements.forEach(item=>{
                    item.MaterialName=data.RepairDetail.Repair.MaterialObject.MaterialName
                   })
                  this.fetchGSTDetails()
                 

                }

              }
            }
          } catch (ext) {
          }
        },
        error: err => {
          debugger
         // this.ngxSpinnerService.hide()
          console.log(err)
        }

      }
    );

  }


  getRepairPaymentObject() { 
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetPaymentObject"
    });
    requestData.push({
      "Key": "Caseguid",
      "Value": this.params.caseguid
    });
    requestData.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              if (data.Totalrecords == "0") {
              this.presentToast('Payment Records Not Found, kindly complete the payment','danger')   
              }
              else {
                
                if (data?.PaymentList?.Payment != null && data?.PaymentList?.Payment != undefined) {
                  if (Array.isArray(data?.PaymentList?.Payment?.Payment)) {
                    this.paymentDetailArray = data?.PaymentList?.Payment?.Payment
                  }
                  else {
                    this.paymentDetailArray.push(data?.PaymentList?.Payment?.Payment)
                    this.errorMessage = "";
                  }
                  console.log("PAYMENTDETAILARRAY",this.paymentDetailArray)
                  this.paymentDetailArray = this.paymentDetailArray.filter(item => item.TranType !== "RADV");
                  this.totalPaidAmount = 0.00
                  this.paymentDetailArray.forEach((item) => {
                    item.NEWPAYMENT = 0;
                    this.totalPaidAmount += parseFloat(item.Amount);
                  })
                  this.totalPaidAmount = parseFloat(this.totalPaidAmount.toFixed(2))
                }
              }
            }
          } catch (ext) {
          }
        },
        error: err => {
          console.log(err)
        }

      }
    );
  }

 

  onSalesPersonSearch($event: { term: string; item: any[] }) {
    debugger
    this.dropdownDataService.fetchDropDownData(DropDownType.SalesPerson, $event.term, {
      LocationCode: this.params.LocationCode
    }).subscribe({
      next: (value) => {
        debugger
        if (value != null) {
          this.SalesPersonDD = value;
        }
      },
      error: (err) => {
        debugger

        this.SalesPersonDD = DropDownValue.getBlankObject();
      }
    });
  }


  onPricingOptionSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.PricingOption, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.PricingOptionDD = value;
        }
      },
      error: (err) => {
        this.PricingOptionDD = DropDownValue.getBlankObject();
      }
    });
  }


  onModeofPaymentSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.modeofpayment, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.ModeofPayment = value;
        }
      },
      error: (err) => {
        this.ModeofPayment = DropDownValue.getBlankObject();
      }
    });

  }


  invoiceSuccessObj:any;

  onSubmit() {
    
    
      // this.validatePayment()
    //this.submitClicked=true;
    var hasLesserUnitPrice = false
    for(let item of this.finalSelectedElements)
    { 
      
      if(parseFloat(item.UnitPrice) < parseFloat(item.MinimumUnitPrice))
      {
        hasLesserUnitPrice=true
      }

    }

    //const hasLesserUnitPrice = this.finalSelectedElements.some((item => (item?.UnitPrice < item?.MinimumUnitPrice) && (item?.ItemType == "Material")))
    const hasHigherDiscountPrice = this.finalSelectedElements.some((item =>{item?.DiscountAmount > item?.UnitPrice}))
    if(hasHigherDiscountPrice)
    {
     alert("Discount Amount cannot be greater than Unit Price")
      return
    }
    if(!(this.params.RetailCustomerCode=="123909249" || this.params.RetailCustomerCode=="123909265" || this.params.RetailCustomerCode=="123909277" || this.params.RetailCustomerCode=="123909247"))
    {
      if (hasLesserUnitPrice) {
       alert("Unit price cannot be lesser than Minimum Unit Price")
        return;
      }
    }

    const hasZeroUnitPrice = this.finalSelectedElements.some((item =>{item?.UnitPrice==0}))
    if(hasZeroUnitPrice)
    {
     alert("Unit Price cannot be zero")
      return
    }
    // if (this.salesPersonName == '') {
    //  alert("Please select Sales Person Name")
    //   return
    // }
    const hasBlankKGB = this.finalSelectedElements.some((item => (item?.SerialNo == null || item?.SerialNo == "" || item?.SerialNo == undefined) && (item?.ItemType == "Material")))
    if (hasBlankKGB) {
     alert("Cannot insert null value in Serial No")
      return;
    }
    if (this.totalPaidAmount > (this.totalNetAmount + 1) || this.totalPaidAmount < (this.totalNetAmount - 1)) {
     alert("Paid Amount does not match with Total Net Amount")
      return;
    }
    const hasBlankBatch = this.finalSelectedElements.some(item => (item?.Batch == null || item?.Batch === '' || item?.Batch == undefined) && (item?.ItemType == "Material"));
    if (hasBlankBatch) {
     alert("Cannot insert null or empty value in Batch Number")
      return;
    }
    const hasBlankMaterialName = this.finalSelectedElements.some(item => item.MaterialName == null || item?.MaterialName === '' || item?.MaterialName == undefined);
    if (hasBlankMaterialName) {
     alert("Material Name Not Found...")
      return;
    }

    const hasBlankGSTGroup = this.finalSelectedElements.some(item => item.GSTGroupCode == null || item.GSTGroupCode === '' || item.GSTGroupCode == undefined);
    if (hasBlankGSTGroup) {
     alert("GST Detail Not found")
      return;
    }
    
    const hasBlankGSTAmount = this.finalSelectedElements.some(item => item.GSTPercentage == 0);
    if(!(this.CustomerObject[0].GSTRegistrationType == "GSEZ"))
    {
      if (hasBlankGSTGroup) {
       alert("GST is not configured for item")
        return;
      }
    }
    if(this.submitClicked == true)
    {
      return;
    }
    this.submitClicked=true    
    //this.ngxSpinnerService.show()
    
    for (let item of this.finalSelectedElements) {
      item.InvoiceHeaderGUID = this.InvoiceGuid
    }
    
    

    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveInvoice4Job"
    });
    requestData.push({
      "Key": "InvoiceGuid",
      "Value": this.InvoiceGuid
    });
    requestData.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    });
    requestData.push({
      "Key": "InvoiceCode",
      "Value": ""
    });
    requestData.push({
      "Key": "SalesPersonName",
      "Value": this.salesPersonName == null || this.salesPersonName == undefined ? "" : this.salesPersonName
    });
    requestData.push({
      "Key": "Remarks",
      "Value": this.Remarks == null || this.Remarks == undefined ? "" : this.Remarks
    });

    requestData.push({
      "Key": "InvoiceDocType",
      "Value": this.InvoiceDocTypeData
    });
    requestData.push({
      "Key": "InvoiceDate",
      "Value": new Date(),
    });
    requestData.push({
      "Key": "LocationCode",
      "Value": this.params.LocationCode
    });
    requestData.push({
      "Key": "CaseGuid",
      "Value": this.params.caseguid == null || this.params.caseguid == undefined ? "00000000-0000-0000-0000-000000000000" : this.params.caseguid
    });
    requestData.push({
      "Key": "CaseID",
      "Value": ""
    });
    requestData.push({
      "Key": "RetailCustomerCode",
      "Value": this.params.RetailCustomerCode == null || this.params.RetailCustomerCode == undefined ? "" : this.params.RetailCustomerCode
    });
    requestData.push({
      "Key": "BillToCustomerCode",
      "Value": this.params.RetailCustomerCode == null || this.params.RetailCustomerCode == undefined ? "" : this.params.RetailCustomerCode
    });
    requestData.push({
      "Key": "TotalBaseAmount",
      "Value": this.totalBaseAmount
    });
    requestData.push({
      "Key": "TotalDiscountAmount",
      "Value": this.totalDiscountAmount
    });
    requestData.push({
      "Key": "TotalTaxableAmount",
      "Value": this.totalTaxableAmount
    });
    requestData.push({
      "Key": "TotalTaxAmount",
      "Value": this.totalTaxAmount
    });
    requestData.push({
      "Key": "TotalNetAmount",
      "Value": this.totalNetAmount
    });
    requestData.push({
      "Key": "InvoiceStatus",
      "Value": "RELEASED"
    });
    //product Object

    // requestData.push({
    //   "Key": "ObjectKey",
    //   "Value":this.params.repa.ObjectKey 
    // });

    // requestData.push({
    //   "Key": "MaterialCode",
    //   "Value":this.params.repa.MaterialCode 
    // });

    // requestData.push({
    //   "Key": "ProductType",
    //   "Value": this.params.repa.ProductType
    // });
    // requestData.push({
    //   "Key": "SerialNo",
    //   "Value": this.params.repa.SerialNo1
    // });
    // requestData.push({
    //   "Key": "POPDate",
    //   "Value": this.params.repa.PopDate
    // });
    // requestData.push({
    //   "Key": "RepairType",
    //   "Value": this.params.repa.RepairType
    // });
    // requestData.push({
    //   "Key": "SellerName",
    //   "Value":this.params.repa.OriginalSellerName
    // });
    // requestData.push({
    //   "Key": "SellerCity",
    //   "Value":this.params.repa.OriginalSellerCity
    // });




    requestData.push({
      "Key": "InvoiceDetails",
      "Value": this.saveInvoiceListXml()
    });
    requestData.push({
      "Key": "PaymentDetail",
      "Value": this.savePaymentListXml()
    })
    // requestData.push({
    //   "Key":"ProductObjectXML",
    //   "Value":this.productobjectXML()
    // })


    let strRequestData = JSON.stringify(requestData);
    console.log("API Data==",strRequestData)
    let contentRequest = {
      "content": strRequestData
    };
    
     
    debugger
 //   this.ngxSpinnerService.show();
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (value) => {
      
          
         // this.ngxSpinnerService.hide()
     
          let response = JSON.parse(value.toString());  

          if (response.ReturnCode == '0') { 
             this.invoiceSuccessObj = JSON.parse(response.ExtraData);
            //  this.invoiceSuccessObjt.emit(this.invoiceSuccessObj.INVOICE)
            //  this.contractSuccessObjt.emit(this.invoiceSuccessObj.INVOICE)
            console.log("invoiceSuccessObj==",this.invoiceSuccessObj)
             this.modalController.dismiss({
              invoiceSuccessObjt: this.invoiceSuccessObj.INVOICES
            });

            // this.invoiceSuccessObj = JSON.parse(response.ExtraData);
            // console.log(this.invoiceSuccessObj,"invoicesucc obj")
            // this.invoiceCode = this.invoiceSuccessObj?.INVOICE?.InvoiceCode
            // this.invoiceDate = this.invoiceSuccessObj?.INVOICE?.InvoiceDate
            // this.invoiceGUID = this.invoiceSuccessObj?.INVOICE?.InvoiceGuid
            // this.navigateToAccessorySales(this.invoiceGUID, this.params.customercode,this.params.locationcode,this.params.doctype)
          //  this.route.navigate(['auth/' + glob.getCompanyCode() + '/accessory-sales'], {queryParams: { headerguid: this.invoiceGUID, customercode: this.params.customercode, locationcode:this.params.locationcode,doctype:this.params.doctype}})
            let data = JSON.parse(response?.ExtraData);
            this.isEdit = true;

           
            //  this.isEdit = true;
            // this.paymentDetailArray=[];
            // let detailobject = data?.InvoiceDetailObject?.InvoiceDetail
            // if (!(data?.PaymentObject == null || data?.PaymentObject == undefined)) {
            //   let paymentobject = data?.PaymentObject?.PaymentDetail
            //   if (Array.isArray(paymentobject)) {
            //     for (let item of paymentobject) {
            //       this.paymentDetailArray.push(item)
            //     }
            //   }
            //   else {
            //     this.paymentDetailArray.push(paymentobject)
            //   }
            //   this.paymentDetailArray.forEach((payment)=>{
            //     this.totalPaidAmount += parseFloat(payment.Amount)
            //   })
            // }
            // this.finalSelectedElements=[];
            // if (Array.isArray(detailobject)) {
            //   for (let item of detailobject) {
            //     this.finalSelectedElements.push(item)
            //   }

            // }
            // else {
            //   this.finalSelectedElements.push(detailobject)
            // }
            // this.TotalNetAmount()
          //  this.repairProcess.getRepair()
          this.presentToast('Successfully Saved','success')   
 
            this.dismissModal()
          //TO-CHECK
          //  this.route.navigate(['auth/' + glob.getCompanyCode() + '/accessory-sales'], { queryParams: { headerguid:this.InvoiceGuid, doctype: this.InvoiceDocTypeData, locationcode: this.locationData, customercode: this.params.customercode } })

          }
          if (response.ReturnCode == '1') {
         
            // let data = JSON.parse(response?.ErrorMessage);
            console.log("Error ", response?.ErrorMessage)
          }
      
        },
        error: err => {
          debugger

          this.submitClicked=false;
         // this.ngxSpinnerService.hide()
          console.log(err);
        }
      });
  }
  routers:any;

  navigateToAccessorySales(invoiceGUID,customerCode,locationCode,doctype) { 
    // Get current query parameters
    const queryParams = {
      headerguid: invoiceGUID,
      doctype: doctype,
      locationcode: locationCode,
      customercode: customerCode
    };
  
    // Navigate to the same route with updated query parameters
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge' // Merge with existing query parameters
    }).then(() => {
      // Route refresh after navigation
      this.router.navigated = false;
      this.router.navigate(this.routers.url);
    });
  }

  calculatePrices(item)
  {
    item.BaseAmount = (parseFloat(item.UnitPrice) * item.Quantity)
    item.TaxableAmount = parseFloat(item.BaseAmount) - item.DiscountAmount
    item.SGSTAmount = item.TaxableAmount * (item.SGSTPercentage / 100)
    item.CGSTAmount = item.TaxableAmount * (item.CGSTPercentage / 100)
    item.IGSTAmount = item.TaxableAmount * (item.IGSTPercentage / 100)
    item.GSTAmount = item.TaxableAmount * (item.GSTPercentage / 100)
    item.TaxAmount = item.GSTAmount
    item.NetAmount = item.TaxableAmount + item.TaxAmount
    this.TotalNetAmount()
  }

  TotalNetAmount() {
    this.totalBaseAmount = 0;
    this.totalDiscountAmount = 0;
    this.totalNetAmount = 0;
    this.totalTaxAmount = 0;
    this.totalTaxableAmount = 0;
    this.finalSelectedElements.forEach((item) => {
      this.totalTaxableAmount += parseFloat(item.TaxableAmount);
      this.totalTaxAmount += parseFloat(item.TaxAmount);
      this.totalNetAmount += parseFloat(item.NetAmount);
      this.totalDiscountAmount += parseFloat(item.DiscountAmount);
      this.totalBaseAmount += parseFloat(item.BaseAmount);
    });

    this.totalTaxableAmount = parseFloat(this.totalTaxableAmount.toFixed(2));
    this.totalTaxAmount = parseFloat(this.totalTaxAmount.toFixed(2));
    this.totalNetAmount = parseFloat(this.totalNetAmount.toFixed(2));
    this.totalDiscountAmount = parseFloat(this.totalDiscountAmount.toFixed(2));
    this.totalBaseAmount = parseFloat(this.totalBaseAmount.toFixed(2));
    // if ((this.totalNetAmount >= 50000 && (this.CustomerObject[0].StateCode != this.LocationObject[0].StateCode))
    //   || (this.totalNetAmount >= 200000 && (this.CustomerObject[0].StateCode == this.LocationObject[0].StateCode))
    // )
    //  {
    //   if (this.EwayBillFlag == "0") {
    //     this.hideEwaySelection = false;
    //   }
    // }
  }
 

  saveInvoiceListXml() {
    let rawData = {
      "rows": []
    }
    let count = 0;
    //if (this.InvoiceDocTypeData == "CSALES") {
    for (let item of this.finalSelectedElements) {
      count += 1
      rawData.rows.push({
        "row": {
          "InvoiceDetailGuid": item.InvoiceDetailGUID,
          "InvoiceGUID": this.InvoiceGuid,
          "ItemType": item.ItemType,
          "ItemNo": count,
          "SerialNo": item.SerialNo,
          "ItemCode": item.MaterialCode,
          "DivisionCode": item.DivisionCode,
          "ItemDescription": item.MaterialName,
          "GSTGroupCode": item.GSTGroupCode == null || item.GSTGroupCode == undefined ? "" : item.GSTGroupCode,
          "SAC_HSNCode": item.SAC_HSNCode == null || item.SAC_HSNCode == undefined ? "" : item.SAC_HSNCode,
          "Quantity": item.Quantity,
          "UnitPrice": item.UnitPrice,
          "CostPrice": item.CostPrice==null || item.CostPrice == undefined ? "0":item.CostPrice,
          "Batch": item.Batch,
          "BaseAmount": item.BaseAmount,
          "DiscountCoupon":item.DiscountCoupon==null || item.DiscountCoupon == undefined ? "0":item.DiscountCoupon,
          "DiscountAmount": item.DiscountAmount,
          "TaxableAmount": item.TaxableAmount,
          "TaxPercentage": item.GSTPercentage,
          "CGSTPercentage": item.CGSTPercentage,
          "SGSTPercentage": item.SGSTPercentage,
          "IGSTPercentage": item.IGSTPercentage,
          "LavyPercentage": item.LavyPercentage == null || item.LavyPercentage == undefined ? 0 : item.LavyPercentage,
          "CGSTAmount": item.CGSTAmount,
          "SGSTAmount": item.SGSTAmount,
          "IGSTAmount": item.IGSTAmount,
          "LavyAmount": item.LavyAmount == null || item.LavyAmount == undefined ? 0.00 : item.LavyAmount,
          "NetAmount": item.NetAmount,
          "TaxAmount": item.TaxAmount,
          "isDeleted": 0
        }
      })
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(rawData);
    xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
    xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
    return xml;
  }

  savePaymentListXml() {
    //if (this.InvoiceDocTypeData == "CSALES") {
    let rawData = {
      "rows": []
    }
    if (this.paymentDetailArray.length > 0) { 
      for (let item of this.paymentDetailArray) {
        if (item.NEWPAYMENT == 1) {
          rawData.rows.push({
            "row": {
              "TranType": item?.TranType == null || item?.TranType == undefined ? 'Payment' : item?.TranType,
              "TranDate": item?.TranDate == null || item?.TranDate == undefined ? new Date() : item?.TranDate,
              "Amount": item?.Amount == null || item?.Amount == undefined ? 0.00 : item?.Amount,
              "ModeOfPayment": item?.ModeOfPayment,
              "AccountNumber": item?.AccountNumber,
              "AuthenticationNumber": item?.AuthenticationNumber,
              "CardType": item?.CardType,
              "CardNumber": item?.CardNumber,
              "Adjudication": item?.Adjudication,
              "TerminalId": item?.TerminalId,
              "HouseOfBank":item?.HouseOfBank == null || item?.HouseOfBank == undefined ?'' : item?.HouseOfBank,
              "RequestedAmount": item?.RequestedAmount == null || item?.RequestedAmount == undefined ? 0.00 : item?.RequestedAmount,
              "AccountHolderName": item?.AccountHolderName,
              "BankCode": item?.BankCode,
              "BankAccountNo": item?.BankAccountNo,
              "UTRNumber":'',
              "UPITransactionId":item?.UPITransactionId,
              "PaymentGUID": uuidv4(),
              // "GLCode": item.GLCode == null || item.GLCode == undefined ? "" : item.GLCode,
              "CompanyCode": glob.getCompanyCode()
            }
          })
        }
      }
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(rawData);
      xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
      xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
      return xml;
    }
    //}
  }

  
  productobjectXML(){
    let rawData = {
    "rows": []
    }
 rawData.rows.push({
   "row": {
    //  "ObjectKey":"",
     "MaterialCode": this.params.repa.MaterialCode,
     "ProductType":this.params.repa.ProductType,
 //    "CompanyCode":glob.getCompanyCode(),
    // "IsSerialProvided":this.ISerialProvided==true ? 1 : 0,
     "SerialNo":this.params.repa.SerialNo1,
   //  "InvoiceNo":this.AddProctForm.controls["InvoiceNumber"].value,
     "POPDate":this.params.repa.PopDate,
     "RepairType":this.params.repa.RepairType,
     "SellerName":this.params.repa.OriginalSellerName,
     "SellerCity":this.params.repa.OriginalSellerCity,
    // "InvoiceAmount":this.AddProctForm.controls["InvoiceAmount"].value,
    // "InvoiceType":this.AddProctForm.controls["InvoiceType"].value,
    //  "InvoiceImageURL":"",
    //  "IMEI1":"",
    //  "IMEI2":"",
    //  "MEID":"",
   }
 })
var builder = new xml2js.Builder();
var xml = builder.buildObject(rawData);
xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
return xml;
 }





  saveDiscount()
  {
    if(this.discountMaterialCode == null || this.discountMaterialCode == undefined || this.discountMaterialCode == '')
    {
      //this.toasty.error("Material Code not found for discount")
      return
    }
    if(this.discountPartUnitPrice == null || this.discountPartUnitPrice == undefined || this.discountPartUnitPrice == 0)
    {
     //alert("Material Unit Price not found for discount")
      return
    }
    if(this.discountAmountRequested == null || this.discountAmountRequested == undefined || this.discountAmountRequested == 0)
    {
     //alert("Discount Amount not found for discount")
      return
    }
    if(this.discountAmountRequested > this.discountPartUnitPrice)
    {
    // alert("Discount Amount cannot be greater than Unit Price")
      return
    }
   // this.ngxSpinnerService.show()
    let requestData = []
    requestData.push({
      "Key":"APIType",
      "Value":"SaveDiscount"
    })
    requestData.push({
      "Key":"CustomerCode",
      "Value":this.CustomerObject[0].CustomerCode
    })
    requestData.push({
      "Key":"MaterialCode",
      "Value":this.discountMaterialCode
    })
    requestData.push({
      "Key":"LocationCode",
      "Value":this.locationData
    })
    requestData.push({
      "Key":"CompanyCode",
      "Value": glob.getCompanyCode()
    })
    requestData.push({
      "Key":"IsConsumed",
      "Value": "0"
    })
    requestData.push({
      "Key":"UnitPrice",
      "Value": this.discountPartUnitPrice
    })
    requestData.push({
      "Key":"DiscountAmount",
      "Value": this.discountAmountRequested
    })
    requestData.push({
      "Key":"CouponCode",
      "Value": ''
    })
    requestData.push({
      "Key":"DiscountCouponStatus",
      "Value": 'SENT FOR APPROVAL'
    })
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
       //   this.ngxSpinnerService.hide()
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              if (data.Totalrecords == "0") {
               //alert("Discount Request Failed")
              }
              else {
               // this.toasty.success("Discount Requested Submitted Successfully")
                this.hideDiscountForm = true
              }
            }
          } catch (ext) {
          }
        },
        error: err => {
       //   this.ngxSpinnerService.hide()
          console.log(err)
        }

      }
    ); 
  }

  hideAddParts(){
    this.hideDiscountPopup = !this.hideDiscountPopup;
  }

  toggleRequestDiscount()
  {
    this.hideAddParts
    this.hideDiscountForm = !this.hideDiscountForm
  }
  addDiscount(item)
  {
    this.finalSelectedElements.forEach(obj =>{
      if(item.MaterialCode == obj.MaterialCode)
      {
        obj.DiscountAmount = parseFloat(item.DiscountAmount).toFixed(2)
        obj.DiscountCoupon=item.DiscountCoupon
        this.calculatePrices(obj)
        this.hideAddParts()
        this.updateDiscount(item)
      }
    })
  }

  updateDiscount(item)
  {
  //  this.ngxSpinnerService.show()
    let requestData = []
    requestData.push({
      "Key":"APIType",
      "Value":"SaveDiscount"
    })
    requestData.push({
      "Key":"CustomerCode",
      "Value":this.CustomerObject[0].CustomerCode
    })
    requestData.push({
      "Key":"MaterialCode",
      "Value":item.MaterialCode
    })
    requestData.push({
      "Key":"LocationCode",
      "Value":this.locationData
    })
    requestData.push({
      "Key":"CompanyCode",
      "Value": glob.getCompanyCode()
    })
    requestData.push({
      "Key":"IsConsumed",
      "Value": "1"
    })
    requestData.push({
      "Key":"UnitPrice",
      "Value": item?.UnitPrice
    })
    requestData.push({
      "Key":"DiscountAmount",
      "Value": item?.DiscountAmount
    })
    requestData.push({
      "Key":"CouponCode",
      "Value": ''
    })
    requestData.push({
      "Key":"DiscountCouponStatus",
      "Value": 'EXPIRED'
    })
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
        //  this.ngxSpinnerService.hide()
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              if (data.Totalrecords == "0") {
            //   alert("No Discount Available")
              }
              else {
             //   this.toasty.success("Coupon Applied Successfully")
              }
            }
          } catch (ext) {
          }
        },
        error: err => {
        //  this.ngxSpinnerService.hide()
          console.log(err)
        }

      }
    ); 
  }
  deletePaymentitem(item) {
    console.log("deletion List ", this.paymentDetailArray)
    let index = this.paymentDetailArray.indexOf(item)
    this.totalPaidAmount = this.totalPaidAmount - item.Amount
    this.paymentDetailArray.splice(index, 1)
  }

  deleteSelectedElements(item: any) {
    const index = this.finalSelectedElements.indexOf(item);
    if (index > -1) {
      this.finalSelectedElements.splice(index, 1);
    }
    this.calculatePrices(item);
  }



  acceptEmittedPaymentObj($event) {
    // this.paymentDetailArray=[]
    this.paymentDetailArray.push($event)
    this.totalPaidAmount = 0
    this.paymentDetailArray.forEach(payment => {
      this.totalPaidAmount += parseFloat(payment.Amount)
    })
  }

  validatePayment() {
    // alert(this.Amount)
    if (this.Amount == null || this.Amount == undefined || this.Amount == 0) { 
     this.presentToast('Payment Amount cannot be zero!','danger')   

      return false;
    }
    else if (this.modeofPaymentData == '') { 
     this.presentToast("Mode of Payment cannot be empty",'danger')   

      return false;
    }
    // else if (this.GLCodeData == '') {
    //  alert("GLCode cannot be empty")
    //   return false;
    // }
    // else if (this.modeofPaymentData == 'PINELABS') {
    //   if (this.UPITransactionId == '' || this.UPITransactionId == null || this.UPITransactionId == undefined) {
    //    alert("Transaction Reference Number cannot be empty!")
    //     return false;
    //   }
    // }
    // else if (this.modeofPaymentData == 'CREDITREQ') {
    //   if (this.UPITransactionId == '' || this.UPITransactionId == null || this.UPITransactionId == undefined) {
    //    alert("Transaction Reference Number cannot be empty!")
    //     return false;
    //   }
    // }
    // else if (this.modeofPaymentData == 'OLDSYSTEM') {
    //   if (this.UPITransactionId == '' || this.UPITransactionId == null || this.UPITransactionId == undefined) {
    //    alert("Transaction Reference Number cannot be empty!")
    //     return false;
    //   }
    // }
    // else if (this.modeofPaymentData == 'CREDITCARD') {
    //   if (this.CardTypeData == '' || this.CardTypeData == null || this.CardTypeData == undefined) {
    //    alert("Card Type cannot be empty!")
    //     return false;
    //   }
    //   else if (this.CardNo == '' || this.CardNo == null || this.CardNo == undefined) {
    //    alert("Card number cannot be empty")
    //     return false;
    //   }
    //   else if (this.Adjudication == '' || this.Adjudication == null || this.Adjudication == undefined) {
    //    alert("Adjudication cannot be empty")
    //     return false;
    //   }
    //   else if (this.TerminalId == '' || this.TerminalId == null || this.TerminalId == undefined) {
    //    alert("TerminalId cannot be empty")
    //    return  false
    //   } 
    // }
    // else if (this.modeofPaymentData == 'CHEQUE') {
    //   if (this.UPITransactionId == null || this.UPITransactionId == undefined || this.UPITransactionId == '') {
    //    alert("Transaction Reference Number cannot be empty!")
    //    return  false
    //   }

    // }
    // else if (this.modeofPaymentData == 'UPI') {
    //   if (this.UPITransactionId == null || this.UPITransactionId == undefined || this.UPITransactionId == '') {
    //    alert("Transaction Reference Number cannot be empty!")
    //    return  false
    //   } 
    // }
    // const hasAdvance = this.paymentDetailArray.some( item => item.ModeOfPayment == 'ADVANCE')
    // if (this.modeofPaymentData === 'ADVANCE' && hasAdvance ) {
    //  alert("You can't make Multiple Advance Payments!");
    //  return  false

    // }

    // if (this.modeofPaymentData == 'ADVANCE' && this.Amount > this.TotalCustomerAdvance) {
    //  alert("Advance Payment can't exceed Total Advance!")
    //  return  false

    // }

    this.paymentDetailArray.push({
      "NEWPAYMENT": 1,
      "TranType": "Payment",
      "TranDate": new Date(),
      "Amount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
      "ModeOfPayment": this.modeofPaymentData,
      "AccountNumber": this.AccountNo,
      "AuthenticationNumber": this.AuthNo,
      "CardType": this.CardTypeData,
      "CardNumber": this.CardNo,
      "Adjudication": this.Adjudication,
      "TerminalId": this.TerminalId,
      "RequestedAmount": this.RequestedAmt == null || this.RequestedAmt == undefined ? 0.00 : this.RequestedAmt,
      "AccountHolderName": this.AccountHolderName,
      "BankCode": this.BankCode,
      "HouseOfBank":this.houseofBank,
      // "GLCode": this.GLCodeData,
      "BankAccountNo": this.BankAccountNo == null || this.BankAccountNo == undefined ? '' : this.BankAccountNo,
      "UPITransactionId":this.UPITransactionId == null || this.UPITransactionId == undefined?'':this.UPITransactionId
    })
    this.totalPaidAmount = this.totalPaidAmount + this.Amount
    this.Amount = 0.00
    this.modeofPaymentData = '';
    this.AccountNo = ''
    this.AuthNo = '';
    this.CardTypeData = '';
    this.CardNo = '';
    this.Adjudication = '';
    this.TerminalId = '';
    this.UPITransactionId = '';
    this.RequestedAmt = 0.00;
    this.AccountHolderName = '';
    this.BankCode = '';
    this.houseofBank = '';
    this.BankAccountNo = 0.00;
    // this.GLCodeData = ''
    return true;
  }

  deleteitem(item) {
    let index = this.finalSelectedElements.indexOf(item)
    this.finalSelectedElements.splice(index, 1)
    this.TotalNetAmount()
  }

  validateSerialNo(item) {
    if (item.SerialNo != null && item.SerialNo != undefined && item.SerialNo != '') {
      if (item.MaterialCode != null && item.MaterialCode != undefined && item.MaterialCode != '') {
       // this.ngxSpinnerService.show()
       
      }
      else { 
     this.presentToast("MaterialCode cant be blank for"+ item.PartDescription ,'danger')   

      }
    }
    else {
     this.presentToast("Serial No cannot be blank for"+ item.PartCode ,'danger')   
 
    }

  }

  setfunction(){
    for(let item of this.ModeofPayment.Data)
    {
      // if(item.Id == this.modeofPaymentData)
      // {
      //   this.GLCodeData = item.GLCode
      //   this.houseofBank = item.extraData
      //   break;
      // }
    }
  }

  downloadServiceReport(reportType: String) {
 //   this.ngxSpinnerService.show()
    let PdfData = [];
    PdfData.push({
      "Key": "ApiType",
      "Value": "GetInvoiceObject4Print",
    });
    PdfData.push({
      "Key": "InvoiceGuid",
      "Value": this.params.headerguid,
    });
    let pdfRequestData = JSON.stringify(PdfData);
    let contentRequest =
    {
      "content": pdfRequestData
    };
    let storepdf = contentRequest;
    this.reportService.downloadServiceReport(reportType, contentRequest).subscribe(
      {
        next: (value) => {
          let response = JSON.parse(value.toString());
          const byteArray = new Uint8Array(atob(response.FileContents).split('').map(char => char.charCodeAt(0)));
          var blob = new Blob([byteArray], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          window.open(url);
        //  this.ngxSpinnerService.hide()


        },
        error: err => {
          console.log(err);
        //  this.ngxSpinnerService.hide()

        }
      });
  }

  fetchGSTDetails() {
 
    debugger
   let requestdata = []
   requestdata.push({
     "Key": "ApiType",
     "Value": "GetQuotationGstList"
   })
   requestdata.push({
     "Key": "ItemType",
     "Value": "MaterialCode"
   })
   requestdata.push({
     "Key": "ItemList",
     "Value": this.getAccessoryMarginListXml()
   })
   requestdata.push({
     "Key": "CustomerCode",
     "Value": this.params.RetailCustomerCode
   })
   requestdata.push({
     "Key": "LocationCode",
     "Value": this.params.LocationCode
   })
   requestdata.push({
     "Key": "CompanyCode",
     "Value": glob.getCompanyCode()
   })
   let strRequestData = JSON.stringify(requestdata);
   let contentRequest = {
     "content": strRequestData
   };
    ;
  // this.ngxSpinnerService.show();
   this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
     next: (response: any) => {
       debugger
     //  this.ngxSpinnerService.hide();
       let data = JSON.parse(response)
        ;
       if (data.ReturnCode == "0") {
         let extraData = JSON.parse(data.ExtraData)
         //if (this.InvoiceDocTypeData == "DSALES") {
         if (Array.isArray(extraData?.QuoteItem)) {
           for (let object of extraData?.QuoteItem) {
             for (let item of this.finalSelectedElements) {
               if (item?.MaterialCode == object.ItemCode) {
                 if(this.CustomerObject[0].GSTRegistrationType == "GSEZ")
                 {
                   item.CGSTPercentage = 0
                   item.GSTPercentage = 0
                   item.SGSTPercentage = 0
                   item.IGSTPercentage = 0
                 }
                 else
                 {
                   item.CGSTPercentage = object.CGSTPercentage
                   item.GSTPercentage = object.GSTPercentage
                   item.SGSTPercentage = object.SGSTPercentage
                   item.IGSTPercentage = object.IGSTPercentage
 
                 }
                 item.MarginPercentage = 0; //parseFloat(object.Margin)
                 item.MarginAmount = 0; // (parseFloat(object.StockPrice) / ( 1 - (object.Margin / 100)))-parseFloat(object.StockPrice)
                 item.SAC_HSNCode = object.SAC_HSNCode
                 item.DiscountAmount = 0.00
                 item.UnitPrice = object.UnitPrice == undefined || object.UnitPrice == null ? 0 : object.UnitPrice;
                 item.MinimumUnitPrice = object?.UnitPrice == undefined || object?.UnitPrice == null ? 0 : object?.UnitPrice;
                 item.BaseAmount = parseFloat(item.UnitPrice) * item.Quantity
                 item.TaxableAmount = parseFloat(item.BaseAmount) - item.DiscountAmount
                 item.SGSTAmount = item.TaxableAmount * (item.SGSTPercentage / 100)
                 item.CGSTAmount = item.TaxableAmount * (item.CGSTPercentage / 100)
                 item.IGSTAmount = item.TaxableAmount * (item.IGSTPercentage / 100)
                 item.GSTAmount = item.TaxableAmount * (item.GSTPercentage / 100)
                 item.TaxAmount = item.GSTAmount
                 item.NetAmount = item.TaxableAmount + item.TaxAmount
                 item.ItemType = object.ItemType
                 item.GSTGroupCode = object.GSTGroupCode
                 item.SalesUOM = object.SalesUOM
                 item.DivisionCode = object.DivisionCode
                 item.InvoiceDetailGUID = uuidv4()
               }
             }
           }
           this.TotalNetAmount()
         }
         else {
           for (let obj of this.finalSelectedElements) {
             if (obj.MaterialCode === extraData?.QuoteItem.ItemCode) {
               if(this.CustomerObject[0].GSTRegistrationType == "GSEZ")
               {
                 obj.CGSTPercentage = 0
                 obj.GSTPercentage = 0
                 obj.SGSTPercentage = 0
                 obj.IGSTPercentage = 0

               }
               else
               {
                 obj.CGSTPercentage = extraData?.QuoteItem.CGSTPercentage
                 obj.GSTPercentage = extraData?.QuoteItem.GSTPercentage
                 obj.SGSTPercentage = extraData?.QuoteItem.SGSTPercentage
                 obj.IGSTPercentage = extraData?.QuoteItem.IGSTPercentage
 
               }
               obj.MarginPercentage = 0; // extraData?.QuoteItem.Margin
               obj.UnitPrice = extraData?.QuoteItem?.UnitPrice == undefined || extraData?.QuoteItem?.UnitPrice == null ? 0 : extraData?.QuoteItem?.UnitPrice;
               obj.MinimumUnitPrice = extraData?.QuoteItem?.UnitPrice == undefined || extraData?.QuoteItem?.UnitPrice == null ? 0 : extraData?.QuoteItem?.UnitPrice;
               obj.MarginAmount = 0;
               obj.SAC_HSNCode = extraData?.QuoteItem.SAC_HSNCode
               obj.DiscountAmount = 0.00
               obj.BaseAmount = (parseFloat(obj.UnitPrice) * obj.Quantity)
               obj.TaxableAmount = parseFloat(obj.BaseAmount) - obj.DiscountAmount
               obj.SGSTAmount = obj.TaxableAmount * (obj.SGSTPercentage / 100)
               obj.CGSTAmount = obj.TaxableAmount * (obj.CGSTPercentage / 100)
               obj.IGSTAmount = obj.TaxableAmount * (obj.IGSTPercentage / 100)
               obj.GSTAmount = obj.TaxableAmount * (obj.GSTPercentage / 100)
               obj.TaxAmount = obj.GSTAmount
               obj.ItemType = extraData?.QuoteItem?.ItemType
               obj.GSTGroupCode = extraData?.QuoteItem?.GSTGroupCode
               obj.SalesUOM = extraData?.QuoteItem?.SalesUOM
               obj.NetAmount = obj.TaxableAmount + obj.TaxAmount
               obj.GSTGroupCode = extraData?.QuoteItem.GSTGroupCode
               obj.InvoiceDetailGUID = uuidv4()
             }
           }
           this.TotalNetAmount()
         }

       }
     },
     error: err => {
       //this.ngxSpinnerService.hide();
       console.log(err);
     }
   })

 }
 isDiscountModalOpen:boolean=false;
 isOpen:boolean=false



  onInvoiceDocTypeSearch($event: { term: string; item: any[] }) {
 
    this.dropdownDataService.fetchDropDownData(DropDownType.InvoiceDocType, $event.term, {
      CompanyCode:glob.getCompanyCode(),
    }).subscribe({
      next: (value) => {
        console.log("===value===",value)
        if (value != null) {
          for (let item of value.Data) {
            if (this.params.InvoiceDocType != undefined || this.params.InvoiceDocType != null) {
              if (item.Id == this.params.InvoiceDocType) {
                this.InvoiceDocTypeData = item.Id
                this.title = item.TEXT
                break
              }
            }
          }

          this.InvoiceDocType = value;
        }
      },
      error: (err) => {
        this.InvoiceDocType = DropDownValue.getBlankObject();
      }
    });

  }

  dismissModal() {
    this.modalController.dismiss();
  }

  getInvoiceStockPrice() {
    var requestdata
  //  this.ngxSpinnerService.show()
    var partlist = []
    let i = 0;

    for (let item of this.finalSelectedElements) {
      item.StockPrice = "0"
      item.Quantity = 1
    }

    var tempSelectedElements = this.finalSelectedElements.slice()
    this.fetchGSTDetails()
  }


    async openInvoicePartSelector(doctype) {
  
     if (this.locationData != null || this.locationData != undefined) {
            const modal = await this.modalController.create({
              component: InvoiceSalesStockSelectorPage,
              componentProps: {
                  data:{
                    doctype:doctype
                  }
              },
              cssClass: 'my-custom-modal-class',  
              backdropDismiss: false, 
              animated: true,  
            });
            await modal.present();
      
            const { data } = await modal.onDidDismiss();
            if (data) {
              for (let item of data) {
                this.finalSelectedElements.push({
                  "ERPMaterialCode": item.ERPMaterialCode,
                  "Batch": item.Batch == null || item.Batch == undefined ? "" : item.Batch,
                  "MaterialCode": item.MaterialCode,
                  "MaterialName": item.MaterialName,
                  "SerialNo": item.SerialNumber == null || item.SerialNumber == undefined ? "" : item.SerialNumber,
                  "ItemType": item.ItemType,
                  "Billable": 1,
                  "PriceType": "StockPrice",
                  "DivisionCode": item.DivisionCode == null || item.DivisionCode == undefined ? "" : item.DivisionCode,
                  "SalesUOM": item.SalesUOM == null || item.SalesUOM == undefined ? "" : item.SalesUOM
                })
              }
              this.getInvoiceStockPrice();
            }
          } else {
          alert("Please select location to add parts")
          }
    }

  


  getAccessoryMarginListXml() {
    let rawData = {
      "rows": []
    }
    if (this.InvoiceDocTypeData === "CSALES") {
      for (let item of this.finalSelectedElements) {
        //if (item.StockPrice != null || item.StockPrice != undefined) {
        rawData.rows.push({
          "row": {
            "ItemType": item.ItemType,
            "InvoiceDetailGUID": uuidv4(),
            "ItemCode": item.MaterialCode,
            "ItemDescription": item.MaterialName,
            "Type": '',
            "PriceGroup":"RETAIL",
            "ImageUrl": item.ImageUrl,
            "ProductCategory": '',
            "Quantity": item.Quantity == null || item.Quantity == undefined ? 1 : item.Quantity,
            "Billable": 1,
            "StockPrice": this.dynamicService.removeCommas(item.StockPrice == null || item.StockPrice == undefined ? "0" : item.StockPrice.toString()),
            "PricingOptions": item.PriceType == null || item.PriceType == undefined?"STOCKPRICE":item.PriceType
          }
        })
      }
    }
    else if (this.InvoiceDocTypeData === "RSALES") {
      for (let item of this.finalSelectedElements) {
        //if (item.NetPrice != null || item.NetPrice != undefined) {
        rawData.rows.push({
          "row": {
            "ItemType": item?.ItemType,
            "InvoiceDetailGUID": uuidv4(),
            "ItemCode": item.MaterialCode,
            "ItemDescription": item.MaterialName,
            "Type": '',
            "ImageUrl": item.ImageUrl,
            "PriceGroup":"RETAIL",
            "ProductCategory": '',
            "Quantity": item.Quantity,
            "Billable": 1,
            "UnitPrice": this.dynamicService.removeCommas(item.NetPrice == null || item.NetPrice == undefined ? "0" : item.NetPrice.toString()),
            "PricingOptions": item.PriceType
          }
        })
        //}
      }
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(rawData);
    xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
    xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
    console.log(xml)
    return xml;
  }




//Payment Popup
  async openPayment(paymentType: string) {
    const modal = await this.modalController.create({
      component: PaymentPopupPage,
      componentProps: {
        data: {
          paymentType: paymentType,  
        },
        modeofpayment:{
          "modeofPayment": event,
          "totalAmount": this.totalNetAmount - this.totalPaidAmount,
          "locationCode": this.locationData,
          "customerCode": this.CustomerObject[0].CustomerCode,
          "advanceAmount": this.TotalCustomerAdvance == null || this.TotalCustomerAdvance == undefined ? 0 : this.TotalCustomerAdvance,
          "caseGUID": this.params.caseguid == null || this.params.caseguid == undefined ? "00000000-0000-0000-0000-000000000000" : this.params.caseguid,
          "acceptedPayment":this.paymentDetailArray
        } 
      },
      id: paymentType
    });
    // return await modal.present();
    await modal.present();
    let result= await modal.onDidDismiss() 

    if(result.data == undefined || result.data == null)
    { 
    }
    else
    { 
      //value get from payment-popup
      console.log("paymentDetailArray===",result.data.paymentDetailArray)
    this.acceptEmittedPaymentObj(result.data.paymentDetailArray); 
    } 
 
  }

//  Discount PopUp
  async openDiscountList(item) { 
    if (this.locationData != null || this.locationData != undefined) {
      const modal = await this.modalController.create({
        component: DiscountListPopupPage,
        componentProps: {
          data: {
            List: item, 
            locationCode: this.locationData,
            customerCode: this.CustomerObject[0].CustomerCode
            // Add more properties as needed
          },
          // You can pass any data to the modal using componentProps
        },
        cssClass: 'my-custom-modal-class', // You can add custom CSS classes to style the modal
        backdropDismiss: false, // Set this to true if you want to close the modal by tapping on the backdrop
        animated: true, // Set this to false if you want to disable animations
        // Other modal options like presentingElement, keyboardClose, etc.
      });
      await modal.present();
 
    } else {
     alert("Please select location to add parts")
    } 

}
 
onDismissChange(canDismiss) {  
  // Allows the modal to be dismissed based on the state of the checkbox
  this.canDismissOverride = canDismiss;
}

onWillPresent() {
  // Resets the override when the modal is presented
  this.canDismissOverride = false;
}


canDismiss = async () => 
{
  if (this.canDismissOverride) {
    // Checks for the override flag to return early if we can dismiss the overlay immediately
    return true;
  }

  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Are you sure?',
    buttons: [
      {
        text: 'Yes',
        role: 'confirm',
      },
      {
        text: 'No',
        role: 'cancel',
      },
    ],
  });

  actionSheet.present();

  const { role } = await actionSheet.onWillDismiss();

  return role === 'confirm';
};


//New discount popup
openDiscount(item)
  {
    this.hideDiscountPopup = !this.hideDiscountPopup;
  }

  ProductDetails:any[]=[]

  GetProductDetails(mobileNo)
  { 

    this.ProductDetails=[] 
  let RequestData=[];
  RequestData.push({
    "Key":"APITYPE",
    "Value":"GetProductdetailsList"
  });
  RequestData.push({
    "Key":"MobileNo",
    "Value":mobileNo
  })
  RequestData.push({
    "Key":"BrandCode",
    "Value":this.params.repa.Brand
  })
  RequestData.push({
    "Key":"MaterialCode",
    "Value":this.params.repa.MaterialCode
  })
  RequestData.push({
    "Key":"SerialNo",
    "Value":this.params.repa.SerialNo1
  })
  RequestData.push({
    "Key":"PageNo",
    "Value":"1"
  })
  RequestData.push({
    "Key":"PageSize",
    "Value":"10"
  })
  console.log("Search product:",RequestData)
  let CustRequestJson = JSON.stringify(RequestData);
  let contentRequest={
    "content":CustRequestJson
  }
  this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
    next:(value)=>{
      let Response = JSON.parse(value.toString())
      if(Response.ReturnCode == '0'){
        let data = JSON.parse(Response?.ExtraData);
        if(Array.isArray(data.ProductObj?.ProductDetails)){ 
          this.ProductDetails = data.ProductObj?.ProductDetails
          console.log('=====',this.ProductDetails)
        }
        else{ 
          this.ProductDetails.push(data.ProductObj?.ProductDetails);
          console.log('=====',this.ProductDetails)

        }
        for (let i = 0; i < this.ProductDetails.length; i++) {
          this.ProductDetails[i].selectedProduct = false;
      }      
      }
    }
  }) 
  }















        //Toster Function
async presentToast(text,type) {
  const toast = await this.toastController.create({
    message: text,
    duration: 3000,
    position:'top',
    icon:type=='success'?'checkmark-outline':'close',
    color:type=='success'?'success':'danger'
  });
  toast.present();
}
}
