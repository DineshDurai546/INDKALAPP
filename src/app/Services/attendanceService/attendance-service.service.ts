import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DynamicService } from '../dynamicService/dynamic.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceServiceService {

  constructor(private dynamicService: DynamicService) { }

  MobileNo: string=""; 
  results: any[] = [];

  getData() : Observable<any>{ 
    // this.ngxSpinnerService.show()
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "GetAttendanceDetails"
    });
    requestData.push({
      "Key": "Mobile",
      "Value": this.MobileNo
    });
    let strRequestData = JSON.stringify(requestData); 
    let contentRequest = {
      "content": strRequestData
    };
    
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (value) => {
          let response = JSON.parse(value.toString());
        
          let data = JSON.parse(response.ExtraData.toString())
          if (response.ReturnCode == '0') {
            let data = JSON.parse(response?.ExtraData);
            this.results = []
            if(data.Totalrecords !=0)
            { 
  
             // this.isActive = false //If Attendance done
  
              if(Array.isArray(data?.Attendance?.AttendanceDetails))
              {
                this.results = data?.Attendance?.AttendanceDetails  
              }
              else
              {
                this.results.push(data?.Attendance?.AttendanceDetails)
              //  this.statusCheck=results[0]['Status']  
              //  this.checkInTime=results[0]['CheckInTime'] 
  
              }  
            }
            else
            { 
            //  this.isActive=true //If Attendance Not done
            }
          }
          else {
           // this.ngxSpinnerService.hide()
          //  this.toastMessage.error("Something Went Wrong")
          }
        },
        error: err => {
         // this.toastMessage.error(err)
        }
      });
      return this.dynamicService.getDynamicDetaildata(contentRequest);
  }

  getResults(): any[] {
    return this.results;
  }
  
}
