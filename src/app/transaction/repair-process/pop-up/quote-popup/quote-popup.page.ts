import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { CaseDetail } from '../../repair-process.metadata';

@Component({
  selector: 'app-quote-popup',
  templateUrl: './quote-popup.page.html',
  styleUrls: ['./quote-popup.page.scss'],
})
export class QuotePopupPage implements OnInit {

 
  typeSelected = 'ball-clip-rotate';
  toastr: any;
  validateAllFormFields: any;
  partList: any[]= [];
  resourceData: any[]=[]
  SelectedPartList: any[] = []; 
  SelectedPartCount:Number=0;
  NormalPartList:any[]=[];
  TierPartList:any[]=[];
  AcPlusPartList:any=[];
  PartSelectionMode:String="Normal"
  searchText: String = "";
  showonlyselected:boolean=false;
  errorMessage : string = "";
  detail: BehaviorSubject<any> = new BehaviorSubject<any>(null);
@Output() closePartSelectionEvent = new EventEmitter<any>();
  @Input() repa;
  @Input() materialCode;
  @Input() locationCode;
@Output() QuotePartListData = new EventEmitter<any>()
@Output() GetQuoteList = new EventEmitter<any>()

@Output() SelectedPartEmit = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void{
    
    if(changes['objcasedetail'])
    {
      this.GetBOMList('')
      // this.getPartSummaryData();      
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private dropdownDataService: DropdownDataService,
    private dynamicService: DynamicService,
    // private toast: ToastrService,
    // private ngxSpinnerService:NgxSpinnerService,
  )
  { }

  ngOnInit() {
     this.GetBOMList('')
  }


  // ======================Save Selected Data======================


  
  // for (let item of this.returnOrderPartList) {
  //   this.TotalAmount = 0
  //   if (item.selected == true) {
  //     this.SelectedReturnOrderPartList.push(item);
  //   }
  // }
  // this.returnOrderPartSelector.emit(this.SelectedReturnOrderPartList);
  // this.closeReturnOrderPartSelector.emit(false);

   onSubmit() {
  //  this.SelectedPartList=[];
    for(let item of this.partList) {
      if(item.selected == true) {
        console.log("Save Before:",item)
        this.SelectedPartList.push(item); 
        console.log("Store Selectd Data:",this.SelectedPartList);
        // this.QuotePartListData.emit(this.SelectedPartList)
        this.closePartSelectionEvent.emit('close PopUp') 
      }
    } 
    this.SelectedPartEmit.emit(this.SelectedPartList);

}

 
UpdateSelectedCount(){
  this.SelectedPartCount= this.partList.filter(x => x.selected == true).length;
}
  onSearchChange(text) { 
    console.log(text);
    for(let item of this.partList) {
      if(text.length > 1){
        item.inSearch = (item.description.toLowerCase().includes(text.toLowerCase()) || item.number.toLowerCase().includes(text.toLowerCase()));
      }else{
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
    if(this.showonlyselected==false)
    {
        if(this.searchText.length <= 1){
          return true;
        }else if(item.selected == true){
          return true;
        } else if (item.inSearch) {
          return true;
        } else{
          return false;
        }
    }
    else
    {
      if(item.selected == true)
      {
        return true;
      } else{
        return false;
      }
    }
  }


  ValidToDate: Date;
  GetBOMList(eventDetail) {
    console.log("Get  Reapa 0 DATA:",this.repa.CaseId)
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value":"GetQuotationListOBJ"
    });
    requestData.push({
      "Key": "CaseId",
      "Value":this.repa.CaseId
    });
    requestData.push({
      "Key": "PageNo",
      "Value": "1"
    });
    requestData.push({
      "Key": "PageSize",
      "Value": "10"
    });
    
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    console.log("Before SP:", requestData)
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
          console.log("Gst List:",Value)
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData)
              console.log("Data is ", data)
              if (data.Totalrecords == "0"){
                alert("No Data Found")
                this.detail.next({ totalRecord: data?.Totalrecords, Data: '' })
                return
              }
              let ExtraData =[]
              this.ValidToDate = data?.BomObject?.ValidTo
              if( Array.isArray(data.BomObject?.BomDetail) ) {
                this.partList = data.BomObject?.BomDetail;
              }
              else{
                this.partList.push(data.BomObject?.BomDetail)
              }
              console.log("Bom Rows are:- ",this.partList)
              this.detail.next({ totalRecord: data?.Totalrecords, Data: ExtraData })
            }
          } catch (ext) {
          }
        },
        error: err => {
          console.log(err)
        }
      }
    );
  }
 
  ClosePOpUp(){
    this.closePartSelectionEvent.emit('close PopUp')
  }
}
