import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IonModal, CheckboxCustomEvent, ModalController, ActionSheetController } from '@ionic/angular';
import { CaseDetail } from '../repair-process.metadata';
import { Router } from '@angular/router';
import { ReportService} from 'src/app/Services/gsxService/report.service';
import { Capacitor, Plugins } from '@capacitor/core';
import { FilesystemDirectory } from '@capacitor/filesystem';
import { AccessorySalesPage } from 'src/app/inventory/accessory-sales/accessory-sales.page';
const { Browser, Filesystem } = Plugins;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

  @Input() modal!: IonModal;
  @Input() repa;
  
  constructor(private router: Router,
              private actionSheetCtrl: ActionSheetController,
              private reportService: ReportService,
              private modalController: ModalController,

    ) { }

  caseGUID:any;
  customercode:any;
  doctype:any;
  LocationCode:any;
  accessoryData:any
  headerguid:any;

  invoiceList: any []=[];
  isShowTotal: boolean = false
  presentingElement = undefined;
  private canDismissOverride = false;

  @Output() InvoiceEmit = new EventEmitter<any>();
  

  InvoiceSuccess(event)
  {  
    this.InvoiceEmit.emit(event) 

    // this.invoiceList = []
    // if(event!= null && event != undefined ){ 
    //   if(Array.isArray(event?.INVOICE?.INVOICEDETAILS?.InvoiceItem))
    //   {
    //     for (let item of event?.INVOICE?.INVOICEDETAILS?.InvoiceItem)
    //     {
    //       this.invoiceList.push({
    //         "ItemNo": item.ItemNo, 
    //         "ItemCode":item.ItemCode,
    //         "ItemDescription": item.ItemDescription,
    //         "UnitPrice": item.UnitPrice,
    //         "TotalNetPrice":item.TotalNetPrice,
    //         "TotalTaxPrice":item.TotalTaxPrice,
    //         "ImageUrl":item.imageUrl,
    //         "Type":item.type,              
    //       })
    //     }
    //   }
    // }
  }
  
  ngOnInit() { 
    console.log("FROM INVOICE=====",this.repa)
    this.accessoryData = {
      //To-DO CHANGE
      caseguid: this.repa.CaseGUID,
      RetailCustomerCode: this.repa.CUSTOMER?.CustomerCode, 
      InvoiceDocType: "RSALES", 
      LocationCode: this.repa.LocationCode,   
    }; 
 
    if(this.repa!= null && this.repa != undefined )
    { 

      if (this.repa?.INVOICES?.Invoice){
        
        if(Array.isArray(this.repa?.INVOICES?.Invoice))
        {
          this.invoiceList = this.repa?.INVOICES?.Invoice
        }
        else
        {
  
          this.invoiceList.push(this.repa?.INVOICES?.Invoice)
  
        }
        console.log("INVOICE TS===",this.invoiceList)
  
        if ( this.invoiceList.length > 0){
          this.invoiceList.forEach( (part,index) => {
            debugger
            this.invoiceList[index].InvoiceDetailList = []
            if( Array.isArray(part?.INVOICEDETAILS?.InvoiceItem)){
              let parts = part?.INVOICEDETAILS?.InvoiceItem
              this.invoiceList[index].InvoiceDetailList = parts
            }
            else{
              let parts = part?.INVOICEDETAILS?.InvoiceItem
              this.invoiceList[index].InvoiceDetailList.push(parts)
            }
          })
        }
        console.log("INVOICE TS===",this.invoiceList)

      }
    }
  }
  
//   ngOnChanges(changes: SimpleChanges): void{
//     if(changes['repa'])
//     {
//       debugger
//       this.invoiceList = []
//       if(this.repa!= null && this.repa != undefined ){ 
//         if(Array.isArray(this.repa?.INVOICE?.INVOICEDETAILS?.InvoiceItem))
//         {
//           for (let item of this.repa?.INVOICE?.INVOICEDETAILS?.InvoiceItem)
//           {
//             this.invoiceList.push({
//               "ItemNo": item.ItemNo, 
//               "ItemCode":item.ItemCode,
//               "ItemDescription": item.ItemDescription,
//               "UnitPrice": item.UnitPrice,
//               "TotalNetPrice":item.TotalNetPrice,
//               "TotalTaxPrice":item.TotalTaxPrice,
//               "ImageUrl":item.imageUrl,
//               "Type":item.type,              
//             })
//           }
//         }else 
//         {
//           var lstInvoiceList=[];
//           lstInvoiceList.push(this.repa?.INVOICE?.INVOICEDETAILS?.InvoiceItem);
//           this.invoiceList.push({
//               "ItemNo": lstInvoiceList[0]?.ItemNo,
//               "ItemCode":lstInvoiceList[0]?.ItemCode,
//               "ItemDescription": lstInvoiceList[0]?.ItemDescription,
//               "UnitPrice": lstInvoiceList[0]?.UnitPrice,
//               "TotalNetPrice":lstInvoiceList[0]?.TotalNetPrice,
//               "TotalTaxPrice":lstInvoiceList[0]?.TotalTaxPrice,
//               "ImageUrl":lstInvoiceList[0]?.imageUrl,
//               "Type":lstInvoiceList[0]?.type,
//         })
//       }
//     }
//   }
// }


  ngOnChanges(changes: SimpleChanges): void{
 
    if(changes['repa'])
    {  
      this.invoiceList = []
      console.log("Repa TS===",this.repa)
      if(this.repa!= null && this.repa != undefined )
      { 

        if (this.repa?.INVOICES?.Invoice){
          
          if(Array.isArray(this.repa?.INVOICES?.Invoice))
          {
            this.invoiceList = this.repa?.INVOICES?.Invoice
          // if(Array.isArray(this.repa?.INVOICES?.Invoice?.INVOICEDETAILS?.InvoiceItem))
          // {
          //   for (let item of this.repa?.INVOICES?.Invoice?.INVOICEDETAILS?.InvoiceItem)
          //   {
          //     this.invoiceList.push({
          //       "ItemNo": item.ItemNo, 
          //       "ItemCode":item.ItemCode,
          //       "ItemDescription": item.ItemDescription,
          //       "UnitPrice": item.UnitPrice,
          //       "TotalNetPrice":item.TotalNetPrice,
          //       "TotalTaxPrice":item.TotalTaxPrice,
          //       "ImageUrl":item.imageUrl,
          //       "Type":item.type,              
          //     })
          //   }
          // }else 
          // {
          //   var lstInvoiceList=[];
          //   lstInvoiceList.push(this.repa?.INVOICES?.Invoice[0]?.INVOICEDETAILS?.InvoiceItem);
          //   this.invoiceList.push({
          //       "ItemNo": lstInvoiceList[0]?.ItemNo,
          //       "ItemCode":lstInvoiceList[0]?.ItemCode,
          //       "ItemDescription": lstInvoiceList[0]?.ItemDescription,
          //       "UnitPrice": lstInvoiceList[0]?.UnitPrice,
          //       "TotalNetPrice":lstInvoiceList[0]?.TotalNetPrice,
          //       "TotalTaxPrice":lstInvoiceList[0]?.TotalTaxPrice,
          //       "ImageUrl":lstInvoiceList[0]?.imageUrl,
          //       "Type":lstInvoiceList[0]?.type,
          // })
          // }
    
    
          }
          else
          {
    
            this.invoiceList.push(this.repa?.INVOICES?.Invoice)
    
          }
          console.log("INVOICE TS===",this.invoiceList)
    
          if ( this.invoiceList.length > 0){
            this.invoiceList.forEach( (part,index) => {
              debugger
              this.invoiceList[index].InvoiceDetailList = []
              if( Array.isArray(part?.INVOICEDETAILS?.InvoiceItem)){
                let parts = part?.INVOICEDETAILS?.InvoiceItem
                this.invoiceList[index].InvoiceDetailList = parts
              }
              else{
                let parts = part?.INVOICEDETAILS?.InvoiceItem
                this.invoiceList[index].InvoiceDetailList.push(parts)
              }
            })
          }
          console.log("INVOICE TS===",this.invoiceList)

        }

    }
  }
}


showTotal()
{
    if (this.isShowTotal == true) {
      this.isShowTotal = false;
    } else {
      this.isShowTotal = true;
    } 
}



  //Updated code
  isModalOpen = false;
  setOpen(isOpen: boolean) 
  {
    this.isModalOpen = isOpen;
  }


  onDismissChange(canDismiss) {  
    // Allows the modal to be dismissed based on the state of the checkbox
    this.canDismissOverride = canDismiss;
  }

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

  modalName:any;

  downloadServiceReport(reportType: String,InvoiceGUID) { 

   // this.ngxSpinnerService.show()
    let PdfData = [];
    PdfData.push({
      "Key": "ApiType",
      "Value": "GetInvoiceObject4Print",
    });
    PdfData.push({
      "Key": "InvoiceGuid",
      "Value":InvoiceGUID,
    });
    let pdfRequestData = JSON.stringify(PdfData);
    let contentRequest =
    {
      "content": pdfRequestData
    };
    let storepdf = contentRequest;
    this.reportService.downloadServiceReport(reportType, contentRequest).subscribe(
      {
        next: (value) => {
          let response = JSON.parse(value.toString());
          const byteArray = new Uint8Array(atob(response.FileContents).split('').map(char => char.charCodeAt(0)));
          var blob = new Blob([byteArray], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          window.open(url);
          this.modalName = byteArray;
          let fileName: string = new Date().toLocaleDateString();
              try 
              {
                const link = document.createElement('a');
                if (link.download !== undefined) { 
                  link.setAttribute('href', url);
                  link.setAttribute('download', fileName);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }
              catch (e) 
              {
                console.error('BlobToSaveAs error', e);
              } 


         // this.ngxSpinnerService.hide()


        },
        error: err => {
          console.log(err);
        //  this.ngxSpinnerService.hide()

        }
      });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: AccessorySalesPage,
      componentProps: {
        accessoryData: this.accessoryData // Pass the item to the modal component
      }
    });
     await modal.present();
     let result= await modal.onDidDismiss() 

     if(result.data == undefined || result.data == null)
     { 
     }
     else
     { 
       //value get from accessories-popup 
       this.InvoiceEmit.emit(result.data.invoiceSuccessObjt) 
     } 
  }


 
}
