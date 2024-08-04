import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IonModal, CheckboxCustomEvent, ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { InspectionMetaData } from '../inspection/inspection.metadata';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { HandOverData } from './hand-over.metadata';
import { v4 as uuidv4 } from 'uuid';
import * as glob from "../../../config/global";

import { OtpVerificationPage } from '../pop-up/otp-verification/otp-verification.page';
import { OnsiteJobclosedPage } from '../pop-up/onsite-jobclosed/onsite-jobclosed.page';

@Component({
  selector: 'app-hand-over',
  templateUrl: './hand-over.page.html',
  styleUrls: ['./hand-over.page.scss'],
})
export class HandOverPage implements OnInit {

  errorMessage: any;
  isHandOver: boolean = false;
  isAuthPersonSignature : boolean 
  isCustomerSignature : boolean
  HandOverList: any = ['Release']
  HandOverViewList: any [] = []
  HandOverLists: any [] = []
  InputMode=""
  SignatureList: any [] = []
  AuthorisedPersonSignature
  dictData = []
  controlName = ''
  answer = ''
  dictArr = []
  AuthPersonSignature
  CustomerSignature
  datePipe:DatePipe;
  UploadedImageList:any[]=[];
  isSubmit=  true
  isEdit:boolean=false;
  inspectionMetaData:InspectionMetaData
  DataStatus:any;
  handoverbtn:boolean=true;
  
  handoverForm: FormGroup;
  handover: HandOverData



  @Input() modal!: IonModal;
  @Input() repa;
  @Output() dismissChange = new EventEmitter<boolean>();
  @Output() HanOverUpdated = new EventEmitter<any>();
  @Output() isOtpCall= new EventEmitter<any>();
  @Output() isHandoverSubmitted = new EventEmitter<any>();
  @Output() isonsitecallclosed = new EventEmitter<any>();



  presentingElement = undefined;
  private canDismissOverride = false;

  constructor(
    private formBuilder: FormBuilder,
    private dynamicService: DynamicService, 
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.handover = new HandOverData();
    this.handoverForm = this.formBuilder.group({
      HandOverRemark: [null, [Validators.required]],
    });
 
  }


  ngOnChanges(changes: SimpleChanges): void{
 
    if(changes['repa'])
    { 

      if(this.repa?.JobStatusDesc == 'Waiting For Approval')
      { 
        this.handoverbtn=true;
      }
 
        if(this.repa!= null && this.repa != undefined  ){
          debugger
          let StrData:any=[];
          StrData.push(this.repa?.DIAG)
          for(let item of StrData){
           this.DataStatus = item?.ReasonStatus
           console.log("Reason:",this.DataStatus)
          }



          // if(this.repa?.DIAG != null || this.repa?.DIAG != undefined)
          //   { 
          //     StrData.push(this.repa?.DIAG)
          //     for(let item of StrData){
          //      this.DataStatus = item?.ReasonStatus
          //      console.log("Reason:",this.DataStatus)
          //     }
          //   }
     
          // if(this.repa.OTPVALUE != null || this.repa.OTPVALUE != undefined){
          //   if(this.isSubmit == true){
          //     this.onSubmit()
          //   }
          // }
          this.HandOverViewList = [];
          this.HandOverLists = [];
          this.HandOverLists.push(this.repa.HANDOVER)
          if(Array.isArray(this.HandOverLists))
          {
            for ( var item of this.HandOverLists)
            {
              // if(item.HandOverStatus == null || item.HandOverStatus == undefined){
              //   this.isEdit = true
              // }
              console.log("*****************************HANDOVER STATUS*******************:",item);
              this.HandOverViewList.push({
                "HandOverCode":   item?.HandOverCode,
                "HandOverStatus": item?.HandOverStatus==null || item?.HandOverStatus==undefined ? "CCUDB":item?.HandOverStatus,
                "Remark": item?.Remark,
                "CreatedBy": item?.CreatedBy,
                "CreatedDate":item?.CreatedDate,
                "HandOverDesc":item?.HandOverDesc,
              })
            }
          }
        }
      }
   
    }


  isOTPShow:boolean=false

  async onValidation()
  { 
    if(this.handoverForm.controls["HandOverRemark"].value == null || this.handoverForm.controls["HandOverRemark"].value == undefined || this.handoverForm.controls["HandOverRemark"].value == ""){
      this.presentToast("Please Enter Remark",'danger');
      return false;
    }

    if(this.repa.Brand == "WISHTEL"){
      this.CallClosed();
      return false
    
    }
    
    if(this.repa.JobCategory == "ONSITE"){
      if(this.repa?.JobStatus != 'S27')
      {
        //call top modal
        await this.openOnsiteCallClosedModal();
        this.isonsitecallclosed.emit(true)
        return false
      }
      else
      {
        this.CallClosed()
        return false; 
      }
     
    }
    
    else{
    this.isOtpCall.emit(true)
    return true;
    }
  }

  async openOnsiteCallClosedModal() 
  {
    console.log("call opne oniste == ",this.repa)
    const modal = await this.modalController.create({
      component: OnsiteJobclosedPage,
      componentProps: {
        data: this.repa   ,
        remark:this.handoverForm.controls["HandOverRemark"].value
      }
    });

    //get value from onsite modal close 
    modal.onDidDismiss().then((detail) => {
      if (detail !== null) {
        this.HanOverUpdated.emit(detail.data);
        console.log('The result:', detail.data);
        // Handle the data here
      }
                  });
    return await modal.present();
  }
  // async onValidation(){
  
  //   let errorcount =0  
  //   var myDate = new Date();
  //   this.datePipe=new DatePipe("en-US")
  //   var strDate = this.datePipe.transform(myDate, 'yyyy-MM-ddThh:mm:ss');

  //   let handoverguid = uuidv4();
  //   const handoverval = this.handoverForm.value 
  //   // this.dynamicService.validateAllFormFields(this.handoverForm);
         
  //   const pattern = /^[^\\+\\=@\\-]/;
  //   const htmlpattern= /<(\"[^\"]\"|'[^']'|[^'\">])*>/

  //   if(this.repa.Brand == "WISHTEL"){
  //     this.CallClosed();
  //     return 
    
  //   }

  //   if(this.repa.JobCategory == "ONSITE"){
  //     if(this.repa?.JobStatus != 'S27')
  //     {
  //       this.isonsitecallclosed.emit(true)
  //       return  
  //     }
  //     else
  //     {
  //       this.CallClosed()
  //     }
     
  //   }

  //   if( handoverval.HandOverRemark == null || handoverval.HandOverRemark == ''  )
  //   { 
  //     this.presentToast("Please Enter Remark",'danger')
  //     return;
  //   }

    
  

  //   if(!pattern.test(handoverval.HandOverRemark))
  //   { 
  //     this.presentToast("Invalid Remark Pattern",'danger')
  //     return;
  //   }
  //   if(htmlpattern.test(handoverval.HandOverRemark))
  //   { 
  //     this.presentToast("Invalid Remark Pattern",'danger')
  //     return;
  //   }

 
  //   errorcount == 0 ? this.isHandoverSubmitted.emit(true) : ''
  //   this.openOTP();

  // }

  async openOTP()
{
  const modal = await this.modalController.create({
    component: OtpVerificationPage, // Replace with your modal component
    componentProps: {
      data:{
        data:this.repa
      } 
    }
    
  });
  await  modal.present();
  const { data } = await modal.onDidDismiss();
  if (data == true) { 
   // this.presentToast("save successfully",'success')

    this.onSubmit();
  }

}



  onSubmit() {
      this.isOtpCall.emit(true)

    var myDate = new Date();
    this.datePipe=new DatePipe("en-US")
    var strDate = this.datePipe.transform(myDate, 'yyyy-MM-ddThh:mm:ss');
    let handoverguid = uuidv4();
    const handoverval = this.handoverForm.value
   
      let requestData = [];
      requestData.push({
        "Key": "ApiType",
        "Value": "SaveHandOver"
      });
      requestData.push({
        "Key": "CompanyCode",
        "Value": glob.getCompanyCode()
      });
      requestData.push({
        "Key": "HandOverGUID",
        "Value": handoverguid
      });
      requestData.push({
        "Key": "HandOverCode",
        "Value": "NEW"
      });
      requestData.push({
        "Key": "HandOverDate",
        "Value": strDate
      });
      requestData.push({
        "Key": "HandOverStatus",
        "Value": "S13"
      });
      requestData.push({
        "Key": "HandOverRemark",
        "Value": handoverval.HandOverRemark
      });
      requestData.push({
        "Key": "CaseGUID",
        "Value": this.repa.CaseGUID
      });
      requestData.push({
        "Key": "OTPguid",
        "Value": uuidv4()
      });
      // requestData.push({
      //   "Key": "OTP",
      //   "Value": this.repa.OTPVALUE.OTP
      // });
      requestData.push({
        "Key": "LocationCode",
        "Value": this.repa.LocationCode
      });
      requestData.push({
        "Key": "CustomerCode",
        "Value": this.repa.CUSTOMER.CustomerCode
      });
      console.log("Request DATA === ",requestData);
      let strRequestData = JSON.stringify(requestData);
      console.log(strRequestData);
      let contentRequest = {
        "content": strRequestData
      };
      console.log(requestData);
      this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
        {
          next: (value) => {
            let response = JSON.parse(value.toString());
            if (response.ReturnCode == '0') { 
              console.log("sucess");
              this.isHandOver = !this.isHandOver 
             this.presentToast("save successfully",'success')

              var getval = JSON.parse(response.ExtraData);
              this.isSubmit = false;
              this.HanOverUpdated.emit(getval)
            }
            else {
              this.isSubmit = true;
              this.errorMessage = response?.ErrorMessage;
              console.log("Messages : " ,this.errorMessage)
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(this.errorMessage, 'text/xml');
              const errorMessages = xmlDoc.getElementsByTagName('ErrorMessage');
              for (let i = 0; i < errorMessages.length; i++) {
                const errorMsg = errorMessages[i].textContent;
               alert(errorMsg); // Display only the error message
              }    
            }
          },
          error: err => {
            this.isSubmit = true;
            console.log(err);
          }
        });
  }

  onReset() {
    this.handoverForm.reset(); 
   this.presentToast("Form Reset",'danger')

  }
  


  addHandOver() { 
    this.isHandOver = !this.isHandOver 
  }
 

  onDismissChange(canDismiss) {  
    // Allows the modal to be dismissed based on the state of the checkbox
    this.canDismissOverride = canDismiss;
  }

  onWillPresent() {
    // Resets the override when the modal is presented
    this.canDismissOverride = false;
  }


  canDismiss = async () => {
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



     // HandOver With WISHTEL
  
     CallClosed(){
      //this.ngxSpinnerService.show()
     var myDate = new Date();
      this.datePipe=new DatePipe("en-US")
      var strDate = this.datePipe.transform(myDate, 'yyyy-MM-ddThh:mm:ss');
        let requestData = [];
        requestData.push({
          "Key": "ApiType",
          "Value": "OnsiteHandOver"
        });
        requestData.push({
          "Key": "CompanyCode",
          "Value":glob.getCompanyCode()
        });
        requestData.push({
          "Key": "HandOverGUID",
          "Value":  uuidv4()
        });
        requestData.push({
          "Key": "HandOverCode",
          "Value": "NEW"
        });
        requestData.push({
          "Key": "HandOverDate",
          "Value": strDate
        });
        requestData.push({
          "Key": "CaseGUID",
          "Value": this.repa.CaseGUID
        });
        requestData.push({
          "Key": "HandOverStatus",
          "Value": "S13"
        });
        requestData.push({
          "Key": "HandOverRemark",
          "Value": this.handoverForm.controls["HandOverRemark"].value
        });
        console.log("Saved Onsite JOb Closed:",requestData)
        let strRequestData = JSON.stringify(requestData);
        let contentRequest = {
          "content": strRequestData
        };
        this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
          {
            next: (value) => {
              let response = JSON.parse(value.toString());
              if (response.ReturnCode == '0'){
             //  this.ngxSpinnerService.hide()
               this.presentToast('Form Submitted Successfully','success')
                var getval = JSON.parse(response.ExtraData);
                this.HanOverUpdated.emit(getval)
                 window.location.reload();
                // this.ngxSpinnerService.hide()
              }
              else {
                this.errorMessage = response?.ErrorMessage;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(this.errorMessage, 'text/xml');
                 //this.ngxSpinnerService.hide()
                const errorMessages = xmlDoc.getElementsByTagName('ErrorMessage');
                for (let i = 0; i < errorMessages.length; i++) {
                // this.ngxSpinnerService.hide()
                  const errorMsg = errorMessages[i].textContent;
                //  this.toastrService.error(errorMsg); // Display only the error message
                }    
              }
            },
            error: err => {
            // this.ngxSpinnerService.hide()
              // this.isSubmit = true;
              console.log(err);
            }
          });
  
          
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
