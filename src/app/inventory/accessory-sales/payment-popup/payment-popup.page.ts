import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonModal, ModalController, NavParams } from '@ionic/angular';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import * as glob from "../../../config/global";

@Component({
  selector: 'app-payment-popup',
  templateUrl: './payment-popup.page.html',
  styleUrls: ['./payment-popup.page.scss'],
})
export class PaymentPopupPage implements OnInit {

  constructor(private navParams: NavParams, 
              private modalController: ModalController,
              private dynamicService:DynamicService) { }

  modePayment:any
  @Input() modal!: IonModal;

  Amount:any;

  @Input()modeofpayment;

  
  @Output() close = new EventEmitter<boolean>();
  @Output() paymentObj = new EventEmitter<any>();

  // -----------------
  previousRecordsFound:boolean = false
  newJioPayPayment:boolean = false;
  isJioPayBtn:boolean = true;
  typeSelected = 'ball-clip-rotate';
  paymentDetailArray: any[] = [];
  AccountHolderName: string = '';
  BankCode: string = '';
  BankAccountNo: string = '';
  ChequeNo: string = '';
  AccountNo: string = '';
  AuthNo: string = '';
  CardTypeData: string = '';
  CardNo: string = '';
  Adjudication: string = '';
  TerminalId: string = '';
  UTR: string = '';
  edcMachineObject :any[] = [];
  edcMachineName:string = ''
  selectedPreviousTransaction:string = ''
  locationData: string = '';
  customerCode:string = '';
  caseGUID: any;
  errorMessage: string = '';
  customerAdvanceAmount:number = 0;
  transactionNumber: string = '';
  customerObject: any[] = [];
  alreadyAcceptedPayment: any[] = []
  isNewPayment:boolean=false;
  CardType: any = ['Visa', 'Master Card','Rupay','Diner']
  isPinelabsBtn:boolean=true;
  previousEDCPaymentRecords: any[] = [];
  previousJIOPaymentRecords: any[] = [];
  previousJIOPayRecordsFound: boolean = false;
  paymentType:string='';
  //------------------

   // Refund Advance Options
   AmountToBeRefunded: number

   //object from accessory-sales
   paymentObject:any;

  ngOnInit() 
  {
   
    //Fetch data from button  
    this.modePayment= this.navParams.get('data');

    this.paymentObject=this.navParams.get('modeofpayment') 

    // --
    this.paymentType=this.paymentObject.modeofPayment 
    this.Amount = this.paymentObject.totalAmount 
    this.AmountToBeRefunded = this.Amount
    this.locationData = this.paymentObject.locationCode
    this.customerCode = this.paymentObject.customerCode
    this.alreadyAcceptedPayment = this.paymentObject.acceptedPayment;
    this.caseGUID = this.paymentObject.caseGUID
    this.customerAdvanceAmount = this.paymentObject.advanceAmount
    this.getData()

    //--
    
     //this.paymentType=this.modeofpayment[0].modeofPayment
    // this.Amount = this.modeofpayment[0].totalAmount
    // this.AmountToBeRefunded = this.Amount
    // this.locationData = this.modeofpayment[0].locationCode
    // this.customerCode = this.modeofpayment[0].customerCode
    // this.alreadyAcceptedPayment = this.modeofpayment[0].acceptedPayment;
    // this.getData()
    // this.caseGUID = this.modeofpayment[0].caseGUID
    // this.customerAdvanceAmount = this.modeofpayment[0].advanceAmount
  }


  newJioPayment()
  {
    this.newJioPayPayment=true
    this.isJioPayBtn=false
    this.previousJIOPayRecordsFound = false
  }

  addJioPreviousPayment()
  {
    for(let item of this.alreadyAcceptedPayment)
    {
      if(item.JioPayTxnRefNo != null && item.JioPayTxnRefNo != undefined && item.JioPayTxnRefNo != '')
      {
        if(item.JioPayTxnRefNo == this.transactionNumber)
        {
         alert("This payment has been already added, kindly select a different transaction")
          return false
        }
      }
    }
    for(let item of this.previousJIOPaymentRecords)
    {
      if(item.transactionRefNumber == this.transactionNumber)
      {
        alert("JIOPAYMENT SUCCESS")
          this.paymentDetailArray = []
          this.paymentDetailArray.push({
            "NEWPAYMENT": 1,
            "TranType": "Payment",
            "TranDate": new Date().toString(),
            "Amount": item?.Amount == null || item?.Amount == undefined ? 0.00 : item?.Amount,
            "ModeOfPayment": this.paymentType,
            "AccountNumber": this.AccountNo,
            "AuthenticationNumber": this.AuthNo,
            "JioPayTxnRefNo":this.transactionNumber,
            "CardType": this.CardTypeData,
            "CardNumber": this.CardNo,
            "EDCMachineType":'',
            "EDCMachineReferenceID":'',
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
          this.modeofpayment =  
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
          this.paymentObj.emit(this.paymentDetailArray[0])
         // this.closePopUp()
          return true;
      }
    }
    return false;
  }

  getPreviousJioaymentObj4Customer()
  {
   // this.ngxSpinnerService.show()
    let requestData = [];
    requestData.push({
      Key: "ApiType",
      Value: "GetJiopayPreviousPayment4Invoice",
    });
    requestData.push({
      Key: "CompanyCode",
      Value: glob.getCompanyCode()
    });
    requestData.push({
      Key: "CustomerCode",
      Value: this.customerCode
    });
    requestData.push({
      Key: "LocationCode",
      Value: this.locationData
    });
    requestData.push({
      Key: "IsConsumed",
      Value: 0
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      content: strRequestData,
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
      next: (Value) => {
      //  this.ngxSpinnerService.hide()
        let response = JSON.parse(Value.toString());
        if (response.ReturnCode == "0") 
        {
          console.log(response)
          let recordsObj = JSON.parse(response?.ExtraData)
          if(recordsObj.Totalrecords != "0")
          {
            this.previousJIOPayRecordsFound = true
            let data = JSON.parse(response.ExtraData)?.JobPaymentLink?.JobSucessObj;
           alert("Records found");
            if(data != null && data != undefined)
            {
              if(Array.isArray(data))
              {
                this.previousJIOPaymentRecords = data
              }
              else
              {
                this.previousJIOPaymentRecords.push(data)
              }
              this.previousJIOPaymentRecords.forEach(item =>{
                if(item.Amount != "0" && item.Amount != '' && item.Amount != null && item.Amount != undefined)
                {
                  item.Amount = parseFloat(item.Amount)/100
                }
              })
            }
          }
          else
          {
          alert("No Previous Transacation Found")
            return;
          }
        } 
        else {
          console.log("error",response);
        }
      },
      error: (err) => {
       // this.ngxSpinnerService.hide()
        console.log(err);
      },
    });
  }


  getData() { 
    let requestData = [];
    requestData.push({
      Key: "ApiType",
      Value: "GetRtlCustomerObject",
    });
    requestData.push({
      Key: "CompanyCode",
      Value: glob.getCompanyCode(),
    });
    requestData.push({
      Key: "CustomerCode",
      Value: this.customerCode,
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      content: strRequestData,
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
      next: (Value) => {
        let response = JSON.parse(Value.toString());
        if (response.ReturnCode == "0") {
          let data = JSON.parse(response.ExtraData)?.Customer;
          if(Array.isArray(data))
          {
            this.customerObject = data
          }
          else
          {
            this.customerObject.push(data)
          }
        } 
        else {
          console.log("error");
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

paymentListArray: any[] = [];

  validatePayment()
  {
  //  alert(this.paymentObject.totalAmount)
  // Cash-> alert(this.modePayment.paymentType)
    if (this.Amount == null || this.Amount == undefined || this.Amount == 0) {
      alert("Payment Amount cannot be zero!")
      return false;
    }
    if (this.Amount < 1) {
     alert("Payment Amount cannot be less than 1 ")
      return false;
    }
    if(this.Amount > this.paymentObject.totalAmount)
    {
      alert("Amount cannot be greater than the total payable amount")
      return false;
    }

    else if (this.modePayment.paymentType == 'Cash')
    {
      if(this.Amount == null || this.Amount == undefined || this.Amount == 0)
      {
        alert("Amount cannot be 0")
        return false;
      }
      else
      { 
        this.paymentDetailArray = []=[]

        this.paymentListArray=[]
        this.paymentDetailArray.push({
          "NEWPAYMENT": 1,
          "TranType": "Payment",
          "TranDate": new Date().toString(),
          "Amount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
          "ModeOfPayment": this.modePayment.paymentType,
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
        this.modeofpayment =  
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
        this.paymentObj.emit(this.paymentDetailArray[0]) 
        this.modalController.dismiss({
          paymentDetailArray: this.paymentDetailArray[0]
        });
       // this.dismissModal()
        return true;
      }
    }
    else if (this.modePayment.paymentType == 'NEFT/RTGS') {
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
        this.paymentDetailArray = []=[]
        this.paymentListArray=[]
        this.paymentDetailArray.push({
          "NEWPAYMENT": 1,
          "TranType": "Payment",
          "TranDate": new Date().toString(),
          "Amount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
          "ModeOfPayment": this.modePayment.paymentType,
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
        this.modeofpayment =  
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
        this.paymentObj.emit(this.paymentDetailArray[0])

        this.modalController.dismiss({
          paymentDetailArray: this.paymentDetailArray[0]
        }); 
        //this.dismissModal()
        return true;
      }
    }
  

    else if (this.modePayment.paymentType == 'Cheque') {
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
        this.paymentDetailArray = []
        this.paymentDetailArray.push({
          "NEWPAYMENT": 1,
          "TranType": "Payment",
          "TranDate": new Date().toString(),
          "Amount": this.Amount == null || this.Amount == undefined ? 0.00 : this.Amount,
          "ModeOfPayment": this.modePayment.paymentType,
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
        this.modeofpayment =  
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
        this.paymentObj.emit(this.paymentDetailArray[0])
        this.modalController.dismiss({
          paymentDetailArray: this.paymentDetailArray[0]
        });
      //  this.closePopUp()
        return true;
      }
    }
    return true
  }

  // async dismissModal() {
  //   // await this.modalController.dismiss();
  //   this.modalController.dismiss({
  //   //  paymentDetailArray: this.paymentListArray
  //   });
  // }
}
