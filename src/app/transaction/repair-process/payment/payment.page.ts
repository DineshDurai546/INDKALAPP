import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { IonModal, CheckboxCustomEvent, ModalController, ActionSheetController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';
import { ObjPayment } from './payment.metadata';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { ReportService } from 'src/app/Services/gsxService/report.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import xml2js from 'xml2js';
import { AdvancePaymentPage } from 'src/app/inventory/advance-payment/advance-payment.page'; 
import { EventEmitter } from '@angular/core';
import * as glob from "../../../config/global";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  @Input() modal!: IonModal;
  @Input() repa;
  isPayment: boolean = false
  isCreatePaymentLink: boolean = false;
  isAddPayment: boolean = true 
  isPaymentLinkList: boolean = false 
  isShowPaymentLink: boolean = false 
  PaymentTypeVal: any = ['Payment','Refund']
  MOPVal: any = ['RazorPay','NEFT/RTGS', 'Debit/Credit-Card', 'Cash']
  CardTypeVal: any = ['Visa','Master Card']
  paymentviewlist: any [] = [] ;
  paymentLinkList: any[] = [];
  date = new Date();
  MOPValue = ""
  paymentForm: FormGroup;
  PaymentLink: FormGroup;
  payment: ObjPayment
  errorMessage: any;
  TotalNetValue = ""
  PaidAmount=0
  PendingAmount=0
  PaymentListVal
  PaymentGuid = uuidv4();
   
  @Output() PaymentEmit = new EventEmitter<any>();

  
  
  constructor(
                private formBuilder: FormBuilder,
                private dynamicService: DynamicService,
                private reportService:ReportService, 
                private datePipe: DatePipe,
                private route:Router,
                private modalController: ModalController,

            ) { }

            ngOnInit(): void {
              if(this.payment == null)
              {
                this.payment = new ObjPayment();
              }
              console.log("REPA", this.repa)
              this.paymentForm = this.formBuilder.group({
                PaymentType: [null, Validators.required],
                PaymentDate: [null, Validators.required],
                MOPayment: [null, Validators.required],
                QuoteAmount: [null, Validators.required],
                AccountNo: [" "],
                AuthNo: [" "],
                CardType: [" "],
                Adjudication: [" "],
                TerminalId: [" "],
                RequestedAmt: [" "],
                AccountHolderName: [" "],
                CardNo: [" "],
                BankCode: [" "],
                BankAccountNo: [" "]
                
              });
              this.PaymentLink = this.formBuilder.group({
              
                Payable: [" "]
                
              });
              this.dataSet();
            }
          

  ngOnChanges(changes: SimpleChanges): void{
     
    if(changes['repa'])
    { 
      if(this.repa!= null && this.repa != undefined  ){
        if(this.payment == null)
        {
          this.payment = new ObjPayment();
        }
        this.payment.TotalNetAmount = this.repa?.QUOTE?.TotalNetAmount
        this.paymentviewlist=[];
        if(Array.isArray(this.repa?.PAYMENTLIST?.Payment))
        {
          for ( var item of this.repa?.PAYMENTLIST?.Payment)
          {
            this.paymentviewlist.push({
              "AccountHolderName": item.AccountHolderName,
              "AccountNumber": item.AccountNumber,
              "Adjudication": item.Adjudication,
              "Amount": item.Amount,
              "AuthenticationNumber": item.AuthenticationNumber,
              "BankAccountNumber": item.BankAccountNumber,
              "BankCode": item.BankCode,
              "CardNumber": item.CardNumber,
              "CardType": item.CardType,
              "CreatedBy": item.CreatedBy,
              "ChequeNo": item.ChequeNo,
              "CreatedDate": item.CreatedDate,
              "ModeOfPayment": item.ModeOfPayment,
              "PaymentGUID": item.PaymentGUID,
              "TerminalId": item.TerminalId,
              "TranDate": item.TranDate,
              "TranType": item.TranType,
              "PaymentCode":item.PaymentCode
           }) 
          }

        }
        else
        {
          if(!(this.repa?.PAYMENTLIST?.Payment == undefined || this.repa?.PAYMENTLIST?.Payment == null))
          {
          var lstpaymentviewlist=[];
          lstpaymentviewlist.push(this.repa?.PAYMENTLIST?.Payment);
              this.paymentviewlist.push({
                  "AccountHolderName": lstpaymentviewlist[0]?.AccountHolderName,
                  "AccountNumber": lstpaymentviewlist[0]?.AccountNumber,
                  "Adjudication": lstpaymentviewlist[0]?.Adjudication,
                  "Amount": lstpaymentviewlist[0]?.Amount,
                  "AuthenticationNumber": lstpaymentviewlist[0]?.AuthenticationNumber,
                  "BankAccountNo": lstpaymentviewlist[0]?.BankAccountNo,
                  "BankCode": lstpaymentviewlist[0]?.BankCode,
                  "CardNumber": lstpaymentviewlist[0]?.CardNumber,
                  "CardType": lstpaymentviewlist[0]?.CardType,
                  "CreatedBy": lstpaymentviewlist[0]?.CreatedBy,
                  "CreatedDate": lstpaymentviewlist[0]?.CreatedDate,
                  "ModeOfPayment": lstpaymentviewlist[0]?.ModeOfPayment,
                  "PaymentGUID": lstpaymentviewlist[0]?.PaymentGUID,
                  "TerminalId": lstpaymentviewlist[0]?.TerminalId,
                  "TranDate": lstpaymentviewlist[0]?.TranDate,
                  "TranType": lstpaymentviewlist[0]?.TranType,
                  "PaymentCode":lstpaymentviewlist[0]?.PaymentCode,
                  "ChequeNo": lstpaymentviewlist[0]?.ChequeNo,
              })
          }
         } 
        this.CalculatePaidAmount();
        this.PaymentLink = this.formBuilder.group({
          Payable: [this.payment.TotalNetAmount - this.PaidAmount ]
        })

        if(Array.isArray(this.repa?.PaymentLinkList?.PaymentLink))
        {
          for(let item of this.repa?.PaymentLinkList?.PaymentLink){
            this.paymentLinkList.push({
              "PaymentLinkStatus": item.PaymentLinkStatus,
              "Amount": item.Amount,
              "PaymentLink": item.PaymentLink,
              "PaymentLinkGUID": item.PaymentLinkGUID,
              "PaymentGateway": item.PaymentGateway
            })
          }
        }else{
          var lstpaymentlinklist=[];
          lstpaymentlinklist.push(this.repa?.PaymentLinkList?.PaymentLink);
              this.paymentLinkList.push({
                "PaymentLinkStatus": lstpaymentlinklist[0]?.PaymentLinkStatus,
                "Amount": lstpaymentlinklist[0]?.Amount,
                "PaymentLink": lstpaymentlinklist[0]?.PaymentLink,
                "PaymentLinkGUID": lstpaymentlinklist[0]?.PaymentLinkGUID,
                "PaymentGateway": lstpaymentlinklist[0]?.PaymentGateway
              })
        }
        
      }
    }
  }



  onSubmit() {

    const payval = this.paymentForm.value
    let requestData = [];
    console.log("Total Records:", requestData)
    this.dynamicService.validateAllFormFields(this.paymentForm);
    var PaymentAMT = this.paymentForm.controls['QuoteAmount'].value
    var PayableAmount = parseInt(this.paymentForm.controls['QuoteAmount'].value)
    if(PayableAmount <= this.PendingAmount){
    if (this.paymentForm.valid) {
      requestData.push({
        "Key": "ApiType",
        "Value": "SavePayment"
      });
      requestData.push({
        "Key": "TranType",
        "Value": payval.PaymentType
      });
      requestData.push({
        "Key": "PaymentCode",
        "Value": "NEW"
      });
      requestData.push({
        "Key": "TranDate",
        "Value": payval.PaymentDate
      });
      requestData.push({
        "Key": "ModeOfPayment",
        "Value": payval.MOPayment
      });
      requestData.push({
        "Key": "Amount",
        "Value": payval.QuoteAmount
      });
      requestData.push({
        "Key": "AccountNumber",
        "Value": payval.AccountNo
      });
      requestData.push({
        "Key": "AuthenticationNumber",
        "Value": payval.AuthNo
      });
      requestData.push({
        "Key": "CardType",
        "Value": payval.CardType
      });
      requestData.push({
        "Key": "CardNumber",
        "Value": payval.CardNo
      });
      requestData.push({
        "Key": "Adjudication",
        "Value": payval.Adjudication
      });
      requestData.push({
        "Key": "TerminalID",
        "Value": payval.TerminalId
      });
      requestData.push({
        "Key": "AccountHolderName",
        "Value": payval.AccountHolderName
      });
      requestData.push({
        "Key": "BankCode",
        "Value": payval.BankCode
      });
      requestData.push({
        "Key": "BankAccountNo",
        "Value": payval.BankAccountNo
      });
      requestData.push({
        "Key": "CompanyCode",
        "Value":glob.getCompanyCode()
      });
      requestData.push({
        "Key": "CaseGUID",
        "Value": this.repa.CaseGUID
      });
      requestData.push({
        "Key": "PaymentGUID",
        "Value": this.PaymentGuid
      });

      console.log(requestData);
      let strRequestData = JSON.stringify(requestData);
      
      let contentRequest = {
        "content": strRequestData
      };
    
      this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
        {
          next: (value) => {
        
            let response = JSON.parse(value.toString());

            if (response.ReturnCode == '0') {
              console.log("sucess");
              this.PaymentListVal = JSON.parse(response.ExtraData);
              console.log("Data" , this.PaymentListVal)
              this.AdvancePaymentObj()
             // this.PaymentUpdated.emit(this.PaymentListVal)
              this.addNewPayment  ()
              alert('Submitted Succesfully')

            }
            else {
              ''
              this.errorMessage = response.ReturnMessage;
              const parser = new xml2js.Parser({ strict: false, trim: true });
              parser.parseString(response.ErrorMessage, (err, result) => {
                response['errorMessageJson'] = result;

              });
            }
          },
          error: err => {
            console.log(err);
          }
        });
    }
     else {
      console.log("Enter Required Fields")
      alert("Fields Cannot be Empty")
    }
  }else {
    alert("Payable Amount is more than Pending Amount")
  }
}


  CalculatePaidAmount()
  {
    this.PaidAmount=0
    for(let item of this.paymentviewlist)
    {
        if(item.TranType.toUpperCase()=="PAYMENT")
        {
            this.PaidAmount= parseFloat( this.PaidAmount.toString() )+parseFloat( item.Amount.toString())
        }
        else
        {
          this.PaidAmount= parseFloat(this.PaidAmount.toString())-parseFloat(item.Amount.toString())
        }
    }
    this.PendingAmount= this.payment.TotalNetAmount - this.PaidAmount
   

  }


  downloadPaymentReport(item)
  {}

  AdvancePaymentObj(){
    ''
    var AdvancePayValArray = []
      if(Array.isArray(this.PaymentListVal.PAYMENTLIST.Payment)){
        AdvancePayValArray = this.PaymentListVal.PAYMENTLIST.Payment
      }else{
        AdvancePayValArray.push(this.PaymentListVal.PAYMENTLIST.Payment)
      }
    
      for(let item of AdvancePayValArray){
        if(this.PaymentGuid.toUpperCase() == item.PaymentGUID){
          var AdvancePayVal = item
        }
      } 
    
      var customer = this.PaymentListVal.CUSTOMER
      var businessdaydate = this.datePipe.transform(AdvancePayVal.TranDate,"yyyyMMdd")
      var begindatetimestamp = this.datePipe.transform(AdvancePayVal.TranDate,"yyyyMMddHHMSS")
      var enddatetimestamp = this.datePipe.transform(AdvancePayVal.TranDate,"yyyyMMddHHMSS")
      var retailstoreid = "8905"
      var transactiontypecode
      var workstationid = "C1"
      var transactionsequencenumber = AdvancePayVal.PaymentCode
      var tendertypecode
      var RegionCode = ""
      console.log("AdvancePayVal" , AdvancePayVal)
    
      if(customer.StateCode == "MH")
      {
        RegionCode="MAH"
      }
      if(!(customer.GSTRegistrationNo != undefined && customer.GSTRegistrationNo != null))
      {
      transactiontypecode = "1211"
      }
      else{
      transactiontypecode = "1212"
      }
    
    
    if(AdvancePayVal.ModeOfPayment == 'RazorPay')
    {
      tendertypecode = "5030"
    }
     else if(AdvancePayVal.ModeOfPayment == 'NEFT/RTGS'){
      tendertypecode = "3201"
    }else if(AdvancePayVal.ModeOfPayment == 'Debit/Credit-Card'){
      tendertypecode = "3307"
    }else if(AdvancePayVal.ModeOfPayment == 'Cash'){
      tendertypecode = "3101"
    }
    
    /*if(customer.StateCode == "MH")
    {
      RegionCode="MAH"
    }*/
    RegionCode="MAH"
    
    
      var importparameters = {
        "i_commit": "X",
        "i_lockwait": "",
        "i_sourcedocumentlink": {
        "key": "",
        "logicalsystem": "",
        "type": ""
        }
      }
    
      var additionals = [
        
      ]
      additionals.push({
        "businessdaydate": businessdaydate,
        "retailstoreid": retailstoreid,
        "transactionsequencenumber": transactionsequencenumber,
        "transactiontypecode": transactiontypecode,
        "workstationid": workstationid
      })
    
      var creditcard = [
        
    
      ]
      if(tendertypecode=="3307")
      {
    
        
        creditcard.push({
          "tendersequencenumber": "1",
          "paymentcard": AdvancePayVal.CardType,
          "cardnumber": AdvancePayVal.CardNumber,
          "adjudicationcode": AdvancePayVal.Adjudication,
          "authorizingtermid": workstationid,
          "requestedamount": AdvancePayVal.Amount,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid,
          "businessdaydate": businessdaydate,
          "retailstoreid": retailstoreid,
    
        })
      }
      var customerdetails = [
    
      ]
      if(customer.EmailID != undefined && customer.EmailID != null){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "CUST_EMAIL",
          "dataelementvalue": customer.EmailID,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
      
    
      if(customer.ZipCode != undefined && customer.ZipCode != null){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "CUSTZIP",
          "dataelementvalue": customer.ZipCode,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
    
      if(customer.StateCode != undefined && customer.StateCode != null){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "CUSTREGION",
          "dataelementvalue": RegionCode,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
      if(customer.FirstName != undefined && customer.FirstName != null && customer.LastName != null && customer.LastName != undefined){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "CUSTNAMES",
          "dataelementvalue": customer.FirstName+" "+customer.LastName,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
      if(customer.MobileNo != undefined && customer.MobileNo != null){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "CUSTMOBILE",
          "dataelementvalue": customer.MobileNo,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
    
      if(customer.GSTRegistrationNo != undefined && customer.GSTRegistrationNo != null){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "GSTIN",
          "dataelementvalue": customer.GSTRegistrationNo,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
    
      if(customer.Address1 != undefined && customer.Address1 != null){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "CUST_ADD1",
          "dataelementvalue": customer.Address1,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
    
      
      if(customer.Address2 != undefined && customer.Address2 != null){
        customerdetails.push({
          "businessdaydate": businessdaydate,
          "customerdetailssequencenumber": customer.CustomerCode,
          "customerinformationtypecode": "CUST",
          "dataelementid": "CUST_ADD2",
          "dataelementvalue": customer.Address2,
          "retailstoreid": retailstoreid,
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
        })
      }
      
    
    var directdebit = [
    
    ]
    if(tendertypecode=="3201")
    directdebit.push({
      "tendersequencenumber": "1",
      "accountholdername": AdvancePayVal.AccountHolderName,
      "bankcode": AdvancePayVal.BankCode,
      "bankaccount": AdvancePayVal.BankAccountNo,
      "industrymainkey": "",
      "ecseperator": ""
    })
    
    var lineitemdiscount = [
    
    ]
    
    var lineitemext = [
    
    ]
    
    var lineitemtax = [
    
    ]
    
    var retaillineitem = [
    
    ]
    
    var tender = [
    
    ]
    tender.push({
      "accountnumber": "",
      "businessdaydate": businessdaydate,
      "referenceid": "",
      "retailstoreid": retailstoreid,
      "tenderamount": AdvancePayVal.Amount,
      "tendercurrency": "INR",
      "tendercurrency_iso": "INR",
      "tenderid": "",
      "tendersequencenumber": "1",
      "tendertypecode": tendertypecode,
      "transactionsequencenumber": transactionsequencenumber,
      "transactiontypecode": transactiontypecode,
      "workstationid": workstationid
      },
      {
      "accountnumber": "",
      "businessdaydate": businessdaydate,
      "referenceid": "",
      "retailstoreid": retailstoreid,
      "tenderamount": "-" + AdvancePayVal.Amount,
      "tendercurrency": "INR",
      "tendercurrency_iso": "INR",
      "tenderid": "",
      "tendersequencenumber": "2",
      "tendertypecode": "6044",
      "transactionsequencenumber": transactionsequencenumber,
      "transactiontypecode": transactiontypecode,
      "workstationid": workstationid
      })
    
      var tenderext = [
    
      ]
      tenderext.push(
        {
          "businessdaydate": businessdaydate,
          "fieldgroup": "ACTNO",
          "fieldname": "ACCOUNTNO",
          "fieldvalue": this.repa.CaseId,
          "retailstoreid": retailstoreid,
          "tendersequencenumber": "2",
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
          })
          if(tendertypecode == "5030")
          tenderext.push(
              {
            "businessdaydate": businessdaydate,
            "fieldgroup": "AUTNO",
            "fieldname": "AUTHNUMBER",
            "fieldvalue": AdvancePayVal.AuthenticationNumber,
            "retailstoreid": retailstoreid,
            "tendersequencenumber": "1",
            "transactionsequencenumber": transactionsequencenumber,
            "transactiontypecode": transactiontypecode,
            "workstationid": workstationid
    
          })
      var transaction = [
    
      ]
      transaction.push(
        {
          "activitytime": "0.000",
          "begindatetimestamp": begindatetimestamp,
          "businessdaydate": businessdaydate,
          "customerage": "0",
          "customerentrymethod": "W",
          "customeridpos": "",
          "department": "1",
          "enddatetimestamp": enddatetimestamp,
          "logsys": "",
          "operatorid": "",
          "operatorqualifier": "",
          "origbegintimestamp": "",
          "origbusinessdaydate": "",
          "origlineitemnumber": "",
          "origreasoncode": "",
          "origretailstoreid": "",
          "origtransnumber": "",
          "origworkstationid": "",
          "partnerid": "",
          "partnerqualifier": "",
          "pausetime": "0.000",
          "registertime": "0.000",
          "retailstoreid": retailstoreid,
          "tendertime": "",
          "tillid": "",
          "trainingtime": "0.000",
          "transactioncurrency": "INR",
          "transactioncurrency_iso": "INR",
          "transactionsequencenumber": transactionsequencenumber,
          "transactiontypecode": transactiontypecode,
          "workstationid": workstationid
          }
      )
    
     var transactiondiscount= [
    
      ]
    
     var transactionext = [
    
     ]
     transactionext.push(
      {
        "businessdaydate": businessdaydate,
         "fieldgroup": "ECOM",
         "fieldname": "ORDERID",
         "fieldvalue": this.repa.CaseId,
         "retailstoreid": retailstoreid,
         "transactionsequencenumber": transactionsequencenumber,
         "transactiontypecode": transactiontypecode,
         "workstationid": workstationid
      }
     )
    
     var transactionloyalty =  [
          
     ]
    
     var requesttables ={
      "additionals": additionals,
      "creditcard": creditcard,
      "customerdetails": customerdetails,
      "directdebit": directdebit,
      "lineitemdiscount" : lineitemdiscount,
      "lineitemext": lineitemext,
      "lineitemtax" : lineitemtax,
      "retaillineitem" : retaillineitem,
      "tender" : tender,
      "tenderext": tenderext,
      "transaction": transaction,
      "transactiondiscount": transactiondiscount,
      "transactionext": transactionext,
      "transactionloyalty": transactionloyalty
     }
     var obj = {
      "importparameters": importparameters,
      "requesttables":requesttables
    }
    let contentRequest = {
      "content": JSON.stringify(obj)
    };
     
    console.log(contentRequest);
    this.dynamicService.savePosDta(transactionsequencenumber,contentRequest).subscribe(
      {
        next: (value) => {
          ''
          var result=JSON.parse(value.toString());
          var isSuccess = true ;
          /*for(var item of result)
          {
              if(item.type=="E")
              {
                isSuccess= false;
                this.toaster.error(item.message,"PS-DTA Error");
              }
          }*/
       //   this.SavePosDtaLog(transactionsequencenumber,obj,result)
    
    
        },
        error: err => {
          console.log(err);
    
        }
      });
     
    console.log("Advance Payment Data" , obj)
    
    
    
    }  

    addNewPayment(){
      if (this.isAddPayment == true) {
        this.isAddPayment = false;
      } else {
        this.isAddPayment = true;
      }
    }
 

  onReset() {
    this.paymentForm.reset();
    alert('Form Reset')
  }

  dataSet(){ 
    if(this.repa!= null && this.repa != undefined  ){
      this.payment.TotalNetAmount = this.repa?.QUOTE?.TotalNetAmount
      this.paymentviewlist=[];
      if(Array.isArray(this.repa?.PAYMENTLIST?.Payment))
      {
        for ( var item of this.repa?.PAYMENTLIST?.Payment)
        {
          this.paymentviewlist.push({
            "PaymentGuid":item.PaymentGuid,
            "AccountHolderName": item.AccountHolderName,
            "AccountNumber": item.AccountNumber,
            "Adjudication": item.Adjudication,
            "Amount": item.Amount,
            "AuthenticationNumber": item.AuthenticationNumber,
            "BankAccountNumber": item.BankAccountNumber,
            "BankCode": item.BankCode,
            "CardNumber": item.CardNumber,
            "ChequeNo": item.ChequeNo,
            "CardType": item.CardType,
            "CreatedBy": item.CreatedBy,
            "CreatedDate": item.CreatedDate,
            "ModeOfPayment": item.ModeOfPayment,
            "PaymentGUID": item.PaymentGUID,
            "TerminalId": item.TerminalId,
            "TranDate": item.TranDate,
            "TranType": item.TranType,
            "PaymentCode":item.PaymentCode,
            "PaymentDocType":item.PaymentDocType
         })
        }

      }
      else
      {
        if(!(this.repa?.PAYMENTLIST?.Payment == undefined || this.repa?.PAYMENTLIST?.Payment == null))
        {

            var lstpaymentviewlist=[];
            this.paymentviewlist=[];
            lstpaymentviewlist.push(this.repa?.PAYMENTLIST?.Payment);
            this.paymentviewlist.push({
                "AccountHolderName": lstpaymentviewlist[0]?.AccountHolderName,
                "AccountNumber": lstpaymentviewlist[0]?.AccountNumber,
                "Adjudication": lstpaymentviewlist[0]?.Adjudication,
                "Amount": lstpaymentviewlist[0]?.Amount,
                "AuthenticationNumber": lstpaymentviewlist[0]?.AuthenticationNumber,
                "BankAccountNumber": lstpaymentviewlist[0]?.BankAccountNumber,
                "BankCode": lstpaymentviewlist[0]?.BankCode,
                "CardNumber": lstpaymentviewlist[0]?.CardNumber,
                "CardType": lstpaymentviewlist[0]?.CardType,
                "CreatedBy": lstpaymentviewlist[0]?.CreatedBy,
                "CreatedDate": lstpaymentviewlist[0]?.CreatedDate,
                "ModeOfPayment": lstpaymentviewlist[0]?.ModeOfPayment,
                "PaymentGUID": lstpaymentviewlist[0]?.PaymentGUID,
                "TerminalId": lstpaymentviewlist[0]?.TerminalId,
                "TranDate": lstpaymentviewlist[0]?.TranDate,
                "TranType": lstpaymentviewlist[0]?.TranType,
                "PaymentCode":lstpaymentviewlist[0]?.PaymentCode
            })
          }
      }
       
      this.CalculatePaidAmount();
      this.PaymentLink = this.formBuilder.group({
        Payable: [this.payment.TotalNetAmount - this.PaidAmount ==undefined||this.PaidAmount==null ?0 :this.PaidAmount ]
      })
    }
    
  }
  setFunction(){
    this.MOPValue = this.paymentForm.controls["MOPayment"].value
    console.log("*" , this.paymentviewlist)
  }
 
  paymentData:any;
  async openAddPayment() {

    this.paymentData = {
      //To-DO CHANGE
      caseguid: this.repa.CaseGUID,
      locationcode:this.repa.LocationCode,
      customercode:this.repa.RetailCustomerCode,
      doctype:"RADV",
      caseid:this.repa.CaseId 
    }; 

    const modal = await this.modalController.create({
      component: AdvancePaymentPage,
      componentProps: {
        advanceObj: this.paymentData // Pass the item to the modal component
      }
    });
     await modal.present();
     let result= await modal.onDidDismiss() 
     console.log("After save adv payment = ",result)

     if(result.data == undefined || result.data == null)
     { 
     }
     else
     { 
       //value get from advancePayment-popup 
       this.PaymentEmit.emit(result.data.paymentSuccessObjt) 
     } 
  }
}
