import { ChangeDetectorRef, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { CaseDetail } from './repair-process.metadata';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { QuoteViewPage } from './quote-view/quote-view.page';
import { RepairViewPage } from './repair-view/repair-view.page';
import { InspectionPage } from './inspection/inspection.page';
import { CancellationViewPage } from './cancellation-view/cancellation-view.page';
import * as glob from "../../config/global";
import { CancellationRequestPage } from './pop-up/cancellation-request/cancellation-request.page';
import { JobVerificationPage } from './job-verification/job-verification.page';

@Component({
  selector: 'app-repair-process',
  templateUrl: './repair-process.page.html',
  styleUrls: ['./repair-process.page.scss'],
})
export class RepairProcessPage implements OnInit {

  constructor(
              private router: Router,
              private dynamicService: DynamicService,
              private cdr: ChangeDetectorRef,
              private actionSheetCtrl: ActionSheetController,
              private modalCtrl: ModalController,
              private navController: NavController
              ) { }

              presentingElement = undefined;

              private canDismissOverride = false;

   //Boolean for show RP
   isShowQuote:boolean=false;
   isShowRepairParts:boolean=false;
   isShowInvoice:boolean=false;
   isShowNotes:boolean=false; 
   isShowRFP:boolean=false;     
   isShowPayment:boolean=false;


   reapairList:any[]=[]
   notesList:any[]=[]
   invoiceList:any[]=[]
   quoteList:any[]=[]
   RFPList:any[]=[];
   paymentList:any[]=[];
 

  //dynamic back url
  dynamicBack='Menu/job-detail'        
  hidePopup: boolean = true
  hideConfirmpopUp: boolean = true;
  isApprove: boolean = false
  hideCancelpopup:boolean=true;    

  caseGUID:any

  objCaseDetailObServable: Observable<CaseDetail>; 
  objCaseDetail: CaseDetail;
  laborCover;
  partCover: string;
  isstatusShow;

  @ViewChild(QuoteViewPage) callingFunction: QuoteViewPage
  @ViewChild(RepairViewPage) repairView: RepairViewPage;
  @ViewChild(JobVerificationPage) JobVerification: JobVerificationPage;

  // Boolean
  isAllEventPop:boolean = false;
  loadDiag: boolean;
  isRotated = false;
  isCustomerShow =false;
  customerdetails: boolean;

  DiagIndexNo: number ;
  NotesIndexNo: number ;
  QuestionIndexNo: number ;
  QuoteIndexNo: number ;
  PaymentIndexNo: number ;
  InvoiceIndexNo: number ;
  RepairIndexNo: number;
  RFPIndexNo: number ;
  HandOverIndexNo: number

   //pop flags
   isOpenPanelDetails: boolean = false
   isDetails: boolean = true
   isDiagnosisPop: boolean = false;
   isQoutePop: boolean = false;
   isPartRequestPop: boolean = false;
   isRepairPop: boolean = false;
   isNotesPop: boolean = false;
   isInvoisePop: boolean = false;
   isReadyToPickup: boolean = false;
   isGIDMAP:boolean = false;
   isPaymentPickup: boolean = false;
   isComponentIssuesPop: boolean = false;
   isAssignTechPop: boolean = false;
   isRepairViewComponentIssues: boolean = false;
   isDivShow: boolean = false;
   isToShowFeedBack = false;
   isHandOver: boolean = true;
   isNotesListOpen: boolean = false;
  //  customerdetails: boolean;
   casedetails: boolean = true;
   showLoaner:boolean = false

  isDiagSliderButtonStatus= ''
  isQuoteSliderButtonStatus= ''
  isRepairSliderButtonStatus= ''
  isNotesSliderButtonStatus= ''
  isPaymentSliderButtonStatus= ''
  isRFPSliderButtonStatus= ''
  isCallCloseSliderButtonStatus= ''

  //--All Show & Hide Flag--// 
  isJobVerificationShow:boolean = false
  isRFPButton: boolean = true;
  isHandoverButton: boolean = true;
  isDiagShow: boolean = false;
  isNoteShow: boolean = false;
  isQuestionShow: boolean = false;
  isQuoteShow: boolean = false;
  isPaymentShow: boolean = false;
  isInvoiceShow: boolean = false;
  isRepairShow: boolean = false;
  isRFPShow: boolean = false;
  isHandOverShow: boolean = false;
  isImageUpload: boolean = false;
  isSignature: boolean = false;
  isRejectReason: boolean = false;
  isOtpVerification: boolean = false;
  isCommunicationPopup : boolean = false;
  isCommunicationDetailPopup: boolean = false;
  isInspectionShow:boolean=false;
  isVerificationShow:boolean=false;
  handoverbtn:boolean=true;
  isReadyToPickupShow:boolean=false;

  isNotesShow: boolean = false;

  // -------------------------- //

  
  repairButton: boolean = true;
  quoteButton : boolean = true; 
  @ViewChild('popover') popover;

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  ngOnInit() { 
    this.presentingElement = document.querySelector('.ion-page');

    if (this.router.getCurrentNavigation().extras.state) {
      this.caseGUID = this.router.getCurrentNavigation().extras.state;
    } 
    this.getRepair();
    this.checkProfilePermission();
    //this.FlagCheck()
  }

  ngOnChanges(changes: SimpleChanges): void{
    if(changes['objCaseDetail']){
      this.ButtonCheck();
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
      "Value": this.objCaseDetail.LocationCode // this.Location 
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
        
                this.objCaseDetail.JobStatus == 'S15' ?  this.isApprove = true :  this.isApprove = false
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




  onDismissChange(canDismiss) {  
    // Allows the modal to be dismissed based on the state of the checkbox
    this.canDismissOverride = canDismiss;
  }

  onWillPresent() {
    // Resets the override when the modal is presented
    this.canDismissOverride = false;
  }


  // canDismiss = async () => {
  //   if (this.canDismissOverride) {
  //     // Checks for the override flag to return early if we can dismiss the overlay immediately
  //     return true;
  //   }

  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Are you sure?',
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         role: 'confirm',
  //       },
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //       },
  //     ],
  //   });

  //   actionSheet.present();

  //   const { role } = await actionSheet.onWillDismiss();

  //   return role === 'confirm';
  // };



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
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
    debugger
        
          let response = JSON.parse(Value.toString());
          if (response.ReturnCode == '0') {
            response['ExtraDataJSON'] = JSON.parse(response.ExtraData);
            this.objCaseDetailObServable = response['ExtraDataJSON'];
            this.objCaseDetail = response['ExtraDataJSON']; 
            if(this.objCaseDetail?.ProductType == "SERIALIZED")
            {
              this.isAllEventPop = true;
            }
            this.objCaseDetail = Object.assign({}, this.objCaseDetail);
            this.loadDiag = true;
            console.log("Repa Original *************** ", this.objCaseDetail)
           // this.displayView( this.objCaseDetail)
            this.getApprovalSettingDetailObject()
            this.FlagCheck()

            if(this.objCaseDetail?.PAYMENTLIST?.Payment  != null || this.objCaseDetail?.PAYMENTLIST?.Payment != undefined )
              {
                this.isShowPayment=true;
              }


          }
        },
        error: err => {
    debugger

          console.log(err);
        }
      }
    );

   
  }
checkverification:boolean ;

  FlagCheck() {
     
    if (this.objCaseDetail.AssignTechFlag == 0) {
    alert("Assign Technician First")
      this.isJobVerificationShow = false
      this.isHandOverShow = false
      this.CustomerDetails();
    }

    if (this.objCaseDetail.AssignTechFlag == 1) {
      this.isOpenPanelDetails = false;
      this.isDetails = true;
    }

    if (this.objCaseDetail.JobTypePermissions.PVRequired == "1" && this.objCaseDetail.AssignTechFlag == 1) 
      {
      this.isJobVerificationShow = true 

      if (this.objCaseDetail.JOBVerification == null || this.objCaseDetail.JOBVerification == undefined) {
        this.isJobVerificationShow = true
      }
      else {
        if (this.objCaseDetail?.JOBVerification?.PVStatus == 'Approved') {
          this.isInspectionShow = true
          this.checkverification=true
        }
        else if (this.objCaseDetail?.JOBVerification?.PVStatus == 'Rejected') {
          this.checkverification=true
          this.isInspectionShow = false
          this.isRepairShow = false
          this.isQuoteShow = false
          this.isHandOverShow = true

        }
        else {
          this.isInspectionShow = false
          this.isQuoteShow = false
          this.isNotesShow = false
          this.isRepairShow = false
        }
      }

    }
    else {
      this.isJobVerificationShow = false
      if (this.objCaseDetail.AssignTechFlag == 1) {
        this.isInspectionShow = true;
      }

      this.isQuoteShow = false
      this.isNotesShow = false
      this.isRepairShow = false
    }


    if (this.objCaseDetail?.DiagFlag == "1") {
      this.isRepairShow = true
      if (this.objCaseDetail?.DIAG?.BillableRepair == 1) {
        this.isQuoteShow = true
        this.isPaymentShow = true
        this.isInvoiceShow = true
      }
      else {
        this.isQuoteShow = false
        this.isPaymentShow = false
        this.isInvoiceShow = false
      }

      if (this.objCaseDetail?.DIAG?.RepairType == "SVNR") 
        {
        this.isRepairShow = false
        this.isReadyToPickupShow = true
      
        if (this.objCaseDetail.JobTypePermissions?.JobCategory != "CARRYIN") {
          this.isHandOverShow = true
        }
        else { 
            this.isHandOverShow = true
          }
        
      }
    }
    var repairstatuslist = []
    if (Array.isArray(this.objCaseDetail?.REPAIR?.REPAIRSTATUSLIST?.REPAIRSTATUS)) {
      repairstatuslist = this.objCaseDetail.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS
      // for (let item of this.repa.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS ) {
      //   // this.SetRepairtObject(item)
      // }
    }
    else {
      repairstatuslist = this.objCaseDetail?.REPAIR?.REPAIRSTATUSLIST?.REPAIRSTATUS
      // this.SetRepairtObject(this.repa.REPAIR?.REPAIRSTATUSLIST.REPAIRSTATUS )
    }


    if (repairstatuslist[0].RepairStage == "COMPLETED") {
      if (this.objCaseDetail.HandoverFlag == "1") {
        this.isHandOverShow = true
      }
      if (this.objCaseDetail.JobTypePermissions?.JobCategory != "CARRYIN") {
        this.isHandOverShow = true
      }
      else { 
          this.isHandOverShow = true
    
       
      }
    }

  
      if (this.objCaseDetail.JobTypePermissions?.JobCategory != "CARRYIN") {
        this.isReadyToPickupShow = false
        this.isHandOverShow = true
      }
 
  }
 
   

 

  ChangeFlageStatus(){
    if(this.objCaseDetail?.AssignTechFlag == null || this.objCaseDetail?.AssignTechFlag == undefined || this.objCaseDetail?.AssignTechFlag == 0 ){
      this.isstatusShow="Assign Technician First";
   }
    else if(this.objCaseDetail?.DiagFlag == null ||this.objCaseDetail?.DiagFlag == undefined || this.objCaseDetail?.DiagFlag == 0 || this.objCaseDetail?.DIAG?.DiagnosisStatus == 'OPEN' ){
      this.isstatusShow="Completed Diagnosis";
    }else if(this.objCaseDetail?.DIAG?.DiagnosisStatus != 'RELEASED' && this.objCaseDetail?.DIAG?.BillableRepair != 1 && this.objCaseDetail?.QUOTE?.quoteFlag != null && this.objCaseDetail?.QUOTE?.quoteFlag != undefined ){
      this.isstatusShow="Create Quote";
    }
    else if( this.objCaseDetail?.QUOTE?.QuoteStatus == 'OPEN' ){
      this.isstatusShow="Release Quote";
    }else if(this.objCaseDetail?.QUOTE?.QuoteStatus == 'RELEASED' ){
      this.isstatusShow="Check For Payment";
    }else if(this.objCaseDetail?.QUOTE?.QuoteStatus == 'APPROVED' ){
      this.isstatusShow="Create Payment";
    }else if(this.objCaseDetail?.QUOTE?.QuoteStatus == 'REJECTED' ){
      this.isstatusShow="Create Invoice";
    }
    else if(this.objCaseDetail?.DIAG?.BillableRepair == 0  ){
      this.isstatusShow="Complete Repair";
    }
    
  
  }


  CustomerDetails(){
    if (this.isOpenPanelDetails == true) {
      this.isOpenPanelDetails = false;
      this.isDetails = true;
    } else {
      this.isOpenPanelDetails = true;
      this.isDetails = false;
    }
  }
  

  assignTechFlagSet($event){

    this.objCaseDetail.AssignTechFlag = 1;
    this.objCaseDetail.AssignTechGUID = $event.AssignTechGUID;
    this.objCaseDetail.ASGTECH=$event;
    this.isAssignTechPop=false;
  
    this.FlagCheck()
  }

  DiagUpdated($event){

    var objDiag = $event;
    let DiagsnosisGUID = objDiag.DiagsnosisGUID;
    this.objCaseDetail.DiagFlag=1
    this.objCaseDetail.DiagGUID=DiagsnosisGUID
    this.objCaseDetail.DIAG={...$event};
    this.objCaseDetail = Object.assign({}, this.objCaseDetail);
    this.FlagCheck()
  
  }

  sliderButtonStatus(){
  
    if(this.objCaseDetail?.DIAG?.DiagnosisStatus == 'RELEASED'){
      this.isDiagSliderButtonStatus = '#29ba30' //green
    }else if(this.objCaseDetail?.DIAG?.DiagnosisStatus == 'OPEN'){
      this.isDiagSliderButtonStatus = '#4860fa' //blue
    }
  
    if(this.objCaseDetail?.QUOTE?.QuoteStatus == null || this.objCaseDetail?.QUOTE?.QuoteStatus == undefined || this.objCaseDetail?.QUOTE?.QuoteStatus == 'Open' || this.objCaseDetail?.QUOTE?.QuoteStatus == 'RELEASED'){
      this.isQuoteSliderButtonStatus = '#4860fa' //blue
    }else if(this.objCaseDetail?.QUOTE?.QuoteStatus == 'APPROVED'){
      this.isQuoteSliderButtonStatus = '#29ba30' //green
    }else if(this.objCaseDetail?.QUOTE?.QuoteStatus == 'REJECTED'){
      this.isQuoteSliderButtonStatus = '#fa3434'  //red
    }
  
    if(this.objCaseDetail?.NOTESLIST == null || this.objCaseDetail?.NOTESLIST == undefined){
      this.isNotesSliderButtonStatus = '#4860fa'  //blue
    }else{
      this.isNotesSliderButtonStatus = '#29ba30' //green
    }
  
    if(this.objCaseDetail?.REPAIR?.isGSXPosted == '1'){
      this.isRepairSliderButtonStatus = '#49ff24'  //green
    }else if(this.objCaseDetail?.REPAIR?.isGSXPosted == null || this.objCaseDetail?.REPAIR?.isGSXPosted == undefined){
      this.isRepairSliderButtonStatus = ''
    }
  }
  showDetails() {
    this.isRotated = !this.isRotated;
    this.isCustomerShow =!this.isCustomerShow
  }



  ButtonCheck(){
    if(this.objCaseDetail?.repairPartList?.length <= 0 || this.objCaseDetail.RepairFlag == 1){
      this.repairButton = false;
    }
  }

  isHandover:boolean=false
  isDiagnosis:boolean=false
  isAllEvent:boolean=false
  isQuote:boolean=false
  isNotes:boolean=false
  isRepair:boolean=false
  isLoaner:boolean=false
  isVerification:boolean=false
  isFeedback:boolean=false
  isPayment:boolean=false
  isInvoice:boolean=false
  isRFP:boolean=false

  openRepairTap(type)
  {
    if(type == 'handover')
    {
      this.isHandover=true 
    }

    if(type == 'Diagnosis')
    {
      this.isDiagnosis=true 
    }

    if(type == 'AllEvent')
    {
      this.isAllEvent=true 
    }

    if(type == 'Invoice')
    {
      this.isInvoice=true 
    }

    if(type == 'RFP')
    {
      this.isRFP=true 
    }

    if(type == 'Payment')
    {
      this.isPayment=true 
    }

    if(type == 'Quote')
    {
      this.isQuote=true 
    }

    if(type == 'Notes')
    {
      this.isNotes=true 
    }

    if(type == 'Repair')
    {
      this.isRepair=true 
    }

    if(type == 'Loaner')
    {
      this.isLoaner=true 
    }
    if(type == 'Verification')
    {
      this.isVerification=true 
    }
    if(type == 'Feedback')
    {
      this.isFeedback=true 
    }

  }


  // Quote --

  quotePartList: any[];
  quoteFormClose(selectedpart) {
    this.quotePartList = selectedpart;
    this.isQoutePop = false;
  }

  AllSelectedQoute:any[]=[];
  isQuoteview:boolean=true;
  selectedQuoteList(event){
   this.AllSelectedQoute = event;
   this.isQuoteview=false;
   this.callingFunction.GetQuotePart();
 }





verificationStatus:any;
//emit from job verification
 jobVerificationStatus(event)
 { 
  this.verificationStatus=event
 }

//Save job verification(footer)
 OnSubmitStatus()
 { 
   this.JobVerification.OnSubmit(this.verificationStatus)
 }


 
isShowRejectReason:boolean=false
SaveReject(event)
{
  this.JobVerification.OnSubmit(event)
}

 OnSubmit(event)
 {
  
  this.JobVerification.OnSubmit(event)
 }

 setQuoteStatus($event){
  this.objCaseDetail.QUOTE.QuoteStatus = $event
  this.sliderButtonStatus()
  this.ChangeFlageStatus()
}
UpdateQuote($event){
  ''
  var objQuote = $event;
  let QuoteGUID = objQuote.QuoteGuid
  this.objCaseDetail.QuoteFlag = 1
  this.objCaseDetail.QuoteGUID = QuoteGUID
  this.objCaseDetail.QUOTE = null
  this.objCaseDetail.QUOTE = {...$event};
  this.objCaseDetail = Object.assign({}, this.objCaseDetail);

}


// REPAIR PARTS 

AddRepairParts(){
  console.log("Reapir ", this.objCaseDetail?.DIAG)
  if( this.objCaseDetail?.DIAG?.RepairType == 'CIN'){
    this.isRepairPop= true
  }
  else{
    alert("Can't Add Parts for Repair Type")
  }
}

OpenRepairParts(){
  if ( this.objCaseDetail.DiagFlag = 0 ){
    alert("Please Fill the Inspection Details, first!")
  }

  else{
    this.isRepairPop = true
  }
} 

inspectionVisible: boolean = false;
callInspection()
{ 
  this.inspectionVisible = true;
  this.router.navigate(['repair-process/inspection'], { state: { objCaseDetail: this.objCaseDetail } });
}

message = 'This modal example uses the modalController to present and dismiss modals.';

async openModal() {
  const modal = await this.modalCtrl.create({
    component: InspectionPage,
    componentProps: {
      // Pass any data you want to InspectionPage here
      // For example:
      repa: this.objCaseDetail
    }
  });
  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    this.message = `Hello, ${data}!`;
  }
}


InspectUpdated($event){ 
  var objDiag = $event;
  let DiagnosisGUID = objDiag.DiagnosisGUID;
  this.objCaseDetail.DiagFlag=1
  this.objCaseDetail.DiagGUID=DiagnosisGUID
  this.objCaseDetail.DIAG={...$event};
  this.objCaseDetail = Object.assign({}, this.objCaseDetail);
  this.FlagCheck()
  this.getRepair();
}


InvoiceEmitObj($event)
{  
  this.objCaseDetail.INVOICES = { ...$event }; 
  this.objCaseDetail = Object.assign({}, this.objCaseDetail); 
  this.getRepair();


}


PaymentEmitObj($event)
{ 
  console.log("PAYMENT===",$event)
  this.objCaseDetail.PAYMENTLIST = { ...$event }; 
  this.objCaseDetail = Object.assign({}, this.objCaseDetail); 
  this.getRepair();

}

HanOverUpdated($event){
  this.isOtpVerification = false
  this.objCaseDetail.HANDOVER={...$event};
  this.objCaseDetail = Object.assign({}, this.objCaseDetail);
  this.getRepair();
}

repairAttachment($event)
{ 
  this.objCaseDetail.JOBATTACHMENT.ATTACHMENT={...$event};
  this.objCaseDetail = Object.assign({}, this.objCaseDetail);
  this.getRepair();

}

JobVerificationUpdate($event)
{
  // this.modal.dismiss()
  this.objCaseDetail.JOBVerification={...$event};
  this.objCaseDetail = Object.assign({}, this.objCaseDetail); 
  console.log('FROM REPAIRPROCESS==',this.objCaseDetail)
  this.getRepair();

}

RepaUpdated($event)
{
  this.getRepair();

}

QuoteUpdated($event)
{  
   this.objCaseDetail.QUOTE={...$event};
  this.objCaseDetail = Object.assign({}, this.objCaseDetail); 
  this.getRepair();

}

RepairUpdated($event){  
  this.objCaseDetail.REPAIR={...$event};
  this.objCaseDetail = Object.assign({}, this.objCaseDetail);
  console.log('completed Object==',this.objCaseDetail)
  this.getRepair();
}


ContractEmitObj($event)
{
  this.objCaseDetail.INVOICE = { ...$event };
  this.objCaseDetail = Object.assign({}, this.objCaseDetail); 
  this.getRepair()
}

 //Repair Parts
 isPartOrderpop:boolean=false;

 call(event)
{
  this.isPartOrderpop = true;
}
ClosePartOrderPopUp(){
  this.isPartOrderpop = false;
}

SelectedPartFromRPV:String;

callChildFunction(item){
  this.SelectedPartFromRPV = item
  console.log("Repa Component",this.SelectedPartFromRPV)

}

GetSelectedDataFromPartOrder:any=[];
GetSelectedPartOrder(event){
  this.GetSelectedDataFromPartOrder = event;
  console.log("Get Data Repa partorder:",event);
}
  openComponentIssuePopup(event){
    this.isComponentIssuesPop = event;
  }
  
  isOtpCall(event)
  { 
    this.isOtpVerification=event;
  }

  isHandoverSubmitted($event)
  { 
    this.isOtpVerification=$event
  }


  onlyView:boolean
  pageUrl:any;

  checkProfilePermission() {
    let allPermision = JSON.parse(localStorage.getItem('UserPermission'));
    console.log("allPermision ", allPermision)
    let resp = allPermision.find(x => x.ModuleId == '91'); 
    if (resp?.Edit == false) {
      this.onlyView = true;
    }  
 
    return resp != undefined && resp?.Edit ? true : false;
  }
 

  async openCancelMethod(type) { 
    const modal = await this.modalCtrl.create({
      component: CancellationRequestPage, 
      componentProps: {
        type: type,
        objCaseDetail: this.objCaseDetail  
      }
    });
    await modal.present();
  }


  displayView(objCaseDetail)
  {  
                //Quote
                if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
                {     

                  if(this.objCaseDetail?.QUOTE?.QUOTEDETAILS?.QuoteItem != null || this.objCaseDetail?.QUOTE?.QUOTEDETAILS?.QuoteItem != undefined )
                  { 
                    this.isShowQuote=true
    
                    if (Array.isArray(this.objCaseDetail?.QUOTE?.QUOTEDETAILS?.QuoteItem)) 
                    {   
                        this.quoteList= this.objCaseDetail?.QUOTE?.QUOTEDETAILS?.QuoteItem  
                    }
                    else 
                    {    
                      this.quoteList.push(this.objCaseDetail?.QUOTE?.QUOTEDETAILS?.QuoteItem)
                    }           
                  }
                }

            //Repair List
            if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
            {    
              if(this.objCaseDetail?.REPAIR?.REPAIRLIST?.REPAIRDETAIL != null || this.objCaseDetail?.REPAIR?.REPAIRLIST?.REPAIRDETAIL != undefined )
              {
                this.isShowRepairParts=true;

                  if (Array.isArray(this.objCaseDetail?.REPAIR?.REPAIRLIST?.REPAIRDETAIL)) 
                  {  
                      this.reapairList= this.objCaseDetail?.REPAIR?.REPAIRLIST?.REPAIRDETAIL  
                  }
                  else 
                  { 
                    this.reapairList.push(this.objCaseDetail.REPAIR.REPAIRLIST.REPAIRDETAIL)
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
                     this.notesList=this.objCaseDetail?.NOTESLIST?.Notes  
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
                    this.invoiceList=this.objCaseDetail?.INVOICE?.INVOICEDETAILS?.InvoiceItem  
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
                       this.RFPList=this.objCaseDetail.RFP 
                  } 
                   else 
                   {  
                     this.RFPList.push(this.objCaseDetail.RFP)
                   }           
                 }
               }


               
               //Payment
               if (this.objCaseDetail != null && this.objCaseDetail != undefined) 
               {    
                 if(this.objCaseDetail?.PAYMENTLIST?.Payment  != null || this.objCaseDetail?.PAYMENTLIST?.Payment != undefined )
                 {
                   this.isShowPayment=true;
   
                   if (Array.isArray(this.objCaseDetail?.PAYMENTLIST?.Payment  )) 
                   {   
                       this.paymentList=this.objCaseDetail?.PAYMENTLIST?.Payment  
                  } 
                   else 
                   {  
                     this.paymentList.push(this.objCaseDetail?.PAYMENTLIST?.Payment  )
                   }           
                 }
               } 
  }
  CancelFlag:any;
  CustomerConfirmationNotes:any;


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
      "Value": this.objCaseDetail.JOBCancellationRequest.CancellationGUID
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
      "Value": this.objCaseDetail.CaseGUID
    })

    requestData.push({
      "Key": "CancellationReason",
      "Value": this.objCaseDetail.JOBCancellationRequest.CancellationReason
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
     
       //     this.ngxSpinnerService.hide();
          }
          else {
            // this.errorMessage = response.ReturnMessage;
           alert(response.ReturnMessage)
          }
        },
        error: err => {
          debugger
          console.log(err);
         // this.ngxSpinnerService.hide();
        }
      }); 

}

onsitecallclosed:boolean=false;

isonsitecallclosed(event){ 
  this.onsitecallclosed = event;
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
