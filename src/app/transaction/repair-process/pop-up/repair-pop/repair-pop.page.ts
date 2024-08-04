import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { CaseDetail } from '../../repair-process.metadata';
import { ActionSheetController, CheckboxCustomEvent, IonModal, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-repair-pop',
  templateUrl: './repair-pop.page.html',
  styleUrls: ['./repair-pop.page.scss'],
})
export class RepairPopPage implements OnInit {


  typeSelected = 'ball-clip-rotate';
  toastr: any;
  validateAllFormFields: any;
  partList: any[] = [];
  resourceData: any[] = []
  SelectedPartList: any[] = [];
  SelectedPartCount: Number = 0;
  NormalPartList: any[] = [];
  TierPartList: any[] = [];
  AcPlusPartList: any = [];
  PartSelectionMode: String = "Normal"
  SearchField: String = "";
  showonlyselected: boolean = false;
  errorMessage: string = "";
  detail: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  ValidToDate: Date
  isBillable: boolean = true


  @Output() repairPartEvent = new EventEmitter<any>();
  @Output() closePartSelector = new EventEmitter<any>();
  @Input() selectedParts : any[] =[]
  selectedQuopartlist: any[] =[]
 
  @Input() modal!: IonModal; 
  @Output() dismissChange = new EventEmitter<boolean>(); 
  @Output() messageEvent = new EventEmitter<string>();

  repa:any
 

  checkboxChanged(event: any) {
    const ev = event as CheckboxCustomEvent;
    const checked = ev.detail.checked;

    this.dismissChange.emit(checked);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['objcasedetail']) {
      this.GetBOMList();
    }
 

  }

  constructor(
    private formBuilder: FormBuilder,
    private dropdownDataService: DropdownDataService,
    private dynamicService: DynamicService,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private navParams: NavParams,

    // private toast: ToastrService,
    // private ngxSpinnerService: NgxSpinnerService,
  ) { }
 

  ngOnInit() 
  {
    this.repa = this.navParams.get('repairData');  
    this.GetBOMList();
    console.log("in Quote component"); 
 
    this.selectedQuopartlist =[];
    console.log("Quote ", this.repa?.QUOTE)
    console.log("Billable ", this.repa.DIAG.BillableRepair) //
    this.isBillable =  this.repa.DIAG.BillableRepair== 0? false : true
    if(this.repa?.QUOTE?.QUOTEDETAILS !=null || this.repa?.QUOTE?.QUOTEDETAILS != undefined){
      if(Array.isArray(this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem)){
        this.selectedQuopartlist = this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem
      } 
      else{
        this.selectedQuopartlist.push(this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem);
      }
      console.log("Quote Parts ", this.selectedQuopartlist)
    }
  }


  onSubmit() 
  {  
    let partsToSend  = this.partList.filter(x => x.selected == true)

    console.log("====partsToSend=====",partsToSend)


    for( let part of partsToSend){
      console.log("part ", this.selectedQuopartlist.find( item =>item.ItemCode == part.MaterialCode && item.ItemType == "Material") )
      if ( this.isBillable == true ){ 
        let found = this.selectedQuopartlist.find( item =>item.ItemCode == part.MaterialCode )
        // && part.ItemType == "Material"
        if( !found ){
          alert(part.MaterialCode + " Part Code doesnt exists in the Quotations list")
          return
        }
      }
    }

    this.modalController.dismiss({
      partsToSend: partsToSend
    }); 
    
    // this.repairPartEvent.emit(partsToSend);
    // this.closePartSelector.emit(false);  
  }


  UpdateSelectedCount() {
    this.SelectedPartCount = this.partList.filter(x => x.selected == true).length;
  }

  
  GetBOMList() {
    let PartRequest=[]
    PartRequest.push({
      "Key":"APITYPE",
    "Value":"GetRepairPartOrderList"
  })
  PartRequest.push({
    "Key":"CaseGuid",
    "Value": this.repa?.CaseGUID
  })
  PartRequest.push({
    "Key":"PageNo",
    "Value":"1"
  })
  PartRequest.push({
    "Key":"PageSize",
    "Value":"1000"
  })
  let PartJson = JSON.stringify(PartRequest)
  let RequestContent={
    "content":PartJson
  }
   ;
  this.dynamicService.getDynamicDetaildata(RequestContent).subscribe({
    next:(value)=>{
      try {
         ;
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') {
          let data = JSON.parse(response?.ExtraData)
        
          if (data.Totalrecords == "0"){
            this.detail.next({ totalRecord: data?.Totalrecords, Data: '' })
            return
          }
          let ExtraData =[]
          if( Array.isArray(data.PartList?.Part) ){
            this.partList = data.PartList?.Part;
          }
          else{
            this.partList.push(data.PartList?.Part)
          }
          console.log(this.partList)
          this.detail.next({ totalRecord: data?.Totalrecords, Data: ExtraData })
        }
      } catch (ext) {
      }
    },
    error: err => {
      console.log(err)
    }
  })
  }

  // GetBOMList() {
  //   let requestData = [];
  //   requestData.push({
  //     "Key": "APIType",
  //     "Value":"GetRepairPartOrderList"
  //   });
  //   requestData.push({
  //     "Key": "MaterialCode",
  //     "Value": this.repa.MaterialCode
  //   });
  //   requestData.push({
  //     "Key": "RepairType",
  //     "Value": this.repa?.DIAG?.RepairType
  //   });
  //   requestData.push({
  //     "Key": "PageNo",
  //     "Value": "1"
  //   });
  //   requestData.push({
  //     "Key": "PageSize",
  //     "Value": "10"
  //   });

  //   let strRequestData = JSON.stringify(requestData);
  //   let contentRequest =
  //   {
  //     "content": strRequestData
  //   };
  //   console.log("Before SP:", requestData)
  //   this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
  //     {
  //       next: (Value) => {
  //         try {
  //           let response = JSON.parse(Value.toString());
  //           console.log("Get qoute data:",response)
  //           if (response.ReturnCode == '0') {
  //             let data = JSON.parse(response?.ExtraData)
  //             if (data.Totalrecords == "0"){
  //             alert("No Data Found")
  //               this.detail.next({ totalRecord: data?.Totalrecords, Data: '' })
  //               return
  //             }
  //             let ExtraData =[]
  //             this.ValidToDate = data?.BomObject?.ValidTo
  //             if( Array.isArray(data.BomObject?.BomDetail) ){
  //               this.partList = data.BomObject?.BomDetail;
  //               console.log("Data1",this.partList)
  //             }
  //             else{
  //               this.partList.push(data.BomObject?.BomDetail)
  //               console.log("Data2",this.partList)
  //             }
  //             this.detail.next({ totalRecord: data?.Totalrecords, Data: ExtraData })
  //           }
  //         }
  //          catch (ext) {
  //         }
  //       },
  //       error: err => {
  //         console.log(err)
  //       }
  //     }
  //   );
  // }



  onSearchChange(text) {
    console.log("search filed",text);

    for (let item of this.partList) {
      console.log("Inside function:",item)
      if (text.length > 1) {
        item.inSearch = (item.MaterialDescription.toLowerCase().includes(text.toLowerCase()) || item.MaterialCode.toLowerCase().includes(text.toLowerCase()));
      } else {
        item.inSearch = false;
      }
    }
  }


  sortArrayOfObjects = <T>(
    data: T[],
    keyToSort: keyof T,
    direction: 'ascending' | 'descending' | 'none',
  ) => {
    if (direction === 'none') {
      return data
    }
    const compare = (objectA: T, objectB: T) => {
      const valueA = objectA[keyToSort]
      const valueB = objectB[keyToSort]

      if (valueA === valueB) {

        return 0
      }

      if (valueA > valueB) {
        return direction === 'ascending' ? 1 : -1
      } else {
        return direction === 'ascending' ? -1 : 1
      }
    }

    return data.slice().sort(compare)
  }



  isToShowTr(item): Boolean {
    if (this.showonlyselected == false) {
      if (this.SearchField.length <= 1) {
        return true;
      } else if (item.selected == true) {
        return true;
      } else if (item.inSearch) {
        return true;
      } else {
        return false;
      }
    }
    else {
      if (item.selected == true) {
        return true;
      } else {
        return false;
      }

    }
  }


  setdataInPartList() {
    for (let item of this.resourceData) {
      this.partList.push({
        "currency": 'INR',
        "description": item.ResourceName,
        "imageUrl": '',
        "number": item.ResourceCode,
        "type": item.ResourceType,
        "typeDescription": item.ResourceDescription,
        "stockPrice": item.ResourceType,
        "exchangePrice": 0,
      })
    }
  }
 
 
}
