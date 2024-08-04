import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Controller } from 'src/app/config/comman.const';
import { ApiService } from 'src/app/core/service/api.service'; 
import { Columns } from 'src/app/models/column.metadata';
//import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {

  constructor(
    private apiService: ApiService,
   // private toaster: ToastrService
  ) { }

  formControl = () => {
    let fields = JSON.parse(localStorage.getItem("FieldDetail"));
    return fields;
  }

  gridDetails = () => {
    let fields = JSON.parse(localStorage.getItem("GridModuleDetail"));
    return fields;
  }

  postDetail = (data) => {
    return this.apiService.postData(Controller.Dynamic + 'AddDynamicData', data);
  }

  postGetData = (detail) => {
    return this.apiService.postData(Controller.Dynamic + 'GetDynamicData', detail);
  }

  postGetGridData = (data) => {
    return this.apiService.postData(Controller.Dynamic + 'GetGridDetail', data);
  }


  getDropdown = (methodName) => {
    return this.apiService.getData(methodName);
  }

  getData = (spName) => {
    return this.apiService.getData(Controller.Dynamic + "GetData(spName=" + spName + ")");
  }

  uploadUserImage(param) {
    return this.apiService.upload(Controller.Register + 'UploadUserImage', param);
  }

  getActions = (mouduleName: any, moduleId: any, screenLayoutTypeId: any) => {
    let act = JSON.parse(localStorage.getItem("ModuleAction"))
    let moduleAction = act.filter(x => x.ModuleName == mouduleName && x.ModuleId == moduleId
      && x.ScreenLayoutTypeId == screenLayoutTypeId);
    return moduleAction;
  }

  registerUser = (user) => {
    return this.apiService.postData(Controller.Register + 'AddUser', user );
  }

  uploadFile = (param) => {
    return this.apiService.upload(Controller.Dynamic + 'AcUploadFile', param);
  }

  getImportField = (data) => {
    return this.apiService.postData(Controller.Dynamic + 'GetImportDetail', data);
  }


  getDropdownData = (data) => {
    return this.apiService.postData(Controller.Dynamic + 'GetDynamicDropdown', data);
  }
  getGuestQuoteData = (QuoteGuid) => {
    return this.apiService.getData(Controller.Guest + "getQuoteDetail/?QuoteGuid=" + QuoteGuid );
  }

 
  setGuestQuoteStatus = (QuoteGuid,QuoteStatus) => {
    return this.apiService.getData(Controller.Guest + "setQuoteStatus/?QuoteGuid=" + QuoteGuid + "&QuoteStatus=" + QuoteStatus );
  }

  getDropdownExtraData = (data) => {
    return this.apiService.postData(Controller.Dynamic + 'GetDynamicDropdownExtra', data);
  }

  getComboSearch = (detail) => {
    return this.apiService.postData(detail.api, detail.data);
  }

  postDeleteData = (detail) => {
    return this.apiService.postData(Controller.Dynamic + 'DeleteDynamicData', detail);
  }
  generatePaymentLink = (detail) => {
    return this.apiService.postData(Controller.PaymentGateway + 'GetPaymentLink', detail);
  }
  
  getDropdownDataExtra = (data) => {
    return this.apiService.postData(Controller.Dynamic + 'GetDynamicDropdownExtra', data);
  }
  getDynamicDetaildata = (data) => {
    return this.apiService.postData(Controller.Dynamic + 'GetDynamicDetaildata', data);
  }
  // Reset Password:- 
  sendResetPasswordRequest = (ResetPasswordGUID, PrimaryEmail) => {
    return this.apiService.getData(Controller.Guest + "sendResetPasswordRequest/?ResetPasswordGUID=" + ResetPasswordGUID + "&PrimaryEmail=" + PrimaryEmail );
  }  
  getResetPasswordObject = (ResetPasswordGUID) => {
    return this.apiService.getData(Controller.Guest + "getResetPasswordObject/?ResetPasswordGUID=" + ResetPasswordGUID );
  }
  SaveUserPassword = (data) => {
    return this.apiService.postData(Controller.Guest + "SaveUserPassword", data );
  }
  savePosDta = (transactionno,data) => {
    return this.apiService.postData(Controller.PosDta + 'savePosDta?transactionno='+transactionno, data);
  }

 

  getColumn(datatyle: string, title: String, field: String): Columns {
    let cal = new Columns();
    cal.datatype = datatyle;
    cal.title = title;
    cal.field = field;
    return cal;
  }

  // validateAllFormFields(formGroup: FormGroup): boolean {
  //   let isValid = true;
  
  //   Object.keys(formGroup.controls).forEach(field => {
  //     let controlValue = formGroup.get(field).value;
  
  //     if (formGroup.get(field).hasValidator(Validators.required)) {
  //       if (controlValue == null || controlValue == undefined) {
  //         // this.toaster.error(field + " Cannot be Empty")
  //         isValid = false;
  //       } else if (field == "Email") {
  //         let emailValue = formGroup.get(field).value;
  //         const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //         if (!emailPattern.test(emailValue)) {
  //           // this.toaster.error(field, "is not an acceptable format")
  //           isValid = false;
  //         }
  //       }
  //     }
  //   });
  
  //   return isValid;
  // }

  
  validateAllFormFields(formGroup: FormGroup) :boolean{
    let isValid = true;
    Object.keys(formGroup.controls).forEach(field => {
      let controlvalue = formGroup.get(field).value
      if (formGroup.get(field).hasValidator(Validators.required)==true)
      {
        if (controlvalue == null || controlvalue == undefined ) {
        //  this.toaster.error(field + " Cannot be Empty")
         // return false;
          isValid = false;
        }
        else if(field == "Email")
        {
          let emailValue = formGroup.get(field).value
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if(!emailPattern.test(emailValue))
          {
          //  this.toaster.error(field, "is not a acceptable format")
           // return false;
           isValid = false;
          }
          
        }
      }
    })
    // return true
    return isValid ;
  }

  removeCommas(strPrice) {
    var strAmount = strPrice.replace(",", "");
    var fAmount = parseFloat(strAmount);
    return fAmount;
  }

  groupChildren(obj) {
    for (let prop in obj) {
      if (typeof obj[prop] === 'object') {
        this.groupChildren(obj[prop]);
      } else {
        obj['$'] = obj['$'] || {};
        obj['$'][prop] = obj[prop];
        delete obj[prop];
      }
    }
    return obj;
  }
  uploadimagefile(params) {
    debugger;
    return this.apiService.upload(Controller.Dynamic + 'UploadImageFile', params)

  }

  
}


//  Object.keys(formGroup.controls).forEach(field => {
  // const control = formGroup.get(field);
  // if (control instanceof FormControl) {
  //   control.markAsTouched({ onlySelf: true });
  // } else if (control instanceof FormGroup) {
  //   this.validateAllFormFields(control);
  // }
// });