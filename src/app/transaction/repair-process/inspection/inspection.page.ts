import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, Validator, Validators } from '@angular/forms';
// import { DropdownDataService } from 'src/app/common/Services/dropdownService/dropdown-data.service';
// import { DropDownValue } from 'src/app/common/Services/dropdownService/dropdown-data.service';
// import { DropDownType } from 'src/app/custom-components/call-login/metadata/request.metadata';
//import { ToastrService } from 'ngx-toastr';
import { DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DropDownValue } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import * as glob from "../../../config/global";
import { CaseDetail } from '../repair-process.metadata';
import { v4 as uuidv4 } from 'uuid';
import xml2js from 'xml2js';
import { InspectionMetaData } from './inspection.metadata'; 
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DatePipe } from '@angular/common';
import { IonModal, CheckboxCustomEvent, ModalController } from '@ionic/angular'; 
import { ComponentIssuePage } from '../component-issue/component-issue.page';
import { ToastController } from '@ionic/angular';

//import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.page.html',
  styleUrls: ['./inspection.page.scss'],
})
export class InspectionPage implements OnInit {

  // =========Boolean Value===========
  billiablebox:boolean=false;
  ispaymentterm:boolean=false;
  iscomponentpopup:boolean=false;
  isDiagEdit: boolean = true;
  ComponentIssueList:any=[];
  inspectionMetaData:InspectionMetaData
  isCheckBox: boolean = false;
  BillableRepair: string;
  isdisabledAllfield:boolean=false;
  isreason:boolean=false; 
  isinspection: boolean = false;


  // =============Input Event ===========
  @Input() repa : CaseDetail;
  // @Input() compoissuelist : any[]
  @Output() InspUpdated  = new EventEmitter<any>();
  @Output() openComponentIssuePopupEvent  = new EventEmitter<any>();
WarrantyCode:any;
CustomerCode:any;
PopDate:any;
ElsStatus:any; 
  BillingOption: DropDownValue = DropDownValue.getBlankObject();
  SubmissionType:DropDownValue = DropDownValue.getBlankObject();
  NoOfDays:DropDownValue = DropDownValue.getBlankObject();
  PaymentTerms:DropDownValue = DropDownValue.getBlankObject();
  selectedReason:DropDownValue = DropDownValue.getBlankObject();
  selectrepairtype1:DropDownValue = DropDownValue.getBlankObject();
  constructor(
    private formBuilder:FormBuilder,
    private toastController: ToastController,
    private dropdownDataService:DropdownDataService,
    // private toastrService:ToastrService,
    private dynamicService:DynamicService,
    private datePipe : DatePipe,
    private modalController: ModalController
    // private NgxService:NgxSpinnerService
  ) { }
  CoverageStartdate;
  WarrantyStatusCode:string="";

  ngOnChanges(changes: SimpleChanges): void{    
    if(changes['repa'])
    { 
      if(this.repa?.DIAG!= null && this.repa?.DIAG != undefined  )
      {  
          this.WarrantyCode = this.repa.WarrantyCode; 
          this.CoverageStartdate = this.repa.CoverageStartdate;
          this.WarrantyStatusCode = this.repa.WarrantyStatus;
          this.CustomerCode = this.repa?.RetailCustomerCode;
          this.PopDate = this.repa?.POPDate;
          this.ElsStatus = this.repa?.ElsStatus;
          this.inspectionMetaData.DiagnosisGUID = this.repa?.DIAG?.DiagnosisGUID;
          this.inspectionMetaData.RepairType = this.repa?.DIAG?.RepairType;
          this.inspectionMetaData.Remark = this.repa?.DIAG?.Remark;
          this.inspectionMetaData.ReasonStatus = this.repa?.DIAG?.ReasonStatus;
          this.inspectionMetaData.ShootingByEngineer = this.repa?.DIAG?.TroubleShootingByEngineer;
          this.inspectionMetaData.Reason = this.repa?.DIAG?.Reason;
          this.inspectionMetaData.DiagnosisCode = this.repa?.DIAG?.DiagnosisCode;
          this.inspectionMetaData.DiagnosisDate = this.repa?.DIAG?.DiagnosisDate;
          this.inspectionMetaData.RepairType = this.repa?.DIAG?.RepairType;
          this.inspectionMetaData.RepairTypeDesc = this.repa?.DIAG?.RepairTypeDesc;
          this.inspectionMetaData.BillingOption = this.repa?.DIAG?.BillingOption;
          this.inspectionMetaData.BillingOptionDesc = this.repa?.DIAG?.BillingOptionDescription;
          this.inspectionMetaData.SubmissionType = this.repa?.DIAG?.SubmissionType;
          this.inspectionMetaData.SubmissionTypeDesc = this.repa?.DIAG?.SubmissionTypeDesc;
          this.inspectionMetaData.DiagnosisStatus = this.repa?.DIAG?.DiagnosisStatus;
          this.inspectionMetaData.LaborCovered = this.repa?.DIAG?.LaborCovered;
          this.inspectionMetaData.PartsCovered = this.repa?.DIAG?.PartsCovered;
          this.inspectionMetaData.NoOfDays = this.repa?.DIAG?.NoOfDaysToComplete;
          this.inspectionMetaData.NoOfDaysDesc = this.repa?.DIAG?.NoOfDaysToCompleteDesc;
          this.inspectionMetaData.BillableRepair = this.repa?.DIAG?.BillableRepair == 1 ? true : false;
          this.inspectionMetaData.PaymentTerms = this.repa?.DIAG?.PaymentTerms
          this.isCheckBox= this.repa?.DIAG?.BillableRepair==1 ? true:false;
          this.inspectionForm = this.formBuilder.group({
            RepairType: [this.inspectionMetaData.RepairType, Validators.required],
            BillingOption: [this.inspectionMetaData.BillingOption, Validators.required],
            NoOfDays:[this.inspectionMetaData.NoOfDays, Validators.required],
            PaymentTerms: [this.inspectionMetaData.PaymentTerms],
            billableRepair:[this.inspectionMetaData.BillableRepair],
            SubmissionType:[this.inspectionMetaData.SubmissionType],
            Remark:[this.inspectionMetaData.Remark, Validators.required],
            Reason:[this.inspectionMetaData.Reason, Validators.required],
            shootingbyengineer:[this.inspectionMetaData.ShootingByEngineer, Validators.required]
          });
          let ReasonObject = this.selectedReason.Data.find( item => item.Id == this.inspectionMetaData.ReasonStatus)
          this.inspectionMetaData.ReasonName = ReasonObject?.TEXT
          let RepairTypeObj = this.selectrepairtype.Data.find( item => item.Id == this.inspectionMetaData.RepairTypeName)
          this.inspectionMetaData.RepairTypeName = RepairTypeObj?.TEXT

         
        
        this.ComponentIssueList=[];
        this.inspectionMetaData.SelectedComponentIssue = []
        if(Array.isArray(this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL))
        {
          for ( var item of this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL)
          {
            this.inspectionMetaData.SelectedComponentIssue.push({
              "DiagnosisDetailGUID":item.DiagnosisDetailGUID,
              "ComponentCode": item.ComponentCode,
              "ComponentDesc": item.ComponentDesc,
              "IssueCode": item.IssueCode,
              "IssueDesc": item.IssueDesc,
              "ReproducibilityCode": item.ReproducibilityCode,
              "ReproducibilityDescription": item.ReproducibilityDescription,
              "IsDeleted": item.IsDeleted
            })
          }
        }
        else
        {
          var lstDiagDetail=[];
          lstDiagDetail.push(this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL);
          this.inspectionMetaData.SelectedComponentIssue.push({
            "DiagnosisDetailGUID":lstDiagDetail[0].DiagnosisDetailGUID,
            "ComponentCode": lstDiagDetail[0].ComponentCode,
            "ComponentDesc": lstDiagDetail[0].ComponentDesc,
            "IssueCode": lstDiagDetail[0].IssueCode,
            "IssueDesc": lstDiagDetail[0].IssueDesc,
            "ReproducibilityCode":  lstDiagDetail[0].ReproducibilityCode,
            "ReproducibilityDescription":  lstDiagDetail[0].ReproducibilityDescription,
            "IsDeleted": lstDiagDetail[0].IsDeleted
          })
        }
        this.ComponentIssueList = this.inspectionMetaData.SelectedComponentIssue 
      }
    this.BindRepairType();
     
    }

 
  }
  
  // Validation Component Issue
  validateComponents(com: any) {
 
    for (let item of this.inspectionMetaData.SelectedComponentIssue) {
      if (item.ComponentDesc == com.ComponentDesc && item.IssueDesc == com.IssueDesc) { 
        alert("Component & Issue already exists")
        return false;
      }
    }
    alert("Issue Added Successfully!");
    return true;
  }

  ngOnInit(): void {  

    this.BindRepairType(); 
    //this.WrrantyEvent();
    this.inspectionMetaData = new InspectionMetaData();
    this.onReasonSearch({ term: "", items: [] });
    this.onBillingOption({ term: "", items: [] });
    this.onSubmissionType({ term: "", item: [] });
    this.onNoOfDays({ term: "", items: [] });
    this.onPaymentTerms({ term: "", item: [] });
    //this.onRepiarTypeSearch({term: "", items: null });
    if( this.inspectionMetaData.DiagnosisStatus == 'RELEASED' ){
      this.editDiagForm();
      this.isDiagEdit = false;
    }
      this.setDataFunction()
      console.log("this.repa.DiagGUID:",this.repa)
  }
  
  editDiagForm() {
    this.isDiagEdit = !this.isDiagEdit
    this.isinspection =true;
  }

  addInspectionList() {
    if (this.isinspection == true) {
      this.isinspection = false;
    } else {
      this.isinspection = true;
    }
  }

  getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }

  inspectionForm = this.formBuilder.group({
    RepairType:[],
    BillingOption:[],
    SubmissionType:[],
    NoOfDays:[],
    billableRepair:[],
    PaymentTerms:[],
    Remark:[],
    shootingbyengineer:[],
    Reason:[],
  })

  billableChangeEvent(event){
    if(this.inspectionForm.controls["BillableRepair"].value == true){
      this.ispaymentterm=true;
    }
    else{
      this.ispaymentterm=false;
    }
  }
  FilteredRepairTypeCode:any[] =[]
  // ===========RepairType DropDown=================

  onRepiarTypeSearch($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.RepairType, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) { 
          this.selectrepairtype1 = value  
        }
      },
      error: (err) => {
        this.selectrepairtype = this.getBlankObject();
      }
    });
  }

 
  selectrepairtype:DropDownValue = DropDownValue.getBlankObject(); 
  onReasonSearch($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.SNRReason, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          console.log(value);
          this.selectedReason = value;  
        }
      },
      error: (err) => {
        this.selectedReason = this.getBlankObject();
      }
    });
  }

  // ==============BillingOption DropDown===========================
  onBillingOption($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.CovarageOption, $event.term).subscribe({
      next: (value) => {
        if (value != null) {
          console.log(value);
          this.BillingOption = value;
         console.log("=====BillingOption=====",this.BillingOption)
        }
      },
      error: (err) => {
        this.BillingOption = this.getBlankObject();
      }
    });
  }

  // ================SubmissionType DropDown================
  onSubmissionType($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.SubmissionType, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.SubmissionType = value;
        }
      },
      error: (err) => {
        this.SubmissionType = DropDownValue.getBlankObject();
      }
    });
  }

  // ============NoofDays=========================
  
  onNoOfDays($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.NoOfDays, $event.term).subscribe({
      next: (value) => {
        if (value != null) {
          console.log(value);
          this.NoOfDays = value;
        }
      },
      error: (err) => {
        this.NoOfDays = this.getBlankObject();
      }
    });
  }
  
  // =========PaymentTerms Dropdown=========

  onPaymentTerms($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.PaymentTerm, $event.term, {
    }).subscribe({
      next: (value) => { 
        if (value != null) { 
          this.PaymentTerms = value;
          console.log("PaymentTerms===",this.PaymentTerms)
        }
      },
      error: (err) => {
        this.PaymentTerms = DropDownValue.getBlankObject();
      }
    });
  }

  // openComponentIssue(){
  //   this.iscomponentpopup=true;
  // }

  ComponentPopUpColse(event){
    this.iscomponentpopup=false;
  }
  
  setDataFunction(){ 
    if(this.repa!= null && this.repa != undefined ){
      
      if(this.repa?.DiagFlag == "0")
      {
        this.isinspection=true;
        this.isDiagEdit = true;

      }
      else
      {
        this.inspectionMetaData.DiagnosisGUID = this.repa?.DIAG?.DiagnosisGUID;
        this.inspectionMetaData.DiagnosisCode = this.repa?.DIAG?.DiagnosisCode;
        this.inspectionMetaData.DiagnosisDate = this.repa?.DIAG?.DiagnosisDate;
        this.inspectionMetaData.RepairType = this.repa?.DIAG?.RepairType;
        this.inspectionMetaData.ShootingByEngineer = this.repa?.DIAG?.TroubleShootingByEngineer;
        this.inspectionMetaData.Remark = this.repa?.DIAG?.Remark;
        this.inspectionMetaData.ReasonStatus = this.repa?.DIAG?.ReasonStatus;
        this.inspectionMetaData.RepairTypeDesc = this.repa?.DIAG?.RepairTypeDesc;
        this.inspectionMetaData.BillingOption = this.repa?.DIAG?.BillingOption;
        this.inspectionMetaData.SubmissionType = this.repa?.DIAG?.SubmissionType;
        this.inspectionMetaData.SubmissionTypeDesc = this.repa?.DIAG?.SubmissionTypeDesc;
        this.inspectionMetaData.LaborCovered = this.repa?.DIAG?.LaborCovered;
        this.inspectionMetaData.DiagnosisStatus = this.repa?.DIAG?.DiagnosisStatus;
        this.inspectionMetaData.PartsCovered = this.repa?.DIAG?.PartsCovered;
        this.inspectionMetaData.NoOfDays = this.repa?.DIAG?.NoOfDaysToComplete;
        this.inspectionMetaData.NoOfDaysDesc = this.repa?.DIAG?.NoOfDaysToCompleteDesc;
        this.inspectionMetaData.BillableRepair = this.repa?.DIAG?.BillableRepair == 1 ? true : false;        
        this.inspectionMetaData.SelectedComponentIssue=[]
        if(Array.isArray(this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL))
        {
          for ( var item of this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL)
          {
            this.inspectionMetaData.SelectedComponentIssue.push({
              "DiagnosisDetailGUID":item.DiagnosisDetailGUID,
              "ComponentCode": item.ComponentCode,
              "ComponentDesc": item.ComponentDesc,
              "IssueCode": item.IssueCode,
              "IssueDesc": item.IssueDesc,
              "ReproducibilityCode": item.ReproducibilityCode,
              "ReproducibilityDescription": item.ReproducibilityDescription,
              "IsDeleted": item.IsDeleted
            })
          }
        }
        else
        {
          var lstDiagDetail=[];
          lstDiagDetail.push(this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL);
          this.inspectionMetaData.SelectedComponentIssue.push({
            "DiagnosisDetailGUID":lstDiagDetail[0].DiagnosisDetailGUID,
            "ComponentCode": lstDiagDetail[0].ComponentCode,
            "ComponentDesc": lstDiagDetail[0].ComponentDesc,
            "IssueCode": lstDiagDetail[0].IssueCode,
            "IssueDesc": lstDiagDetail[0].IssueDesc,
            "ReproducibilityCode":  lstDiagDetail[0].ReproducibilityCode,
            "ReproducibilityDescription":  lstDiagDetail[0].ReproducibilityDescription,
            "IsDeleted": lstDiagDetail[0].IsDeleted
          })
        }
        this.ComponentIssueList = this.inspectionMetaData.SelectedComponentIssue 

      }

        this.inspectionMetaData.PaymentTerms = this.repa?.DIAG?.PaymentTerms;
        if(this.inspectionMetaData.DiagnosisStatus == 'RELEASED' ){
          this.editDiagForm();
          this.isDiagEdit = false;
        }
        else
        {
          this.isinspection=true;
          this.isDiagEdit = true;
        }
  

      }
      this.inspectionForm = this.formBuilder.group({
        RepairType: [this.inspectionMetaData.RepairType, Validators.required],
        BillingOption: [this.inspectionMetaData.BillingOption, Validators.required],
        NoOfDays:[this.inspectionMetaData.NoOfDays, Validators.required],
        PaymentTerms: [this.inspectionMetaData.PaymentTerms],
        billableRepair:[this.inspectionMetaData.BillableRepair],
        SubmissionType:[this.inspectionMetaData.SubmissionType],
        Reason:[this.inspectionMetaData.Reason, Validators.required],
        Remark:[this.inspectionMetaData.Remark, Validators.required],
        shootingbyengineer:[this.inspectionMetaData.ShootingByEngineer, Validators.required]
      });

      }

  // setDataFunction(){ 
  //   if(this.repa!= null && this.repa != undefined ){
      
  //       this.inspectionMetaData.DiagnosisGUID = this.repa?.DIAG?.DiagnosisGUID;
  //       this.inspectionMetaData.DiagnosisCode = this.repa?.DIAG?.DiagnosisCode;
  //       this.inspectionMetaData.DiagnosisDate = this.repa?.DIAG?.DiagnosisDate;
  //       this.inspectionMetaData.RepairType = this.repa?.DIAG?.RepairType;
  //       this.inspectionMetaData.ShootingByEngineer = this.repa?.DIAG?.TroubleShootingByEngineer;
  //       this.inspectionMetaData.Remark = this.repa?.DIAG?.Remark;
  //       this.inspectionMetaData.ReasonStatus = this.repa?.DIAG?.ReasonStatus;
  //       this.inspectionMetaData.RepairTypeDesc = this.repa?.DIAG?.RepairTypeDesc;
  //       this.inspectionMetaData.BillingOption = this.repa?.DIAG?.BillingOption;
  //       this.inspectionMetaData.SubmissionType = this.repa?.DIAG?.SubmissionType;
  //       this.inspectionMetaData.SubmissionTypeDesc = this.repa?.DIAG?.SubmissionTypeDesc;
  //       this.inspectionMetaData.LaborCovered = this.repa?.DIAG?.LaborCovered;
  //       this.inspectionMetaData.DiagnosisStatus = this.repa?.DIAG?.DiagnosisStatus;
  //       this.inspectionMetaData.PartsCovered = this.repa?.DIAG?.PartsCovered;
  //       this.inspectionMetaData.NoOfDays = this.repa?.DIAG?.NoOfDaysToComplete;
  //       this.inspectionMetaData.NoOfDaysDesc = this.repa?.DIAG?.NoOfDaysToCompleteDesc;
  //       this.inspectionMetaData.BillableRepair = this.repa?.DIAG?.BillableRepair == 1 ? true : false;
  //       this.isCheckBox = this.inspectionMetaData.BillableRepair
  //       this.inspectionMetaData.PaymentTerms = this.repa?.DIAG?.PaymentTerms;
  //       this.inspectionForm = this.formBuilder.group({
  //         RepairType: [this.inspectionMetaData.RepairType, Validators.required],
  //         BillingOption: [this.inspectionMetaData.BillingOption, Validators.required],
  //         NoOfDays:[this.inspectionMetaData.NoOfDays, Validators.required],
  //         PaymentTerms: [this.inspectionMetaData.PaymentTerms],
  //         billableRepair:[this.inspectionMetaData.BillableRepair],
  //         SubmissionType:[this.inspectionMetaData.SubmissionType],
  //         Reason:[this.inspectionMetaData.Reason, Validators.required],
  //         Remark:[this.inspectionMetaData.Remark, Validators.required],
  //         shootingbyengineer:[this.inspectionMetaData.ShootingByEngineer, Validators.required]
  //       });

  //       this.inspectionMetaData.SelectedComponentIssue=[]
  //       if(Array.isArray(this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL))
  //       {
  //         for ( var item of this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL)
  //         {
  //           this.inspectionMetaData.SelectedComponentIssue.push({
  //             "DiagnosisDetailGUID":item.DiagnosisDetailGUID,
  //             "ComponentCode": item.ComponentCode,
  //             "ComponentDesc": item.ComponentDesc,
  //             "IssueCode": item.IssueCode,
  //             "IssueDesc": item.IssueDesc,
  //             "ReproducibilityCode": item.ReproducibilityCode,
  //             "ReproducibilityDescription": item.ReproducibilityDescription,
  //             "IsDeleted": item.IsDeleted
  //           })
  //         }
  //       }
  //       else
  //       {
  //         var lstDiagDetail=[];
  //         lstDiagDetail.push(this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL);
  //         this.inspectionMetaData.SelectedComponentIssue.push({
  //           "DiagnosisDetailGUID":lstDiagDetail[0].DiagnosisDetailGUID,
  //           "ComponentCode": lstDiagDetail[0].ComponentCode,
  //           "ComponentDesc": lstDiagDetail[0].ComponentDesc,
  //           "IssueCode": lstDiagDetail[0].IssueCode,
  //           "IssueDesc": lstDiagDetail[0].IssueDesc,
  //           "ReproducibilityCode":  lstDiagDetail[0].ReproducibilityCode,
  //           "ReproducibilityDescription":  lstDiagDetail[0].ReproducibilityDescription,
  //           "IsDeleted": lstDiagDetail[0].IsDeleted
  //         })
  //       }
  //       this.ComponentIssueList = this.inspectionMetaData.SelectedComponentIssue 
  //     }
  //     if(this.inspectionMetaData.DiagnosisStatus == 'RELEASED' ){
  //       this.editDiagForm();
  //       this.isDiagEdit = false;
  //     }
  //     }


  removeComponent(item) {
    item.IsDeleted = '1';
    this.updateInspectionXML() 
    console.log("++" , this.inspectionMetaData.SelectedComponentIssue)
  }

  // Component Issue Update
  updateInspectionXML(){
    let rawData = {
      "rows": []
    }
    for (let item of this.inspectionMetaData.SelectedComponentIssue) {
      rawData.rows.push({
        "row": {
          "DiagnosisDetailGUID":item.DiagnosisDetailGUID,
          "ComponentCode": item.ComponentCode,
          "ComponentDesc":item.ComponentDesc,
          "IssueCode": item.IssueCode,
          "IssueDesc":item.IssueDesc,        
          "ReproducibilityCode":item.ReproducibilityDescription,
          "ReproducibilityDescription":item.ReproducibilityDescription,
          "IsDeleted": item.IsDeleted
        }
      })
    }
  
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(rawData);
    xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
    xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
    xml = xml.split(' ').join('')
    return xml;
  }

  GetcomponentIssueObj(event){
    console.log("Inspection Compoenet:",event)
    this.inspectionMetaData.SelectedComponentIssue.push(event);
  }

  SaveInspection(){ 

    let RequestInspection=[];
    RequestInspection.push({
      "Key":"APIType",
      "Value":"SaveDiagnosis"
    })
    RequestInspection.push({
      "Key":"CompanyCode",
      "Value":glob.getCompanyCode()
    })
    RequestInspection.push({
      "Key":"DiagnosisGUID",
    "Value": this.repa.DiagFlag == "0" || this.repa.DiagFlag == null ? uuidv4() : this.repa?.DIAG?.DiagnosisGUID
    })
    RequestInspection.push({
      "Key":"CaseGUID",
      "Value":this.repa.CaseGUID
    })
    RequestInspection.push({
      "Key": "DiagnosisCode",
      "Value": this.repa.DiagFlag == "0" || this.repa.DiagFlag == null ? "New":this.repa?.DIAG?.DiagnosisCode
    });
    RequestInspection.push({
      "Key":"DiagnosisDate",
      "Value": this.repa.DiagFlag == "0" || this.repa.DiagFlag == null ? this.datePipe.transform( new Date() , 'dd-MM-yyyy') :this.repa?.DIAG?.DiagnosisDate
    })
    RequestInspection.push({
      "Key": "DiagnosisStatus",
      "Value": "RELEASED"
    });
    RequestInspection.push({
      "Key":"NoOfDaysToComplete",
      "Value":this.inspectionForm.controls["NoOfDays"].value == null || this.inspectionForm.controls["NoOfDays"].value == undefined ? '': this.inspectionForm.controls["NoOfDays"].value
    })
    RequestInspection.push({
      "Key":"RepairType",
      "Value":this.inspectionForm.controls["RepairType"].value
    })
    RequestInspection.push({
      "Key":"BillingOption",
      "Value":this.inspectionForm.controls["BillingOption"].value == null || this.inspectionForm.controls["BillingOption"].value == undefined ? '' : this.inspectionForm.controls["BillingOption"].value
    })
    RequestInspection.push({
      "Key":"SubmissionType",
      "Value":this.inspectionForm.controls["SubmissionType"].value == null || this.inspectionForm.controls["SubmissionType"].value == undefined ? '' : this.inspectionForm.controls["SubmissionType"].value 
    })
    RequestInspection.push({
      "Key": "PartsCovered",
      "Value": this.repa?.PartCovered == null || this.repa?.PartCovered == undefined ?0 : this.repa?.PartCovered
    });
    RequestInspection.push({
      "Key": "LaborCovered",
      "Value": this.repa?.LaborCovered == null || this.repa?.LaborCovered == undefined ?0 : this.repa?.LaborCovered,
    });
    RequestInspection.push({
      "Key":"TroubleShootingByEngineer",
      "Value": this.inspectionForm.controls["shootingbyengineer"].value
    })
    RequestInspection.push({
      "Key":"Remark",
      "Value": this.inspectionForm.controls["Remark"].value
    })
    RequestInspection.push({
      "Key":"Reason",
      "Value": this.inspectionMetaData.Reason
    })
    RequestInspection.push({
      "Key":"BillableRepair",
      "Value":this.inspectionForm.controls["billableRepair"].value == null || this.inspectionForm.controls["billableRepair"].value == undefined ? 0 : this.inspectionForm.controls["billableRepair"].value==true ?1:0
    })

    RequestInspection.push({
      "Key":"PaymentTerms",
      "Value":this.inspectionForm.controls["PaymentTerms"].value == null || this.inspectionForm.controls["PaymentTerms"].value == undefined ? '' : this.inspectionForm.controls["PaymentTerms"].value
    })
    RequestInspection.push({
      "Key":"DiagnosisDetail",
      "Value":this.inspectionXML()
    })

    
    console.log("save inspection Obj:",RequestInspection)
    let RequestIns= JSON.stringify(RequestInspection)
    let requestContent={
      "content":RequestIns
    }
    debugger
    this.dynamicService.getDynamicDetaildata(requestContent).subscribe({
      next:(value)=>{
     //   this.NgxService.show();
        let response = JSON.parse(value.toString())
        if(response.ReturnCode == '0'){
         alert("Inspection Added Successfully")
          var data = JSON.parse(response.ExtraData)
          this.InspUpdated.emit(data);
          this.isDiagEdit = false;
         // this.NgxService.hide();
          this.setDataFunction();
          this.onPaymentTerms({ term: "", item: [] });
        }
        if(response.ReturnCode == '1'){ 
         // this.NgxService.hide();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.ErrorMessage, 'text/xml');
            const eachErrorMessagesList = xmlDoc.getElementsByTagName('errorMessage');
            for (let i = 0; i < eachErrorMessagesList.length; i++) {
             // this.NgxService.show();
              console.log("Error List ", eachErrorMessagesList[i].getElementsByTagName('ErrorMessage'))
              const eachErrorMessages = eachErrorMessagesList[i].getElementsByTagName('ErrorMessage')[0];
             alert(eachErrorMessages.textContent);
            }
        }
      },
      error: err =>{
       // this.NgxService.hide();
       alert("Error parsing the error message.");
        const errors = err.split("Error Code:").slice(1); // Split the error string into separate error segments
       // this.NgxService.hide();
        errors.forEach(error => {
          const messageIndex = error.indexOf("Message: ");
          if (messageIndex !== -1) {
            const messageSubstring = error.substring(messageIndex + 9).trim();
            const message = JSON.parse(messageSubstring).message;
          alert("Error:- " + message);
          } else {
          alert("Error parsing the error message.");
           // this.NgxService.hide();
          }
        });
       // this.NgxService.hide();
      }
    })
  }

  inspectionXML(){
      let rawData = {
        "rows": []
      }
      for (let item of this.inspectionMetaData.SelectedComponentIssue) {
        rawData.rows.push({
          "row": {
            "DiagnosisDetailGUID":item.DiagnosisDetailGUID,
            "ComponentCode": item.ComponentCode,
            "ComponentDesc":item.ComponentDesc,
            "IssueCode": item.IssueCode,
            "IssueDesc":item.IssueDesc,        
            "ReproducibilityCode":item.ReproducibilityDescription,
            "ReproducibilityDescription":item.ReproducibilityDescription,
            "IsDeleted": item.IsDeleted
          }
        })
      }
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(rawData);
      xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
      xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
      //xml = xml.split(' ').join('')
      return xml;
  }

 

  InspectionValidation(){
    if(this.inspectionForm.controls["RepairType"].value == null||
    this.inspectionForm.controls["RepairType"].value == undefined||
    this.inspectionForm.controls["RepairType"].value == ""){
      alert('Please Select Repair Type')
  //  this.toastrService.error("Please Select Repair Type");
    return false;
    }
    if(this.inspectionForm.controls["shootingbyengineer"].value == null||
    this.inspectionForm.controls["shootingbyengineer"].value == undefined||
    this.inspectionForm.controls["shootingbyengineer"].value == ""){
      alert('Please Enter Trouble Shooting by Engineer')
   // this.toastrService.error("Please Enter Trouble Shooting by Engineer");
    return false;
    }
    if(this.inspectionForm.controls["Remark"].value == null||
    this.inspectionForm.controls["Remark"].value == undefined||
    this.inspectionForm.controls["Remark"].value == ""){
      alert('Please Enter Remark')
  //  this.toastrService.error("Please Enter Remark");
    return false;
    }
    if(this.inspectionMetaData.SelectedComponentIssue.length === 0){
   //   this.toastrService.error("Please select Component And Issue");
   alert('Please select Component And Issue')
   return false;
    }
    else{
      this.SaveInspection()
      return true;
    }
  }

 

  isCheckBoxFunc(event){
    if ( event.checked ) {
     // alert(event?.detail?.checked)
   }


      if (this.isCheckBox == true) {  
        this.isCheckBox = false; 
        this.inspectionForm.controls["PaymentTerms"].setValue("");
        this.BillableRepair = '0';
      } else {  
        this.isCheckBox = true;
        this.BillableRepair = '1';
      }
    }
    
    RepairChangeEvent(event){ 
      debugger
      let repairtype = this.inspectionForm.controls["RepairType"].value
      this.inspectionMetaData.RepairType = repairtype
     // this.inspectionMetaData.RepairType = event.toString()
        
    // if(repairtype == 'CIN'){
    //   this.inspectionMetaData.RepairType = repairtype
    // }
    // if(repairtype == 'SVNR'){
    //   this.inspectionMetaData.RepairType = repairtype
    // }
    }

    ReasonEvent(event)
    { 
      let Reason = this.inspectionForm.controls["Reason"].value
      this.inspectionMetaData.Reason = Reason
    }

    WrrantyEvent(){
      const date = new Date(this.PopDate);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      let WarrantyRequest=[];
      WarrantyRequest.push({
        "Key":"ApiType",
        "Value":"GetWarrantyObject"
      });
      WarrantyRequest.push({
        "Key":"WarrantyCode",
        "Value":this.WarrantyCode
      });
      WarrantyRequest.push({
        "Key":"CustomerCode",
        "Value":this.CustomerCode
      });
      WarrantyRequest.push({
        "Key":"POPDate",
        "Value": formattedDate
      });
      WarrantyRequest.push({
        "Key":"ElsStatus",
        "Value": this.ElsStatus
      });
      console.log("Array Data:",WarrantyRequest)
      let warrantyJson = JSON.stringify(WarrantyRequest)
      let WarrantyContentRequest = {
        "content":warrantyJson
      }
      this.dynamicService.getDynamicDetaildata(WarrantyContentRequest).subscribe({
        next:(value)=>{
          let response = JSON.parse(value.toString())
          if(response.ReturnCode == '0'){
            let WarrantyData = JSON.parse(response.ExtraData);
            console.log("Get Warranty Object**** ", WarrantyData);
            if (Array.isArray(WarrantyData?.WarrantyObject)){
              for(let item of WarrantyData?.WarrantyObject){
                console.log("Item Repair Type code:",item);
                this.FilteredRepairTypeCode.push(item.RepairType);
              }
            }
            else{
              this.FilteredRepairTypeCode.push(WarrantyData?.WarrantyObject?.RepairType);
            }
            this.onRepiarTypeSearch({term: "", items: null });
          }
        }
      })}

  materialCode:any;

    @Input() modal!: IonModal;

    @Output() dismissChange = new EventEmitter<boolean>();
  
    checkboxChanged(event: any) {
      const ev = event as CheckboxCustomEvent;
      const checked = ev.detail.checked;
  
      this.dismissChange.emit(checked);
    }

    editDiag() {
      console.log(" Repair Status ", this.repa)
      this.repa.RepairFlag == 0 ?  this.editDiagForm() : ''
    }
    
    compoissuelist: any[]=[];
 


    async openComponentIssue() { 
    this.materialCode=this.repa.MaterialCode  
   
      // console.log('previews DATA==', this.inspectionMetaData.SelectedComponentIssue)
      const modal = await this.modalController.create({
        component: ComponentIssuePage, 
        componentProps:this.repa
      });
    
      modal.onDidDismiss().then((data) => {
        if (data && data.data) {
          // console.log("DATA DATA==",data.data.data)
          this.compoissuelist=[]
          this.compoissuelist.push(data.data.data); 
  

          if(this.compoissuelist!= null && this.compoissuelist != undefined )
          {
              for(let item of this.compoissuelist)
              {
                var object4 = item;  
                if(this.validateComponents(object4))
                    {
                      this.inspectionMetaData.SelectedComponentIssue.push(object4);
                    }
              }
          } 
 
        }
      });
      await modal.present();
    }

    handleRefresh(event) 
    {
      setTimeout(() => {
        // Any calls to load data go here
        event.target.complete();
      }, 2000);
    }


    BindRepairType() { 
     
     let ReqWarranty = []
     ReqWarranty.push({
       "Key": "APITYPE",
       "Value": "GetProductWarrantyDetailList"
     });
     ReqWarranty.push({
       "Key": "WarrantyStatus",
       "Value": this.repa?.WarrantyStatus
     });
     ReqWarranty.push({
       "Key": "ReceiveDate",
       "Value": this.repa.CaseDate
     });
     ReqWarranty.push({
       "Key": "CoverageStartDate",
       "Value": this.repa?.CoverageStartdate
     });
     ReqWarranty.push({
       "Key": "WarrantyCode",
       "Value": this.repa?.WarrantyCode
     });
     ReqWarranty.push({
       "Key": "CustomerCode",
       "Value": this.repa?.CUSTOMER?.CustomerCode
     });

     ReqWarranty.push({
      "Key": "JobType",
      "Value": this.repa?.JobType
    });

    ReqWarranty.push({
      "Key": "BrandCode",
      "Value":this.repa?.Brand
    });
     console.log("GET WARRANTY DETAILS:", ReqWarranty)
     let CustRequestJson = JSON.stringify(ReqWarranty);
     let contentRequest = {
       "content": CustRequestJson
     }
     this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
       next: (value) => {
         let Response = JSON.parse(value.toString())
         console.log("CONSOLE = ",Response)
         let data = JSON.parse(Response?.ExtraData)
         console.log("Get Warranty Details::", data)
         this.selectrepairtype1.Data = [];
         if (Array.isArray(data?.ProductWarrantyList?.WarrantyDetails)) {
           for (let item of data?.ProductWarrantyList?.WarrantyDetails) {
             console.log("Item RepaiType:", item)
             //this.FilteredRepairTypeCode.push(item)
             //console.log("RepairType:", this.FilteredRepairTypeCode)
             this.selectrepairtype1.Data.push(item);
           }
 
         }
         else {
           this.selectrepairtype1.Data.push(data.ProductWarrantyList.WarrantyDetails);
           //this.FilteredRepairTypeCode.push(data.ProductWarrantyList.WarrantyDetails)
         }
         // this.addProductDetails.patchValue({
         //   WarrantyStatus: this.FilteredRepairTypeCode[0].WarrantyStatus
         // })
         // console.log("Get WWWW:",this.FilteredRepairTypeCode[0].WarrantyStatus)
         // for(let item of this.FilteredRepairTypeCode){
         //   this.addProductDetails.patchValue({
         //     WarrantyStatus:item.WarrantyStatus
         //   })
         // }
         // console.log("Check Warranty:",data.ProductWarrantyList.WarrantyDetails.WarrantyStatus)
 
         //this.onRepiarTypeSearch({ term: "", items: null });
         //this.addProductDetails.controls["RepairType"].reset();
         //this.addProductDetails.controls["WarrantyStatus"].reset();
         //this.FilterWarrantyStatus = []
         console.log("Item RepaiType:", this.selectrepairtype1)
       }
     })
 
     //let index = this.StrProductDetails.findIndex(part => part.MaterialCode == item.MaterialCode)
     //this.StrProductDetails[index].ElsStatus = event.Id
 
     //console.log("Set ELSE Status:", this.StrProductDetails)
   }
   }
