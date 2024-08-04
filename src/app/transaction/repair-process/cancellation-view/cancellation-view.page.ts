import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as glob from "../../../config/global";
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { CaseDetail } from '../repair-process.metadata';
import { Observable } from 'rxjs';
import { NavParams } from '@ionic/angular'; 
@Component({
  selector: 'app-cancellation-view',
  templateUrl: './cancellation-view.page.html',
  styleUrls: ['./cancellation-view.page.scss'],
})
export class CancellationViewPage implements OnInit {

  constructor(
    private dynamicService:DynamicService, 
    private activatedRoute: ActivatedRoute,
    private navParams: NavParams,
    private router: Router,



  ) { }

  
  caseGUID:any;
  objCaseDetail: CaseDetail;
  objCaseDetailObServable: Observable<CaseDetail>;

  hidePopup: boolean = true
  hideConfirmpopUp: boolean = true;
  isApprove: boolean = false
  hideCancelpopup:boolean=true;

  CustomerConfirmationNotes:any;

//  @Input() repa;
  repa:any;

  CancelFlag:any;

  //Boolean for show RP
  isShowQuote:boolean=false;
  isShowRepairParts:boolean=false;
  isShowInvoice:boolean=false;
  isShowNotes:boolean=false; 
  isShowRFP:boolean=false;

  ngOnInit() {  
    if (this.router.getCurrentNavigation().extras.state) {
      this.repa = this.router.getCurrentNavigation().extras.state; 
    }


    this.repa = this.navParams.get('objCaseDetail');  
    console.log("Repa check",this.repa)

    this.caseGUID = this.repa.CaseGUID  
    alert(this.caseGUID )
    this.getRepair(); 
    this.getApprovalSettingDetailObject() 
  }

  ngOnChanges(changes: SimpleChanges): void{
    if(changes['repa']){
      this.caseGUID = this.repa.CaseGUID   
      this.getRepair();
      this.getApprovalSettingDetailObject()
    }
  }

  async getApprovalSettingDetailObject() {  
 


    let requestData = []
    requestData.push({
      "Key": "ApiType",
      "Value": "GetApprovalSettingDetailObject"
    })
    requestData.push({
      "Key": "LocationCode",
      "Value": this.repa.LocationCode // this.Location 
    })
    requestData.push({
      "Key": "ApprovalProcess",
      "Value": "JobCancel"
    })
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    };
    let userName = localStorage.getItem(glob.GLOBALVARIABLE.USERNAME);

    console.log("Before Approval Sp", userName)
    // console.log("Before Approval Sp", requestData)
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (value) => {
          let response = JSON.parse(value.toString());
           console.log("Approval Object Response", response)
          if (response.ReturnCode == '0') { 
            let userName = localStorage.getItem(glob.GLOBALVARIABLE.USERNAME);
            let extraDataResponse = JSON.parse(response?.ExtraData); 
            console.log("extraDataResponse==",extraDataResponse)
            if (extraDataResponse?.ApprovalSettingDetail?.ApprovalPerson == userName ) {    
              if ( extraDataResponse?.ApprovalSettingDetail?.ApprovalLevel == 'L1') {
        
                this.repa.JobStatus == 'S15' ?  this.isApprove = true :  this.isApprove = false
              alert("Approver Manager Access") 
               
              } 
              // else if ( extraDataResponse?.ApprovalSettingDetail?.ApprovalLevel == 'L2') {
              //   // this.isApproverL2 = true
              //   this.SalesReturnStatusL2 == 'SENT FOR APPROVAL' ? this.isnotApprover = false : this.isnotApprover = true
              //   // this.toastMessage.success("Cluster Manager Access")
              //   this.isApproverL2 = true
              // }
            }
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


  reapairList:any[]=[]
  notesList:any[]=[]
  invoiceList:any[]=[]
  quoteList:any[]=[]
  RFPList:any[]=[];

  getRepair() { 
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetJobObject"
    });
    requestData.push({
      "Key": "CaseGUID",
      "Value": this.caseGUID,
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
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
        next: (Value) => {
          let response = JSON.parse(Value.toString());
          if (response.ReturnCode == '0') {
            response['ExtraDataJSON'] = JSON.parse(response.ExtraData);
            this.objCaseDetailObServable = response['ExtraDataJSON'];
            this.objCaseDetail = response['ExtraDataJSON']; 
 
            this.objCaseDetail = Object.assign({}, this.objCaseDetail); 

            //Repair List
            if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
            {    
              if(this.objCaseDetail?.REPAIR?.REPAIRLIST?.REPAIRDETAIL != null || this.objCaseDetail?.REPAIR?.REPAIRLIST?.REPAIRDETAIL != undefined )
              {
                this.isShowRepairParts=true;

                  if (Array.isArray(this.objCaseDetail.REPAIR.REPAIRLIST.REPAIRDETAIL)) 
                  { 
                    for (let item of this.objCaseDetail.REPAIR.REPAIRLIST.REPAIRDETAIL) 
                    { 
                      this.reapairList=item 
                    }
                  }
                  else 
                  { 
                    this.reapairList.push(this.objCaseDetail.REPAIR.REPAIRLIST.REPAIRDETAIL)
                  }    
                }    
            }

            //Quote
            if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
            {    
              if(this.objCaseDetail?.QUOTE?.QUOTEDETAILS.QuoteItem != null || this.objCaseDetail?.QUOTE?.QUOTEDETAILS.QuoteItem != undefined )
              {
                this.isShowQuote=true

                if (Array.isArray(this.objCaseDetail?.QUOTE?.QUOTEDETAILS)) 
                {  
                  for (let item of this.objCaseDetail?.QUOTE?.QUOTEDETAILS.QuoteItem) 
                  { 
                    this.quoteList=item 
                  }
                }
                else 
                {  
                  this.quoteList.push(this.objCaseDetail?.QUOTE.QUOTEDETAILS.QuoteItem)
                }           
              }
            }

            //Notes 
            if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
            {    
              if(this.objCaseDetail?.NOTESLIST?.Notes != null || this.objCaseDetail?.NOTESLIST?.Notes != undefined )
              {
                this.isShowNotes = true
                if (Array.isArray(this.objCaseDetail?.NOTESLIST?.Notes)) 
                {  
                  for (let item of this.objCaseDetail?.NOTESLIST?.Notes) 
                  { 
                    this.notesList=item 
                  }
                }
                else 
                {  
                  this.notesList.push(this.objCaseDetail?.NOTESLIST.Notes)
                }           
              }
            }

            // Invoice 
            if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
            {    
              if(this.objCaseDetail?.INVOICE?.INVOICEDETAILS?.InvoiceItem != null || this.objCaseDetail?.INVOICE?.INVOICEDETAILS?.InvoiceItem != undefined )
              {
                this.isShowInvoice=true;

                if (Array.isArray(this.objCaseDetail?.INVOICE?.INVOICEDETAILS?.InvoiceItem)) 
                {  
                  for (let item of this.objCaseDetail?.INVOICE?.INVOICEDETAILS?.InvoiceItem) 
                  { 
                    this.invoiceList=item 
                  }
                }
                else 
                {  
                  this.invoiceList.push(this.objCaseDetail?.INVOICE?.INVOICEDETAILS?.InvoiceItem)
                }           
              }
            }

            //RFP
            if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
            {    
              if(this.objCaseDetail.RFP  != null || this.objCaseDetail.RFP != undefined )
              {
                this.isShowRFP=true;

                if (Array.isArray(this.objCaseDetail.RFP)) 
                {  
                  for (let item of this.objCaseDetail.RFP) 
                  { 
                    this.RFPList=item 
                  }
                }
                else 
                {  
                  this.RFPList.push(this.objCaseDetail.RFP)
                }           
              }
            }
          
            // this.FlagCheck(); 
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }  

//Confirm cancel function
SubmitRequest(valueCheck)
  { 
    if(valueCheck == 'cancel')
    {
      this.CancelFlag=0
    }
    if(valueCheck == 'approve')
    {
      this.CancelFlag=1
    }
     

     // this.ngxSpinnerService.show() 
      let requestData = [];
      requestData.push({
        "Key": "ApiType",
        "Value": "SaveCancellationRequest"
      })
  
      requestData.push({
        "Key": "CancellationGUID",
        "Value": this.repa.JOBCancellationRequest.CancellationGUID
      })
  
      requestData.push({
        "Key": "CancelFlag",
        "Value": this.CancelFlag
      })
 
      requestData.push({
        "Key": "CustomerConfirmationNotes",
        "Value": this.CustomerConfirmationNotes
      })
  
  
      requestData.push({
        "Key": "CaseGUID",
        "Value": this.repa.CaseGUID
      })

      requestData.push({
        "Key": "CancellationReason",
        "Value": this.repa.JOBCancellationRequest.CancellationReason
      })
   
 
      let strRequestData = JSON.stringify(requestData);
      let contentRequest = {
        "content": strRequestData
      }; 

      this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
        {
 
          next: (value) => {
            debugger
            let response = JSON.parse(value.toString());
            if (response.ReturnCode == '0') {
            alert("Successfully Updated")

              if(valueCheck == 'cancel')
              {
                this.CloseCancelpopUp()
              }
              if(valueCheck == 'approve')
              {
                 this.closeConfirmPopUp()
              }
       
            //  this.ngxSpinnerService.hide();
            }
            else {
              // this.errorMessage = response.ReturnMessage;
           alert(response.ReturnMessage)
            }
          },
          error: err => {
            debugger
            console.log(err);
          //  this.ngxSpinnerService.hide();
          }
        }); 
  
  }


  

  Confirm()
  {
    this.hideConfirmpopUp=false 
  }
  closeConfirmPopUp()
  {
    this.hideConfirmpopUp=true

  }


  Cancel()
  {
    this.hideCancelpopup=false
  }

  CloseCancelpopUp()
  {
    this.hideCancelpopup=true

  }
 
}
