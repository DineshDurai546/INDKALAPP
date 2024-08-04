import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DropDownValue } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { AccessorySalesPage } from 'src/app/inventory/accessory-sales/accessory-sales.page';
import * as glob from "../../config/global";

@Component({
  selector: 'app-accessories-sales',
  templateUrl: './accessories-sales.page.html',
  styleUrls: ['./accessories-sales.page.scss'],
})
export class AccessoriesSalesPage implements OnInit {

  docTypeData: any;
  InvoiceCode:string = ''
  results :any [] = []
  MobileNo:string = ''
  InvoiceDocType: DropDownValue = DropDownValue.getBlankObject();
  Location: DropDownValue = DropDownValue.getBlankObject();
  locationcodedata:string =  '';
  accessoryData:any;
  presentingElement = undefined;
  private canDismissOverride = false;


  constructor(
              private route: Router,
              private dynamicService: DynamicService,
              // private ngxservice: NgxSpinnerService,
              // private toast: ToastrService,
              private activatedRoute: ActivatedRoute,
              private modalController: ModalController,
              private dropdownDataService: DropdownDataService
            ) { }

  ngOnInit() {
    this.onInvoiceDocTypeSearch({ term: "", item: [] });
    this.onLocationSearch({ term: "", item: [] });
    this.GetAccessorySalesList('','','')
  }



  GetAccessorySalesList(mobileNo,locationcode,invoicecode) {
 //   this.ngxservice.show();
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetAccessorySalesList"
    });
    requestData.push({
      "Key": "DocumentType",
      "Value": this.docTypeData == null || this.docTypeData == undefined ? '':this.docTypeData
    });
    requestData.push({
      "Key": "MobileNo",
      "Value": mobileNo == null || mobileNo == undefined?'':mobileNo
    });
    requestData.push({
      "Key": "InvoiceCode",
      "Value": invoicecode == null || invoicecode == undefined?'':invoicecode
    });
    requestData.push({
      "Key": "LocationCode",
      "Value": locationcode == null || locationcode == undefined?'':locationcode
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    };
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
        //  this.ngxservice.hide()
          this.results = []
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData);
              if(data?.Totalrecords > 0)
              {
                //this.toast.success("Records Found")
              }
              else
              {
                alert("No Record Found")
              }
              console.log(data)
              if (Array.isArray(data?.AccessorySalesList?.AccessorySalesRow)) {
                this.results = data?.AccessorySalesList?.AccessorySalesRow
              }
              else {
                this.results.push(data?.AccessorySalesList?.AccessorySalesRow)
              }
            }
          } catch (ext) {
            console.log(ext);
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }
  
  onInvoiceDocTypeSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.InvoiceDocType, $event.term, {
      CompanyCode:glob.getCompanyCode(),
    }).subscribe({
      next: (value) => {
        if (value != null) {

          this.InvoiceDocType = value;
        }
      },
      error: (err) => {
        this.InvoiceDocType = DropDownValue.getBlankObject();
      }
    });
  }

  onLocationSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.Location, $event.term, {
      CompanyCode: glob.getCompanyCode(),
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.Location = value;
        }
      },
      error: (err) => {
        this.Location = DropDownValue.getBlankObject();
      }
    });
  }
  onWillPresent() {
    // Resets the override when the modal is presented
    this.canDismissOverride = false;
  }

  async openModal(item: any) {

    this.accessoryData = { 
      caseguid: item.CaseGuid,
      RetailCustomerCode: item.RetailCustomerCode, 
      headerguid: item.InvoiceGuid, 
      InvoiceDocType: item.InvoiceDocType, 
      LocationCode: item.LocationCode,   
    }; 

    const modal = await this.modalController.create({
      component: AccessorySalesPage,
      componentProps: {
        accessoryData: this.accessoryData 
        // Pass the item to the modal component
      }
    });
    await modal.present();

    let result= await modal.onDidDismiss() 
    if(result.data == undefined || result.data == null)
    { 
    }
    else
    { 
      //value get from Accessories-popup
      console.log("GET FROM ACC==",result)
    } 
  }

  // click(item)
  // { 
  //   this.accessoryData = {
  //     //To-DO CHANGE
  //     caseguid: item.CaseGuid,
  //     customercode: item.RetailCustomerCode, 
  //     doctype: item.InvoiceDocType, 
  //     locationCode:item.LocationCode, 
  //     headerguid:item.InvoiceGuid  
  //   }; 
  // }
}
