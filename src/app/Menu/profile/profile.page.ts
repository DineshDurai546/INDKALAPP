import { Component, OnInit } from '@angular/core';
import { AttendanceServiceService } from 'src/app/Services/attendanceService/attendance-service.service';
import * as glob from 'src/app/config/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private attendanceService:AttendanceServiceService
  ) { }

  AttendanceDetails:any[]=[];
  imageElement:any;

  ngOnInit() {
    this.attendanceService.getData().subscribe({
      next:(value) =>{
        // console.log("Value check=",value)
        let response =JSON.parse(value)
        let data = JSON.parse(response?.ExtraData)

        if(Array.isArray(data?.Attendance?.AttendanceDetails))
        {
          this.AttendanceDetails=data?.Attendance?.AttendanceDetails
        }
        else
        {
          this.AttendanceDetails.push(data?.Attendance?.AttendanceDetails)
          this.imageElement=glob.GLOBALVARIABLE.SERVER_LINK +this.AttendanceDetails[0]['Image']
        }
        console.log("AttendanceDetails=",this.AttendanceDetails)

    },
    error:(err)=>{
      console.log(err)
    }
  })
  
  }

}
