import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { DropdownDataService, DropDownValue } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { v4 as uuidv4, parse } from 'uuid';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import xml2js from 'xml2js';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.page.html',
  styleUrls: ['./visit.page.scss'],
})
export class VisitPage implements OnInit {

  @Input() modal!: IonModal;
  @Input() repa;

  isAddVisit:boolean=false;
  isChecked: boolean = false;
  AppointmentStatus: string[] = [ 'Reschedule', 'Cancel', 'Visited'];

  errorMessage: any;
  caseId:any;
  customerName:any;
  // Status:any;

  items: string[] = ['Reschedule', 'Cancel', 'Visited'];
  selectedItem: string;
  currentDate:string;
  UpdatedTimeSlotValue:string;
  TimeSlot:any;
  UpdatedAppointmentDate:string;




  constructor( 
                private modalController: ModalController,
                private dropdownDataService:DropdownDataService, 
                private dynamicService:DynamicService,
                private toastController: ToastController,
  ) { }

  ngOnInit() {

    this.caseId=this.repa.CaseId
    this.customerName=this.repa.CUSTOMER.FirstName + this.repa.CUSTOMER.LastName
    this.onTimeSlot({ term: "", items: [] });
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;

    this.GetAppointment()
  }


  updateValidations():boolean
  {
    if(this.selectedAppointmentStatus == 'Cancel' || this.selectedAppointmentStatus == 'Visited' )
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

 


  results :any[]=[]
  SetAppointmentDate:any;
  SetTimeSlot:any;

  GetAppointment()
  {
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
        this.results=[]
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') {
          let data = JSON.parse(response?.ExtraData); 
          
        
          if(data?.AppointmentDetails?.AppointmentList != null && data?.AppointmentDetails?.AppointmentList !=undefined )
          {
            if(Array.isArray(data?.AppointmentDetails?.AppointmentList ))
            { 
              this.results= data?.AppointmentDetails?.AppointmentList 
              console.log('if====',this.results)
              

              // this.presentToast('Get Successfully','success') 
            }
            else
            { 
              this.results.push(data?.AppointmentDetails?.AppointmentList)
              console.log('esle',this.results)
              // this.presentToast('Get Successfully','success') 
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

  AddAppointment(event: any,item) 
  {
    this.isChecked = event.detail.checked;
  }
  selectedAppointmentStatus:any;
  onItemSelected(event: any) {
    this.selectedAppointmentStatus = event.detail.value;  
  }

  // onItemSelected(event: any) {
  //   this.selectedItem = event.detail.value;
  //   console.log('Selected Item:', this.selectedItem);
  // }


  
  isShowStatus:boolean=false
  changeStatus()
  {
    this.isShowStatus=!this.isShowStatus
  }




  //visit list popup 
  openListVisit()
  {
    this.isAddVisit=true
  }

  closeListVisit()
  {
    this.isAddVisit=false

  }

  VisitGUID:any;
  //Save Visit function
  SaveVisit(item)
  {  

    this.VisitGUID = uuidv4()
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveVisit"
    });

    requestData.push({
      "Key": "VisitGUID",
      "Value": this.VisitGUID
    });
    requestData.push({
      "Key": "AppointmentGUID",
      "Value": item.AppointmentGUID
    });
    requestData.push({
      "Key": "CaseGUID",
      "Value": this.repa.CaseGUID
    });

    requestData.push({
      "Key": "Status",
      "Value": this.selectedItem
    });


    requestData.push({
      "Key": "AppointmentDate",
      "Value": item.AppointmentDate
    });

    requestData.push({
      "Key": "TimeSlot",
      "Value": item.TimeSlot
    });


    let strRequestData = JSON.stringify(requestData);
    console.log('strRequestData== ',strRequestData)
    let contentRequest = {
      "content": strRequestData
    };

    //this.ngxSpinnerService.show()
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
    
    next: (value) => {
      // this.submitClicked= false 
   //   this.ngxSpinnerService.hide()
      let response = JSON.parse(value.toString());
      if (response.ReturnCode == '0') {
        var getval = JSON.parse(response.ExtraData); 

        // this.paymentSuccessData=getval; 
        this.presentToast('Submitted Succesfully','success')
        this.closeListVisit()
    //    this.isAddAppointment=false;
        this.GetVisit()
        // this.modalController.dismiss({
        //   // paymentSuccessObjt: this.paymentSuccessData.PAYMENTLIST
        // });
        //Close popup here

      //  this.route.navigate(['auth/' + glob.getCompanyCode() + '/advance-payment-list'])
        // this.saveSapAdvancePayment()
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



  GetVisit()
  {

  }

  
  UpdateAppointment(item)
  {
    if(this.updateValidations()) 
      {
    console.log("ITEM=====",item) 
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
      "Key": "CaseGUID",
      "Value": this.repa.CaseGUID
    });

    requestData.push({
      "Key": "Status",
      "Value":  this.selectedAppointmentStatus =='' || this.selectedAppointmentStatus ==undefined ?'Open':this.selectedAppointmentStatus
    });

    requestData.push({
      "Key": "AppointmentDate",
      "Value": this.UpdatedAppointmentDate ==''|| this.UpdatedAppointmentDate == undefined ? item.AppointmentDate: this.UpdatedAppointmentDate
    });
    requestData.push({
      "Key": "TimeSlot",
      "Value": this.UpdatedTimeSlotValue =='' || this.UpdatedTimeSlotValue == undefined ? item.TimeSlot : this.UpdatedTimeSlotValue
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
           // this.isAddAppointment=false;
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

  getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }
  
  @ViewChild('popover') popover;

  isOpen = false;

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


  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
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
