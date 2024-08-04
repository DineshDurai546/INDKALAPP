import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { CaseDetail } from '../../repair-process.metadata';
import { v4 as uuidv4 } from 'uuid';
import * as glob from "../../../../config/global";



@Component({
  selector: 'app-onsite-jobclosed',
  templateUrl: './onsite-jobclosed.page.html',
  styleUrls: ['./onsite-jobclosed.page.scss'],
})
export class OnsiteJobclosedPage implements OnInit {

  constructor(
    // private toatmessage:ToastrService,
    private dynamicService:DynamicService,
    private navParams: NavParams,
    private modalController: ModalController,
    private toastController: ToastController,
    // private ngxSpinnerService:NgxSpinnerService
  ) { }

  //input from modal 
  // @Input() repa: CaseDetail;
  repa:any;
 


  HappyCode:any;
  remark:any;
  datePipe:DatePipe;
  errorMessage: any;

  ngOnInit() {
    this.repa = this.navParams.get('data'); 
    this.remark=this.navParams.get('remark');
  }

 

  VerifyOnsiteHandover(){
    if(this.HappyCode == this.repa.HappyCode){
      this.presentToast("Happay Code Verifyed",'success')
      //this.isonsitecallclosed.emit(false)
      this.onsubmit()
      return false
    }
    if(this.HappyCode == "0000"){
      this.presentToast("Happay Code Verifyed",'success')
     // this.isonsitecallclosed.emit(false)
      this.onsubmit()
      return false
    }
    else{
      this.presentToast("Please Enter Correct HappyCode",'danger')
      return false
    }
  }

 
  closeOnsitepopup() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  onsubmit(){
    // this.ngxSpinnerService.show()
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
      "Value": this.remark
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
           //this.ngxSpinnerService.hide()
           this.presentToast('Form Submitted Successfully','success')
            var getval = JSON.parse(response.ExtraData);
            //this.HanOverUpdated.emit(getval)
            this.closeModal(getval)
             //window.location.reload();
            // this.ngxSpinnerService.hide()
          }
          else {
            this.errorMessage = response?.ErrorMessage;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(this.errorMessage, 'text/xml');
             //this.ngxSpinnerService.hide()
            const errorMessages = xmlDoc.getElementsByTagName('ErrorMessage');
            for (let i = 0; i < errorMessages.length; i++) {
             //this.ngxSpinnerService.hide()
              const errorMsg = errorMessages[i].textContent;
           this.presentToast(errorMsg,'success')


              //this.toatmessage.error(errorMsg); // Display only the error message
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


  async closeModal(getval) {
    await this.modalController.dismiss({
      dismissed: true,
      customData: getval
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
