import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { IonModal, CheckboxCustomEvent, ModalController, PopoverController, ToastController } from '@ionic/angular'; 
import { CaseDetail } from '../repair-process.metadata';
import { FormBuilder, FormControl } from '@angular/forms';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { ActivatedRoute } from '@angular/router';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { DatePipe } from '@angular/common';
import xml2js from 'xml2js';
import { v4 as uuidv4 } from 'uuid';
import * as glob from 'src/app/config/global';
import { MaterialPopupPage } from '../pop-up/material-popup/material-popup.page';
//import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
// import { BarcodeScanner } from '@ionic-native/barcode-scannerw/ngx'; 
// import {  BarcodeScanner, BarcodeFormat} from "@capacitor-mlkit/barcode-scanning"; 
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { BarcodeScannerPage } from '../pop-up/barcode-scanner/barcode-scanner.page'; 
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { async } from '@angular/core/testing';
import { ImageViewPage } from './image-view/image-view.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-job-verification',
  templateUrl: './job-verification.page.html',
  styleUrls: ['./job-verification.page.scss'],
})
export class JobVerificationPage implements OnInit {
 
  @Input() modal!: IonModal;
  @Input() repa : CaseDetail;

  @Output() JobVerificationUpdated = new EventEmitter<any>();
  @Output() jobVerificationStatus = new EventEmitter<any>();


  serialFlag: boolean = false;
  popDateFlag: boolean = false;
  materialChangeFlag: boolean = false;
  // selectedType: string = 'S26';


  //
  BrandCode;
  ProductType:string="";
  WarrantyStatus:string="";
  PopDate:Date;
  searchText = '';
  materialCodeControl = new FormControl(); 

  //Foem Declare
  JobVerificationForm = this.formBuilder.group({
    MaterialCode:[],
    SerialNo:[],
    WarrantyStatus:[],
    PopDate:[],
    PvRemark:[],
    
  })

  //Boolean Declare
  ismaterial:boolean=false;
  isserialNo:boolean=true;
  ispopdate:boolean=true;
  ispvremark:boolean=false;

  //Scanner-Variable
  result=null
  scanActive=false
  
  //DropDownCode
  selectMeteialCode:DropDownValue = this.getBlankObject();
  SelectedPvRemark:DropDownValue = this.getBlankObject();

  selectedType: string= 'S26';

  getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }
  constructor(
              private formBuilder:FormBuilder,
              public popoverController: PopoverController,
              private dropdownDataService:DropdownDataService,
              private dynamicService:DynamicService,
              private activatedRoute:ActivatedRoute, 
              private datePipe:DatePipe,
              private modalController: ModalController,
              private toastController:ToastController,
              private renderer: Renderer2, 
              private el: ElementRef,
              private cdr: ChangeDetectorRef, 


             ) {
               
              }


             get filteredMaterialCodes() {
              return this.selectMeteialCode.Data.filter(item =>
                item.TEXT.toLowerCase().includes(this.searchText.toLowerCase())
              );
             }
             customPopoverOptions: any = {
              header: 'Select Material',
              subHeader: 'Type to search',
              searchPlaceholder: 'Search...'
            };

  ngOnInit() {
    console.log('from ===',this.repa) 
    
    this.onPVRemarkSearch({term: "" , items:[]});

    const requestPermissions = async () => {
      // await BarcodeScanner.requestPermissions();
    };

    const isSupported = async () => {
      // await BarcodeScanner.isSupported();
    };

  }


  isattachmentShow:boolean=false;
  attachmentList:any[]=[];
  imageURL :any=glob.GLOBALVARIABLE.SERVER_LINK;

  AttachmentOriginType:any;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['repa']) {   
    if (this.repa != null && this.repa != undefined) {  
      this.BrandCode = this.repa.Brand
      this.ProductType = this.repa.ProductType
      this.WarrantyStatus = this.repa.WarrantyStatus
      this.onSearchMaterailCode({term: "" , items:[]});
      // this.onPVRemarkSearch({ term: "",items:[]})
    this.JobVerificationForm.patchValue({
      MaterialCode:this.repa.MaterialCode,
      SerialNo:this.repa.SerialNo1,
      WarrantyStatus:this.repa.WarrantyStatus,
      PopDate:this.datePipe.transform(this.repa.POPDate, 'yyyy-MM-dd'),
    })

    
      //Attachment
      
      if (this.repa != null && this.repa != undefined) 
      {    
        if(this.repa?.JOBATTACHMENT?.ATTACHMENT != null || this.repa?.JOBATTACHMENT?.ATTACHMENT != undefined )
        {
          //this.isattachmentShow=true

          if (Array.isArray(this.repa?.JOBATTACHMENT?.ATTACHMENT)) 
          {   
              this.attachmentList=this.repa?.JOBATTACHMENT?.ATTACHMENT 

              this.attachmentList.forEach(attachment => {
                if (attachment.AttachmentOriginType === 'MoreImages') 
                {
                    this.MoreImageList=[]
                    this.MoreImageList.push(attachment) 
                    this.MoreImageList.forEach( item=>{
                      item.src =   glob.GLOBALVARIABLE.SERVER_LINK + item?.AttachmentFile
                      item.filename =item?.AttachmentFile 
                    }) 
                }

                if (attachment.AttachmentOriginType === 'PurchaseImage') 
                {
                    this.PurchaseImageList=[]
                    this.PurchaseImageList.push(attachment)

                    this.PurchaseImageList.forEach( item=>{
                      item.src =   glob.GLOBALVARIABLE.SERVER_LINK + item?.AttachmentFile
                      item.filename =item?.AttachmentFile 
                    }) 
                }

                if (attachment.AttachmentOriginType === 'ProductImage') 
                {
                    this.ProductImageList=[]
                    this.ProductImageList.push(attachment)
                    
                    this.ProductImageList.forEach( item=>{
                      item.src =   glob.GLOBALVARIABLE.SERVER_LINK + item?.AttachmentFile
                      item.filename =item?.AttachmentFile 
                    }) 
                }
            
            });


            //   this.attachmentList.forEach(attachment => { 
            //     if (attachment.AttachmentOriginType === 'ProductImage') 
            //     { 
            //         // console.log("Attachment is a ProductImage.");
            //     }
            //      else if (attachment.AttachmentOriginType === 'PurchaseImage') 
            //     { 
            //         // console.log("Attachment is a PurchaseImage.");
            //     } 
            //     else if (attachment.AttachmentOriginType == 'MoreImages') 
            //     { 
            //       this.MoreImageList.push()

            //     } 
            //     else 
            //     { 
            //         // console.log("AttachmentOriginType is unknown.");
            //     }
            // });
             
        
          }
          else 
          {  
            this.attachmentList.push(this.repa?.JOBATTACHMENT?.ATTACHMENT)
          }           
        }
      }
        }
      }
      
    }

  // ========Update Material Code ===============
  UpdateMaterialCode(event) {
    if (event.detail.checked == true) {
      this.materialChangeFlag = true
      // this.ismaterial = false
      this.ismaterial = true
    }
    if (event.detail.checked == false) {
      // this.ismaterial = true
      this.ismaterial = false
      this.materialChangeFlag = false
    }
  }
  
  
  // ==========UpdateSerialNo==========
  UpdateSerialNo(event) {
    if (event.detail.checked == true) {
      this.serialFlag = true
      this.isserialNo = false
    }
    if (event.detail.checked == false) {
      this.serialFlag = false
      this.isserialNo = true
    }
  }
  
  // ========UpdatePopDate===========
  UpdatePopDate(event) { 
    if (event.detail.checked == true) {
      this.popDateFlag = true
      this.ispopdate = false
    }
    if (event.detail.checked == false) {
      this.ispopdate = true
      this.popDateFlag = false
    }

  }

  onPVRemarkSearch($event: { term: string; items: any[]}) {
    this.dropdownDataService.fetchDropDownData(DropDownType.PVRemark, $event.term,{
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.SelectedPvRemark = value;
          console.log("SelectedPvRemark:",this.SelectedPvRemark)
        }
      },
      error: (err) => {
        this.SelectedPvRemark = DropDownValue.getBlankObject();
      }
    });
      }

  // Get Material
  onSearchMaterailCode($event: { term: string; items: any[]}) 
  {
    this.dropdownDataService.fetchDropDownData(DropDownType.Material4BrandJob, $event.term,{
      "BrandCode":this.BrandCode,
      "ProductType":this.ProductType,
      "MaterialCode":this.repa?.MaterialCode

    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.selectMeteialCode = value;
          console.log("Get Material code12345678876543:",this.selectMeteialCode)
        }
      },
      error: (err) => {
        this.selectMeteialCode = DropDownValue.getBlankObject();
      }
    });
      }

      TempFileList: any[]= [];

      ProductImageList: any[]=[];
      PurchaseImageList:any[]=[];
      MoreImageList:any[]=[];






      // isFrontIcon: boolean = true;
        // ===========Image Upload==============
   

      
  

    //Delete product Image
    DeleteProductImage(item)
    {
      let index = this.ProductImageList.indexOf(item);
      this.ProductImageList.splice(index, 1);
      if (this.ProductImageList.length === 0) {
        // Update ProductimageElement to display default image
        this.ProductimageElement = '/assets/EmptyImage.jpg';
      }
    }


    //Purchase IMage Upload
  
    //Delete Purchase Image
    DeletePurchaseImage(item)
    {
      let index = this.PurchaseImageList.indexOf(item);
      this.PurchaseImageList.splice(index, 1);
      if (this.PurchaseImageList.length === 0) {
        // Update PurchaseimageElement to display default image
        this.PurchaseimageElement = '/assets/EmptyImage.jpg';
      }
    }
 
    //MoreImage  Upload
    MoreImageUpload(event: any) {
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
              this.MoreImageList.push({
                "AttachmentFile": uploadedimage?.dbPath,
                "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
                "filename": fileToUpload.name,
                "CaseGuid":this.repa.CaseGUID
              })
              console.log("Mote Image ===:",this.MoreImageList)
              // this.isFrontIcon = false;
            }
          });
      }
    }

    //Delete Purchase Image
    DeleteMoreImage(item)
    {
      let index = this.MoreImageList.indexOf(item);
      this.MoreImageList.splice(index, 1);
      if (this.MoreImageList.length === 0) {
        // Update MoreimageElement to display default image
        this.MoreimageElement = '/assets/EmptyImage.jpg';
      }
    }
 
    DeleteImage(item)
    {
      let index = this.TempFileList.indexOf(item);
      this.TempFileList.splice(index, 1);
    }
      // PvRejected(RejectedStatus){
      //   alert(RejectedStatus)
      //   console.log("Rejected Status:",RejectedStatus)
    
      // }
  
      // PvApproved(StatusApproved){
      //   alert(StatusApproved)
      //   console.log("this is my apprved status:",StatusApproved)
  
      // }
  
      PvRejected:any;
  
      // ============SAVE JOB VERIFICATION===============
      OnSubmit(status){ 
     this.selectedType  == 'S26' ? "Approved" : "Rejected"

        this.PvRejected = status;
 
         
        if(status == 'S27'){
          if(this.JobVerificationForm.controls["PvRemark"].value == null || this.JobVerificationForm.controls["PvRemark"].value == undefined || this.JobVerificationForm.controls["PvRemark"].value == ""){
         this.presentToast("Please Select PV Remark" ,'danger')  

            return false
          }
        }
        if(this.JobVerificationForm.controls["MaterialCode"].value == null || this.JobVerificationForm.controls["MaterialCode"].value == undefined || this.JobVerificationForm.controls["MaterialCode"].value == ""){
          this.presentToast("Please Select Material Code" ,'danger')  
          return false
        }
        if(this.JobVerificationForm.controls["SerialNo"].value == null || this.JobVerificationForm.controls["SerialNo"].value == undefined || this.JobVerificationForm.controls["SerialNo"].value == ""){
       this.presentToast("Please Enter SerialNo" ,'danger')  
          return false
        }
        // if(this.JobVerificationForm.controls["WarrantyStatus"].value == null || this.JobVerificationForm.controls["WarrantyStatus"].value == undefined || this.JobVerificationForm.controls["WarrantyStatus"].value == ""){
        //   alert("Please Select Warranty Status")
        //   return false
        // }
        if(this.JobVerificationForm.controls["PopDate"].value == null || this.JobVerificationForm.controls["PopDate"].value == undefined || this.JobVerificationForm.controls["PopDate"].value == ""){
       this.presentToast("Please Select PopDate" ,'danger')  

          return false
        }
        // if(this.TempFileList.length <=0){
        //   alert("Please Upload POP Image")
        //   return false
        // }

        if(this.ProductImageList.length <=0){
          this.presentToast("Please Upload Product Image" ,'danger')   
          return false
        }
        if(this.PurchaseImageList.length <=0){ 
          this.presentToast("Please Upload Purchase Image" ,'danger')   

          return false
        }

        else {
          let RequeVerification = []
          RequeVerification.push({
            "Key": "APITYPE",
            "Value": "SaveJobVerification"
          })
          RequeVerification.push({
            "Key": "CaseGUID",
            "Value":this.repa.CaseGUID
          })
          RequeVerification.push({
            "Key": "JobStatus",
            "Value": this.selectedType
          })
          RequeVerification.push({
            "Key": "PVStatus",
            "Value":   this.selectedType == "S26" ? 'Approved' : 'Rejected'
          })
          RequeVerification.push({
            "Key": "PVRemark",
            "Value": this.JobVerificationForm.controls["PvRemark"].value == null || this.JobVerificationForm.controls["PvRemark"].value == undefined ? '' : this.JobVerificationForm.controls["PvRemark"].value
          })
          RequeVerification.push({
            "Key": "SerialNo",
            "Value": this.JobVerificationForm.controls["SerialNo"].value
          })
          RequeVerification.push({
            "Key": "StartDateFlag",
            "Value": "0"
          })
          RequeVerification.push({
            "Key": "CoverageDate",
            "Value": this.JobVerificationForm.controls["PopDate"].value
          })
          RequeVerification.push({
            "Key": "MaterialCode",
            "Value": this.JobVerificationForm.controls["MaterialCode"].value
          })
          RequeVerification.push({
            "Key": "SerialFlag",
            "Value": this.serialFlag
          })
          RequeVerification.push({
            "Key": "POPDateFlag",
            "Value": this.popDateFlag
          })
          RequeVerification.push({
            "Key": "MaterialChangeFlag",
            "Value": this.materialChangeFlag
          })
          RequeVerification.push({
            "Key": "WarrantyStatus",
            "Value": this.WarrantyStatus
          })
          RequeVerification.push({
            "Key": "Attachment",
            "Value": this.uploadedimageXML()
          })
          let CustRequestJson = JSON.stringify(RequeVerification);
          let contentRequest = {
            "content": CustRequestJson
          }
          debugger
          this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
            next: (value) => {
              let Response = JSON.parse(value.toString())
              if (Response.ReturnCode == "0") { 
               this.presentToast("Saved Successfully" ,'success')   

               var getval = JSON.parse(Response.ExtraData);
               this.JobVerificationUpdated.emit(getval)
               this.modalController.dismiss();

               // window.location.reload();
              }
            }
          })
          return true
        }
    
  
      }
      // ============================= Upload Image===============
      uploadedimageXML(){
        let rawData = {
          "rows": []
        }
      //   for(let image of this.TempFileList){
      //     console.log("Upload Image:",image)
      //         rawData.rows.push({
      //           "row": {
      //             "CaseGuid":image.CaseGuid,
      //             "AttachmentOriginType":image. AttachmentFile,
      //             "AttachmentFile":image.AttachmentFile,
      //             "AttachmentType":image.filename
      //           }
      //         })
          
      // }

      for(let image of this.ProductImageList)
      {
        console.log("Upload Image:",image)
            rawData.rows.push({
              "row": {
                "CaseGuid":image.CaseGuid,
                "AttachmentOriginType":'ProductImage',
                "AttachmentFile":image.AttachmentFile,
                "AttachmentType":'Image'
              }
            })    
      }
      for(let image of this.PurchaseImageList)
      {
        console.log("Upload Image:",image)
            rawData.rows.push({
              "row": {
                "CaseGuid":image.CaseGuid,
                "AttachmentOriginType":'PurchaseImage',
                "AttachmentFile":image.AttachmentFile,
                "AttachmentType":'Image'
              }
            })    
      }

      for(let image of this.MoreImageList)
      {
        console.log("Upload Image:",image)
            rawData.rows.push({
              "row": {
                "CaseGuid":image.CaseGuid,
                "AttachmentOriginType":'MoreImages',
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

  
  //Material Code DropDown 
  async openDropdown(ev: any)
   { 
    if(this.ismaterial == true)
    {
      const popover = await this.popoverController.create({
        component: MaterialPopupPage,
        componentProps: {
          // Pass your data here
          repa: this.repa
        },
        event: ev,
        translucent: true,
        showBackdrop: true,
        backdropDismiss: true
      });
  
      popover.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
          // Handle the returned data here
          const selectedValue = dataReturned.data.selectedValue;
          console.log('Selected value:', selectedValue.TEXT);
          this.JobVerificationForm.get('MaterialCode').patchValue(dataReturned.data.selectedValue.TEXT);
        }
      });
      return await popover.present();
    }

  }
  barcodeScanner:any;
  barCode:any;

  


  scannedCode: string; 


async scanBarcode() {
  const statusRequest = await BarcodeScanner.checkPermission({ force: true });

  this.renderer.addClass(document.body, 'hidden-body');
  this.scanActive = true;

  // Toggle the visibility of the div when the camera is on
  this.renderer.removeClass(document.querySelector('.toggleDiv'), 'hidden-div');

  const result = await BarcodeScanner.startScan();
  console.log("BARCODE result==== ", result);

  if (result.hasContent) {
    this.scanActive = false;
    this.result = result.content;
    console.log("RESULTS+++++   ", result.content);
    this.stopScanner();

    this.JobVerificationForm.patchValue({ 
      SerialNo: result.content
    });

    this.renderer.removeClass(document.body, 'hidden-body');

    // Hide the div when the scan is complete
    this.renderer.addClass(document.querySelector('.toggleDiv'), 'hidden-div');
  } else {
    // If no content is found, hide the div as well
    this.renderer.addClass(document.querySelector('.toggleDiv'), 'hidden-div');
  }
}
 
stopScanner()
{
  BarcodeScanner.stopScan();
  this.scanActive = false
}


async checkPermision()
{
  return new Promise(async (resolve, reject)=>{
    const status = await BarcodeScanner.checkPermission({force:true});

    if(status.granted)
      {resolve(true)
        
      }
  })
}

  async checkPermission()
  {
    return new Promise(async (resolve, reject)=>{
      const status = await BarcodeScanner.checkPermission({force:true});
      if(status.granted)
        {
          resolve(true)
        }
      else if(status.denied)
        {
          resolve(true)
        }
      else
      {
        resolve(false);
      }

    })
  }

  isShowRejectReason:boolean=false;

  // showRejectReason()
  // {
  //   this.isShowRejectReason=true
  // }

  
  options: { value: string, label: string }[] = [
    { value: 'S26', label: 'Approve' },
    { value: 'S27', label: 'Reject' }, 
  ];
 
  
  onOptionChange(event: any) {
    console.log('Selected option:', event.detail.value);
    this.selectedType = event.detail.value;
    this.jobVerificationStatus.emit(this.selectedType) 
    if( this.selectedType == 'S27')
      {
        this.isShowRejectReason=true
      }
    else
    {
      this.isShowRejectReason=false
    }
    this.cdr.detectChanges();
  }

  // viewImage(item) {
  //   this.dialog.open(ImageViewPage, {
  //     data: { Imagesrc: item.AttachmentFile }
  //   });
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

private getFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

//Purchase Image
ImageName:any; 
PurchaseimageElement:any;
MoreimageElement:any;
ProductimageElement:any;

async takePicture(event,imageType) {
  try {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });  

    this.ImageName = this.getFileName(image.webPath);

    const formData = new FormData();
    const blob = await fetch(image.webPath).then(response => response.blob());
    var filename = uuidv4() + "_" + this.ImageName; 
    formData.append('file', blob, filename); 

    this.dynamicService.uploadimagefile(formData).subscribe({
      next: (value) => { 
        let uploadedimage: any = value;
        const newImage = {
          "AttachmentFile": uploadedimage?.dbPath,
          "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
        };


        if(imageType == "ProductImage")
          {
            if (this.ProductImageList.length === 0) 
              {
                // If no images yet, update PurchaseimageElement for default image display
                this.ProductimageElement = newImage.src;
              }
              // Add new image to PurchaseImageList
              this.ProductImageList.push({
                "AttachmentFile": uploadedimage?.dbPath,
                "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
                "CaseGuid": this.repa.CaseGUID,
              });
          }

        if(imageType == "PurchaseImage")
          {
            if (this.PurchaseImageList.length === 0) 
              {
                // If no images yet, update PurchaseimageElement for default image display
                this.PurchaseimageElement = newImage.src;
              }
              // Add new image to PurchaseImageList
              this.PurchaseImageList.push({
                "AttachmentFile": uploadedimage?.dbPath,
                "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
                "CaseGuid": this.repa.CaseGUID,
              });
          }

          if(imageType == "MoreImage")
            {
              if (this.MoreImageList.length === 0) 
                {
                  // If no images yet, update PurchaseimageElement for default image display
                  this.MoreimageElement = newImage.src;
                }
                // Add new image to PurchaseImageList
                this.MoreImageList.push({
                  "AttachmentFile": uploadedimage?.dbPath,
                  "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
                  "CaseGuid": this.repa.CaseGUID,
                });
            }


      
         
      },
      error: (error) => {
        console.error('Error uploading image:', error);
      }
    });
  } catch (error) {
    console.error('Error capturing image:', error);
  }
}
 
    //productImage Upload
    productImageUpload(event: any) {
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
              this.ProductImageList.push({
                "AttachmentFile": uploadedimage?.dbPath,
                "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
                "filename": fileToUpload.name,
                "CaseGuid":this.repa.CaseGUID
              })
              console.log("ProductImageList Image ===:",this.ProductImageList)
              // this.isFrontIcon = false;
            }
          });
      }
    }

   //Purchase IMage Upload
   PurchaseImageUpload(event: any) {
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
            this.PurchaseImageList.push({
              "AttachmentFile": uploadedimage?.dbPath,
              "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
              "filename": fileToUpload.name,
              "CaseGuid":this.repa.CaseGUID
            }) 
            console.log('PurchaseImageList ==',this.PurchaseImageList)
            // this.isFrontIcon = false;
          }
        });
    }
    }



closeModal()
{
  this.modalController.dismiss();
}
}
