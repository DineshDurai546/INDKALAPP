import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonModal, CheckboxCustomEvent, ModalController } from '@ionic/angular';
import { CaseDetail, Quote } from '../repair-process.metadata';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DatePipe } from '@angular/common';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { v4 as uuidv4 } from 'uuid';
import * as glob from "../../../config/global";
import xml2js from 'xml2js';
import { QuotePopupPage } from '../pop-up/quote-popup/quote-popup.page';


@Component({
  selector: 'app-quote-view',
  templateUrl: './quote-view.page.html',
  styleUrls: ['./quote-view.page.scss'],
})
export class QuoteViewPage implements OnInit {
 

  @Input() partlist
  @Input() repa: CaseDetail;
  @Input() objCaseDetail: CaseDetail;
  @Input() modal!: IonModal;
  @Output() dismissChange = new EventEmitter<boolean>();
  @Input () QuotationPartlist=[];
  @Output() QuoteGSTPriceDetails = new EventEmitter<any>();
  @Output() QuoteUpdated = new EventEmitter<any>();
  @Output() updateRep = new EventEmitter<any>();

  


  @ViewChild(QuotePopupPage) QuotePopupMethod: QuotePopupPage


  selectedQuopartlist:any[] = [];
  QuotPartList: any[] = [];
  QuoteStatusList: any[] = [];
  isEdit: boolean = true;
  isQuoteview:boolean =false;

  quoteSatusChange = ''


  // @Input() materialCode
  quoteForm: FormGroup;
  objQuote: Quote;
  isQuotView:boolean = false;
  quote:Quote;
  partListArray: any[] = [];
  quoteviewList:any=[];
  TotalQuotationGstDetails:any[]; 

  isOpenStatus: boolean = false;
  quoteStatus = ''

  QouteDate:any;
  QuoteData:any;
  PriceType:String
  QuoteHeaderGuid:string;

  selectPriceType:DropDownValue = DropDownValue.getBlankObject();

  //GST variable
  TotalBaseAmount:number=0;
  TotalTaxAmount:number=0;
  TotalNetAmount:number=0;
  TotalDiscount:number=0;
  TotalAmount:number=0;
  TotalIGSTPercentage:number=0;
  TotalTaxableAmount:number=0;

  constructor(
    private formBuilder:FormBuilder,
    private dynamicService:DynamicService,
    // private toastrService:ToastrService,
    private modalController: ModalController,
    private datePipe:DatePipe,
    private dropdownDataService:DropdownDataService

  ) { }

   
  ngOnInit(): void 
  { 
    this.QuoteData=this.repa;
    console.log("Quotation Repair Process:",this.QuotationPartlist)
    this.InitializeObject();
    let QouteDate = new Date()
    this.QouteDate = this.datePipe.transform(QouteDate, 'yyyy-MM-dd');
    
  }

  calculateDetails()

  {
    this.TotalBaseAmount=0
    this.TotalTaxAmount=0
    this.TotalDiscount=0
    this.TotalNetAmount=0
    this.TotalTaxableAmount=0
    console.log(" this.selectedQuopartlist== ", this.selectedQuopartlist)
    for (var item of this.selectedQuopartlist)
    {
          if(item.isDeleted == false){
          this.TotalBaseAmount = this.TotalBaseAmount+ parseFloat( (item.UnitPrice * item.Quantity).toString())
          item.DiscountAmount == null || item.DiscountAmount == undefined ||  item.DiscountAmount ==  ''? 0 : item.DiscountAmount  
          item.TaxableAmount = parseFloat((item.UnitPrice * item.Quantity).toString()) - parseFloat(item.DiscountAmount.toString())
          this.TotalTaxableAmount = this.TotalTaxableAmount+parseFloat( item.TaxableAmount.toString())
          item.CGSTAmount=this.round((parseFloat(item.TaxableAmount.toString()) * parseFloat(item.CGSTPercentage.toString()))/100)
          item.SGSTAmount=this.round((parseFloat(item.TaxableAmount.toString()) * parseFloat(item.SGSTPercentage.toString()))/100)
          item.IGSTAmount=this.round((parseFloat(item.TaxableAmount.toString()) * parseFloat(item.IGSTPercentage.toString()))/100)
          item.GSTAmount= item.IGSTAmount == 0 ? item.SGSTAmount + item.CGSTAmount : item.IGSTAmount
          item.TaxAmount =  item.GSTAmount
          this.TotalTaxAmount = this.TotalTaxAmount+ parseFloat(item.TaxAmount.toString())
          this.TotalDiscount= this.TotalDiscount + parseFloat(item.DiscountAmount.toString())
          item.NetAmount = item.TaxableAmount + item.TaxAmount
          this.TotalNetAmount= this.TotalNetAmount+ parseFloat(item.NetAmount.toString())
        }
        
        }
        const TotalQuotationGstDetails={
        "TotalBaseAmount":parseFloat( this.TotalTaxableAmount.toFixed(2)),
        "TotalTaxAmount":parseFloat(this.TotalTaxAmount.toFixed(2)),
        "TotalTaxableAmount":parseFloat( (this.TotalTaxableAmount).toFixed(2)),
        "TotalNetAmount":parseFloat(this.TotalNetAmount.toFixed(2)),
        "TotalDiscount":this.TotalDiscount
        }
        this.QuoteGSTPriceDetails.emit(TotalQuotationGstDetails);
        console.log("Total Amount::",TotalQuotationGstDetails)
        console.log("selectedQuopartlist",this.selectedQuopartlist);
  }

  InitializeObject()
  {
       this.quoteForm = this.formBuilder.group({
            QuoteCode: [null]
    });
  
  }

  round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
 
  GetQuotePart()
  {
    for(let item of this.partlist){
      console.log("Total PartList",item)
      this.quoteviewList.push(item)
      console.log("quoteviewList",this.quoteviewList)
    }  
  }
  
  OnSaveQuote(){
    this.QuoteHeaderGuid = uuidv4()
    let QuoteReq=[];
    QuoteReq.push({
      "Key": "ApiType",
      "Value":"SaveQuote4Job"
    });
    QuoteReq.push({
      "Key": "QuoteCode",
      "Value":this.repa?.QUOTE?.QuoteCode == null || this.repa?.QUOTE?.QuoteCode == undefined ? "NEW":this.repa?.QUOTE?.QuoteCode
    });
    QuoteReq.push({
      "Key": "QuoteGuid",
      "Value":this.repa?.QuoteFlag == "0"  ? this.QuoteHeaderGuid: this.repa?.QUOTE.QuoteGuid
    });
    QuoteReq.push({
      "Key": "CompanyCode",
      "Value":glob.getCompanyCode()
    });
    QuoteReq.push({
      "Key": "QuoteDate",
      "Value":this.QouteDate
    });
    QuoteReq.push({
      "Key": "LocationCode",
      "Value":this.repa?.LOCATION?.LocationCode
    });
    QuoteReq.push({
      "Key": "CaseGUID",
      "Value":this.repa?.CaseGUID
    });
    QuoteReq.push({
      "Key": "RetailCustomerCode",
      "Value":this.repa?.RetailCustomerCode
    });
    QuoteReq.push({
      "Key": "TotalBaseAmount",
      "Value":this.TotalBaseAmount
    });
    QuoteReq.push({
      "Key": "TotalDiscountAmount",
      "Value":this.TotalDiscount
    });
    QuoteReq.push({
      "Key": "TotalTaxableAmount",
      "Value":this.TotalTaxableAmount
    });
    QuoteReq.push({
      "Key": "TotalTaxAmount",
      "Value":this.TotalTaxAmount
    });
    QuoteReq.push({
      "Key": "TotalNetAmount",
      "Value":this.TotalNetAmount
    });
    QuoteReq.push({
      "Key": "QuoteStatus",
      "Value":"OPEN"
    });
    QuoteReq.push({
      "Key": "QuotationDetails",
      "Value": this.getQouteXml()
    });
    console.log("Savesd Quote Data:",QuoteReq)
    debugger
    let QuoteRequest = JSON.stringify(QuoteReq)
    let QuoteRequestContent = {
      "content":QuoteRequest
    }
    //return
    this.dynamicService.getDynamicDetaildata(QuoteRequestContent).subscribe({
      next:(value)=>{
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') {  
          alert("Saved Successfully")
       
          var getval = JSON.parse(response.ExtraData); 
          this.QuoteUpdated.emit(getval.QUOTE)
        }
       
      }
    })
  }
 

  getPricingOptionXml(poption)
  {
    var rawData={"rows":[]};
    rawData.rows=poption;
    debugger;
    var builder = new xml2js.Builder();
    
    console.log("Data xml1:",builder)
    var xml = builder.buildObject(rawData);
    xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
    xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
    //xml = xml.split(' ').join('')
    return xml;

  }
  getQouteXml(){
    debugger
    let rawData = {
      "rows": []
    }

    for (let item of this.selectedQuopartlist) {
      console.log("Part CODE:",item)
      rawData.rows.push({
        "row": {
         "QuoteDetailGuid":item?.QuoteDetailGuid == null || item?.QuoteDetailGuid == undefined ? uuidv4() : item?.QuoteDetailGuid,
         "QuoteGUID":this.repa?.QuoteFlag == "0"  ? this.QuoteHeaderGuid: this.repa?.QUOTE.QuoteGuid,
         "ItemType":item.ItemType,
         "Type":item.PartType,
         "ItemCode":item.MaterialCode,
         "ItemDescription":item.MaterialDescription,
         "ImageUrl":item.ImageUrl,
         "CompanyCode":glob.getCompanyCode(),
         "GSTGroupCode":item.GSTGroupCode,
         "GSTJuridiction":item.GSTJuridiction,
         "SAC_HSNCode":item.HSNSACCode,
         "Quantity":item.Quantity,
         "UnitPrice":item.UnitPrice,
         "BaseAmount":item.BaseAmount == null || item.BaseAmount == undefined ? 0 : item.BaseAmount ,
         "DiscountAmount":item.DiscountAmount,
         "TaxableAmount": item.TaxableAmount == null || item.TaxableAmount == undefined ? 0 :item.TaxableAmount,
         "IGSTPercentage": item.IGSTPercentage == null || item.IGSTPercentage == undefined ? 0 :item.IGSTPercentage,
         "SGSTPercentage": item.SGSTPercentage == null || item.SGSTPercentage == undefined ? 0 :item.SGSTPercentage,
         "CGSTPercentage": item.CGSTPercentage == null || item.CGSTPercentage == undefined ? 0 :item.CGSTPercentage,
         "IGSTAmount": item.IGSTAmount == null || item.IGSTAmount == undefined ? 0 :item.IGSTAmount,
         "SGSTAmount": item.SGSTAmount == null || item.SGSTAmount == undefined ? 0 :item.SGSTAmount,
         "CGSTAmount": item.CGSTAmount == null || item.CGSTAmount == undefined ? 0 :item.CGSTAmount,
         "NetAmount":item.NetAmount,
         "TaxAmount":item.TaxAmount,
         "TaxPercentage":item.IGSTPercentage + item.CGSTPercentage + item.SGSTPercentage,
         "PriceType":item.POption.PriceOption,
         "GSTPercentage":item.IGSTPercentage + item.CGSTPercentage + item.SGSTPercentage,
         "GSTAmount":item.IGSTAmount + item.CGSTAmount + item.SGSTAmount,
         "GSTComponentDetails":"", 
         "PricingOptions":JSON.stringify(item.PricingOption),
         "isDeleted":item.isDeleted
        }
      })
    }
    var builder = new xml2js.Builder();
    console.log("Data xml1:",builder)
    var xml = builder.buildObject(rawData);
    xml = xml.toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
    xml = xml.toString().replace(/(\r\n|\n|\r|\t)/gm, "");
    //xml = xml.split(' ').join('')
    return xml;
  }

  PriceTypeChangeEvent(event,item)
  {
    item.POption=event;
    item.UnitPrice=  event.UnitPrice;
    item.TaxableAmount= event.UnitPrice;
    item.CurrencyCode=event.CurrencyCode;
    this.calculateDetails();
  }

  DiscountAmountEvent(item) 
  {
    item.DiscountAmount == null || item.DiscountAmount == undefined ||  item.DiscountAmount ==  ''? 0 : item.DiscountAmount  ;
    this.calculateDetails()
  }  

  ngOnChanges(changes: SimpleChanges) {
   
    if(changes["repa"]){  
      this.selectedQuopartlist =[]; 
      if(this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem !=null || this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem != undefined){
       if(Array.isArray(this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem)){ 
        for(let item of this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem){
            var QuoteItem = this.getQuotemItemFromQuoteDetails(item); 
            var poption = QuoteItem.PricingOption.find(x=>x.PriceOption == QuoteItem.PriceType);
            QuoteItem.POption=poption;
            this.selectedQuopartlist.push(QuoteItem);
        }
       } 
       else{  
        var QuoteItem = this.getQuotemItemFromQuoteDetails(this.repa?.QUOTE?.QUOTEDETAILS?.QuoteItem);
        var poption = QuoteItem.PricingOption.find(x=>x.PriceOption == QuoteItem.PriceType);
        QuoteItem.POption=poption;
        this.selectedQuopartlist.push(QuoteItem);
       }
       this.calculateDetails()
      }

      this.UpdateQuoteStatus();
    }
  }


  getBlankObject(): DropDownValue {
    const ddv = new DropDownValue();
    ddv.TotalRecord = 0;
    ddv.Data = [];
    return ddv;
  }

  // Price Type
  onPriceTypeSearch($event: { term: string; items: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.pricetype, $event.term)
      .subscribe({
        next: (value) => {
          if (value != null) {
            this.selectPriceType = value;
            console.log("Get PriceType Data:",value)
          }
        },
        error: (err) => {
          this.selectPriceType = this.getBlankObject();
        },
      });
  }
 
  checkboxChanged(event: any) {
    const ev = event as CheckboxCustomEvent;
    const checked = ev.detail.checked;

    this.dismissChange.emit(checked);
  }
 
  PriceTypeEvent(event,item){  
    debugger;
    const PriceTypeObj={
      "PriceType":event.PriceTypeEvent
    } 
    
  }
 
 
  //Updated Code

  
isModalOpen = false;
setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
}
closePopUp(event)
{ 
  this.isModalOpen = event;
}

selectedQuotationParts: any[] ;
addPartToQoutation(selectedQuotationList){
  this.selectedQuotationParts = selectedQuotationList;
  console.log('==selectedQuotationParts==',this.selectedQuotationParts)
  this.isModalOpen = false;
  // this.objCaseDetail = Object.assign({}, this.objCaseDetail);
}


quotePartList: any[];
  quoteFormClose(selectedpart) {
    this.quotePartList = selectedpart;
  //  this.isQoutePop = false;
  }


//Instend of ngonchanges get from Quote-popup directly
  receiveQuote($event) 
  {  
   console.log('After Emit from popup= ',$event)
    this.QuotationPartlist=$event; 

    if(this.QuotationPartlist != null || this.QuotationPartlist != undefined){
      if(Array.isArray(this.QuotationPartlist)){ 
        for(let item of this.QuotationPartlist){
          var QuotationItem = this.getQuotemItemFromSelectedPart(item)
          if( Array.isArray( item.PricingOption.PriceList)){
            QuotationItem.PricingOption=item.PricingOption.PriceList
            var stockpriceindex = QuotationItem.PricingOption.findIndex(x=>x.PriceOption == "StockPrice")
            if(!(stockpriceindex < 0))
            {
              QuotationItem.POption = QuotationItem.PricingOption[stockpriceindex]
              QuotationItem.UnitPrice=QuotationItem.POption.UnitPrice ;  
            }
            else
            {
              QuotationItem.POption = QuotationItem.PricingOption[0];
              QuotationItem.UnitPrice=QuotationItem.POption.UnitPrice ;
              QuotationItem.TaxableAmount=QuotationItem.POption.UnitPrice ;

            }
          }
          else
          {
            QuotationItem.PricingOption.push(item.PricingOption.PriceList);
            QuotationItem.POption = item.PricingOption.PriceList;
            QuotationItem.UnitPrice=QuotationItem.POption.UnitPrice ;
            QuotationItem.TaxableAmount=QuotationItem.POption.UnitPrice ;
          }

          var QuoteItemExists = this.selectedQuopartlist.findIndex(x=>x.MaterialCode == QuotationItem.MaterialCode && x.IsDeleted==0)
          if(QuoteItemExists < 0)
          {
            this.selectedQuopartlist.push(QuotationItem);
          }
          console.log("Get Real Data:",this.selectedQuopartlist)
        }
      }
      else{ 

        var QuotationItem = this.getQuotemItemFromSelectedPart(this.QuotationPartlist)
        var QuoteItemExists = this.selectedQuopartlist.findIndex(x=>x.MaterialCode == QuotationItem.MaterialCode && x.IsDeleted==0)
        if(QuoteItemExists < 0)
        {
           this.selectedQuopartlist.push(QuotationItem)
        }
      }
      this.calculateDetails()
      if(this.selectedQuopartlist.length>0){
        this.isQuoteview =  false;
      }
    }

    this.isModalOpen = false; 
  }

 

  // CalculateUnit(){
  //   let TotalUnitAmount:number=0;
  //   var IGSTPercentage : number=0
  //     for(let item of this.selectedQuopartlist){
  //       IGSTPercentage=IGSTPercentage +  parseFloat(item.IGSTPercentage.toString())
  //       this.TotalIGSTPercentage  = IGSTPercentage
  //       console.log("TotalIGSTPercentage:",this.TotalIGSTPercentage);
  //       TotalUnitAmount=TotalUnitAmount +  parseFloat(item.PricingOption.PriceList.UnitPrice.toString())
  //       this.TotalBaseAmount = TotalUnitAmount
  //       // console.log("Total *****:",TotalUnitAmount)
  //     }
  //     // for(let item of IGSTPercentage)
  //   }
    
 
 

    onSubmit()
    {
      this.QuotePopupMethod.onSubmit()
    }
  
    deletePart(index: number) { 
      this.selectedQuopartlist.splice(index, 1);
      this.calculateDetails() 
    }

    
    getQuotemItemFromQuoteDetails(item)
    {
      debugger;
      var QuotationItem={
        "QuoteDetailGuid":item.QuoteDetailGuid,
        "ItemType":item.ItemType,
        "ImageUrl":item.ImageUrl,
        "MaterialCode":item.ItemCode,
        "MaterialDescription":item.ItemDescription,
        "ItemNo":item.ItemNo,
        "PartType":item.Type,
        "PricingOption":JSON.parse(item.PricingOptions),
        "GSTGroupCode":item.GSTGroupCode,
        "Quantity":item.Quantity,
        "POption":{ "UnitPrice":0 , "PriceOption":"" , "CurrencyCode":""},
        "UnitPrice": parseFloat( parseFloat(item.UnitPrice).toFixed(2)),
         "HSNSACCode":item.SAC_HSNCode,
         "GSTJuridiction":item.GSTJuridiction,
         "CGSTPercentage": parseFloat(parseFloat(item.CGSTPercentage).toFixed(2)),
         "SGSTPercentage":parseFloat(parseFloat(item.SGSTPercentage).toFixed(2)),
         "IGSTPercentage":parseFloat(parseFloat(item.IGSTPercentage).toFixed(2)),
         "CGSTAmount":parseFloat(parseFloat(item.CGSTAmount).toFixed(2)),
         "SGSTAmount":parseFloat(parseFloat(item.SGSTAmount).toFixed(2)),
         "IGSTAmount":parseFloat(parseFloat(item.IGSTAmount).toFixed(2)),
         "TotalTaxAmount":parseFloat(parseFloat(item.TaxAmount).toFixed(2)),
         "TaxableAmount":parseFloat(parseFloat(item.TaxableAmount).toFixed(2)),
         "PriceType":item.PriceType,
         "SalesUOM":item.UOM,
         "DiscountCouponCode":"",
         "DiscountAmount":parseFloat(parseFloat(item.DiscountAmount).toFixed(2)),
         "isDeleted":0
      }
      return QuotationItem;
    }

    getQuotemItemFromSelectedPart(item)
    {
    
      var QuotationItem={
        "ItemType":item.ItemType,
        "MaterialCode":item.MaterialCode,
        "MaterialDescription":item.MaterialDescription,
        "PartType":item.PartType,
        "ImageUrl":"",
        "PricingOption":[],
        "GSTGroupCode":item.GSTGroupCode,
        "Quantity":1,
        "POption":{ "UnitPrice":0 , "PriceOption":"" , "CurrencyCode":""},
        "UnitPrice":0,
         "HSNSACCode":item.HSNSACCode,
         "CGSTPercentage": parseFloat(parseFloat(item.CGSTPercentage).toFixed(2)),
         "SGSTPercentage":parseFloat(parseFloat(item.SGSTPercentage).toFixed(2)),
         "IGSTPercentage":parseFloat(parseFloat(item.IGSTPercentage).toFixed(2)),
         "CGSTAmount":0,
         "SGSTAmount":0,
         "IGSTAmount":0,
         "TotalTaxAmount":0,
         "TaxableAmount":0,
         "SalesUOM":item.SalesUOM,
         "DiscountCouponCode":"",
         "DiscountAmount":0,
         "isDeleted":0
      }
    
      return QuotationItem ;
    
    }
    

    updatequoteStatus() {
      this.onQuoteStatus();
      this.quoteStatus = this.quoteSatusChange;
      this.update_quote();
      //this.setQuoteStatus.emit(this.quoteStatus)
      this.UpdateQuoteStatus()
    }

    update_quote() {
      //   let QuoteRequest = JSON.stringify(QuoteReq)
      // let QuoteRequestContent = {
      //   "content":QuoteRequest
      // }
      
  console.log("newquoteGuid",this.repa?.QUOTE.QuoteGuid)
  console.log("quoteStatus",this.quoteStatus)
      this.dynamicService.setGuestQuoteStatus(this.repa?.QUOTE.QuoteGuid, this.quoteStatus).subscribe(
        {
          next: (value:any) => {   
            if (value.ReturnCode == '0') {
             alert('Quote Status Updated')
             this.updateRep.emit(true)

              var getval = JSON.parse(value.ExtraData);
            }
            else {
              console.log("else")
            }
          },
          error: err => {
             ;
            console.log(err);
          }
        });
    }
  

    onQuoteStatus() {
      if (this.isOpenStatus == true) {
        this.isOpenStatus = false;
  
      } else {
        this.isOpenStatus = true;
      }
    }
  

    UpdateQuoteStatus() {
      this.QuoteStatusList = [];
      if (this.repa?.QUOTE?.QuoteStatus == null || this.repa?.QUOTE?.QuoteStatus == undefined || this.repa?.QUOTE?.QuoteStatus == "OPEN") {
        this.QuoteStatusList.push({
          "QuoteStatusCode": "OPEN",
          "QuoteStatusDescription": "Quote Preparation"
        })
        this.QuoteStatusList.push({
          "QuoteStatusCode": "RELEASED",
          "QuoteStatusDescription": "Quote Submit To Customer"
        })
      }
  
      if (this.repa?.QUOTE?.QuoteStatus == "RELEASED") {
        this.QuoteStatusList.push({
          "QuoteStatusCode": "APPROVED",
          "QuoteStatusDescription": "Quote Approved By Customer"
        })
        this.QuoteStatusList.push({
          "QuoteStatusCode": "REJECTED",
          "QuoteStatusDescription": "Quote Rejected By Customer"
        })
      }
  
      if (this.repa?.QUOTE?.QuoteStatus == "DISCOUNTAPPROVAL") {
        this.QuoteStatusList.push({
          "QuoteStatusCode": "DISCOUNTAPPROVED",
          "QuoteStatusDescription": "Discount Approved By Approver"
        })
        this.QuoteStatusList.push({
          "QuoteStatusCode": "DISCOUNTREJECTED",
          "QuoteStatusDescription": "Discount Rejected By Approver"
        })
      }
      if (this.repa?.QUOTE?.QuoteStatus == "DISCOUNTAPPROVED") {
        this.QuoteStatusList.push({
          "QuoteStatusCode": "RELEASED",
          "QuoteStatusDescription": "Quote Submit To Customer"
        })
  
        this.QuoteStatusList.push({
          "QuoteStatusCode": "APPROVED",
          "QuoteStatusDescription": "Est"
        })
        this.QuoteStatusList.push({
          "QuoteStatusCode": "REJECTED",
          "QuoteStatusDescription": "Quote Rejected By Customer"
        })
      }
  
      if (this.repa?.QUOTE?.QuoteStatus == "DISCOUNTREJECTED") {
        this.QuoteStatusList.push({
          "QuoteStatusCode": "OPEN",
          "QuoteStatusDescription": "Quote Preparation"
        })
        this.QuoteStatusList.push({
          "QuoteStatusCode": "RELEASED",
          "QuoteStatusDescription": "Quote Submit To Customer"
        })
      }
    }
 

}
