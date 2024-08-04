import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges,ViewChild  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, CheckboxCustomEvent, ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { GsxService } from 'src/app/Services/gsxService/gsx.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import xml2js from 'xml2js';
import { Repair, CaseDetail } from '../repair-process.metadata';
import { v4 as uuidv4 } from 'uuid';
import * as glob from "../../../config/global";
import { RepairMetaData } from './repair.metadata';
import { RepairPopPage } from '../pop-up/repair-pop/repair-pop.page'; 
import { lastValueFrom } from 'rxjs';
import { RepairProcessPage } from '../repair-process.page';
import { PartorderPage } from '../pop-up/partorder/partorder.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; 
import { VideoCapturePlus,MediaFile,VideoCapturePlusOptions } from '@ionic-native/video-capture-plus/ngx';
import { FileViewerPage } from '../file-viewer/file-viewer.page';


@Component({
  selector: 'app-repair-view',
  templateUrl: './repair-view.page.html',
  styleUrls: ['./repair-view.page.scss'],
})
export class RepairViewPage implements OnInit { 
  @ViewChild(RepairProcessPage) RepaCompo: RepairProcessPage;

  errorMessage: any;
  handleError: any;
  selected = '';
  objRepair: Repair
  ComponentArray:any;
  RepairGUID: string
  repairview: RepairMetaData;
  compIssueForm: FormGroup;
  repairstatus = '';
  coveragehover: String;
  issueshover: String;
  username: String = "";
  reproducibilityhover: String;
  repairstatushover: '';
  isDeletshover: '';
  repairStatusForm: FormGroup
  returnOptions: string;
  GSXRepairStatusDescription: String;
  GSXRepairStatus: String;
  GSXRepairStatusDateTime: Date
  RepairDate: Date = new Date();
  RepairDocCode: String;
  GSXCode: string;
  shipments: any;
  accounts: any;
  ServiceNotificationNumber: String;
  SubTotalAmount: Number = 0;
  TaxAmount: Number = 0;
  TotalAmount: Number = 0; 
  SelectedRepairStatus: any;
  repairQuestions: any;
  RepairStatusCode: string;
  RepairStatusCodeDesc: string;
  RepairStage: string;

// ===================DECLARE BOOLEAN VALUE====================
isEdit: boolean = false
submitClicked= false ;
isAddQuote: boolean = true;
InvoiceAvailable: boolean;
isRepaircomponent:boolean=false;
isComponentIssuesPop: boolean = false;
isFormGroupCreated: boolean = false;
isRepairbtn:boolean=false;
requestReviewByApple: boolean = false
markComplete: boolean = false
isRejectReason: boolean = false
isReapirView:boolean = false;
isPartOrderDetails:boolean=false;
isDeleteAllowed: boolean = true

   // ========================ARRAY=======================
   rplist: any[] = [];
   IssuesList: any[] = [];
   selectedList = [] = [];
   selectedpartlist: any[] = [];
   ComponentList: any[] = [];
   ComponentIssueList: any[] = [];
   RepairStatusList: any[] = [];
   SelectIssueCodeDD : any[] =[]
   SelectedComponentIssue: any[] = [];
   SelectedIssuesCode:any=[];
   selectedcomponentissuelist: any[] = [];
   ReturnOrderNumber:any[]=[];
   ReturnOrderList:any[]=[];
  // ===========================All Dropdown Object==================================
  coverages: DropDownValue = DropDownValue.getBlankObject();
  reproducibility: DropDownValue = DropDownValue.getBlankObject();
  repairStatus: DropDownValue = DropDownValue.getBlankObject();
  Coverage : DropDownValue = DropDownValue.getBlankObject();
  selectComponentCode:DropDownValue = DropDownValue.getBlankObject();
  SelectIssueCode: DropDownValue = this.getBlankObject();
  SelectConsigment: DropDownValue = this.getBlankObject();
  SelectedRPType: DropDownValue = this.getBlankObject();
  // ============================INPUT AND OUTPUT ================================
  
  @Output() PopEvent = new EventEmitter();
  @Input() repa: CaseDetail;
  @Input() repairpartlist: any[] = [];
  @Input() verifiedPartList;
  //@Input() GetPartOrderfromPart:any;
  @Input() receivedGidNumber: string;
  @Output() RepairUpdated = new EventEmitter<any>();
  @Output() RepairRejectReason = new EventEmitter<any>();
  @Output() RepairOption = new EventEmitter<any>();
  @Output() RepairOptionValue = new EventEmitter<any>();
  @Output() getRepairQuestions = new EventEmitter<any>();
  @Output() openComponentIssuePopupEvent  = new EventEmitter<any>();
  @Output() PartOrderEmitter = new EventEmitter<any>();
  @Output() RepairViewEmitter = new EventEmitter<any>();
  @Output() repairAttachmentUpdated =new EventEmitter<any>();

  @ViewChild(RepairProcessPage) RepairProcessPage: RepairProcessPage;

 
  @Input() modal!: IonModal;

  constructor(private dropdownDataService: DropdownDataService, 
    private toastController: ToastController,
    private dynamicService: DynamicService,
    // private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController,
    // private spinner: NgxSpinnerService,
    private gsxService: GsxService, 
  
  ) {

  }
  DefaultRepairStatus:any
 repairData:any;
  ngOnInit(): void {
    this.repairData=this.repa 
    var user = glob.getLogedInUser();
    this.username = user.UserDetails.UserName;
    this.username = this.username.toLowerCase();
    this.repairview = new RepairMetaData();
    this.getCovarage({items: [], term: "" });
    this.OnCoverageSearch({ term: "", items: [] })
    this.onComponentCodeSearch({ term: "", items: null });
    this.OnConsigmentSearch({term: "", items: null });
    this.OnRepairheaderStatus({term: "", items: null }); 
  }

  async openFileViewer(item) {
    const modal = await this.modalController.create({
      component: FileViewerPage,
      componentProps: {
        fileSrc: item.src,
        fileType: item.fileType
      }
    });
    return await modal.present();
  }


  RepairHeadeviewr:any[]=[];
  attachmentList:any[]=[];
  RepairSettingObj:any;
  RepairStatusData:any;

  ngOnChanges(changes: SimpleChanges): void {
    debugger
    if (changes['repa']) 
    {
      if (this.repa != null && this.repa != undefined && this.repa.RepairFlag == "1") {  
        this.RepairStatusCode = this.repa.REPAIR.RepairStatusCode 
        this.RepairStatusCodeDesc = this.repa.REPAIR.RepairStatusCodeDesc
        this.SelectedRepairStatus = this.repa.REPAIR.RepairStatusCode 


        this.RepairHeadeviewr.push(this.repa.REPAIR)
        console.log("Repair Header View:",this.RepairHeadeviewr)
        if(this.repa.REPAIR.REPAIRLIST.REPAIRDETAIL != null || this.repa.REPAIR.REPAIRLIST.REPAIRDETAIL != undefined ){
          if (Array.isArray(this.repa.REPAIR.REPAIRLIST.REPAIRDETAIL)) {
            for (let item of this.repa.REPAIR.REPAIRLIST.REPAIRDETAIL) {
              this.SetRepairtObject(item)
              this.isAddQuote = true;
            }
          }
          else {
            this.SetRepairtObject(this.repa.REPAIR?.REPAIRLIST?.REPAIRDETAIL)
          }           
          for(let item of this.selectedpartlist){

            this.RepairStatusCode == 'RC' ?  item.canDelete = false :  item.canDelete = true

            this.ChangeComponentEvent(null, item)
          }

        }
        if(this.repa.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS != null || this.repa.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS != undefined ){
          if (Array.isArray(this.repa.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS )) {
            this.RepairStatusList = this.repa.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS
            // for (let item of this.repa.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS ) {
            //   // this.SetRepairtObject(item)
            // }
          }
          else {
            this.RepairStatusList.push(this.repa.REPAIR.REPAIRSTATUSLIST.REPAIRSTATUS)
            // this.SetRepairtObject(this.repa.REPAIR?.REPAIRSTATUSLIST.REPAIRSTATUS )
          }           
          let statusObj = this.RepairStatusList.find(item => item.Id == this.RepairStatusCode  )
          this.RepairStage = statusObj?.RepairStage 
          console.log("Repair status ", this.RepairStatusList)
        }
        else{
          this.RepairStatusList = []
        }
      }
       
      this.RepairStatusData =[]
      if(this.repa.REPAIRSTATUSDATA.REPAIRSTATUS != null || this.repa.REPAIRSTATUSDATA.REPAIRSTATUS != undefined ){
        if (Array.isArray(this.repa.REPAIRSTATUSDATA.REPAIRSTATUS )) {
          this.RepairStatusData = this.repa.REPAIRSTATUSDATA.REPAIRSTATUS
        }
        else {
          this.RepairStatusData.push(this.repa.REPAIRSTATUSDATA.REPAIRSTATUS)
        } 
        
        let oncreateObj = this.RepairStatusData.find( item => item.ProcessStage == 'ONCREATE')
        this.DefaultRepairStatus = oncreateObj.RepairStatusCode
      }
      else{
        this.RepairStatusList = []
      }

      if(this.repa.REPAIRSETTING != null || this.repa.REPAIRSETTING != undefined ){
        this.RepairSettingObj = this.repa.REPAIRSETTING
        console.log("Repair Setting ", this.RepairSettingObj)
      }

      if(this.repa?.JOBATTACHMENT?.ATTACHMENT != null || this.repa?.JOBATTACHMENT?.ATTACHMENT != undefined) {
        this.attachmentList = this.repa?.JOBATTACHMENT?.ATTACHMENT;
    
        this.CameraImageList = [];
        this.UploadMoreImageList = [];
    
        this.attachmentList.forEach(attachment => {

          const fileName = attachment?.AttachmentFile;
          const fileExtension = fileName.split('.').pop()?.toLowerCase(); 

            if (attachment.AttachmentOriginType === 'RepairCameraImage') {
                this.CameraImageList.push(attachment);
            } 
            else if (attachment.AttachmentOriginType === 'RepairUploadImage') {
                // Determine file type based on file extension
            let fileType = 'document';
            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                fileType = 'image';
            } else if (fileExtension === 'pdf') {
                fileType = 'pdf';
            } else if (['mp4', 'avi', 'mov'].includes(fileExtension)) {
                fileType = 'video';
            }
            attachment.fileType = fileType;
            this.UploadMoreImageList.push(attachment);
            }
        });
    
        this.CameraImageList.forEach(item => {
            item.src = glob.GLOBALVARIABLE.SERVER_LINK + item?.AttachmentFile;
            item.filename = item?.AttachmentFile;
        });
    
        this.UploadMoreImageList.forEach(item => {
            item.src = glob.GLOBALVARIABLE.SERVER_LINK + item?.AttachmentFile;
            item.filename = item?.AttachmentFile;
        });
    }
    
      this.onComponentCodeSearch({ term: "", items: null });

      // else{
      //   debugger
      //   let repairStatusList =[]
      //   if(this.repa.REPAIRSTATUSDATA.REPAIRSTATUS != null || this.repa.REPAIRSTATUSDATA.REPAIRSTATUS != undefined ){
      //     if (Array.isArray(this.repa.REPAIRSTATUSDATA.REPAIRSTATUS )) {
      //       repairStatusList = this.repa.REPAIRSTATUSDATA.REPAIRSTATUS
      //     }
      //     else {
      //         repairStatusList.push(this.repa.REPAIRSTATUSDATA.REPAIRSTATUS)
      //     } 
          
      //     let oncreateObj = repairStatusList.find( item => item.ProcessStage == 'ONCREATE')
      //     this.DefaultRepairStatus = oncreateObj.RepairStatusCode
      //   }
      //   else{
      //     this.RepairStatusList = []
      //   }
      // }
      this.changeRepairData()
      }  
  }
  
  
  getCovarage($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.CovarageOption, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          console.log(value);
          this.coverages = value;
          console.log("Coverage Data:",this.coverages)
        }
      },
      error: (err) => {
        this.coverages = DropDownValue.getBlankObject();
      }
    });
  }

  get_Component_Issue() {
    let searchData = { device: { "id": this.repa.SerialNo1 } };
    let strRequestData = JSON.stringify(searchData);
    let contentRequest = {"content": strRequestData};
    this.gsxService.getComponentIssue(contentRequest).subscribe(
      {
        next: (value) => {
          let response = JSON.parse(value.toString());
          this.ComponentIssueList = response.componentIssues;
          this.ComponentList = this.ComponentIssueList;
        }
      });
  }


  OnCoverageSearch($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.coverage, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          console.log(value);
          this.Coverage = value;
          console.log("Coverage data: this.Coverage", this.Coverage)
        }
      },
      error: (err) => {
        this.Coverage = DropDownValue.getBlankObject();
      }
    });
  }

//==================== Repair Xml =============================================== 

getRepairXml() {
  let rawData = {
    "rows": []
  }

  for (let item of this.selectedpartlist ) {
    rawData.rows.push({
      "row": {
        "RepairDetailGUID":item.RepairDetailGUID == null || item.RepairDetailGUID == undefined ?  uuidv4() : item.RepairDetailGUID,
        "RepairGUID": this.RepairGUID,
        "ComponentCode":item.ComponentCode,
        "CompanyCode":glob.getCompanyCode(),
        "IssueCode":item.IssueCode,
        "ReproducibilityCode":"",
        "SectionCode":"",
        "ConsignmentStockUsed":item.ConsignmentStock=="NO"? 0:1,
        "KGB":"",
        "KBB":"",
        "PartType":item.PartType,
        "ImageUrl":"",
        "PartCode":item.MaterialCode,
        "PartUsed":item.PartUsed == null || item.PartUsed == undefined ? '' : item.PartUsed,
        "StockGuid":item.StockGuid == null || item.StockGuid == undefined ?'00000000-0000-0000-0000-000000000000': item.StockGuid ,
        "PartOrderGuid":item.PartOrderGuid == null || item.PartOrderGuid == undefined ?'00000000-0000-0000-0000-000000000000': item.PartOrderGuid ,
        "PartOrderFlag": item.PartOrderFlag == null || item.PartOrderFlag == undefined ?'0': item.PartOrderFlag ,
        "ReturnOrderGuid":item.ReturnOrderGuid == null || item.ReturnOrderGuid == undefined ?'00000000-0000-0000-0000-000000000000': item.ReturnOrderGuid ,
        "ReturnOrderFlag": item.ReturnOrderFlag == null || item.ReturnOrderFlag == undefined ?'0': item.ReturnOrderFlag ,
        "PartSerialized":"",
        "CoverageOption":item.CoverageCode,
        "Quantity":item.Quantity,
        "billable":item.CoverageCode == "BLABL" ? 1 : 0 ,
        "UnitPrice": item.UnitPrice,
        "TaxAmount":0,
         "NetPrice":0,
         "Currency":"INR",
         "IsDeleted": item.isDeleted == null || item.isDeleted == undefined ? '0' : item.isDeleted,
         "AttachmentFile" : !item.AttachmentFile ? '' : item.AttachmentFile
      }
    })
  }
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(rawData);
  xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
  xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
  console.log("XML ", xml)
  return xml;
}

  // =============== Return Order part xml==========================================
ReturnOrderDetailXml(){
  let rawData = {
    "rows": []
  }
  for (let item of this.selectedpartlist) {
    rawData.rows.push({
      "row": {
        "ReturnOrderGUID": item.ReturnOrderGUID == null || item.ReturnOrderGUID == undefined ? uuidv4() : item.ReturnOrderGUID,
         "CaseGUID": this.repa.CaseGUID ,
         "CaseId": this.repa.CaseId ,
         "ReturnOrderType": "KBB", 
         "CompanyCode": glob.getCompanyCode() ,
         "RepairDetailGUID": item.RepairDetailGUID,
         "RepairDocCode": this.repa.REPAIR.RepairDocCode,
         "LocationCode": this.repa.LocationCode,
         "ToLocationCode": this.repa.LocationCode,
         "MaterialCode": item.PartCode,
         "PartCode":item.PartCode,
         "ReturnOrderStatus": item.ReturnOrderStatus == null || item.ReturnOrderStatus == undefined ? "OPEN" : item.ReturnOrderStatus,
         "SerialNo": this.repa.SerialNo1, //TODO
         "SerializedFlag": item.PartSerialized,
         "UnitPrice": "0",   //TODO
         "CostPrice": "0"
      }
    })
  }
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(rawData);
  xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
  xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
  xml = xml.split(' ').join('')
  console.log("Updated xml", xml);
  return xml;
}

onComponentCodeSearch($event: { term: string; items: any[] }) {
  this.dropdownDataService.fetchDropDownData(DropDownType.bindcomponentcode, $event.term,{
    MaterialCode:this.repa?.MaterialCode
  })
    .subscribe({
      next: (value) => {
        if (value != null) {
          this.selectComponentCode = value;
          this.onIssueCodeSearch({ term: "", items: [] }, '');
          // this.SelectIssueCode = this.getBlankObject();
        }
      },
      error: (err) => {
        this.selectComponentCode = this.getBlankObject();
        this.SelectIssueCode = this.getBlankObject();
      },
    });
}


     
  async onIssueCodeSearch($event: { term: string; items: any[] }, item) {
    // console.log("issue form:",this.ReapiViewForm.controls["component"].value)
    this.dropdownDataService.fetchDropDownData(DropDownType.bindissueCode, $event.term, {
      ComponentCode: item.ComponentCode//this.ReapiViewForm.controls["component"].value,
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.SelectIssueCode = value;
          console.log("Component Extra Data:",this.SelectIssueCode)
        }
      },
      error: err => {
        this.SelectIssueCode = this.getBlankObject();
      }
    });
  }

 

  coverageEvent(event,item){
    const CoverageObj={
      "CoverageCode":event.Id,
      "CoverageDesc":event.TEXT
    }
    let index = this.selectedpartlist.findIndex(part => part == item)
    this.selectedpartlist[index].CoverageCode =event.Id
    this.selectedpartlist[index].CoverageDesc = event.TEXT
  }


  ChangeIssueEvent(event, item) {
    console.log('ChangeIssueEvent CHECK=====', event);
    let IssueObj;
    if (event == null) {
        IssueObj = {
            "IssueCode": item.IssueCode,
            "IssueDesc": item.IssueDescription
        };
    } else {
        IssueObj = {
            "IssueCode": event.IssueCode,
            "IssueDesc": event.IssueDescription
        };
        // Assuming selectedpartlist is an array of items and you want to update the corresponding item
        let Index = this.selectedpartlist.findIndex(part => part == item);
        // Update the IssueCode and IssueDesc of the selected item
        this.selectedpartlist[Index].IssueCode = event.detail.value; // Use event.detail.value to get the selected value
        this.selectedpartlist[Index].IssueDesc = event.IssueDescription;
    }
    this.GetCoverageDataForPart(item);
}


  // ChangeIssueEvent(event, item){
  //   console.log('ChangeIssueEvent CHECK=====',event)
  //   let IssueObj
  //   if(event == null){
  //   IssueObj={
  //   "IssueCode":item.IssueCode,
  //   "IssueDesc":item.IssueDescription
  //   }
  // }

  // else{  
  // IssueObj={
  //   "IssueCode":event.IssueCode,
  //   "IssueDesc":event.IssueDescription
  //   }
  //   let Index = this.selectedpartlist.findIndex(part => part == item)
  //   this.selectedpartlist[Index].IssueCode = event.Id
  //   this.selectedpartlist[Index].IssueDesc = event.extraData
  // }
  // this.GetCoverageDataForPart(item)
 
  // }

GetCoverageDataForPart(item)
{
  console.log("item", item)
  let requestData = [];
  requestData.push({
    "Key": "ApiType",
    "Value":"GetCoverageDataForPart"
  });
  requestData.push({
    "Key": "WarrantyCode",
    "Value":  item.WarrantyCode
  });
  requestData.push({
    "Key": "ComponentCode",
    "Value": item.ComponentCode
  });
  requestData.push({
    "Key": "IssueCode",
    "Value":  item.IssueCode
  });
  requestData.push({
    "Key": "WarrantyStatus",
    "Value":  item.WarrantyStatusCode
  });
  console.log("Reapir Save Details:",requestData)
  let strRequestData = JSON.stringify(requestData);
  let contentRequest = {
    "content": strRequestData
  };
  // 
  this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
    {
      next: (value) => {
      //  this.spinner.hide();
        debugger
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') {
          let data = JSON.parse(response?.ExtraData);
          console.log(" Object:- ", data)
          let Index = this.selectedpartlist.findIndex(part => part == item)
          console.log("data?.Warranty ", data?.WarrantyDetails?.Warranty)
          let warrantyObj =  data?.WarrantyDetails?.Warranty
          if( data?.Totalrecords == '1'){
            this.selectedpartlist[Index].CoverageCode = warrantyObj?.ChangeToWarrantyStatusCode  == "IW" ? 'FOC' : (warrantyObj?.ChangeToWarrantyStatusCode == "OW" ? 'BLABL' : undefined)
          }
          else{
            this.selectedpartlist[Index].CoverageCode =  item.WarrantyStatusCode === "IW" ? 'FOC' : (item.WarrantyStatusCode === "OW" ? 'BLABL' : undefined)
          }
         // this.spinner.hide();
        }
        else {
         // this.spinner.hide();
          this.errorMessage = response.ReturnMessage;
          const parser = new xml2js.Parser({ strict: false, trim: true });
          parser.parseString(response.ErrorMessage, (err, result) => {
            response['errorMessageJson'] = result;
            console.log("response", response)
          //  this.toastr.error("")
          });
        }
        console.log("Parts ", this.selectedpartlist)
      },
      error: err => {
        console.log(err);
     //   this.spinner.hide();
       alert(err.toString());
      }
    });
}


ConsugnmentEvent(event, item) {
  debugger
 console.log('ConsugnmentEvent check=========',event)
  let index = this.selectedpartlist.findIndex(part => part == item)
  this.selectedpartlist[index].ConsignmentStock = event.detail.value
  if(event.detail.value== "NO"){
    this.selectedpartlist[index].PartUsed = ""
    this.selectedpartlist[index].StockGuid = "00000000-0000-0000-0000-000000000000"
  }
  console.log("Parts ", this.selectedpartlist)
}

  // ChangeComponentEvent(event, item) {
  //   if (event != null) {  
  //     // If a new value is selected from the dropdown
  //     const ComponentObj = {
  //       "ComponentCode":item.ComponentCode,
  //       "ComponentDesc": item.ComponentDesc
  //     };
  
  //     // Update item.ComponentCode and selectedpartlist
  //     //item.ComponentCode = ComponentObj.ComponentCode;
  
  //     // Update selectedpartlist
  //     const index = this.selectedpartlist.findIndex(part => part === item);
  //     if (index !== -1) {
  //       this.selectedpartlist[index].ComponentCode = ComponentObj.ComponentCode;
  //       this.selectedpartlist[index].ComponentDesc = ComponentObj.ComponentDesc;
  //     }
  //   } else { 
  //   }
   
  //   this.onIssueCodeAsyncSearch({ term: "", items: [] }, item);
  // }
  

  ChangeComponentEvent(event, item){
    //  
    console.log("ChangeComponentEvent:",item)
    let CompoentObj
    if (event == null ){
      CompoentObj={
        "ComponentCode":item.ComponentCode,
        "ComponentDesc":item.ComponentDescription
      }
    }
    else{
      CompoentObj={
        "ComponentCode":event.Id,
        "ComponentDesc":event.extraData
      }
  
      let index = this.selectedpartlist.findIndex(part => part == item)
      this.selectedpartlist[index].ComponentCode = event.Id
      this.selectedpartlist[index].ComponentDesc = event.extraData
    }

    this.onIssueCodeAsyncSearch({ term: "", items: [] }, item);
    // this.ChangeIssueEvent(null,item)

  }


  // ChangeComponentEvent(event, item){ 
  //   let ComponentObj
  //   if (event == null ){
  //     ComponentObj={
  //       "ComponentCode":item.ComponentCode,
  //       "ComponentDesc":item.ComponentDescription
  //     }
  //   }
  //   else{
  //     ComponentObj={
  //       "ComponentCode":event.Id,
  //       "ComponentDesc":event.extraData
  //     }
  //     item.ComponentCode = ComponentObj.ComponentCode; 
  //     let index = this.selectedpartlist.findIndex(part => part == item)
  //     this.selectedpartlist[index].ComponentCode = event.Id
  //     this.selectedpartlist[index].ComponentDesc = event.extraData
  //   }
  
  //   this.onIssueCodeAsyncSearch({ term: "", items: [] }, item);
  //   // this.ChangeIssueEvent(null,item)

  // }


  checkAvailableQty(item){
    debugger
    if (item.AvailableQty < 1) {
      if( item?.AlternatePartList ){
        if (Array.isArray(item?.AlternatePartList?.Part)){
          for ( let part of  item?.AlternatePartList?.Part){
            if ( part?.AvailableQty > 0 ){   
              return "YES"  
            }
          }
        }
        else{
            if ( item?.AlternatePartList?.Part?.AvailableQty > 0 ){   
              return "YES"  
            }
        }
      }
      return "NO"
    }
    else 
      return "YES"   
  }

  SetRepairtObject(item:any){  
    this.selectedpartlist=[];
    console.log("Get Repair Data:",item)
    const RepairObj={
    "RepairDetailGUID" : item?.RepairDetailGUID, 
    "PartOrderGuid":item?.PartOrderGuid ,
    "PartOrderFlag": item?.PartOrderFlag,
    "ReturnOrderGuid":item?.ReturnOrderGuid ,
    "ReturnOrderFlag": item?.ReturnOrderFlag ,
    "MaterialCode":item.PartCode,
    "ItemType":item.ItemType,
    "PartType":item.PartType,
    "ComponentCode":item.ComponentCode  ,
    "MaterialName":item.PartDescription,
    "ComponentDesc":item.ComponentDescription,
    "IssueCode":item.IssueCode,
    "IssueDesc":item.IssueDescription,
    "CoverageCode":item.CoverageOption,
    "ConsignmentStock":item.ConsignmentStockUsed === "0" ? "NO" : "YES",
    "isDeleted":item.IsDeleted,
    "CoverageDesc":item.CoverageDescription,
    "UnitPrice":item.UnitPrice,
    "Quantity":item.Quantity,
    "AvailableQty":item.AvailableQty,
    "AlternatePartList": item.AlternatePartList,
    "PartTypeDesc" : item.PartTypeDesc,
    "PartUsed" : item.PartUsed,
    "DBPartUsed" : item.PartUsed,
    "WarrantyCode" : item.WarrantyCode,
    "AttachmentFile" : item.AttachmentFile,
    "canDelete": item.canDelete,
    "PARTORDER" : item.PARTORDER ,
    "RETURNORDER" : item.RETURNORDER ,
    "editMode" :true
    }
    this.selectedpartlist.push(RepairObj)
    console.log("Repairt Data with Object:",this.selectedpartlist)
  }

  getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }

 
deletePartsList(item) {
  if (this.repa?.RepairFlag == '0') {
    let index = this.selectedpartlist.indexOf(item);
    this.selectedpartlist.splice(index, 1); 

  } else if (this.repa?.RepairFlag == 1) {
    let index = this.selectedpartlist.indexOf(item);
    this.selectedpartlist[index].isDeleted = 1
  }
 
  if(this.selectedpartlist.length < 1 ){
    this.isEdit = false
  }
}


  receiveMessageFromChild(event)
  {

  }

  addPartsToRepair(event)
  {

  }
  
  //Close Reapir Parts
  dismissModal() {
    this.modalController.dismiss();
  }
 
  
private canDismissOverride = false;

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

//Add Repair Parts Popup
async openModal() {
  const modal = await this.modalController.create({
    component: RepairPopPage,
    componentProps: {
      repairData: this.repairData // Pass the item to the modal component
    }
  });
   await modal.present();

   modal.onDidDismiss().then((dataReturned) => {
    if (dataReturned?.data?.partsToSend !== null && dataReturned?.data?.partsToSend) { 
console.log('From Repair Part popup= ',dataReturned.data.partsToSend)
      this.repairPartsList(dataReturned.data.partsToSend)
      
    }
  });
 
}


//PartOrder popup
async openPartOrderModal(item) {
  const modal = await this.modalController.create({
    component: PartorderPage,
    componentProps: {
      item: item // Pass the item to the modal component
    }
  });
   await modal.present();

   modal.onDidDismiss().then((dataReturned) => {
    if (dataReturned?.data?.partsToSend !== null && dataReturned?.data?.partsToSend) { 

      this.GetPartOrder(dataReturned.data.partsToSend)
      
    }
  });
 
}

PartItem:any;
ComponentEvent(item){
this.PartItem = item
this.openComponentIssuePopupEvent.emit(true)
}
  
 
async onIssueCodeAsyncSearch($event: { term: string; items: any[] }, item) {
  try {
    const value = await lastValueFrom(this.dropdownDataService.fetchDropDownData(DropDownType.bindissueCode, $event.term, {
      ComponentCode: item.ComponentCode
    }));
    if (value != null) {

      let index = this.selectedpartlist.findIndex( part => part == item)
      this.SelectIssueCode = value;
      this.selectedpartlist[index].IssuesList = value;
      console.log("Component Code Drop",this.selectedpartlist)
    }
  } catch (err) {
    this.SelectIssueCode = this.getBlankObject();
  }
}

PartOrderPopUp(item): void {
  //this.callChildFunction.emit(item);
 // this.callParentFunction.emit('hello')
}


OnConsigmentSearch($event: { term: string; items: any[] }) {
  this.dropdownDataService.fetchDropDownData(DropDownType.CONSIGNMENTSTOCK, $event.term, {
  }).subscribe({
    next: (value) => {
      if (value != null) {
        console.log(value);
        this.SelectConsigment = value;
        console.log("Consiginmenet data:",this.SelectConsigment)
      }
    },
    error: (err) => {
      this.SelectConsigment = DropDownValue.getBlankObject();
    }
  });
}

OnRepairheaderStatus($event: { term: string; items: any[] }) {
  this.dropdownDataService.fetchDropDownData(DropDownType.RepairheaderStatus, $event.term, {
  }).subscribe({
    next: (value) => {
      if (value != null) {
        console.log(value);
        this.SelectedRPType = value;
      }
    },
    error: (err) => {
      this.SelectedRPType = DropDownValue.getBlankObject();
    }
  });
}




//call from repair pop-up close
repairPartsList(repairpartlist)
{  
  if (repairpartlist != null && repairpartlist != undefined) 
    {   
     console.log("PartCode array2:",this.selectedpartlist)
     for (let item of repairpartlist) {
       item.CoverageCode = item.WarrantyStatusCode === "IW" ? 'FOC' : (item.WarrantyStatusCode === "OW" ? 'BLABL' : undefined)
       item.DBPartUsed=''
       item.Quantity = 1  
       if (item.PartType != 'SVIBL'){
         item.ConsignmentStock =  this.checkAvailableQty(item)   
         // item.AvailableQty < 1 ? "NO" : "YES"  
       }  
       if ( this.RepairSettingObj?.ConsumptionType == 'SHIP_FROM_BRAND'){

       } 
       item.editMode =false;

       if (!this.selectedpartlist.some(elem => elem.PartCode === item.MaterialCode || elem.MaterialCode === item.MaterialCode )) {
         this.presentToast("Part Added Successfully",'success')
      
         this.selectedpartlist.push(item);
         this.isAddQuote = false;
       }
       else{
        this.presentToast("Already Exists",'danger')
       }
     
     }
     this.selectedpartlist = this.selectedpartlist.map((item, index) => {
       return {
         ...item,
         ComponentCode: "",
         ComponentDesc: "",
         IssueCode: "",
         IssueDesc:"",
       };
     });
     
     let componentList: any[] = []
     if(Array.isArray(this.repa.DIAG.DIAGLIST.DIAGDETAIL)){
      componentList = this.repa.DIAG.DIAGLIST.DIAGDETAIL
     }
     else{
       componentList.push(this.repa.DIAG.DIAGLIST.DIAGDETAIL)
     }
     if( componentList != null || componentList != undefined ){
       const firstComponent = componentList[0];
       const { ComponentCode, ComponentDesc, IssueCode, IssueDesc } = firstComponent;
       this.selectedpartlist.forEach(item => {
         item.ComponentCode = ComponentCode || ""; 
         item.ComponentDesc = ComponentDesc || ""; 
         item.IssueCode = IssueCode || ""; 
         item.IssueDesc = IssueDesc || ""; 
         this.ChangeComponentEvent(null, item)
         // this.ChangeIssueEvent(null, item)
       });
     }
   
  }
  this.changeRepairData()

}
 
//call from Part-Order pop-up close
GetPartOrder(PartOrderfromPart)
{
  if(PartOrderfromPart != undefined || PartOrderfromPart != null){
    console.log("Part ", PartOrderfromPart)
    for(let items of PartOrderfromPart){
        let index = this.selectedpartlist.findIndex(part =>part.MaterialCode == items.OriginalPart);
        if (index != -1) {
        const PartOrderObj = {
        "PartCompanyCode": items.CompanyCode,
        "PartLocationCode":items.MaterialCode,
        "PartQuantity":items.Quantity,
        "partUOMCode":items.UnitPrice,
        "PartMaterialCode":items.MaterialCode,
        "StockGuid": items?.StockGuid,
        };
        this.selectedpartlist[index].PartUsed = PartOrderObj.PartMaterialCode;
        this.selectedpartlist[index].PartCompanyCode = PartOrderObj.PartCompanyCode;
        this.selectedpartlist[index].StockGuid = PartOrderObj.StockGuid;
        this.selectedpartlist[index].PartLocationCode = PartOrderObj.PartLocationCode;
        this.selectedpartlist[index].PartMaterialCode = PartOrderObj.PartMaterialCode;
        this.selectedpartlist[index].PartQuantity = PartOrderObj.PartQuantity;
        this.selectedpartlist[index].partUOMCode = PartOrderObj.partUOMCode;
      }
    }
  }
}

changeRepairData(){ 
  for( let part of this.selectedpartlist){

    if ( part.PartType == "CS" || part.PartType == "PKM" ){
      part.showComponentIssue = false 
      part.ComponentCode = ""
      part.ComponentDesc =""
      part.IssueCode = ""
      part.IssueDesc = ""
    }
    else{
      part.showComponentIssue = true
    }
    if( part.PartType == "SVIBL"){
      
    }
    
  }
  if(this.selectedpartlist.length > 0 ){
    this.isEdit = true
  } 
}

AddRepairParts() {
  if (this.isAddQuote == true) {
    this.isAddQuote = false;
  } else {
    this.isAddQuote = true;
  }
}

// =========================Save RepairPart List====================================
validateRepairParts(){
    
  let shouldContinue = true
  if( !this.RepairDocCode ){
    // if(this.SelectedRepairStatus == null || this.SelectedRepairStatus == undefined || this.SelectedRepairStatus == ''){
    //   this.toastr.error("Kindly select a repair status")
    //   return
    // }
  }
  //  
  if(this.repa.DIAG.BillableRepair == 1 && !this.repa.QUOTE ){
    // this.toastr.error("Kindly create a quotation first!")
    this.presentToast(`Kindly create a quotation first!`,'danger')

    return
  }
  if( this.repa.QUOTE ){
    if ( this.repa.QUOTE.QuoteStatus != 'APPROVED'){
      // this.toastr.error("Quotation not approved!")
    this.presentToast(`Quotation not approved!`,'danger')

      return
    }
  }

  let noOfParts = this.selectedpartlist.length
  if ( this.repa.Brand == 'BOAT' && noOfParts > 2){
    // this.toastr.error("Maximum only 2 parts are allowed for this Brand!")
    this.presentToast(`Maximum only 2 parts are allowed for this Brand!`,'danger')

    return
  } 
    
  let partUsedPending = false
  for( let part of this.selectedpartlist){

    if ( part.PartType != "CS" && part.PartType != "PKM" ){ 
      if ( part.ComponentCode == "" || part.ComponentCode == null || part.ComponentCode == undefined){
        // this.toastr.error(part.MaterialCode , "Component Code not specified")
        this.presentToast(`${part.MaterialCode} Component Code not specified`,'danger')

        shouldContinue = false
      }
      else if ( part.IssueCode == "" || part.IssueCode == null || part.IssueCode == undefined){
        // this.toastr.error(part.MaterialCode , "Issue Code not specified")
        this.presentToast(`${part.MaterialCode} Issue Code not specified`,'danger')

        shouldContinue = false
      }
      
    }
    
    if( part.ItemType == 'Material'){
      //  
      if ( part.Quantity == 0 || part.ConsignmentStock == 'YES') {
        if (part.PartUsed == '' || part.PartUsed == null || part.PartUsed == undefined) {
         // this.toastr.error(part.MaterialCode , "Select a part to be consumed for Part Code")
         this.presentToast(`${part.MaterialCode} Select a part to be consumed for Part Code`,'danger')

          shouldContinue = false
        }
      }
      else if ( this.RepairSettingObj?.ConsumptionType == 'ALLOW_IF_EXISTS') {
        if (part.PartUsed == '' || part.PartUsed == null || part.PartUsed == undefined) {
         // this.toastr.error(part.MaterialCode , "Stock not available for")
          this.presentToast(`${part.MaterialCode} Stock not available for`,'danger')

          shouldContinue = false
        }
      }
    }   

    if ( ((part.ConsignmentStock == 'YES' && part.editMode==false) || (part.ConsignmentStock == 'NO' && part.editMode==true)) 
      && (part.DBPartUsed == undefined || part.DBPartUsed==''  ) 
      && (this.RepairSettingObj?.ConsumptionType != 'SHIP_FROM_BRAND')){
      if (part.PartUsed== null || part.PartUsed == undefined || part.PartUsed ==''){
        partUsedPending = true
      }
    }
    
  }
  let repairStatusObj = this.RepairStatusData.find(item => item.RepairStatusCode == this.SelectedRepairStatus)
  let repairStage = repairStatusObj?.RepairStage
  let repairResult = repairStatusObj?.RepairResult
  if ( repairStage == 'COMPLETED' && repairResult == 'SUCCESS' && partUsedPending){
    this.presentToast('Part Consumption Pending! Cant Complete the Repair','danger')
    //this.toastr.error("Part Consumption Pending! Cant Complete the Repair")
    return
  }


  if(shouldContinue == false){
    return
  }
  this.onSubmit()
  // showComponentIssue
}

//this.presentToast('"Part Consumption Pending! Cant Complete the Repair','danger')
//this.presentToast(`${part.MaterialCode} Stock not available for`,'danger')

  // ============================= Upload Image===============
  uploadedimageXML(){
    let rawData = {
      "rows": []
    }
 

  for(let image of this.CameraImageList)
  {
    console.log("Upload Image:",image)
        rawData.rows.push({
          "row": {
            "CaseGuid":image.CaseGuid,
            "AttachmentOriginType":'RepairCameraImage',
            "AttachmentFile":image.AttachmentFile,
            "AttachmentType":'Image'
          }
        })    
  }
  for(let image of this.UploadMoreImageList)
  {
    const attachmentType = this.determineAttachmentType(image.AttachmentFile);
    console.log("Upload Image:",image)
        rawData.rows.push({
          "row": {
            "CaseGuid":image.CaseGuid,
            "AttachmentOriginType":'RepairUploadImage',
            "AttachmentFile":image.AttachmentFile,
            "AttachmentType":attachmentType
          }
        })    
  }

  for(let image of this.CameraVideoList)
  {
    console.log("Upload Image:",image)
        rawData.rows.push({
          "row": {
            "CaseGuid":image.CaseGuid,
            "AttachmentOriginType":'RepairVideo',
            "AttachmentFile":image.AttachmentFile,
            "AttachmentType":'Image'
          }
        })    
  }
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(rawData);
    xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
    xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
    return xml;
  }



onSubmit(){
 
 // this.spinner.show();
    this.RepairGUID  = this.repa?.RepairGUID ==  '00000000-0000-0000-0000-000000000000' || this.repa?.RepairGUID == undefined || this.repa?.RepairGUID == null  ? uuidv4(): this.repa.REPAIR.RepairGUID
    
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value":"SaveRepair"
    });
    requestData.push({
      "Key": "CompanyCode",
      "Value": glob.getCompanyCode()
    });
    requestData.push({
      "Key": "RepairDocType",
      "Value": this.repa.DIAG.RepairType
    });
    requestData.push({
      "Key": "RepairGUID",
      "Value": this.RepairGUID
    });
    requestData.push({
      "Key": "CaseGUID",
      "Value": this.repa.CaseGUID
    });
    requestData.push({
      "Key": "CaseId",
      "Value": this.repa.CaseId
    });
    requestData.push({
      "Key": "RepairDocCode",
      "Value": this.RepairDocCode == undefined || this.RepairDocCode == null ? " " : this.RepairDocCode,
    });
    requestData.push({
      "Key": "RepairStatusCode",
      // "Value":  this.SelectedRepairStatus ? this.SelectedRepairStatus : ( this.RepairStatusCode ? this.RepairStatusCode :  "RFP"),
      "Value":  this.SelectedRepairStatus ? this.SelectedRepairStatus : ( this.RepairStatusCode ? this.RepairStatusCode :  this.DefaultRepairStatus),

    });
    requestData.push({
      "Key": "RepairDate",
      "Value": this.RepairDate
    });
    requestData.push({
      "Key": "LocationCode",
      "Value": this.repa.LocationCode
    });
    requestData.push({
      "Key": "RepairRemark",
      "Value": ""
    });
    requestData.push({
      "Key": "TechnicianCode",
      "Value": this.repa.ASGTECH.TechCode
    });
    requestData.push({
      "Key": "RepairDetail",
      "Value": this.getRepairXml()
    });



    console.log("Reapir Save Details:",requestData)
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    }; 
    // return
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (value) => {
        //  this.spinner.hide();
          let response = JSON.parse(value.toString());
          if (response.ReturnCode == '0') {
            this.saveAttachment()
            this.presentToast( "Updated Successfully" ,'success') 
            var data = JSON.parse(response.ExtraData)
            this.RepairUpdated.emit(data);
            //this.dismissModal();
           // window.location.reload()
           /// this.spinner.hide();
          }
          else {
          //  this.spinner.hide();
          this.errorMessage = response.ReturnMessage;
          let errorMessage = response.ErrorMessage;
          this.presentToast(errorMessage,'danger');

            const parser = new xml2js.Parser({ strict: false, trim: true });
            parser.parseString(response.ErrorMessage, (err, result) => {
              const errorMessages = result.ERRORMESSAGEROW.ERRORMESSAGE;
              errorMessages.forEach((errorMessage) => {
                this.presentToast(errorMessage.ERRORMESSAGE,'danger');
              });
            });
          }
        },
        error: err => {
          console.log(err);
      //    this.spinner.hide(); 
      this.presentToast( err.toString(),'danger') 
        }
      });
}



saveAttachment()
{

  let requestData = []
  requestData.push({
    "Key": "APITYPE",
    "Value": "Save_RepairAttachment"
  })
  requestData.push({
    "Key": "CaseId",
    "Value": this.repa.CaseId
  });
  requestData.push({
    "Key": "CaseGUID",
    "Value": this.repa.CaseGUID
  });
  requestData.push({
    "Key": "Attachment",
    "Value": this.uploadedimageXML()
  })

  let CustRequestJson = JSON.stringify(requestData);
  let contentRequest = {
    "content": CustRequestJson
  }
  debugger
  this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
    next: (value) => {
      let Response = JSON.parse(value.toString())
      if (Response.ReturnCode == "0") { 
       this.presentToast("Saved Successfully" ,'success')   
      // this.RepairProcessPage.getRepair();
       var getval = JSON.parse(Response.ExtraData); 
       this.repairAttachmentUpdated.emit(getval)
       //this.modalController.dismiss();

       // window.location.reload();
      }
    }
  })
}


determineAttachmentType(fileName: string): string {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  switch (fileExtension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'Image';
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'Video';
    case 'pdf':
      return 'Document';
    // Add more cases as needed
    default:
      return 'Unknown';
  }
}




isModalOpen = false;
setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
}
closePopUp(event)
{
  // alert(event)
  this.isModalOpen = event;
}

CoveargeEvent(event,item){
  const CoverageObj={
    "CoverageCode":event.Id,
    "CoverageDesc":event.TEXT
  }
  let index = this.selectedpartlist.findIndex(part => part == item)
  this.selectedpartlist[index].CoverageCode =event.Id
  this.selectedpartlist[index].CoverageDesc = event.TEXT
}



imageUpload(event: any, item) {
  for (var i = 0; i <= event.target.files.length - 1; i++) {
    let fileToUpload = <File>event.target.files[0];
    if( fileToUpload.type.match(/\/jpg|\/jpeg|\/png|\/pdf/) == null ){
      this.presentToast("Please select a jpg, jpeg, png or pdf file type" ,'danger')  
      return;
    }
    const formData = new FormData();
    var filename = uuidv4() + "_" + fileToUpload.name;
    formData.append('file', fileToUpload, filename);
    this.dynamicService.uploadimagefile(formData).subscribe(
      {
        next: (value) => {

          let uploadedimage: any;
          uploadedimage = value;
          console.log("selectedpartlist ",this.selectedpartlist)
          let index = this.selectedpartlist.findIndex( item => item.MaterialCode == item.MaterialCode)
          this.selectedpartlist[index].AttachmentFile = glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath
          //dinesh console selectedpartlist check evrty single pic append to selectedpartlist.attachment
          console.log("selectedpartlist ",this.selectedpartlist)
          // this.isFrontIcon = false;
        }
      });
  }
}
removeImage(item){
  let index = this.selectedpartlist.findIndex( item => item.MaterialCode == item.MaterialCode)
  this.selectedpartlist[index].AttachmentFile =null
}

private getFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

ImageName:any; 
CameraImageList:any[]=[];
UploadMoreImageList:any[]=[];
CameraVideoList:any[]=[];

  async takePicture(event,item)
{
  try {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });  

    console.log('CAMERA EVENT ==',event)

    this.ImageName = this.getFileName(image.webPath);
    console.log('ImageName ==',this.ImageName)

    const formData = new FormData();
    const blob = await fetch(image.webPath).then(response => response.blob());
    console.log('Image Blob Type:', blob.type);
    
    var filename = uuidv4() + "_" + this.ImageName; 
    formData.append('file', blob, filename); 

    this.dynamicService.uploadimagefile(formData).subscribe({
      next: (value) => { 
        let uploadedimage: any = value;
        // const newImage = {
        //   "AttachmentFile": uploadedimage?.dbPath,
        //   "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
        // };

        this.CameraImageList.push({
          "AttachmentFile": uploadedimage?.dbPath,
          "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
          "CaseGuid": this.repa.CaseGUID,
        }); 

      }
      })
    }
    catch (error) {
      console.error('Error capturing image:', error);
    }

  }

  DeleteCameraImage(item)
  {
    let index = this.CameraImageList.indexOf(item);
      this.CameraImageList.splice(index, 1);
      if (this.CameraImageList.length === 0) {
        // Update ProductimageElement to display default image
       // this.ProductimageElement = '/assets/EmptyImage.jpg';
      }
  }  

  DeleteUploadImage(item)
  {
    let index = this.UploadMoreImageList.indexOf(item);
    this.UploadMoreImageList.splice(index, 1);
    if (this.UploadMoreImageList.length === 0) {
      // Update ProductimageElement to display default image
     // this.ProductimageElement = '/assets/EmptyImage.jpg';
    }
  }


  MoreimageUpload(event: any, item) 
  {
    for (let i = 0; i < event.target.files.length; i++) {
      let fileToUpload = <File>event.target.files[i];
      const formData = new FormData();
      const filename = uuidv4() + "_" + fileToUpload.name;
      formData.append('file', fileToUpload, filename);
  
      this.dynamicService.uploadimagefile(formData).subscribe(
        {
          next: (value) => {
            let uploadedimage: any;
            uploadedimage = value;
  
            // Determine file type
            let fileType = 'document';
            if (fileToUpload.type.match('image.*')) {
              fileType = 'image';
            } else if (fileToUpload.type.match('application/pdf')) {
              fileType = 'pdf';
            } else if (fileToUpload.type.match('video.*')) {
              fileType = 'video';
            }
  
            this.UploadMoreImageList.push({
              "AttachmentFile": uploadedimage?.dbPath,
              "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
              "CaseGuid": this.repa.CaseGUID,
              "fileType": fileType
            }); 
          }
        });
    }
  }
  

  // async takeVideo(event: any, item: any) {
  //   try {
  //     const video = await Camera.getPhoto({
  //       quality: 100,
  //       allowEditing: false,
  //       resultType: CameraResultType.Uri,
  //       source: CameraSource.Camera,
  //       mediaType: Camera.MediaType.VIDEO // Specify that you want to record a video
  //     });

  //     const videoName = this.getFileName(video.webPath);

  //     const formData = new FormData();
  //     const blob = await fetch(video.webPath).then(response => response.blob());
  //     const filename = uuidv4() + "_" + videoName;
  //     formData.append('file', blob, filename);

  //     this.dynamicService.uploadimagefile(formData).subscribe({
  //       next: (value) => {
  //         let uploadedvideo: any = value;

  //      this.CameraVideoList.push({
  //           "AttachmentFile": uploadedvideo?.dbPath,
  //           "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedvideo?.dbPath,
  //           "CaseGuid": this.repa.CaseGUID,
  //         });   

  //         let index = this.selectedpartlist.findIndex( part => part.MaterialCode == item.MaterialCode);
  //         this.selectedpartlist[index].AttachmentFile = glob.GLOBALVARIABLE.SERVER_LINK + uploadedvideo?.dbPath;
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error capturing video:', error);
  //   }
  // }



// async takeVideo()
// {
//   const option:VideoCapturePlusOptions={
//      limit:1,
//     highquality:true
//   }
//   this.capture.captureVideo(option).then(
//     (MediaFile:MediaFile[]) => {
//       alert(JSON.stringify(MediaFile));
//     },(err)=>{
//       alert(err);
//     });
// }







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
