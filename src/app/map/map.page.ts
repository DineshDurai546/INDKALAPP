import { Component, ElementRef, HostListener, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { AttendanceServiceService } from '../Services/attendanceService/attendance-service.service';
import { IonButton, LoadingController, NavController } from '@ionic/angular'; 
import { ModalController } from '@ionic/angular';
import { InspectionMetaData } from '../transaction/repair-process/inspection/inspection.metadata';
import { InspectionPage } from '../transaction/repair-process/inspection/inspection.page';
// import { Geolocation, GeolocationOptions } from '@capacitor/geolocation';
import { Geolocation, GeolocationOptions, PositionError } from '@ionic-native/geolocation/ngx';
import { Geoposition } from '@ionic-native/geolocation';
import { v4 as uuidv4 } from 'uuid'; 
import { Subscription, interval } from 'rxjs'; 
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html', 
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild('openModalButton', { static: true }) openModalButton: IonButton;
  
  @ViewChild('map')
  mapRef: ElementRef<HTMLElement>; 
  // map: GoogleMap;
  map: any;
 
     
  isStartJourney:boolean=false;
  results :any[]
  isVisitDone:boolean=true

  //From AttendanceTable
  statusCheck:string;
  checkInTime:any;
  active:any;
  Location:any;
  startLan:any
  startLong:any;
  attendanceId:any;

  //From JobPickTable
  JobPickId:string;
  JobCloseFlag:boolean=false;
  JobCancelFlag:boolean=false;
  JourneyStartFlag = 0; 
  StartFlag:any=1;
  JourneyLat:any;
  JourneyLong:any
  ArrivalFlag=0;
  WorkStartFlag=0; 
  WorkCompleteFlag=0;

  //User details
  username:string 
  FirstName:string
  LastName:string
  MobileNo:number
  
  //map Properties
  directionsService:any;
  directionsRenderer:any;
  distance:any;
  duration:any;
  expectTime:any;
  currentLocationMarker: any; 
  private marker: google.maps.Marker; 
  originMarker: google.maps.Marker;
  destinationMarker: google.maps.Marker;
  currentPosition: any;
  latLng:any;

  //Customer  
  isModalOpen = false; 
  selectedCustomer:any;
  isShowDetails:boolean;
  customerAddress:any;
  CustomerName:any;
  CustomerMobile:any;
  ReasonForClose:any;
  CaseGUID:any;
  CaseId:any;
  CustomerLat:any;
  CustomerLong:any;
  cusromerDetailList:any=[];

  //Timer

  startJob:boolean=false
  stopJob:boolean=false;
  isArrived:boolean=false;


  // 
  NohaveRecords:boolean=true;
  haveRecords:boolean=false;
  isclickStart:boolean;

  // 
  
  isshowStartJourney:boolean=false

  constructor(
              private router:Router,
              private route: ActivatedRoute, 
              private authService:AuthService,
              private dynamicService:DynamicService,
              private AttendanceService:AttendanceServiceService,
              private loadingCtrl: LoadingController, 
              private modalController: ModalController,
              private navCtrl: NavController,
              private geolocation: Geolocation, 
  
              ) {
               }
 


  ngOnInit()
  {       
    this.fetchData()  
    this.authService.currentUser.subscribe(data =>
    {  
      this.username=data.UserDetails.UserName
      this.MobileNo=data.UserDetails.MobileNo
      this.FirstName=data.UserDetails.FirstName
      this.LastName=data.UserDetails.LastName
    })  
    this.watchPosition() 
 
  }
 
  watchPosition() 
  { 
      const watch = this.geolocation.watchPosition();
      watch.subscribe((position: Geoposition) => { 
          if (position && position.coords) {
              this.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);    
          } else {
              console.error('Error getting position.');
          }
      }, (error) => {
          console.error('Error watching position:', error);
      }); 
   
  }


  calculateAndDisplayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer,
    position: google.maps.LatLng, destination: string, travelMode: google.maps.TravelMode) {  
  
    // Initialize map and markers if not already done
    if (!this.map) {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 12,
      });
    }
  
    if (!this.originMarker) {
      this.originMarker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,  // Use a symbol instead of an icon
          scale: 7, // Adjust the scale as needed
          strokeColor: 'blue', // Customize stroke color
          rotation: 0 // Initial rotation
        },
        title: 'Origin'
      });
    }
  
    if (!this.destinationMarker) {
      this.destinationMarker = new google.maps.Marker({
        position: new google.maps.LatLng(0, 0), // Default position, will be updated later
        map: this.map,
        icon: {
          url: '/assets/customerMarker.png',
          scaledSize: new google.maps.Size(55, 55),
        },
        title: 'Destination'
      });
    }
  
    // Request directions
      directionsService.route({
      origin: position,
      destination: { query: destination },
      travelMode: travelMode,
    }).then((response) => {
      if (!directionsRenderer.getMap()) {
        directionsRenderer.setMap(this.map);
      }
      directionsRenderer.setDirections(response);
  
      // Update distance and estimated time
      this.distance = response.routes[0].legs[0].distance.text;
      const durationSeconds = response.routes[0].legs[0].duration.value;
      const eta = new Date(Date.now() + durationSeconds * 1000);
      this.expectTime = eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
      // Update destination marker position
      this.destinationMarker.setPosition(response.routes[0].legs[0].end_location);
  
 
  
    }).catch((e) => console.error("Directions request failed due to " + e.status));
  }

      
      


  // ----
 
  async fetchData() {  
    // Show loading before making the request
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loading.present();
    
  this.AttendanceService.getData().subscribe(
    () => { 
      const results = this.AttendanceService.getResults(); 

      if (results && results.length > 0) 
      {    
        this.statusCheck = results[0]['Status'];  
        this.checkInTime = results[0]['CheckInTime'];
        // this.active=results[0]['Active'];  
        this.Location=results[0]['Location']; 
        this.startLan=results[0]['latitude'];
        this.startLong=results[0]['longitude'];
        this.attendanceId=results[0]['AttendanceId'];  
        console.log("===FETCH DATA FUNCTION CALL====")
        this.GetTechnicianJob()   

    
        //if attendance done  

        this.showLoading()
        this.ngAfterViewInit();
        loading.dismiss();       
      }

      else
      {   
        //if attendance not done
        this.attendanceId=''  
        loading.dismiss();
      }    
    },

    (error) => {
      // Handle errors
      loading.dismiss();
      console.error('Error from service:', error);
    }

  );

}

 

position:any
async createMap() {   
 
  this.map = new google.maps.Map(
    this.mapRef.nativeElement,
    {
      zoom: 7,
      center: { lat: 19.801215, lng: 72.602055 },
    }
  );

  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer();
  this.directionsRenderer.setOptions({
    polylineOptions:{
      strokeWeight:3,
      strokeOpacity:1,
      strokeColor:'black',

    },
    suppressMarkers:true,
    suppressPolylines:false
  })
  this.directionsRenderer.setMap(this.map);

  this.geolocation.getCurrentPosition().then((position) => {
    const newPosition = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    ); 

  // this.originMarker = new google.maps.Marker({
  //   map: this.map,
  //   position: newPosition,
  //   draggable: false,    
  // }); 
  }); 
}

onDriveButtonClick() { 
  this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer,  this.currentPosition,this.customerAddress, google.maps.TravelMode.DRIVING);
}

onTransitButtonClick() { 
  this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer,  this.currentPosition,this.customerAddress, google.maps.TravelMode.TRANSIT);
} 
  
recenterMap() {
  this.geolocation.getCurrentPosition().then((position) => {
    const newPosition = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    this.map.setCenter(newPosition);
  });
}
markers: google.maps.Marker[] = [];
cleanMarker()
{
  this.markers.forEach(marker => {
    marker.setMap(null); // Remove the marker from the map
  });
  this.markers = [];
}

initMap(mapElement: HTMLElement) 
{
  this.map = new google.maps.Map(mapElement, {
    zoom: 7,
    center: { lat: 41.85, lng: -87.65 } // Default center (Chicago)
  });

  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer();
  this.directionsRenderer.setMap(this.map);

  // Add a marker for the origin
  this.originMarker = new google.maps.Marker({
    map: this.map,
    draggable: false // Set to true if you want to allow the user to move the marker
  });
}
 
  ngOnchanges(changes: SimpleChanges):void
  { 
    this.fetchData() 
  }

  ngAfterViewInit(): void 
  { 
      this.createMap() 
  }
  
  starAttendance()
  {
    this.router.navigate(['Menu/attendance']);
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
      cssClass: 'custom-loading',
    });
    loading.present();
  }
   
  ionViewWillEnter() {  
    this.fetchData()
  }

  openRepairProcess(event)
  {  
  this.navCtrl.navigateForward('repair-process', { state: event }); 
  }

  isBack:boolean;
  Back()
  { 
    this.isStartJourney=false
    this.isShowDetails=false
  }
  

 
async SaveJourney()
{  
 
  // this.count=this.count+1
  // console.log("Count = ",this.count) 
  let requestData = [];
  requestData.push({
    "Key": "ApiType",
    "Value": "SaveTechnicianJob",
  });

  requestData.push({
    "Key": "JobPickId",
    "Value":  this.JobPickId =='' || this.JobPickId == null ||  this.JobPickId == undefined ?  uuidv4(): this.JobPickId
  }) 

  requestData.push({
    "Key": "AttendanceId",
    "Value":  this.attendanceId
  })
 
  requestData.push({
    "Key": "JourneyLat",
    "Value":  this.updatedLatitude == undefined ? this.startLan:this.updatedLatitude
  })

  requestData.push({
    "Key": "JourneyLong",
    "Value": this.updatedLongitude == undefined ? this.startLong:this.updatedLongitude
  })

  requestData.push({
    "Key": "JourneyStartFlag",
    "Value":  this.StartFlag 
  })
  requestData.push({
    "Key": "ArrivalFlag",
    "Value":  this.ArrivalFlag
  })
 
  requestData.push({
    "Key": "WorkStartFlag",
    "Value":  this.WorkStartFlag
  })

  requestData.push({
    "Key": "WorkCompleteFlag",
    "Value":  this.WorkCompleteFlag
  })
 
  requestData.push({
    "Key": "CaseId",
    "Value": this.CaseId
  })

  requestData.push({
    "Key": "CaseGUID",
    "Value": this.CaseGUID
  })

  requestData.push({
    "Key": "CustomerName",
    "Value": this.CustomerName
  })
  requestData.push({
    "Key": "CustomerMobile",
    "Value": this.CustomerMobile
  })
  requestData.push({
    "Key": "CustomerLat",
    "Value": this.CustomerLat
  })

  requestData.push({
    "Key": "CustomerLong",
    "Value": this.CustomerLong
  })

  requestData.push({
    "Key": "CustomerAddress",
    "Value": this.customerAddress
  })
  
  requestData.push({
    "Key": "JobCloseFlag",
    "Value": this.JobCloseFlag
  })
  requestData.push({
    "Key": "ReasonForClose",
    "Value": this.ReasonForClose==null || this.ReasonForClose == undefined ? '':this.ReasonForClose
  })
  requestData.push({
    "Key": "JobCancelFlag",
    "Value": this.JobCancelFlag
  })
  
  let strRequestData = JSON.stringify(requestData);
  let contentRequest = {
    "content": strRequestData
  };    
  // console.log("save== ",strRequestData) 

  this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
    next: (value) => {  
      let response = JSON.parse(value.toString());

      if (response.ReturnCode == '0')
       {   
        this.GetTechnicianJob() 
       }
      else { 
        console.log('Error')
      }
   
    },
  })
  
}


updatedLatitude:any
updatedLongitude:any;
watchPositionSubscription: Subscription;
 
 

intervalId: any; 
//GET Technician Job 
async GetTechnicianJob() 
  {      
    let requestData = [];
    requestData.push({
      "Key": "APIType",
      "Value": "GetTechnicianJob"
    }); 
    requestData.push({
      "Key": "AttendanceId",
      "Value": this.attendanceId
    });
  

    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content": strRequestData
    }; 
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next: (Value) => {  
          try {
            let response = JSON.parse(Value.toString());
            if (response.ReturnCode == '0') { 
              let data = JSON.parse(response?.ExtraData);   
              console.log("check data===",data)
              //First time come here - there is no entry in table
              if(data.Totalrecords == '0')
              {       
        
                this.isShowCustomerDetails=false;
                this.isCancel=false;
                this.isShowPickup=true;
                this.iSStartJourney=false;
                this.ArrivalFlag=0 
                this.WorkStartFlag=0
                this.WorkCompleteFlag=0
                if(this.WorkCompleteFlag == 0)
                  {
                    this.geolocation.getCurrentPosition().then((resp: Geoposition) => { 
                    this.JourneyLat=resp.coords.latitude
                    this.JourneyLong= resp.coords.longitude  
                    this.ConvertLatLong(this.JourneyLat,this.JourneyLong)         

                    }).catch((error) => {
                      console.log('Error getting location', error);
                    }); 
                  }

                
                this.resetMarkers();
              }

            else
              { 
                
                this.results = [] 
                if(Array.isArray(data?.TechnicianJobList?.TechnicianDetails  ))
                { 
                  this.results = data?.TechnicianJobList?.TechnicianDetails 
                }
                else
                {  
                  this.results.push(data?.TechnicianJobList?.TechnicianDetails)  
                  this.JourneyStartFlag=this.results[0]['JourneyStartFlag']  
                  let pickupId=this.results[0]['JobPickId']  
                  this.JobPickId=pickupId =='' || pickupId == null || pickupId == undefined ? uuidv4(): pickupId
                  this.JobCloseFlag=this.results[0]['JobCloseFlag'] == '1'? true:false
                  this.JourneyLat= this.results[0]['JourneyLat'] 
                  this.JourneyLong= this.results[0]['JourneyLong']   
                  this.ArrivalFlag= this.results[0]['ArrivalFlag']     
                  this.WorkStartFlag= this.results[0]['WorkStartFlag']     
                  this.WorkCompleteFlag= this.results[0]['WorkCompleteFlag']     

                  

                  
                  this.ConvertLatLong(this.JourneyLat, this.JourneyLong); 
                      
                }     

                    if(this.ArrivalFlag ==1)
                    { 
                      this.startJob =true
                    }
                    else
                    { 
                      this.isShowArrival=true
                    }

                    if(this.WorkStartFlag == 1)
                    {
                      this.stopJob=true
                      this.startJob=false
                    }
                    if(this.WorkCompleteFlag == 1)
                      {
                        this.stopJob=true
                        this.startJob=false
                      }


                    
                    else
                    {
                    //  this.startJob=false
                    }
                  // Technician already assign job[State Managment]
                    if(this.JourneyStartFlag == 1 )
                    {      

                        this.isShowCustomerDetails=true;
      
                        this.isCancel=true;
                        this.isShowPickup=false;
                        this.iSStartJourney=false; 
                        this.isshowStartJourney=false

                        this.customerAddress=this.results[0]['CustomerAddress']  
                        this.CustomerName= this.results[0]['CustomerName'] 
                        this.CustomerMobile= this.results[0]['CustomerMobile'] 
                        this.CaseId= this.results[0]['CaseId'] 
                        this.CaseGUID= this.results[0]['CaseGUID']    
                        this.JobPickId=this.results[0]['JobPickId'] 

                 
                        
                        // this.modalController.dismiss();
                        // this.selectedCustomer = customer;
                        this.isShowDetails = false;   
                      
                    }  
                
                    if(this.JobCloseFlag == true)
                    {   

                      this.isShowCustomerDetails=false;
                      this.isCancel=false;
                      this.isShowPickup=true;
                      this.iSStartJourney=false;


                      this.customerAddress=''
                      this.selectedCustomer='' 
                      this.isStartJourney=false
                      this.isShowDetails = false;   
                      this.resetMarkers();
                    
                    }
            }
             
              // console.log("Technician == ",this.results)
              // this.detail.next({ totalRecord: data?.Totalrecords, Data: this.results });
            //  this.ngxservice.hide()
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

 

  resetMarkers(): void {
    if (this.originMarker) { 
      this.originMarker.setMap(null);
      this.originMarker = null; // Remove reference to the marker
    }
    if (this.destinationMarker) { 
      this.destinationMarker.setMap(null);
      this.destinationMarker = null; // Remove reference to the marker
    }
    // Clear existing directions from the map
    this.directionsRenderer.setDirections({ routes: [] });
  }


  
  //Convert Lat Long to Address
  ConvertLatLong(JourneyLat,JourneyLong)
  {  
     this.latLng = new google.maps.LatLng(JourneyLat,JourneyLong);  
     const geocoder = new google.maps.Geocoder();
     geocoder.geocode({ location: this.latLng }, (results, status) => {
       if (status === 'OK') {
         if (results[0]) {  
           const address = results[0].formatted_address;  
        setTimeout(() => { 
        this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.latLng, this.customerAddress, google.maps.TravelMode.DRIVING);
      }, 10000);
          // this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.latLng, this.customerAddress, google.maps.TravelMode.DRIVING);
         }
         
          else {
           console.error('No results found');
         }
       } else {
         console.error('Geocoder failed due to: ' + status);
       }
     });
  }

  //Convert Customer Address To Lat/Long
  getLatLngFromAddress(address: string) {
    return new Promise<any>((resolve, reject) => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          resolve({
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng()
          });
        } else {
          reject('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

// ###########  NEW CODE  ##############

isShowPickup:boolean=true;
isStart:boolean=false;
iSStartJourney:boolean=false;
isCancel:boolean=false;
isShowCustomerDetails:boolean=false;
isShowBack:boolean=false;
isShowArrival:boolean=false;

cancelJourney(isOpen: boolean)
{ 
  this.isModalOpen = true; 
}

selectCustomer(customer) 
{   
 
  this.CustomerName=customer.FirstName+customer.LastName
  this.CustomerMobile=customer.MobileNo
  this.CaseGUID=customer.CaseGUID
  this.CaseId=customer.CaseId
  this.CustomerLat=customer.CustomerLat
  this.CustomerLong=customer.CustomerLong
  this.selectedCustomer = customer;
  this.isshowStartJourney=true;
  this.isShowBack=true;
  this.isStartJourney=true;   
 // this.GetTechnicianJob();
 

  //NEW 
  this.watchPosition() 
  this.isShowPickup=false
  this.iSStartJourney=true
  this.isShowCustomerDetails=true
  
  this.customerAddress=customer.Address1+customer.Address2 
  this.getLatLngFromAddress(this.customerAddress) .then((location: any) => {
    this.CustomerLat= location.latitude;
    this.CustomerLong= location.longitude;
  })
 this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.currentPosition,this.customerAddress,google.maps.TravelMode.DRIVING);
 this.modalController.dismiss();
  //Call map route source to destination
}
 

  pickupJob()
  {  
    let requestData = [];
    requestData.push({
      "Key": "ApiType",
      "Value": "GetAsgTechList4User",
    });
    console.log(requestData);
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
      "content": strRequestData
    };  
  
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
      next: (value) => {
        
        let response = JSON.parse(value.toString());
        if (response.ReturnCode == '0') { 
          let data = JSON.parse(response?.ExtraData);
          this.cusromerDetailList = []
          if(Array.isArray(data?.ASGTechList?.ASGTech))
          {
            this.cusromerDetailList = data?.ASGTechList?.ASGTech
            console.log("RESULTS IF===",this.cusromerDetailList)
          }
          else
          {
            this.cusromerDetailList.push(data?.ASGTechList?.ASGTech)
            console.log("RESULTS ELSE===",this.cusromerDetailList)
          }
        }
        else {
          alert('Error')
        }
     
      },
    })
  
  }
 

  statusButton(status)
  {
    if(status== 'pickup')
    {
      this.pickupJob() 
    } 

    if(status == 'startJourney')
    {
      this.JobPickId=uuidv4() 
      this.StartFlag=1;
      this.ReasonForClose=''
      // this.ArrivalFlag=1;
      this.JobCloseFlag=false;
      this.JobCancelFlag=false
      this.isShowArrival=true
      this.SaveJourney()
      this.GetTechnicianJob()

      this.iSStartJourney=false;
      this.isCancel=true
      this.isShowCustomerDetails=true
      this.isShowBack=false;
      this.startWatchingPosition()

      //
      this.startJob=false
    }
    if(status == 'back')
    {
      this.isShowCustomerDetails=false;
      this.isShowPickup=true;
      this.iSStartJourney=false;
      this.isShowBack=false;
    }

    if(status == 'arrived')
    {  
      this.ArrivalFlag=1
      this.isShowArrival=false
      this.startJob=true
      this.SaveJourney() 

    }
    if(status == 'startwork')
      {  
        this.WorkStartFlag=1
        this.stopJob=true
        this.startJob=false
        this.SaveJourney() 
  
      }
      if(status == 'workcomplete')
        {  
          this.JobCloseFlag=true 
          this.JobCancelFlag=true
          this.JourneyStartFlag=1
          this.WorkCompleteFlag=1
          this.StartFlag=0;
          this.isShowPickup=true
          this.isShowCustomerDetails=false
          this.isCancel=false;
          
          this.SaveJourney()  
          this.stopWatchingPosition()  
    
        }

      

    
  
  }
 
  // Below Testing Function


  Arrived()
  {
    this.startJob=true
  }

  CheckArrival()
  {
    this.isArrived=true
  }
  
  startWork()
  {
    this.stopJob=true
    this.startJob=false
    this.WorkStartFlag=1; 
    this.SaveJourney() 
  }
  
  workCompleted() 
  {
    // this.isStartJourney =false; 
    this.JobCloseFlag=true 
    this.JobCancelFlag=true
    this.JourneyStartFlag=1
    this.StartFlag=0;
    this.isShowPickup=true
    this.isShowCustomerDetails=false
    this.isCancel=false;
    this.WorkCompleteFlag=1;
    
    this.SaveJourney()  
    this.stopWatchingPosition() 
    // this.modalController.dismiss();
  }

  //Cancel popup
Cancelsubmit()
{ 
  this.JobCloseFlag=true 
  this.JobCancelFlag=true
  this.JourneyStartFlag=1
  this.StartFlag=0;
  this.isShowPickup=true
  this.isShowCustomerDetails=false
  this.isCancel=false;
 
  this.SaveJourney()  
  this.stopWatchingPosition() 
  this.modalController.dismiss();
}


  startWatchingPosition() {
    // alert('startWatchingPosition')
    const options: GeolocationOptions = {
                  enableHighAccuracy: true, 
                  timeout: 4000,  
                  maximumAge: 10000  
                  };

    this.watchPositionSubscription = this.geolocation.watchPosition(options).subscribe(
      (data: Geoposition) => {
 
        this.updatedLatitude = data.coords.latitude;
        this.updatedLongitude = data.coords.longitude;   
      
          //only trigger when start journeu btn click 
          this.SaveJourney(); 
     

      },
      (error: PositionError) => {
        // Handle position error
      }
    );
  }
 
 
  stopWatchingPosition() { 
    // alert('successfully Close')
    if (this.watchPositionSubscription) {
     this.watchPositionSubscription.unsubscribe();
    }
    this.resetMarkers();
  }
 
}
