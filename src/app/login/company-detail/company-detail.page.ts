import { Component, OnInit } from '@angular/core';
import { DropDownValue, DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import * as glob from 'src/app/config/global'
import { GsxService } from 'src/app/Services/gsxService/gsx.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { Router } from '@angular/router';



@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.page.html',
  styleUrls: ['./company-detail.page.scss'],
})
export class CompanyDetailPage implements OnInit {

  constructor(
              private dropdownDataService: DropdownDataService,
              private gsxService: GsxService,
              private route: Router,


  ) { }


  gsxAuthKey:string;
  companyCodeData:string;
  disableAuthPart:boolean = false;
  hidesubmit:boolean=true;
  companyCode: DropDownValue = DropDownValue.getBlankObject();
  authKeyDisable: boolean = true;
  gsxUserId:string;
  userName:string;
  orgRoleId: string = '';
  defaultCompanyCode: string = '';

  
  
  ngOnInit() {

    this.onCompanySearch({ term: "", item: [] });
    let userdata = []
    debugger
    userdata.push(glob.getLogedInUser()["UserDetails"])
    console.log("userdata======",userdata)
    for(let item of userdata)
    {
      this.userName = item.UserName
      this.gsxUserId = item.GsxUserId
      this.defaultCompanyCode = item.DefaultCompanyCode
      if (item.GsxIdFlag == 0)
      { 
       this.disableAuthPart = true
       this.hidesubmit=false;
      }
      else
      { 
        this.getData()
      }
    } 
   

  }


  
  onCompanySearch($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.Company, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          if(value.Data.length == 1)
          {
            for(let item of value.Data)
            {
              this.companyCodeData = item.Id
            }
          }
          this.companyCode = value;
        }
      },
      error: (err) => {
        this.companyCode = DropDownValue.getBlankObject();
      }
    });
  }

  

  updateGsxToken()
  {
    if(this.gsxAuthKey == null || this.gsxAuthKey == undefined)
    {
     alert("Please enter your gsx Auth Key")
    }
    else
    {
      let data = {
        "ActivationToken":this.gsxAuthKey,
        "UserName":this.userName,
        "GsxUserId":this.gsxUserId
      }
      var strRequestData = JSON.stringify(data)
      var requestdata = {
        "Content": strRequestData
      }
      console.log(requestdata)
      ''
      this.gsxService.saveGsxTokenDetail(requestdata).subscribe({
        next:(value:any) =>{
          ''
          
          var response = JSON.parse(value);
          
          if(response.gsxTokenSaved == true)
          {
           alert("GSX Activation Token Saved successfully")
            this.authKeyDisable = true
            this.hidesubmit=true
            this.getData()
          }
        },
        error: err=>{
          console.log(err)
          alert(err)
        }
      })
    }
  }

  getData()
  {   
    // this.ngxSpinnerService.show()
    this.gsxService.fetchUserDetail().subscribe({
      next:(value) =>{
      //  this.ngxSpinnerService.hide()
        let response = value
        console.log(response)
        if(response["gsxValidToken"] == true)
        {
          alert("GSX Token Validated successfully")
          this.authKeyDisable=true;
          this.hidesubmit=false;
        }
        else
        {
        alert("Please Update GSX Activation Token")
          this.authKeyDisable = false;
          this.hidesubmit=true;
        }
      },
      error: err =>{
        console.log(err)
      //  this.ngxSpinnerService.hide()
      }
    })
  }


  submit()
  {  
     
    if(this.companyCodeData == null || this.companyCodeData == undefined || this.companyCodeData.length == 0   )
    {
    alert("Please select Company")
    }
    else
    {  
      glob.setCompanyCode(this.companyCodeData.trim());
  
      
      if(glob.getLogedInUser().UserDetails.MenuGroupId==2)
      {
        this.route.navigateByUrl('/auth/'+glob.getCompanyCode()+'/token-create')  
      }
      else
      {
        this.route.navigateByUrl('Menu/job-detail')
      } 
      
    //  this.dialogRef.close(this.companyCodeData.trim());
    }
  }

}
