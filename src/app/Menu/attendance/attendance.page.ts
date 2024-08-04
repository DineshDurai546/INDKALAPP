import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from 'src/app/core/service/auth.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { v4 as uuidv4 } from 'uuid'; 
import { HttpClient } from '@angular/common/http';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { LoadingController } from '@ionic/angular';
import { catchError, from, lastValueFrom } from 'rxjs';
import { Location } from '@angular/common'; 
import * as glob from '../../config/global'
//import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  //Time Variable
  currentTime:any; 
  dateAndTime:any

  //User details
  username:string
  FirstName:string
  LastName:string
  MobileNo:number 
  stopAttendance:boolean;
  StartAttendance:boolean;

  //Map Objects
  lat: any;
  lng: any;
  address: any; 

  EndLat:any;
  EndLan:any;

  //From Get Attendance  
  Status:any;
  CheckInTime:any;
  CheckOutTime:any;
  isActive:any;
  Location:any;
  EndLocation:any;

  //Image 
  imageElement:string=''
  capturedImageName: string;
  capturedImage: string; 
  imageList:any[]=[]
  AttachmentFile:any;

  //Address Object
  addressLines:any //"5RMP+MPG, Malad, Ekta Nagar, Malad West, Mumbai, Maharashtra 400064, India"
  countryName:any //India
  locality:any //Mumbai
  subLocality:any //Malad west
  postalCode:any //40064
  administrativeArea:any //maharashtra


  constructor(
              private router:Router,
              private authService:AuthService,
              private dynamicService:DynamicService,
              private ngZone: NgZone,
              private http: HttpClient,
              private nativeGeocoder: NativeGeocoder,
              private loadingCtrl: LoadingController,
              private location: Location,  
              ) { }

  ngOnInit() {

    this.getData()
    this.authService.currentUser.subscribe(data =>
      {
        this.FirstName=data.UserDetails.FirstName
        this.LastName =data.UserDetails.LastName
        this.username=data.UserDetails.UserName
        this.MobileNo=data.UserDetails.MobileNo
      })

     
  }

  ToMap()
  { 
    this.getLocation()
  }

  async getData() { 
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loading.present();
    
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
          this.router.navigate(['Menu/attendance']);
          this.location.replaceState('Menu/attendance');
          loading.dismiss();
          let response = JSON.parse(value.toString());
        
          let data = JSON.parse(response.ExtraData.toString())
          if (response.ReturnCode == '0') {
            let data = JSON.parse(response?.ExtraData);
            let results = []
            // console.log("=======",data)
            if(data.Totalrecords !=0)
            {  
              if(Array.isArray(data?.Attendance?.AttendanceDetails))
              {
                results = data?.Attendance?.AttendanceDetails 
                console.log("results====IF==",results)
                this.imageElement=''
  
              }
              else
              { 
              
                results.push(data?.Attendance?.AttendanceDetails) 
                console.log("results====ELSE==",results)
                this.Status=results[0]['Status']
                this.CheckInTime=results[0]['CheckInTime'] 
                this.isActive=results[0]['Active']
                this.CheckOutTime=results[0]['CheckOutTime']
                this.Location=results[0]['Location']
                this.EndLocation=results[0]['EndLocation']
                this.imageElement= glob.GLOBALVARIABLE.SERVER_LINK + results[0]['Image'] 
            

              } 

              this.StartAttendance=false
              this.stopAttendance=true
              loading.dismiss();

            } 
            else
            {
              this.stopAttendance=false
              this.StartAttendance=true
              loading.dismiss();

            } 
          }
          else {
            loading.dismiss();

           // this.ngxSpinnerService.hide()
          //  this.toastMessage.error("Something Went Wrong")
          }
        },
        error: err => {
          loading.dismiss();

         // this.toastMessage.error(err)
        }
      });
  }

  async getLocation(){ 

    this.getCurrentPosition().then((position) => {
      console.log('Current Position:', position);
    });

    // this.watchPosition((position) => {
    //   console.log('Live Position:', position);
    //   // You can update your UI or perform other actions based on the live position.
    // });


    try{
      const permissionsStatus = await Geolocation.checkPermissions();
      console.log('Permission status',permissionsStatus.location);

      if(permissionsStatus?.location != 'granted')
      {
        const requestStatus =await Geolocation.requestPermissions();
        if(requestStatus.location != 'granted')
        {
          return null
        }
      }
      let options:PositionOptions ={
        maximumAge:3000,
        timeout:10000,
        enableHighAccuracy:true
      };
      const position= await Geolocation.getCurrentPosition(options);
      this.ngZone.run(() => {  
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude; 
      }) 
    }
    catch(e)
    {
      console.log(e)
    }
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(this.lat, this.lng)
      .then((result: NativeGeocoderResult[]) =>{
        console.log("ADDRESS==RESULT=",result[0])
        this.postalCode = result[0]['postalCode'];
        this.locality =   result[0]['locality'];
         this.addressLines = result[0]['addressLines'][0];
        this.administrativeArea = result[0]['administrativeArea'];
        this.subLocality =  JSON.stringify(result[0]['subLocality']);

        this.address = `${this.addressLines}`;
        console.log('MY ADDRESS===',this.address) 
        this.saveAttendance() 
      } 
    )
                 
      .catch((error: any) => console.log(error)); 
    
  }
  ionViewWillEnter() {  
    this.getData()
  }

  async saveAttendance()
  {   
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loading.present();

    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveAttendance",
    });

    requestData.push({
      "Key": "AttendanceId",
      "Value":  uuidv4()
    })

    requestData.push({
      "Key": "FirstName",
      "Value": this.FirstName
    })

    requestData.push({
      "Key": "LastName",
      "Value": this.LastName
    })

    requestData.push({
      "Key": "Mobile",
      "Value": this.MobileNo
    })

    requestData.push({
      "Key": "Status",
      "Value": 'Present'
    })
 

//User Current location store
    requestData.push({
      "Key": "Location",
      "Value": this.address
    })

    requestData.push({
      "Key": "latitude",
      "Value": this.lat
    })

    requestData.push({
      "Key": "longitude",
      "Value": this.lng
    })

    requestData.push({
      "Key": "Image",
      "Value": this.AttachmentFile
    })

    requestData.push({
      "Key": "Active",
      "Value": '1'
    })

    requestData.push({
      "Key": "Remark",
      "Value": 'OK'
    })

    console.log('requestData=====',requestData);
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    };  

    debugger
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
      next: (value) => {
    console.log("Response=====",value)
        loading.dismiss();
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') { 
          // this.router.navigate(['/map']);

          this.router.navigate(['/Menu/job-detail']);


          // this.location.replaceState('Menu/job-details');
         // this.toastMessage.success("Data Submitted Successfully!")
          //this.returnPrevious()
        }
        else {
          loading.dismiss();
          console.log('Error')
        }
     
      },
    })

    
  }

  async EndAttendance()
  { 
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loading.present();

    let option:PositionOptions ={
      maximumAge:3000,
      timeout:10000,
      enableHighAccuracy:true
    };

    const position= await Geolocation.getCurrentPosition(option);
    this.ngZone.run(() => {  
      this.EndLat = position.coords.latitude;
      this.EndLan = position.coords.longitude; 
    }) 
    
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
      };
    try {
      const result = await lastValueFrom(
        from(this.nativeGeocoder.reverseGeocode(this.EndLat, this.EndLan))
          .pipe(
            catchError((error) => {
              console.error('Error in reverseGeocode:', error);
              throw error;
            })
          )
      );
    
      console.log("ADDRESS= lastValueFrom=RESULT=", result);
      this.addressLines = result[0]['addressLines'][0];
      this.EndLocation = ` ${this.addressLines}  `;
    } catch (error) {
      console.error('Error in EndAttendance:', error);
    }
     
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "SaveAttendance",
    });

    requestData.push({
      "Key": "Active",
      "Value": '0'
    })

    // --

    requestData.push({
      "Key": "EndLocation",
      "Value": this.EndLocation
    })

    requestData.push({
      "Key": "Endlatitude",
      "Value": this.EndLat
    })

    requestData.push({
      "Key": "Endlongitude",
      "Value": this.EndLan
    })
  // --------

    requestData.push({
      "Key": "Remark",
      "Value": 'END'
    })
    console.log(requestData);
    debugger
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    }; 
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
      next: (value) => {
        loading.dismiss();
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') {  
        }
        else {
          console.log("Else= ",response)
          loading.dismiss(); 
        }
     
      },
    })
    this.getData()


  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return Geolocation.getCurrentPosition();
  }
  watchId: any;
  // watchPosition(callback: (position: GeolocationPosition) => void): void {
  //   const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
  //   this.watchId = Geolocation.watchPosition(options, (position, err) => {
  //     if (!err) {
  //       callback(position);
  //     }
  //   });
  // }

  rotationAngle: number = 0;
  @HostListener('window:deviceorientation', ['$event'])
  handleDeviceOrientation(event: DeviceOrientationEvent) {
    // Update rotation angle based on device orientation
    this.rotationAngle = event.alpha || 0; // Use alpha for rotation around the vertical axis
  }

imageServerLink:any;

isLoading:boolean=false;

async takePicture(event) {
  this.isLoading = true; // Set loading indicator
  try {
    const image = await Camera.getPhoto({
      quality: 50, // Reduce quality for faster processing
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    this.capturedImage = image.webPath;
    this.capturedImageName = this.getFileName(image.webPath);

    const formData = new FormData();
    const blob = await fetch(image.webPath).then(response => response.blob());

    var filename = uuidv4() + "_" + this.capturedImageName; 
    formData.append('file', blob, filename); 

    this.dynamicService.uploadimagefile(formData).subscribe({
      next: (value) => { 
        let uploadedimage: any;
        uploadedimage = value;
        const newImage = {
          "AttachmentFile": uploadedimage?.dbPath,
          "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
        }; 
        this.AttachmentFile = newImage.AttachmentFile;
        this.imageElement = newImage.src;  
        console.log("uploadedimage==== ", uploadedimage);
      },
      complete: () => {
        this.isLoading = false; // Reset loading indicator
      }
    });
  } catch (error) {
    console.error(error);
    this.isLoading = false; // Reset loading indicator in case of error
  }
}


  private getFileName(path: string): string {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }


  // AttachmentFile:any;
  // onFileSelected(event: any) {
  //   console.log('onFileSelected Event= ',event)
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Convert selected file to a data URL
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => { 
  //     };

  //     let fileToUpload = <File>event.target.files[0];
  //     const formData = new FormData();
  //     var filename = uuidv4() + "_" + fileToUpload.name ;
  //     formData.append('file', fileToUpload, filename);
  //     this.dynamicService.uploadimagefile(formData).subscribe(
  //       {
  //         next: (value) => { 
  //           let uploadedimage: any;
  //           uploadedimage = value;
  //           const newImage = {
  //               "AttachmentFile": uploadedimage?.dbPath,
  //               "src": glob.GLOBALVARIABLE.SERVER_LINK + uploadedimage?.dbPath,
  //               "filename": fileToUpload.name
  //           };
  //           this.imageList.push(newImage);
  //           console.log("imageList==",this.imageList)
  //           this.AttachmentFile=newImage.AttachmentFile
  //           this.imageElement = newImage.src;  
  //       }
          
  //       });
        
  //   }
  //   }
  

  triggerFileInput() {
    document.getElementById('fileInput').click();
  }
 
}


// https://maps.googleapis.com/maps/api/geocode/json?latlng=72.8314238,19.183853&key=AIzaSyAAb1ogYSiDHoSng1JVA3BvTaBKXQ3_v5I