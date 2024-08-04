import { Component, Input, OnInit } from '@angular/core';
import { CaseDetail } from '../repair-process.metadata';
import { IonModal, CheckboxCustomEvent, ModalController, ToastController } from '@ionic/angular'; 
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { v4 as uuidv4, parse } from 'uuid';
import xml2js from 'xml2js';



@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {

  @Input() repa : CaseDetail;
  @Input() modal!: IonModal;
  AppointmentStatus: string[] = ['Reschedule', 'Cancel'];

  currentDate: string;

  constructor(
              private modalController: ModalController,
              private dropdownDataService:DropdownDataService, 
              private dynamicService:DynamicService,
              private toastController: ToastController,

  ) { }

  caseId:any;
  customerName:any;


  ngOnInit() {
    this.caseId=this.repa.CaseId
    this.customerName=this.repa.CUSTOMER.FirstName + this.repa.CUSTOMER.LastName

    this.onTimeSlot({ term: "", items: [] });
    this.GetAppointment()

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;

  }

  selectedAppointmentStatus:any;
  onItemSelected(event: any) {
    this.selectedAppointmentStatus = event.detail.value; 
  }

  results :any[]=[]
  GetAppointment()
  {
    this.results=[]
    let requestData = [];
  requestData.push({
    "Key": "ApiType",
    "Value":"GetAppointment"
  });
  requestData.push({
    "Key": "CaseGUID",
    "Value":  this.repa.CaseGUID
  });

  let strRequestData = JSON.stringify(requestData);
  let contentRequest = {
    "content": strRequestData
  };

  this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
    {
      next: (value) => {
      //  this.spinner.hide();
        debugger
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') {
          let data = JSON.parse(response?.ExtraData); 
          
          // this.presentToast('Get Successfully','success') 
          if(data?.AppointmentDetails?.AppointmentList != null && data?.AppointmentDetails?.AppointmentList !=undefined )
          {
            if(Array.isArray(data?.AppointmentDetails?.AppointmentList ))
            { 
              this.results= data?.AppointmentDetails?.AppointmentList
            }
            else
            { 
              this.results.push(data?.AppointmentDetails?.AppointmentList)
            }
          }
    
       
         // this.spinner.hide();
        }
        else {
         // this.spinner.hide();
          this.errorMessage = response.ReturnMessage;
          const parser = new xml2js.Parser({ strict: false, trim: true });
          parser.parseString(response.ErrorMessage, (err, result) => {
            response['errorMessageJson'] = result; 
            this.presentToast('Error','danger') 
          //  this.toastr.error("")
          });
        }
      //  console.log("Parts ", this.selectedpartlist)
      },
      error: err => {
        console.log(err);
     //   this.spinner.hide();
       alert(err.toString());
      }
    });
 
  }

  TimeSlotValue:any;
  errorMessage: any;
  TimeSlot:any;


  onTimeSlot($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.TimeSlot, $event.term).subscribe({
      next: (value) => {
        if (value != null) {
          console.log(value);
          this.TimeSlot = value;
         console.log("=====TimeSlot=====",this.TimeSlot)
        }
      },
      error: (err) => {
        this.TimeSlot = this.getBlankObject();
      }
    });
  }


  getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }

  AppointmentGUID:any;
  AppointmentDate:any;
  CaseGUID:any;
  UpdatedTimeSlotValue:any;
  UpdatedAppointmentDate:any;




  updateValidations():boolean
  {
    if(this.selectedAppointmentStatus == 'Cancel')
      {
        return true;
      }
    if(this.UpdatedAppointmentDate =='' || this.UpdatedAppointmentDate == null || this.UpdatedAppointmentDate ==undefined)
      { 
       this.presentToast('Please Enter Upateded Appointment Date','danger') 
        return false;
      }
     
      if(this.UpdatedTimeSlotValue =='' || this.UpdatedTimeSlotValue == null || this.UpdatedTimeSlotValue ==undefined)
      { 
       this.presentToast('Please EnterUpateded Appointment Time','danger')
        return false; 
      } 
      return true;
  }

  validationCheck():boolean
  {
    if(this.AppointmentDate =='' || this.AppointmentDate == null || this.AppointmentDate ==undefined)
      { 
       this.presentToast('Please Enter Appointment Date','danger') 

        return false;
      }
     
      if(this.TimeSlotValue =='' || this.TimeSlotValue == null || this.TimeSlotValue ==undefined)
      { 
       this.presentToast('Please Enter Appointment Time','danger') 

          return false; 
      }

      return true;
  }



  saveAppointment()
  {   
    if(this.validationCheck())
      { 
    this.AppointmentGUID = uuidv4()
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveAppointment"
    });
    requestData.push({
      "Key": "AppointmentGUID",
      "Value": this.AppointmentGUID
    });
    requestData.push({
      "Key": "CaseGUID",
      "Value": this.repa.CaseGUID
    });

    requestData.push({
      "Key": "Status",
      "Value":  this.selectedAppointmentStatus =='' || this.selectedAppointmentStatus ==undefined ?'Open':this.selectedAppointmentStatus
    });

    requestData.push({
      "Key": "AppointmentDate",
      "Value": this.AppointmentDate
    });
    requestData.push({
      "Key": "TimeSlot",
      "Value": this.TimeSlotValue
    });
  

    let strRequestData = JSON.stringify(requestData);
    console.log('strRequestData== ',strRequestData)
    let contentRequest = {
      "content": strRequestData
    }; 
    
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        
        next: (value) => { 
          let response = JSON.parse(value.toString());
          if (response.ReturnCode == '0') {
            var getval = JSON.parse(response.ExtraData); 

            // this.paymentSuccessData=getval; 
            this.presentToast('Submitted Succesfully','success')
            this.isAddAppointment=false;
            this.GetAppointment() 
          }
          else {
              // this.submitClicked= false 
              console.log("Error Response: " , response)
              this.errorMessage = response.ErrorMessage;
              const parser = new xml2js.Parser({ strict: false, trim: true });
              parser.parseString( this.errorMessage , (error, result) => {
                const errorMessages = result.ERRORLIST.ERRORMESSAGEROW;
                console.log("Messages : " ,errorMessages)
                errorMessages.forEach((errorMessage) => {
                  // console.log("Error Message: " , error) 
                  this.presentToast(errorMessage.ERRORMESSAGE,'danger')
                });
              }); 
          }
        },
        error: err => {
          // this.submitClicked= false 
          //this.ngxSpinnerService.hide();
          console.log("Error Message:- ", err)
          const errors = err.split("Error Code:").slice(1); // Split the error string into separate error segments
          errors.forEach(error => {
            const messageIndex = error.indexOf("Message: ");
            if (messageIndex !== -1) {
              const messageSubstring = error.substring(messageIndex + 9).trim();
              const message = JSON.parse(messageSubstring).message;
              this.presentToast('Error '+message,'danger') 
            } else { 
              this.presentToast('Error parsing the error message.','danger')

            }
          });
        }
      });
  
  }
}

  UpdateAppointment(item)
  {  
    if(this.updateValidations()) 
      {
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveAppointment"
    });
    requestData.push({
      "Key": "AppointmentGUID",
      "Value": item.AppointmentGUID
    });
    requestData.push({
      "Key": "AppointmentDate",
      "Value": this.UpdatedAppointmentDate
    });
    requestData.push({
      "Key": "TimeSlot",
      "Value":  this.UpdatedTimeSlotValue
    });
    requestData.push({
      "Key": "CaseGUID",
      "Value": this.repa.CaseGUID
    });

    requestData.push({
      "Key": "Status",
      "Value":  this.selectedAppointmentStatus =='' || this.selectedAppointmentStatus ==undefined ?'Open':this.selectedAppointmentStatus
    });
 
 
  

    let strRequestData = JSON.stringify(requestData);
    console.log('strRequestData== ',strRequestData)
    let contentRequest = {
      "content": strRequestData
    }; 
    debugger
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        
        next: (value) => { 
          let response = JSON.parse(value.toString());
          if (response.ReturnCode == '0') {
            var getval = JSON.parse(response.ExtraData); 

            // this.paymentSuccessData=getval; 
            this.presentToast('Updated Succesfully','success')
            this.isAddAppointment=false;
            this.GetAppointment() 
          }
          else {
              // this.submitClicked= false 
              console.log("Error Response: " , response)
              this.errorMessage = response.ErrorMessage;
              const parser = new xml2js.Parser({ strict: false, trim: true });
              parser.parseString( this.errorMessage , (error, result) => {
                const errorMessages = result.ERRORLIST.ERRORMESSAGEROW;
                console.log("Messages : " ,errorMessages)
                errorMessages.forEach((errorMessage) => {
                  // console.log("Error Message: " , error) 
                  this.presentToast(errorMessage.ERRORMESSAGE,'danger')
                });
              }); 
          }
        },
        error: err => {
          // this.submitClicked= false 
          //this.ngxSpinnerService.hide();
          console.log("Error Message:- ", err)
          const errors = err.split("Error Code:").slice(1); // Split the error string into separate error segments
          errors.forEach(error => {
            const messageIndex = error.indexOf("Message: ");
            if (messageIndex !== -1) {
              const messageSubstring = error.substring(messageIndex + 9).trim();
              const message = JSON.parse(messageSubstring).message;
              this.presentToast('Error '+message,'danger') 
            } else { 
              this.presentToast('Error parsing the error message.','danger')

            }
          });
        }
      });
    }
  }

  isAddAppointment:boolean=false
  //Add Appointment Popup
  openModal()
  {
    this.selectedAppointmentStatus=''
    this.isAddAppointment=true
  }

  closeAddAppointment()
  {
    this.isAddAppointment=false 
  }

  isShowStatus:boolean=false
 
  changeStatus(item)
  {
    // this.isShowStatus=!this.isShowStatus
    item.isShowStatus = !item.isShowStatus;
  }

  UpdateStatus()
  {

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
