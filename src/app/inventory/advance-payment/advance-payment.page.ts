import { Component, Input, OnInit } from '@angular/core';
import { IonModal, ModalController, NavParams } from '@ionic/angular';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { PaymentPopupPage } from '../accessory-sales/payment-popup/payment-popup.page';
import xml2js from 'xml2js';
import * as glob from "../../config/global";

import { v4 as uuidv4, parse } from 'uuid';

@Component({
  selector: 'app-advance-payment',
  templateUrl: './advance-payment.page.html',
  styleUrls: ['./advance-payment.page.scss'],
})
export class AdvancePaymentPage implements OnInit {

  @Input() modal!: IonModal;
  
  
  CustomerObject: any[] = []
  LocationObject: any[] = []
  paymentDetailArray: any[] = [];

  GLCode: DropDownValue = DropDownValue.getBlankObject();
  AdvModeofPaymentDD: DropDownValue = DropDownValue.getBlankObject();
  pinelabsPaymentArray: DropDownValue = DropDownValue.getBlankObject();



  PaymentCode : string
  paymentSuccessData: any
  finalSelectedElements: any[] = []
  PONumber: any;
  caseguid: any;
  title: string = ''
  currentDate: Date;
  errorMessage: any;
  params: any; 
  PaymentDate: Date
  advanceObj:any;
  locationdata: string = '';
  customercodedata; string = '';
  paymentDocTypeData: string = ''
  advancePaymentTerm: string =  '';
  isEdit: boolean = false; 
  advanceAmountPaid: number = 0;
  isPaidToggle: boolean = false
  submitClicked= false 
  // Payment Popup
  isPaymentpopUp : boolean = false
  modeofPaymentData: string = ''; 
  GLCodeData: string;
  houseofBank: string;
  isDefaultMOP: boolean = false

  CardType: any = ['Visa', 'Master Card'] 
  Amount: number = 0;
  AccountNumber: string = '';
  AuthenticationNumber: string = '';
  CardTypeData: string = '';
  CardNo: string = '';
  Adjudication: string = '';
  TerminalId: string = '';
  AccountHolderName: string = '';
  BankCode: string = '';
  BankAccountNumber: any = '';
  totalPaidAmount: number = 0;
  totalNetAmount: number = 0; 
  advancePaymentAmount: number = 0 
  paymentDocType: DropDownValue = DropDownValue.getBlankObject(); 
  PaymentGUID: any;   
  paymentSuccessArray: any[] = [] 
  caseId: string = ''
  UTR:string="";
  ChequeNo:string="";
  UPITransactionId: string = '';
  isPaymentProcessing = false 
  transactionNumber: string;
  previousEDCPaymentRecords: any[] = [];
  allowedPaymentMode:string;
  edcMachineObject :any[] = [];
  edcMachineName:string ;
  previousRecordsFound:boolean = false
  isNewTxnBtn: boolean = true
  isNewPayment: boolean = false; 

    // ----------------- 
    newJioPayPayment:boolean = false;
    isJioPayBtn:boolean = true;
    typeSelected = 'ball-clip-rotate';  
    BankAccountNo: string = ''; 
    AccountNo: string = '';
    AuthNo: string = ''; 
    selectedPreviousTransaction:string = ''
    locationData: string = '';
    customerCode:string = '';
    caseGUID: any; 
    customerAdvanceAmount:number = 0; 
    customerObject: any[] = [];
    alreadyAcceptedPayment: any[] = [] 
    isPinelabsBtn:boolean=true; 
    previousJIOPaymentRecords: any[] = [];
    previousJIOPayRecordsFound: boolean = false;
    paymentType:string='';

 

  constructor(
                private dynamicService: DynamicService,
                private dropdownDataService: DropdownDataService,
                private navParams: NavParams, 
                private modalController: ModalController,


             ) { }

  ngOnInit() {

    this.advanceObj=this.navParams.get('advanceObj')   
    this.params=this.advanceObj 

    this.onGLCodeSearch({ term: "", item: [] });
    this.onPaymentDocTypeSearch({ term: "", item: [] });
    this.onAdvanceModeofPaymentSearch({ term: "", item: [] });
    this.onAllowedPaymentSearch({ term: "", item: [] });

    if (this.params.customercode != null && this.params.customercode != undefined) 
    {
      this.getCustomerObject()
      this.customercodedata = this.params.customercode
    }
    else 
    {
      alert("Customer Details not found")
    }

    if (this.params.locationcode != null && this.params.locationcode != undefined) 
    {
      this.getLocationObject()
      this.locationdata = this.params.locationcode
    }
    else 
    {
      alert("Location Details not found")
    }
  
        
    if (this.params.caseguid != null && this.params.caseguid != undefined) { 
      this.caseguid = this.params.caseguid
    }
    else {
     alert("Caseguid Not Found")
      //this.locationservice.back()
    }
    if (this.params.paymentguid != null && this.params.paymentguid != undefined) {
      this.getAdvancePaymentObject()
      this.PaymentGUID = this.params.paymentguid
    }
    else
    {
    //  this.getCustomerModeOfPaymentLink()
   //   this.getEDCMachineObject()
      this.isEdit = true
    }
   
  }



  getLocationObject() {
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
      "Value": this.params.locationcode
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


  getCustomerObject() {
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetRtlCustomerObject"
    });
    requestData.push({
      "Key": "CustomerCode",
      "Value": this.params.customercode
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
            console.log("Cyust ", response)
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              var custlist = [];
              if (Array.isArray(data?.CustomerList?.Customer)) {
                custlist = data?.CustomerList?.Customer;
              }
              else {
                this.CustomerObject.push(data.Customer)
                this.errorMessage = "";
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

  getAdvancePaymentObject() {
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetAdvancePaymentObject"
    });
    requestData.push({
      "Key": "CaseGUID",
      "Value": this.params.caseguid
    });
    requestData.push({
      "Key": "PaymentGUID",
      "Value": this.params.paymentguid
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
              console.log("ADVANCE DATA", data)
              this.PaymentGUID = data?.PaymentObject?.PaymentGUID
              this.PaymentCode = data?.PaymentObject?.PaymentCode
              this.PaymentDate = data?.PaymentObject?.PaymentDate
              let PaymentList = data?.PaymentObject?.PaymentDetail
              if (Array.isArray(PaymentList)) {
                this.paymentDetailArray = PaymentList
                for (let item of PaymentList) {
                  this.advancePaymentAmount += parseFloat(item.Amount == null || item.Amount == undefined ? 0.00 : item.Amount)
                }
              }
              else {
                this.paymentDetailArray.push(PaymentList)
                this.advancePaymentAmount = parseFloat(PaymentList?.Amount == null || PaymentList?.Amount == undefined ? 0.00 : PaymentList?.Amount)
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

  
  onGLCodeSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.GLCode, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.GLCode = value;
        }
      },
      error: (err) => {
        this.GLCode = DropDownValue.getBlankObject();
      }
    });

  }

  onAdvanceModeofPaymentSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.modeofpayment, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.AdvModeofPaymentDD = value;
          console.log("AdvanceModeOf :",this.AdvModeofPaymentDD)
        }
      },
      error: (err) => {
        this.AdvModeofPaymentDD = DropDownValue.getBlankObject();
      }
    });
  }


  deletePaymentitem(item) {
    console.log("Item ", item)
    // this.totalPaidAmount = 0
    let index = this.paymentDetailArray.indexOf(item)
    console.log("Item Index ", index)
    this.advancePaymentAmount = 0
    this.paymentDetailArray.splice(index, 1)
    console.log("Payment List ", this.paymentDetailArray)
    // this.totalPaidAmount += this.advanceAmountPaid
    for (let obj of this.paymentDetailArray) {
      alert(obj?.Amount)
      this.advancePaymentAmount += parseFloat(obj?.Amount)
    }
  }

  //Payment Popup
  async openPayment(paymentType: string) 
  { 
    this.modeofPaymentData = paymentType
    for(let item of this.AdvModeofPaymentDD.Data)
    {
      if(item.Id == this.modeofPaymentData)
      {
        this.GLCodeData = item.GLCode
        this.houseofBank = item.extraData
      }
    }

    if (this.modeofPaymentData == 'CREDITREQ' && this.isDefaultMOP == false){
      const ShouldContinue = confirm("Are you sure you want to choose Credit Request instead of Credit Card Option? Do you want to continue")
      if (ShouldContinue == false ){
        return
      }
    } 
    this.isPaymentpopUp = true
  }

 

  
  saveMaterialRecordXML() {
    let rawData = {
      "rows": []
    }
    let count = 0;
    for (let item of this.finalSelectedElements) {
      if(item?.ItemType == "Material")
      {
        rawData.rows.push({
          "row": {
            "PaymentGUID": this.PaymentGUID,
            "MaterialCode":item?.ItemCode,
            "AdvanceAmount":item?.AdvanceAmount,
            "SAC_HSNCode":item?.SAC_HSNCode
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


  onAllowedPaymentSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.AllowedPaymentMode, $event.term, {
      CompanyCode: glob.getCompanyCode()
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.pinelabsPaymentArray = value;
          console.log("Allowed DD ", this.pinelabsPaymentArray)
        }
      },
      error: (err) => {
        this.pinelabsPaymentArray = DropDownValue.getBlankObject();
      }
    });
  }

  onPaymentDocTypeSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.AdvancePaymentDocType, $event.term, {
      CompanyCode:glob.getCompanyCode(),
    }).subscribe({
      next: (value) => {
        if (value != null) {
          for (let item of value.Data) {
            if (this.params.doctype != undefined || this.params.doctype != null) {
              if (item.Id == this.params.doctype) {
                this.paymentDocTypeData = item.Id
                this.title = item.TEXT
                break
              }
            }
          }
          this.paymentDocType = value;
        }
      },
      error: (err) => {
        this.paymentDocType = DropDownValue.getBlankObject();
      }
    });
  }


  
  savePaymentListXml() {
    let rawData = {
      "rows": []
    }
    let count = 0;
    for (let item of this.paymentDetailArray) {
      count += 1 
       rawData.rows.push({
        "row": {
          "PaymentDetailGUID": uuidv4(),
          "PaymentGUID": this.PaymentGUID,
          "TranType": item.TranType,
          "TranDate": new Date().toISOString(), // Convert to ISO 8601 format
          "Amount": item.Amount,
          "ModeOfPayment": item.ModeOfPayment,
          "AuthenticationNumber": item.AuthenticationNumber,
          "AccountNumber": item.AccountNumber,
          "AccountHolderName": item.AccountHolderName,
          "BankCode": item.BankCode,
          "BankAccountNumber": item.BankAccountNo == null || item.BankAccountNo == undefined ? '' : item.BankAccountNo,
          "CardType": item.CardType,
          "CardNumber": item.CardNumber,
          "ChequeNo": item.ChequeNo,
          "Adjudication": item.Adjudication,
          "TerminalId": item.TerminalId,
          "UTRDetails": item.UTRDetails ,
          "UPITransactionId": item.UPITransactionId,
          "GLCode": item.GLCode,
          "HouseOfBank": item.HouseOfBank,
          "EDCMachineType":item?.EDCMachineType,
          "EDCMachineReferenceID":item?.EDCMachineReferenceID,
          "RefundFlag":0
        }
      })
      // console.log(rawData.rows)
    }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(rawData);
    xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
    xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
    console.log(xml)
    return xml;
  }


  validatePaymentiPlanet()
   { 
    
  //  alert(this.paymentObject.totalAmount)
  // Cash-> alert(this.modePayment.paymentType)
  
  if (this.Amount < 1) {
   alert("Payment Amount cannot be less than 1 ")
    return false;
  }
  //Change
  // if(this.Amount > this.paymentObject.totalAmount)
  // {
  //   alert("Amount cannot be greater than the total payable amount")
  //   return false;
  // }

  else if (this.modeofPaymentData == 'CASH')
  {
    if(this.Amount == null || this.Amount == undefined || this.Amount == 0)
    {
      alert("Amount cannot be 0")
      return false;
    }
    else
    { 
    //  this.paymentDetailArray = []=[]
    this.advancePaymentAmount += this.Amount
      this.paymentDetailArray.push({
        "NEWPAYMENT": 1,
        "TranType": "Payment",
        "TranDate": new Date().toString(),
        "Amount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
        "ModeOfPayment": this.modeofPaymentData,
        "AccountNumber": this.AccountNo,
        "AuthenticationNumber": this.AuthNo,
        "CardType": this.CardTypeData,
        "CardNumber": this.CardNo,
        "EDCMachineType":'',
        "EDCMachineReferenceID":'',
        "JioPayTxnRefNo":'',
        "Adjudication": this.Adjudication,
        "TerminalId": this.TerminalId,
        "RequestedAmount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
        "AccountHolderName": this.AccountHolderName,
        "BankCode": this.BankCode,
        "BankAccountNo": this.BankAccountNo == null || this.BankAccountNo == undefined ? '' : this.BankAccountNo,
        "UTR" : this.UTR == null || this.UTR == undefined ? '' : this.UTR,
        "ChequeNo" : this.ChequeNo == null || this.ChequeNo == undefined ? '' : this.ChequeNo
      })
      this.Amount = 0.00
      this.modeofPaymentData =  
      this.AccountNo = ''
      this.AuthNo =  '';
      this.CardTypeData =  '';
      this.CardNo =  '';
      this.Adjudication =  '';
      this.TerminalId =  '';
      this.AccountHolderName =  
      this.BankCode =  
      this.BankAccountNo = "";
      this.UTR="";
      this.ChequeNo="";
      // this.paymentObj.emit(this.paymentDetailArray[0]) 
      // this.modalController.dismiss({
      //   paymentDetailArray: this.paymentDetailArray[0]
      // });
     // this.dismissModal() 
     this.closePaymentPopUp()
      return true;
    }
  }
  else if (this.modeofPaymentData == 'NEFT/RTGS') {
    if (this.AccountHolderName == '' || this.AccountHolderName == null || this.AccountHolderName == undefined) {
     alert("Account Holder Name cannot be empty")
      return false;
    }
    else if (this.BankCode == '' || this.BankCode == null || this.BankCode == undefined) {
     alert("Bank Code cannot be empty")
      return false;
    }
    else if (this.BankAccountNo == null || this.BankAccountNo == undefined || this.BankAccountNo =='') {
     alert("Bank Account No cannot be empty")
      return false;
    }
    else
    {
      // this.paymentDetailArray = []=[] 
      this.advancePaymentAmount += this.Amount
      this.paymentDetailArray.push({
        "NEWPAYMENT": 1,
        "TranType": "Payment",
        "TranDate": new Date().toString(),
        "Amount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
        "ModeOfPayment": this.modeofPaymentData,
        "AccountNumber": this.AccountNo,
        "AuthenticationNumber": this.AuthNo,
        "CardType": this.CardTypeData,
        "CardNumber": this.CardNo,
        "EDCMachineType":'',
        "EDCMachineReferenceID":'',
        "JioPayTxnRefNo":'',
        "Adjudication": this.Adjudication,
        "TerminalId": this.TerminalId,
        "RequestedAmount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
        "AccountHolderName": this.AccountHolderName,
        "BankCode": this.BankCode,
        "BankAccountNo": this.BankAccountNo == null || this.BankAccountNo == undefined ? '' : this.BankAccountNo,
        "UTR" : this.UTR == null || this.UTR == undefined ? '' : this.UTR,
        "ChequeNo" : this.ChequeNo == null || this.ChequeNo == undefined ? '' : this.ChequeNo
      })
      this.Amount = 0.00
      this.modeofPaymentData =  
      this.AccountNo = ''
      this.AuthNo =  '';
      this.CardTypeData =  '';
      this.CardNo =  '';
      this.Adjudication =  '';
      this.TerminalId =  '';
      this.AccountHolderName =  
      this.BankCode =  
      this.BankAccountNo = "";
      this.UTR="";
      this.ChequeNo=""; 
      //this.paymentObj.emit(this.paymentDetailArray[0])

      // this.modalController.dismiss({
      //   paymentDetailArray: this.paymentDetailArray[0]
      // }); 
      //this.dismissModal()
      this.closePaymentPopUp()
      return true;
    }
  }
  else if (this.modeofPaymentData == 'CHEQUE') {
    if (this.BankCode == '' || this.BankCode == null || this.BankCode == undefined) {
     alert("Bank cannot be empty")
      return false;
    }
    else if (this.AccountHolderName == null || this.AccountHolderName == undefined || this.AccountHolderName == '') {
     alert("Account Holder Name cannot be empty")
      return false;
    }
    else if (this.ChequeNo == null || this.ChequeNo == undefined || this.ChequeNo == '') {
     alert("Cheque Number cannot be empty")
      return false;
    }
    else
    { 
      alert(this.ChequeNo)
      // this.paymentDetailArray = []
      this.advancePaymentAmount += this.Amount
      this.paymentDetailArray.push({
        "NEWPAYMENT": 1,
        "TranType": "Payment",
        "TranDate": new Date().toString(),
        "Amount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
        "ModeOfPayment": this.modeofPaymentData,
        "AccountNumber": this.AccountNo,
        "AuthenticationNumber": this.AuthNo,
        "CardType": this.CardTypeData,
        "CardNumber": this.CardNo,
        "EDCMachineType":'',
        "EDCMachineReferenceID":'',
        "JioPayTxnRefNo":'',
        "Adjudication": this.Adjudication,
        "TerminalId": this.TerminalId,
        "RequestedAmount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
        "AccountHolderName": this.AccountHolderName,
        "BankCode": this.BankCode,
        "BankAccountNo": this.BankAccountNo == null || this.BankAccountNo == undefined ? '' : this.BankAccountNo,
        "UTR" : this.UTR == null || this.UTR == undefined ? '' : this.UTR,
        "ChequeNo" : this.ChequeNo == null || this.ChequeNo == undefined ? '' : this.ChequeNo
      })
      this.Amount = 0.00
      this.modeofPaymentData =  
      this.AccountNo = ''
      this.AuthNo =  '';
      this.CardTypeData =  '';
      this.CardNo =  '';
      this.Adjudication =  '';
      this.TerminalId =  '';
      this.AccountHolderName =  
      this.BankCode =  
      this.BankAccountNo = "";
      this.UTR="";
      this.ChequeNo="";
    //  this.paymentObj.emit(this.paymentDetailArray[0])
      // this.modalController.dismiss({
      //   paymentDetailArray: this.paymentDetailArray[0]
      // });
    
      this.closePaymentPopUp()
      return true;
    }
  }
  return true
  }


  
  //Submit Payment

  onSubmit() {
    if (this.advancePaymentAmount < 1) {
      alert("Invalid Advance Amount")
      return;
    }
    // if (this.totalPaidAmount > (this.advancePaymentAmount + 1) || this.totalPaidAmount < (this.advancePaymentAmount - 1)) {
    //   alert("Paid Amount and Advance Amount does not match")
    //   return;
    // }

    // if(this.advanceAmountPaid == this.advancePaymentAmount)
    // {
    //   alert("Payment is already done")
    //   return;
    // }
    console.log("paymentDetailArray==",this.paymentDetailArray)
    this.PaymentGUID = uuidv4()
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveAdvancePayment"
    });
    requestData.push({
      "Key": "PaymentGUID",
      "Value": this.PaymentGUID
    });
    requestData.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    });
    requestData.push({
      "Key": "PaymentDocType",
      "Value": 'PADV'
    });
    requestData.push({
      "Key": "InvoiceGUID",
      "Value": "00000000-0000-0000-0000-000000000000"
    });
    requestData.push({
      "Key": "CaseGuid",
      "Value": this.caseguid
    });
    requestData.push({
      "Key": "SalesOrderGUID",
      "Value": "00000000-0000-0000-0000-000000000000"
    });
    requestData.push({
      "Key": "CustomerCode",
      "Value": this.customercodedata
    });
    requestData.push({
      "Key": "BillToCustomerCode",
      "Value": this.customercodedata
    });
    requestData.push({
      "Key": "LocationCode",
      "Value": this.locationdata
    });
    requestData.push({
      "Key": "TotalPaidAmount",
      "Value": this.advancePaymentAmount
    });
    requestData.push({
      "Key": "CurrencyCode",
      "Value": "INR"
    });
    requestData.push({
      "Key": "PaymentDetails",
      "Value": this.savePaymentListXml()
    })

    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    };
    const ShouldContinue = confirm("Are you sure? Do you want to continue")
    if (ShouldContinue == false ){
      return
    }

    // // // TODO
    // console.log("Before Saving Advance payment ", requestData)
    // console.log("Payment List ", this.paymentDetailArray)
    // return
    
    if(this.submitClicked == true)
    {
      return;
    }
    this.submitClicked=true 

    //this.ngxSpinnerService.show()
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (value) => {
          this.submitClicked= false 
       //   this.ngxSpinnerService.hide()
          let response = JSON.parse(value.toString());
          if (response.ReturnCode == '0') {
            var getval = JSON.parse(response.ExtraData);
            console.log("success ", getval)

            this.paymentSuccessData=getval;
            alert('Submitted Succesfully')
            this.modalController.dismiss({
              paymentSuccessObjt: this.paymentSuccessData.PAYMENTLIST
            });
            //Close popup here

          //  this.route.navigate(['auth/' + glob.getCompanyCode() + '/advance-payment-list'])
            // this.saveSapAdvancePayment()
          }
          else {
              this.submitClicked= false 
              console.log("Error Response: " , response)
              this.errorMessage = response.ErrorMessage;
              const parser = new xml2js.Parser({ strict: false, trim: true });
              parser.parseString( this.errorMessage , (error, result) => {
                const errorMessages = result.ERRORLIST.ERRORMESSAGEROW;
                console.log("Messages : " ,errorMessages)
                errorMessages.forEach((errorMessage) => {
                  // console.log("Error Message: " , error)
                  alert(errorMessage.ERRORMESSAGE);
                });
              }); 
          }
        },
        error: err => {
          this.submitClicked= false 
          //this.ngxSpinnerService.hide();
          console.log("Error Message:- ", err)
          const errors = err.split("Error Code:").slice(1); // Split the error string into separate error segments
          errors.forEach(error => {
            const messageIndex = error.indexOf("Message: ");
            if (messageIndex !== -1) {
              const messageSubstring = error.substring(messageIndex + 9).trim();
              const message = JSON.parse(messageSubstring).message;
              alert("Error:-  " + message);
            } else {
              alert("Error parsing the error message.");
            }
          });
        }
      });
  }


  closePaymentPopUp(){
    this.isPaymentpopUp = false 
    // this.isNewTxnBtn=true
    // this.isNewPayment=false
  }

 
}
