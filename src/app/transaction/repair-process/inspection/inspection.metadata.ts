export class InspectionMetaData{
  // var item of this.repa?.DIAG?.DIAGLIST?.DIAGDETAIL
    DiagnosisGUID:String;
    CaseGuid:String;
    CaseId:String;
    DiagnosisCode:any;
    DiagnosisDate:Date;    
    BillingOption:String;
    BillingOptionDesc:String;
    LaborCovered:boolean;
    PartsCovered:boolean;  
    RepairType:String;
    RepairTypeDesc:String;
    DiagnosisStatus:String;
    SubmissionType:String;
    SubmissionTypeDesc:String;
    NoOfDays: Number;
    NoOfDaysDesc: String;
    BillableRepair:boolean;
    PaymentTerms:String;
    SelectedComponentIssue: any[] = [];
    UploadedImageList: any[] = [];
    InputMode:String;
    Remark:String;
    Reason:any;
    ReasonName:String;
    WarrantyCode:any;
    CustomerCode:any;
    POPDate:any;
    ShootingByEngineer:any;
    RepairTypeName:String;
    ReasonStatus:String;
  }