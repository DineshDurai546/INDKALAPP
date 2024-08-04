import { Component, Input, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { ModalController } from '@ionic/angular';
import { AdvancePaymentPage } from '../advance-payment/advance-payment.page';
import * as glob from "../../config/global";



@Component({
  selector: 'app-advance-payment-list',
  templateUrl: './advance-payment-list.page.html',
  styleUrls: ['./advance-payment-list.page.scss'],
})
export class AdvancePaymentListPage implements OnInit {

  @Input() repa;
  @Input() modal!: IonModal;

  detail: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  MobileNo: string;
  CaseId : string;
  LocationCode: string; 
  toolBarAction: any[] = [];
  result:any=[];
  LocationForJob: DropDownValue = DropDownValue.getBlankObject();

  constructor(
              private dropdownDataService: DropdownDataService,
              private dynamicService: DynamicService,
              private modalController: ModalController,

             ) { }

  ngOnInit(): void {
    this.onLocationSearch({ term: "", item: [] });
    this.GetAdvancePaymentList('','','','');
  }
  search(){
    this.GetAdvancePaymentList('', this.MobileNo, this.LocationCode, this.CaseId) 
  }
  GetAdvancePaymentList(eventDetail, mobileno, locationcode, caseid) {
  
   // this.ngxSpinner.show()
    let requestdata = []
    requestdata.push({
      "Key":"ApiType",
      "Value":"GetAdvancePaymentList"
    })
    requestdata.push({
      "Key":"MobileNo",
      "Value": mobileno == null || mobileno == undefined ? '' : mobileno
    })
    requestdata.push({
      "Key":"LocationCode",
      "Value": locationcode == null || locationcode == undefined ? '' : locationcode
    })
    requestdata.push({
      "Key":"CaseId",
      "Value": caseid == null || caseid == undefined ? '' : caseid
    })

    requestdata.push({
      "Key":"PageNo",
      "Value": eventDetail.pageIndex == null || eventDetail.pageIndex == undefined? "1": eventDetail.pageIndex + 1 
    });
    requestdata.push({
      "Key":"PageSize",
      "Value": eventDetail.pageSize== null || eventDetail.pageSize == undefined? "10": eventDetail.pageSize
    });
console.log("requestdata",requestdata)
    let strRequestData = JSON.stringify(requestdata);
    let contentRequest =
    {
      "content": strRequestData
    };
    console.log("Before Advance payment SP:", requestdata)
   // this.ngxSpinner.hide()
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {
       //   this.ngxSpinner.hide()
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') {
              let data = JSON.parse(response?.ExtraData)
              console.log("Data is ", data)
              if (data.Totalrecords == "0"){
               alert("No Data Found")
                this.detail.next({ totalRecord: data?.Totalrecords, Data: '' })
                return
              }
              this.result =[]
              if( Array.isArray(data.AdvancePaymentList?.AdvancePaymentRow) ) {
                this.result = data.AdvancePaymentList?.AdvancePaymentRow;
              }
              else{
                this.result.push(data.AdvancePaymentList?.AdvancePaymentRow)
              }
              console.log('=ExtraData=',this.result)
              this.detail.next({ totalRecord: data?.Totalrecords, Data: this.result })
            //  this.ngxSpinner.hide()
              }
            } catch (ext) {
          }
        },
        
        error: err => {
        //  this.ngxSpinner.hide()
          console.log(err)
        }
        

      }
    );
  }
  onLocationSearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.Location, $event.term, {
      CompanyCode:  glob.getCompanyCode()
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.LocationForJob = value;
        }
      },
      error: (err) => {
        this.LocationForJob = DropDownValue.getBlankObject();
      }
    });
  }
  advanceObj:any;

  async openPayment(item)
  {

    this.advanceObj = { 
      caseguid: item.CaseGUID,
      customercode: item.CustomerCode, 
      locationcode: item.LocationCode,  
    }; 


    const modal = await this.modalController.create({
      component: AdvancePaymentPage,
      componentProps: {
        advanceObj: this.advanceObj 
        // Pass the item to the modal component
      }
    });
    await modal.present();

  }
}
