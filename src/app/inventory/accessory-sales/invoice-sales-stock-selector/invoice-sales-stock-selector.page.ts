import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';

@Component({
  selector: 'app-invoice-sales-stock-selector',
  templateUrl: './invoice-sales-stock-selector.page.html',
  styleUrls: ['./invoice-sales-stock-selector.page.scss'],
})
export class InvoiceSalesStockSelectorPage implements OnInit {


  MaterialCode: string =  '';
  invoiceStockData: any[] = [];
  selectedStockData: any[] = [];

  Type:any;

  constructor(
    private modalController: ModalController,
    private dynamicService: DynamicService, 
    private navParams: NavParams,
  ) { }

  ngOnInit(): void {
    this.getInvoiceSalesPart()
        //Fetch data from button  
        this.Type= this.navParams.get('data');
        console.log("doc Type check=",this.Type.doctype)
  }

  getInvoiceSalesPart() {
    //this.ngxSpinnerService.show()
    let requestData = []
    requestData.push({
      "Key":"APIType",
      "Value":"GetMaterialList4Sale"
    })
    requestData.push({
      "Key": "MateriaLCode",
      "Value": this.MaterialCode
    });
    requestData.push({
      "Key": "PageNo",
      "Value": "1"
    });
    requestData.push({
      "Key": "PageSize",
      "Value": "100"
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    debugger
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
      next: (Value: any) => {
        this.invoiceStockData = []
       // this.ngxSpinnerService.hide()
        let response = JSON.parse(Value.toString());
        if(response.ReturnCode == '0') {
          let data = JSON.parse(response?.ExtraData);
          console.log(data.MaterialList.Material)
          if(Array.isArray(data?.MaterialList?.Material))
          {
            this.invoiceStockData = data?.MaterialList?.Material
          }
          else
          {
            this.invoiceStockData.push(data?.MaterialList?.Material)
          }
        }
        for(let item of this.invoiceStockData)
        {
          item.isSelected = false;
        }
      },
      error: (err) => {
     //   this.ngxSpinnerService.hide()
        console.log(err)
      }
    })
  }


  addInvoiceSalesStocks()
  {
    this.selectedStockData=[]
    for(let item of this.invoiceStockData)
    {
      if(item.isSelected == true)
      {
        this.selectedStockData.push(item)
      }
    }
    this.modalController.dismiss(this.selectedStockData);
   // this.dialogRef.close(this.selectedStockData)
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
