import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonModal, CheckboxCustomEvent, ModalController, NavParams } from '@ionic/angular'; 
import { CaseDetail } from '../../repair-process.metadata';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { v4 as uuidv4 } from 'uuid';
import { DropDownType } from 'src/app/custom-components/request.metadata';



@Component({
  selector: 'app-cancellation-request',
  templateUrl: './cancellation-request.page.html',
  styleUrls: ['./cancellation-request.page.scss'],
})
export class CancellationRequestPage implements OnInit {

  constructor(
    private dynamicService: DynamicService,
    private dropdownDataService: DropdownDataService,
    private modalController: ModalController,
    private navParams: NavParams
 
  ) { }

   
  cancellationdata: DropDownValue = DropDownValue.getBlankObject(); 
  replacementdata:  DropDownValue = DropDownValue.getBlankObject(); 

  Cancellationvalue:any;
  CancellationReason:any;
  CancellationNotes:any;
  errorMessage:any;
  CancellationGUID:any; 
  CancelFlag:any=0;
  type:any;

  //Replacement
  ReplacementType:any;
  ReplacementNotes:any;
  ReplacementGUID:any;
  ReplacementFlag:any=0;


  
  @Input() checkType; 
   repa :any ;
  @Input() modal!: IonModal;
  @Output() dismissChange = new EventEmitter<boolean>();


  ngOnInit() {
    this.onCancellationrequest({ term: '', items: [] })  
    this.onReplacementrequest({ term: '', items: [] }) 
    this.type = this.navParams.get('type');  
    this.repa = this.navParams.get('objCaseDetail');  

    this.CancellationGUID =uuidv4 ();
    this.ReplacementGUID =uuidv4 ();
 

  }

  onCancellationrequest($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.CancellationRequest, $event.term).subscribe({
      next: (value) => {
        if (value != null) { 
          this.cancellationdata = value; 
        }
      },
      error: (err) => {
        this.cancellationdata = this.getBlankObject();
      }
    });
  }




  onReplacementrequest($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.ReplacementType, $event.term).subscribe({
      next: (value) => {
        if (value != null) { 
          this.replacementdata = value;  
        }
      },
      error: (err) => {
        this.replacementdata = this.getBlankObject(); 
      }
    });
  }


  getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }

  
  onSubmit() 
  { 

   // this.ngxSpinnerService.show() 
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveCancellationRequest"
    })

    requestData.push({
      "Key": "CancellationGUID",
      "Value": this.CancellationGUID
    })

    requestData.push({
      "Key": "CancelFlag",
      "Value": this.CancelFlag
    })


    requestData.push({
      "Key": "CaseGUID",
      "Value": this.repa.CaseGUID
    })
    requestData.push({
      "Key": "CancellationReason",
      "Value": this.CancellationReason
    })

    requestData.push({
      "Key": "OldStatus",
      "Value": this.repa.JobStatus
    })


    requestData.push({
      "Key": "CancellationNotes",
      "Value": this.CancellationNotes
    })
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    };
    debugger
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        
        next: (value) => {
          let response = JSON.parse(value.toString());
          if (response.ReturnCode == '0') {
            //emit for close popup function
           alert("Successfully Updated")
           this.modalController.dismiss();
           // this.close()
           // this.ngxSpinnerService.hide();
          }
          else {
            this.errorMessage = response.ReturnMessage;
           alert(response.ReturnMessage)
          }
        },
        error: err => {
          console.log(err);
          //this.ngxSpinnerService.hide();
        }
      });
  }
 

  onSubmitReplacement() 
  { 

   // this.ngxSpinnerService.show() 
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveReplacementType"
    })

    requestData.push({
      "Key": "ReplacementGUID",
      "Value": this.ReplacementGUID
    })

    requestData.push({
      "Key": "ReplacementFlag",
      "Value": this.ReplacementFlag
    })


    requestData.push({
      "Key": "CaseGUID",
      "Value": this.repa.CaseGUID
    })
    requestData.push({
      "Key": "ReplacementType",
      "Value": this.ReplacementType
    })

    requestData.push({
      "Key": "OldStatus",
      "Value": this.repa.JobStatus
    })


    requestData.push({
      "Key": "ReplacementNotes",
      "Value": this.ReplacementNotes
    })
    let strRequestData = JSON.stringify(requestData);
    console.log("replacement",requestData)
    let contentRequest = {
      "content": strRequestData
    };
    
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        
        next: (value) => {
          let response = JSON.parse(value.toString()); 
          if (response.ReturnCode == '0') {
            //emit for close popup function
           alert("Successfully Updated") 
           this.modalController.dismiss();
           // this.ngxSpinnerService.hide();
          }
          else {
            this.errorMessage = response.ReturnMessage;
         alert(response.ReturnMessage)
          }
        },
        error: err => {
          console.log(err);
        //  this.ngxSpinnerService.hide();
        }
      });
  }

}
