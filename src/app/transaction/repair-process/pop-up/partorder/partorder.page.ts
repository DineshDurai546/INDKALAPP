import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonModal, ModalController, NavParams } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CaseDetail } from '../../repair-process.metadata';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';

@Component({
  selector: 'app-partorder',
  templateUrl: './partorder.page.html',
  styleUrls: ['./partorder.page.scss'],
})
export class PartorderPage implements OnInit {

  @Input() modal!: IonModal;
  @Input() GetSelectedPart:any;
  @Output() CloseOrderPartPopUp = new EventEmitter<any>()
  detail: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  @Output() SelectedPartEvent = new EventEmitter<any>();

  @Input() repa: CaseDetail;
  @Input() AlternatePartObject: any;

  GetSelectedpartList: any[] = [];

  OriginalPart: string 




  constructor(
              private dynamicService:DynamicService,
              private navParams: NavParams,
              private modalController: ModalController,


  ) { }


  ngOnInit(): void 
  {
    this.AlternatePartObject = this.navParams.get('item');  


    if ( this.AlternatePartObject ){
      this.OriginalPart = this.AlternatePartObject?.MaterialCode
      this.GetPartOrder();
    }




    // if ( this.AlternatePartObject ==null || this.AlternatePartObject == undefined){
    //   this.GetPartOrder();
    // }
    // else{
    //   console.log("AlternatePartObject", this.AlternatePartObject)
    //   if (Array.isArray(this.AlternatePartObject?.AlternatePartList?.Part)){
    //     this.AlternatePartObject?.AlternatePartList?.Part.forEach(obj => {
    //       if ( obj?.AvailableQty > 0 ){   
    //         this.GetSelectedpartList.push({
    //           OriginalPart: this.AlternatePartObject?.MaterialCode,
    //           MaterialCode: obj.MaterialCode,
    //           MaterialName: obj.MaterialName,
    //           Quantity: obj.AvailableQty,
    //           UnitPrice: obj?.UnitPrice,
    //           CompanyCode: obj?.CompanyCode ,
    //           StockGuid: obj?.StockGuid,
    //         });
    //       }
    //     });
    //   }
    //   else{
    //     let obj = this.AlternatePartObject?.AlternatePartList?.Part
    //     if ( obj?.AvailableQty > 0 ){   
    //     this.GetSelectedpartList.push({
    //       OriginalPart: this.AlternatePartObject?.MaterialCode,
    //       MaterialCode: obj.MaterialCode,
    //       MaterialName: obj.MaterialName ,
    //       Quantity: obj.AvailableQty ,
    //       UnitPrice: obj?.UnitPrice ,
    //       CompanyCode: obj?.CompanyCode ,
    //       StockGuid: obj?.StockGuid,

    //     })
    //   }
    //   }
    //   if( this.GetSelectedpartList.length < 1){
    //     alert("No Quantity Left!")
    //   }
    // }
    console.log("repa:",this.repa)
  }

  GetAlternatePartList: any[] = [];

  GetPartOrder(){
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
    "Value":"10"
  })
  console.log(" GetPart Orfer:",PartRequest)
  let PartJson = JSON.stringify(PartRequest)
  let RequestContent={
    "content":PartJson
  }
  this.dynamicService.getDynamicDetaildata(RequestContent).subscribe({
    next:(value)=>{
      console.log("Part Order::",value)
      try {
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') {
          let data = JSON.parse(response?.ExtraData)
          console.log("Part Order::",data)
          if (data.Totalrecords == "0"){
            this.detail.next({ totalRecord: data?.Totalrecords, Data: '' })
            return
          }
          let ExtraData =[]
          debugger
          if( Array.isArray(data.PartList?.Part) ){
            ExtraData = data.PartList?.Part;
          }
          else{
            ExtraData.push(data.PartList?.Part)
          }

          let partObj  = ExtraData.find( item => item.MaterialCode == this.OriginalPart)
          console.log("partObj ", partObj)
          if (Array.isArray(partObj?.AlternatePartList?.Part)){
            partObj?.AlternatePartList?.Part.forEach(obj => {
              if ( obj?.AvailableQty > 0 ){   
                this.GetAlternatePartList.push({
                  OriginalPart: this.OriginalPart,
                  MaterialCode: obj.MaterialCode,
                  MaterialName: obj.MaterialName,
                  Quantity: obj.AvailableQty,
                  UnitPrice: obj?.UnitPrice,
                  CompanyCode: obj?.CompanyCode ,
                  StockGuid: obj?.StockGuid,
                });
              }
            });
          }
          else{
              let obj = partObj?.AlternatePartList?.Part
              if ( obj?.AvailableQty > 0 ){   
              this.GetAlternatePartList.push({
                OriginalPart: this.OriginalPart,
                MaterialCode: obj.MaterialCode,
                MaterialName: obj.MaterialName ,
                Quantity: obj.AvailableQty ,
                UnitPrice: obj?.UnitPrice ,
                CompanyCode: obj?.CompanyCode ,
                StockGuid: obj?.StockGuid,
              })
            }
          }
          if( this.GetAlternatePartList.length < 1){
            alert("No Quantity Left!")
          }
          // this.detail.next({ totalRecord: data?.Totalrecords, Data: ExtraData })
          console.log("GetAlternatePartList",this.GetAlternatePartList)
        }
      } catch (ext) {
      }
    },
    error: err => {
      console.log(err)
    }
  })
}

onsubmit(){

  let partsorderToSend  = this.GetSelectedpartList.filter(x => x.selected == true)
  if( partsorderToSend.length > 1){
   alert("Kindly select 1 alternate part ")
    return
  } 

  //pass data to [repair view]
    this.modalController.dismiss({
      partsorderToSend:partsorderToSend
    })

  this.CloseOrderPartPopUp.emit(false)
}

SelectedPartOrderCount: Number = 0;

SelectedEvent(){
  this.SelectedPartOrderCount = this.GetAlternatePartList.filter(x => x.selected == true).length;
}

showonlyselected: boolean = false;
SearchField: String = "";

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

}
