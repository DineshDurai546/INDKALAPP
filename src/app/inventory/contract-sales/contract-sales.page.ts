import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IonModal, CheckboxCustomEvent, ModalController, ActionSheetController, ToastController } from '@ionic/angular';
import { AccessorySalesPage } from '../accessory-sales/accessory-sales.page';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';


@Component({
  selector: 'app-contract-sales',
  templateUrl: './contract-sales.page.html',
  styleUrls: ['./contract-sales.page.scss'],
})
export class ContractSalesPage implements OnInit {

  @Input() modal!: IonModal;

  private canDismissOverride = false;
  isShowTotal: boolean = false
  totalBaseAmount: number;
  totalDiscountAmount: number;
  totalNetAmount: number;
  totalTaxAmount: number;
  totalTaxableAmount: number;
  finalSelectedElements: any;

  
  constructor(
              private actionSheetCtrl: ActionSheetController,
              private modalController: ModalController,
              private toastController: ToastController,
              private dynamicService: DynamicService,

            ) { }

  accessoryData:any
  @Input() repa;
  @Output() ContractEmit = new EventEmitter<any>();

  invoiceList: any []=[];


  ngOnInit() {
    this.GetDirectSalesInvoice()
    //Send to Accessory Sales
    this.accessoryData = {
      //To-DO CHANGE
      caseguid: this.repa.CaseGUID,
      RetailCustomerCode: this.repa.CUSTOMER?.CustomerCode, 
      InvoiceDocType: "CSALES", 
      LocationCode: this.repa.LocationCode,   
      repa:this.repa
    }; 
  }

  InvoiceObj:any;

  GetDirectSalesInvoice()
  { 

    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetDirectSalesInvoice"
    });
    requestData.push({
      "Key": "CustomerCode",
      "Value": this.repa.CUSTOMER.CustomerCode,
    });
  
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
    debugger
        
          let response = JSON.parse(Value.toString());
          if (response.ReturnCode == '0') {
            response['ExtraDataJSON'] = JSON.parse(response.ExtraData); 
            this.InvoiceObj= response.ExtraDataJSON.InvoiceList.Invoice  
            console.log("InvoiceObj===",this.InvoiceObj)
 

            if(Array.isArray(this.InvoiceObj))
              {
                for (let inv of this.InvoiceObj)
                {

                  if(Array.isArray(inv.InvoiceDetail))
                    { 
                      for (let item of inv.InvoiceDetail)
                      {
                       
                          this.invoiceList.push({
                            "ItemNo": item.ItemNo, 
                            "ItemCode":item.ItemCode,
                            "ItemDescription": item.ItemDescription,
                            "UnitPrice": item.UnitPrice,
                            "TotalNetPrice":item.TotalNetPrice,
                            "TotalTaxPrice":item.TotalTaxPrice,
                            "ImageUrl":item.imageUrl,
                            "Type":item.type,      
                            "NetAmount":item.NetAmount,
                            "TaxableAmount":item.TaxableAmount,
                            "TaxAmount":item.TaxAmount
                                    
                          }) 

                        } 
                      }
                      else 
                      { 
                        var lstInvoiceList=[];
                        lstInvoiceList.push(inv.InvoiceDetail);
                        this.invoiceList.push({
                            "ItemNo": lstInvoiceList[0]?.ItemNo,
                            "ItemCode":lstInvoiceList[0]?.ItemCode,
                            "ItemDescription": lstInvoiceList[0]?.ItemDescription,
                            "UnitPrice": lstInvoiceList[0]?.UnitPrice,
                            "TotalNetPrice":lstInvoiceList[0]?.TotalNetPrice,
                            "TotalTaxPrice":lstInvoiceList[0]?.TotalTaxPrice,
                            "ImageUrl":lstInvoiceList[0]?.imageUrl,
                            "Type":lstInvoiceList[0]?.type,
                            "NetAmount":lstInvoiceList[0]?.NetAmount,
                            "TaxableAmount":lstInvoiceList[0]?.TaxableAmount,
                            "TaxAmount":lstInvoiceList[0]?.TaxAmount
                      })  
                      this.TotalNetAmount()

                    }
                    
                }
              }
              else 
              {
                
                if(Array.isArray(this.InvoiceObj.InvoiceDetail))
                  { 
                    for (let item of this.InvoiceObj.InvoiceDetail)
                    { 

                        this.invoiceList.push({
                          "ItemNo": item.ItemNo, 
                          "ItemCode":item.ItemCode,
                          "ItemDescription": item.ItemDescription,
                          "UnitPrice": item.UnitPrice,
                          "TotalNetPrice":item.TotalNetPrice,
                          "TotalTaxPrice":item.TotalTaxPrice,
                          "ImageUrl":item.imageUrl,
                          "Type":item.type,      
                          "NetAmount":item.NetAmount,
                          "TaxableAmount":item.TaxableAmount,
                          "TaxAmount":item.TaxAmount        
                        }) 

                      } 

                  }
                    else 
                    {
                      var lstInvoiceList=[];
                      lstInvoiceList.push(this.InvoiceObj.InvoiceDetail); 
                      this.invoiceList.push({
                          "ItemNo": lstInvoiceList[0]?.ItemNo,
                          "ItemCode":lstInvoiceList[0]?.ItemCode,
                          "ItemDescription": lstInvoiceList[0]?.ItemDescription,
                          "UnitPrice": lstInvoiceList[0]?.UnitPrice,
                          "TotalNetPrice":lstInvoiceList[0]?.TotalNetPrice,
                          "TotalTaxPrice":lstInvoiceList[0]?.TotalTaxPrice,
                          "ImageUrl":lstInvoiceList[0]?.imageUrl,
                          "Type":lstInvoiceList[0]?.type,
                          "NetAmount":lstInvoiceList[0]?.NetAmount,
                          "TaxableAmount":lstInvoiceList[0]?.TaxableAmount,
                          "TaxAmount":lstInvoiceList[0]?.TaxAmount        
                    }) 
                  }
                  this.TotalNetAmount()

            }
 
            console.log("GET=========",response.ExtraDataJSON) 

           // this.objCaseDetailObServable = response['ExtraDataJSON'];
            //this.objCaseDetail = response['ExtraDataJSON']; 
           
         // console.log("Repa Original *************** ", this.objCaseDetail)
          

          }
        },
        error: err => {
    debugger

          console.log(err);
        }
      }
    );
  }
 

NetAmount:number=0;
TaxAmount:number=0;
TaxableAmount:number=0;
  
  ContractSuccess(event)
  {
    this.ContractEmit.emit(event)
  }

//   ngOnChanges(changes: SimpleChanges): void{
//     if(changes['repa'])
//     { 
//     alert('ngOnChanges')

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

showTotal()
{
    if (this.isShowTotal == true) {
      this.isShowTotal = false;
    } else {
      this.isShowTotal = true;
    } 
}


async openModal() 
{
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
     this.ContractEmit.emit(result.data.invoiceSuccessObjt) 
     console.log('VALUE GET FROM accessories-popup ===',result.data.invoiceSuccessObjt) 
     this.closeModal()
   } 
}

  closeModal() {
    this.modalController.dismiss();
  }


  TotalNetAmount() { 
    debugger
    this.totalBaseAmount = 0;
    this.totalDiscountAmount = 0;
    this.totalNetAmount = 0;
    this.totalTaxAmount = 0;
    this.totalTaxableAmount = 0;
    this.invoiceList.forEach((item) => {  
      this.totalTaxableAmount += parseFloat(item.TaxableAmount);
      this.totalTaxAmount += parseFloat(item.TaxAmount);
      this.totalNetAmount += parseFloat(item.NetAmount);
      this.totalDiscountAmount += parseFloat(item.DiscountAmount);
      this.totalBaseAmount += parseFloat(item.BaseAmount);
    });

    this.totalTaxableAmount = parseFloat(this.totalTaxableAmount.toFixed(2));
    this.totalTaxAmount = parseFloat(this.totalTaxAmount.toFixed(2));
    this.totalNetAmount = parseFloat(this.totalNetAmount.toFixed(2));
    this.totalDiscountAmount = parseFloat(this.totalDiscountAmount.toFixed(2));
    this.totalBaseAmount = parseFloat(this.totalBaseAmount.toFixed(2));
    // if ((this.totalNetAmount >= 50000 && (this.CustomerObject[0].StateCode != this.LocationObject[0].StateCode))
    //   || (this.totalNetAmount >= 200000 && (this.CustomerObject[0].StateCode == this.LocationObject[0].StateCode))
    // )
    //  {
    //   if (this.EwayBillFlag == "0") {
    //     this.hideEwaySelection = false;
    //   }
    // }
  }

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
