import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonModal, PopoverController } from '@ionic/angular';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { CaseDetail } from '../../repair-process.metadata';



@Component({
  selector: 'app-material-popup',
  templateUrl: './material-popup.page.html',
  styleUrls: ['./material-popup.page.scss'],
})
export class MaterialPopupPage implements OnInit {

  @ViewChild('modal', { static: true }) modal!: IonModal;
  
  selectedFruitsText = '0 Items';
  selectedFruits: string[] = [];

  fruits: [ 
    { text: 'Cherry', value: 'cherry' }, 
    { text: 'Passionfruit', value: 'passionfruit' },
    { text: 'Peach', value: 'peach' },
    { text: 'Pear', value: 'pear' },
    { text: 'Plantain', value: 'plantain' },
    { text: 'Plum', value: 'plum' },
    { text: 'Pineapple', value: 'pineapple' },
    { text: 'Pomegranate', value: 'pomegranate' },
    { text: 'Raspberry', value: 'raspberry' },
    { text: 'Strawberry', value: 'strawberry' },
  ];


    //
    @Input() repa : any;
    
    BrandCode;
    ProductType:string="";
    WarrantyStatus:string="";
    PopDate:Date;
    searchText = ''; 

  selectMeteialCode:DropDownValue = this.getBlankObject();

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
                private datePipe:DatePipe
             ) { }

  ngOnInit() 
  {

    console.log("===From  material popup ====",this.repa)
    this.BrandCode = this.repa.Brand
    this.ProductType = this.repa.ProductType
    this.WarrantyStatus = this.repa.WarrantyStatus 
    this.onSearchMaterailCode({term: "" , items:[]});
  }

 

  private formatData(data: string[]) {
    if (data.length === 1) {
      const fruit = this.fruits.find((fruit) => fruit.value === data[0]);
      return fruit.text;
    }

    return `${data.length} items`;
  }

  fruitSelectionChanged(fruits: string[]) {
    this.selectedFruits = fruits;
    this.selectedFruitsText = this.formatData(this.selectedFruits);
    this.modal.dismiss();
  }


  @Input() items: string[] = [];
  filteredItems: string[] = [];
  searchTerm: string = '';

  filterItems() {
    this.filteredItems = this.items.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()));
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
          }
        },
        error: (err) => {
          this.selectMeteialCode = DropDownValue.getBlankObject();
        }
      });
    }

    filterDropdownItems() {
      if (!this.selectMeteialCode || !this.selectMeteialCode.Data) {
        return [];
      }
      return this.selectMeteialCode.Data.filter(item =>
        item.TEXT.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    //emit and close with selected item
    selectItem(item: string) { 
      this.popoverController.dismiss({
        selectedValue: item
      });

    }
}
