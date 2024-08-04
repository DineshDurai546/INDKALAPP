import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { AccessorySalesPage } from '../accessory-sales.page';

@Component({
  selector: 'app-discount-list-popup',
  templateUrl: './discount-list-popup.page.html',
  styleUrls: ['./discount-list-popup.page.scss'],
})
export class DiscountListPopupPage implements OnInit {

  @ViewChild(AccessorySalesPage) ApplyDiscount: AccessorySalesPage


  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private dynamicService: DynamicService,
  ) { }

  DiscountList:any;
  discountMaterialCode: string = '';
  discountPartUnitPrice: number = 0;

  popUpArray:any[]=[]


  ngOnInit() { 
     //Fetch data from discount button  
     this.DiscountList= this.navParams.get('data');   
  }


  showAddParts(item){  
   // this.ngxSpinnerService.show()
    this.discountMaterialCode = item.MaterialCode
    this.discountPartUnitPrice = item.UnitPrice
    let requestData = []
    requestData.push({
      "Key":"APIType",
      "Value":"GetDiscount4Customer"
    })
    requestData.push({
      "Key":"CustomerCode",
      "Value":this.DiscountList.customerCode           
    })
    requestData.push({
      "Key":"MaterialCode",
      "Value":this.DiscountList.List.MaterialCode
    })
    requestData.push({
      "Key":"LocationCode",
      "Value":this.DiscountList.locationCode  
    })
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
          this.popUpArray = []
       //   this.ngxSpinnerService.hide()
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              if (data.Totalrecords == "0") {
                alert("No Discount Available")
              }
              else {
                if (Array.isArray(data?.DiscountCouponList?.DiscountCoupon)) {
                  this.popUpArray = data?.DiscountCouponList?.DiscountCoupon
                }
                else {
                  this.popUpArray.push(data?.DiscountCouponList?.DiscountCoupon)
                }
              }
            }
          } catch (ext) {
          }
        },
        error: err => {
       //   this.ngxSpinnerService.hide()
          console.log(err)
        }

      }
    ); 
  }

  addDiscount(item)
  {
      this.ApplyDiscount.addDiscount(item)
  }
  //   this.finalSelectedElements.forEach(obj =>{
  //     if(item.MaterialCode == obj.MaterialCode)
  //     {
  //       obj.DiscountAmount = parseFloat(item.DiscountAmount).toFixed(2)
  //       obj.DiscountCoupon=item.DiscountCoupon
  //       this.calculatePrices(obj)
  //       this.hideAddParts()
  //       this.updateDiscount(item)
  //     }
  //   })
  // }
  // async closeModal() {
  //   await this.modalController.dismiss();
  // }
  hideDiscountForm: boolean = true;

  async openRequestDiscount() {  

    this.hideDiscountForm=!this.hideDiscountForm;
}



  closeModal()
  {

  }
}
