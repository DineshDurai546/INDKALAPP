import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, CheckboxCustomEvent, NavParams, ModalController } from '@ionic/angular';
import xml2js from 'xml2js';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { Subscription, interval } from 'rxjs';
import { v4 as uuidv4, parse } from 'uuid'; 
import * as glob from "../../../../config/global";



@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {


  @Input() modal!: IonModal;
  MobileNo:any;
  EmailId:any;
  OTPData:any;
  errorMessage: any;
  @Output() OTPtoHandover =new EventEmitter<any>();

  @ViewChild('minutes', { static: true }) minutes: ElementRef;
  @ViewChild('seconds', { static: true }) seconds: ElementRef;

  min: number = 2;
  secondsRemaining: number = this.min * 60;
  subscription: Subscription;
  otpinput: string
  OTPVerification: String 
  resendOtp:boolean=true;
  istimerShow:boolean=false;
  otpguid: string;
  isdiabled:boolean=false;
  
  constructor(
              private navParams: NavParams,
              private dynamicService : DynamicService,
              private modalController: ModalController,
  ) { }

  data:any;
  LocationCode:any;
  ngOnInit() {
    this.isdiabled =true

    //repa
    this.data= this.navParams.get('data');  
    console.log("DATA===",this.data)
    this.MobileNo= this.data.data.CUSTOMER.MobileNo
    this.EmailId= this.data.data.CUSTOMER.EmailID 
    this.LocationCode=this.data.data.LocationCode 



  }

   timeCounter()
  { 
    this.isdiabled=false; 
    
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

      this.seconds.nativeElement.innerText= '00'
      this.minutes.nativeElement.innerText ='02'
    
    const source = interval(1000);
    this.subscription = source.subscribe(() => {

      this.secondsRemaining--;
      if (this.secondsRemaining < 0) {
        this.secondsRemaining = 0;
        this.isdiabled=  true
      }
      this.minutes.nativeElement.innerText = Math.floor(this.secondsRemaining / 60);
      this.seconds.nativeElement.innerText = ('0' + (this.secondsRemaining % 60)).slice(-2);
    });
  

  }
  limitInputLength(event: any) {
    const maxLength = 6;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
      this.otpinput = event.target.value;
    }
  }
  
  GenerateOTP(){      
    this.timeCounter();
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveOTP"
    });
    requestData.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    });
    requestData.push({
      "Key": "EmailId",
      "Value": this.EmailId
    });
    requestData.push({
      "Key": "LocationCode",
      "Value": this.LocationCode
    });
    requestData.push({
      "Key": "MobileNo",
      "Value":  this.MobileNo
    });
    // requestData.push({
    //   "Key": "TokenDate",
    //   "Value": this.Data.TokenDate
    // });
    // requestData.push({
    //   "Key": "TokenCode",
    //   "Value": this.Data.TokenNumber
    // });
    console.log("data checking:",requestData)

    console.log(requestData);
    let strRequestData = JSON.stringify(requestData);
    
    let contentRequest = {
      "content": strRequestData
    };
  debugger
   // this.spinner.show();
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
      
        next: (value) => {
         // this.spinner.hide();
        //  this.modalController.dismiss({
        //   otpData: { 'OTP' : this.otpinput,
        //   'OTPGUID':this.otpguid}
        // });

          let response = JSON.parse(value.toString());
          if (response.ReturnCode == '0') {
            let data = JSON.parse(response?.ExtraData);
            this.OTPData = data
            console.log("GenerateOTP ==",this.OTPData)
            // alert(this.OTPData.OTP.OTP)
            this.otpguid = this.OTPData.OTP.GUID
          }
          else {
          //  this.spinner.hide();
            this.errorMessage = response.ReturnMessage;
            const parser = new xml2js.Parser({ strict: false, trim: true });
            parser.parseString(response.ErrorMessage, (err, result) => {
              response['errorMessageJson'] = result;
            });
          }

        },
        error: err => {
        //  this.spinner.hide();
          console.log(err);
        }
      });
  } 

  verifyOTP(){ 
   // console.log("====--===",this.Data)
    this.OTPVerification = this.otpinput
    if(this.OTPVerification != null || this.OTPVerification != undefined ){
        let otpguid=uuidv4()
        let requestData = []
        requestData.push({
          "Key":"APIType",
          "Value":"SaveOTPData"
        })
        requestData.push({
          "Key":"OTPVerificationGUID",
          "Value":this.OTPData?.OTP?.GUID
        })
        requestData.push({
          "Key":"OTPVerificationStatus",
          "Value":"VERIFIED"
        })
        requestData.push({
          "Key":"CustomerCode",
          "Value": '123888905'
        })

        requestData.push({
          "Key":"BrandCode",
          "Value": '13011'
        })
 
        requestData.push({
          "Key":"LocationCode",
          "Value": this.LocationCode
        })
        requestData.push({
          "Key":"OtpEntered",
          "Value":this.otpinput
        })
     
        requestData.push({
          "Key":"MobileNo",
          "Value":this.MobileNo
        })
        
        let strRequestData = JSON.stringify(requestData);
        let contentRequest =
        {
          "content": strRequestData
        };

        // console.log("===-====-===",strRequestData)
       debugger
        this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
          {
            next: (Value) => {
              try {
                let response = JSON.parse(Value.toString());

               console.log("response=====",response)

                if (response.ReturnCode == '0') { 
                  this.modalController.dismiss(true);
                 // this.openCreateJob.emit(otpguid)
                 // this.handOverCheck.emit(true)
                  let data = JSON.parse(response?.ExtraData);
                 // console.log("saved token status",data)
                } 
                else {
                  // console.log("Messages : " ,response)
                  this.errorMessage = response?.ErrorMessage;
                  console.log("Messages : " ,this.errorMessage)
                  const parser = new DOMParser();
                  const xmlDoc = parser.parseFromString(this.errorMessage, 'text/xml');
                  const errorMessages = xmlDoc.getElementsByTagName('ErrorMessage');
                  for (let i = 0; i < errorMessages.length; i++) {
                    const errorMsg = errorMessages[i].textContent;
                   // alert(errorMsg); // Display only the error message
                  }    
                }
              } 
              catch (ext) {
              }
            },
            error: err => { 
              console.log(err)
            }
    
          }
        );
    }else{
      alert("Enter OTP First")
    }
    
  }
  

  HandoverOTP(){
    this.OTPtoHandover.emit({ 'OTP' : this.otpinput,
                           'OTPGUID':this.otpguid})
   }

  submitOTPforHandover(){
    // alert('submitOTPforHandover')
    this.modalController.dismiss({
      otpData: { 'OTP' : this.otpinput,
      'OTPGUID':this.otpguid}
    });
   }

  //  otpUpdated($event){
  //   this.data.OTPVALUE = {...$event};
  //   this.data = Object.assign({}, this.data);
  // }
   
}
