import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { v4 as uuidv4 } from 'uuid';
import { ModalController, NavParams } from '@ionic/angular';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-component-issue',
  templateUrl: './component-issue.page.html',
  styleUrls: ['./component-issue.page.scss'],
})
export class ComponentIssuePage implements OnInit {
  selectComponentCode:DropDownValue = DropDownValue.getBlankObject();
  SelectIssueCode: DropDownValue = this.getBlankObject();
  selectProduct:any=['Continuous','Intermittent']
  @Output() Closecomponent = new EventEmitter<boolean>();
  @Output() ComponentsIssues = new EventEmitter<any>(); 
getBlankObject(): DropDownValue {
  const ddv = new DropDownValue();
  ddv.TotalRecord = 0;
  ddv.Data = [];
  return ddv;
}
childDataSubject = new Subject<any>();
repa:any;

componentissueForm = this.formBuilder.group({
  component:[],
  issues:[],
  productibility:[]

})
  constructor(
    private formBuilder:FormBuilder,
    private modalController: ModalController,
    private dropdownDataService:DropdownDataService,
    private navParams: NavParams
  ) { }


  formattedData:any;
  sentence: string;

  ngOnInit(): void {  
    this.repa = this.navParams.data; 
    this.onComponentCodeSearch({ term: "", items: null }); 
 
  }

  convertArrayToString(data: any[]): string {
    if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
      return data.join('');
    }
    return '';
  }

  ionViewWillEnter() { 
    this.onComponentCodeSearch({ term: "", items: null });
  }

  
  // onComponentCodeSearch($event: { term: string; items: any[] }) {

  //   this.dropdownDataService.fetchDropDownData(DropDownType.bindcomponentcode, $event.term)
  //     .subscribe({
  //       next: (value) => {
  //         if (value != null) {
  //           console.log("Component Extra Data:",value)
  //           this.selectComponentCode = value;
            
  //           this.SelectIssueCode = this.getBlankObject();
  //           this.onIssueCodeSearch({ term: "", items: [] });
  //         }
  //       },
  //       error: (err) => {
  //         this.selectComponentCode = this.getBlankObject();
  //         this.SelectIssueCode = this.getBlankObject();
  //         // this.selectComponentCode = null;
  //         // this.SelectIssueCode= null;
  //       },
  //     });
  // }
  // onComponentCodeSearch(event: CustomEvent | { term: string; items: any[] }) {
  //   if ('detail' in event) {
  //     // Handle ionChange event
  //     const selectedValue = event.detail.value;
  
  //     // Assuming your selected value has a specific format, adjust this based on your actual scenario
  //     const [Id, extraData] = selectedValue.split(':');
  
  //     const CompoentObj = {
  //       "CompoentCode": Id,
  //       "ComponentDescription": extraData
  //     };
  
  //     console.log("compoent Change Event:", CompoentObj);
  //     this.componentissueForm.controls.issues.setValue('');
  //     this.onIssueCodeSearch({ term: "", items: [] });
  //   } else {
  //     // Handle search event
  //     const term = event.term;
  //     const items = event.items;
  
  //     // Your existing logic for search event
  //     this.dropdownDataService.fetchDropDownData(DropDownType.bindcomponentcode, term)
  //       .subscribe({
  //         next: (value) => {
  //           if (value != null) {
  //             console.log("Component Extra Data:", value);
  //             this.selectComponentCode = value;
  
  //             this.SelectIssueCode = this.getBlankObject();
  //             this.onIssueCodeSearch({ term: "", items: [] });
  //           }
  //         },
  //         error: (err) => {
  //           this.selectComponentCode = this.getBlankObject();
  //           this.SelectIssueCode = this.getBlankObject();
  //         },
  //       });
  //   }
  // }

  onComponentCodeSearch(event: CustomEvent | { term: string; items: any[] }) 
  { 
    if ('detail' in event) {
      // Handle ionChange event
      const selectedValue = event.detail.value;
    
      // Assuming your selected value has a specific format, adjust this based on your actual scenario
      const [Id, extraData] = selectedValue.split(':');
    
      const ComponentObj = {
        "ComponentCode": Id,
        "ComponentDescription": extraData
      };
    
      console.log("component Change Event:", ComponentObj);
      this.componentissueForm.controls.issues.setValue('');
      this.onIssueCodeSearch({ term: "", items: [] });
    } else {
      // Handle search event
      const term = event.term;
      const items = event.items;
    
      // Updated logic for search event
      this.dropdownDataService.fetchDropDownData(DropDownType.bindcomponentcode, term, {
        MaterialCode: this.repa.MaterialCode
      }).subscribe({
        next: (value) => {
          if (value != null) {
            console.log("Component Extra Data:", value);
            this.selectComponentCode = value;
            this.SelectIssueCode = this.getBlankObject();
            this.onIssueCodeSearch({ term: "", items: [] });
          }
        },
        error: (err) => {
          console.error("Error fetching dropdown data:", err);
          this.selectComponentCode = this.getBlankObject();
          this.SelectIssueCode = this.getBlankObject();
          this.selectComponentCode = null;
          this.SelectIssueCode = null;
        }
      });
    }
  }
  
 
  
  
  onIssueCodeSearch(event: CustomEvent<any> | { term: string; items: any[] }): void {
    if (event) {
      console.log('event=='+event)
      let searchTerm: string;
  
      // Check if it's a CustomEvent (ionChange event)
      if ('detail' in event && event.detail && typeof event.detail.value === 'string') {
        searchTerm = event.detail.value.trim();
      } else if ('term' in event && typeof event.term === 'string') {
        // It's the object { term: string; items: any[] }
        searchTerm = event.term.trim();
      } else {
        // Log the actual structure of the event
        console.error('Invalid event structure:', event);
        return;
      }
  
      // Continue with your logic...
      this.dropdownDataService.fetchDropDownData(DropDownType.bindissueCode, searchTerm, {
        ComponentCode: this.componentissueForm.controls["component"].value,
      }).subscribe({
        next: (value) => {
          console.log("onIssueCodeSearch ===", value);
          if (value != null) {
            this.SelectIssueCode = value;
          }
        },
        error: err => {
          this.SelectIssueCode = this.getBlankObject();
        }
      });
    } else {
      // Handle the case where the event is undefined
      console.error('Undefined event');
    }
  }
  
  
  

  // ComponentEvent(event){
  //   const CompoentObj={
  //     "CompoentCode":event.Id,
  //     "ComponentDescription":event.extraData
  //   }
  //   console.log("compoent Change Event:",CompoentObj)
  //   this.componentissueForm.controls.issues.setValue('');
  //   this.onIssueCodeSearch({ term: "", items: [] });
  // }
 

  ComponentEvent(event: CustomEvent) { 
    console.log("ComponentEvent===",event);
    // Access the selected value from event.detail
    const selectedValue = event.detail.value;
  
    // Assuming your selected value has a specific format, adjust this based on your actual scenario
    const [Id, extraData] = selectedValue.split(':');
  
    const CompoentObj = {
      "CompoentCode": Id,
      "ComponentDescription": extraData
    };
  
    console.log("compoent Change Event:", CompoentObj);
    this.componentissueForm.controls.issues.setValue('');
    this.onIssueCodeSearch({ term: "", items: [] });
  }
 

  isCloseComponent:boolean=false;
  async CloseComponentPopUp(){
    await this.modalController.dismiss(); 
  }
  
 
  allcompoentIssue:any=[];
  EmitComponentIssueData:any=[];
  AddComponentIssus(){
    this.sendDataToParent()
    if(this.componentissueForm.controls["component"].value == null ||
     this.componentissueForm.controls["component"].value == undefined ||
     this.componentissueForm.controls["component"].value == ""){
    //  this.toastrService.error("Please Select The Component");
    alert('Please Select The Component')
     return false;
     }
     if(this.componentissueForm.controls["issues"].value == null ||
     this.componentissueForm.controls["issues"].value == undefined ||
     this.componentissueForm.controls["issues"].value == ""){
    //  this.toastrService.error("Please Select The Issues");
    alert('Please Select The Issues')
     return false;
     }
     if(this.componentissueForm.controls["productibility"].value == null ||
     this.componentissueForm.controls["productibility"].value == undefined ||
     this.componentissueForm.controls["productibility"].value == ""){
    //  this.toastrService.error("Please Select The productibility");
    alert('Please Select The productibility')
     return false;
     }
     else{
      // let ComponentCode = this.componentissueForm.controls["component"].value
      // let Issucode = this.componentissueForm.controls["issues"].value
      // let ReproducibilityDescription = this.componentissueForm.controls["productibility"].value

    //  console.log("ComponentCode:",ComponentCode)
    //  console.log("Issucode:",Issucode)
    //  console.log("ReproducibilityDescription:",ReproducibilityDescription)

      const ComponentIssuesObj:any={
        "ComponentCode":this.componentissueForm.controls["component"].value,
        "IssueCode":this.componentissueForm.controls["issues"].value,
       
      }
    this.allcompoentIssue.push(ComponentIssuesObj)
      for(let item of this.allcompoentIssue){
         let Component = this.selectComponentCode.Data.find(comp => comp.Id ==  item.ComponentCode)
          let Issue = this.SelectIssueCode.Data.find(comp => comp.Id ==  item.IssueCode)
          let EventComponentIssuObj={
            "DiagnosisDetailGUID": uuidv4 (),
            "ComponentCode":Component.Id,
            "ComponentDesc":Component.extraData,
            "IssueCode":Issue.Id,
            "IssueDesc":Issue.TEXT,
            "ReproducibilityDescription":this.componentissueForm.controls["productibility"].value
          }

          this.childDataSubject.next(EventComponentIssuObj);
          this.modalController.dismiss({ data: EventComponentIssuObj });

         this.EmitComponentIssueData.push(EventComponentIssuObj)
        console.log("ComponentIssues",this.EmitComponentIssueData)
        //this.ComponentsIssues.emit(EventComponentIssuObj)
      // this.Closecomponent.emit(this.isCloseComponent)
    this.CloseComponentPopUp()
          // console.log("Component2",Component)
          // console.log("Component1",Component.extraData)
          // console.log("Component2",Component.Id)
          // console.log("Issue1",Issue)
      }
      return false
     }
    }


    
  sendDataToParent() {
    // const dataToSend = 'Data from child popup';
    // this.childDataSubject.next(this.EventComponentIssuObj);
    // this.modalController.dismiss({ data: dataToSend });
    // alert(dataToSend)
  }

}
