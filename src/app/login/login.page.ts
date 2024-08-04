import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CommonMessage, GLOBALVARIABLE } from 'src/app/config/global';
import { forkJoin } from 'rxjs';
import { AppInitService } from 'src/app/core/service/app.init.service';
import { EncryptDecryptService } from 'src/app/core/service/encrypt-decrypt.service';
// import { ToastrService } from 'ngx-toastr'; 
import { DynamicService } from '../Services/dynamicService/dynamic.service'; 
import { AlertController, LoadingController } from '@ionic/angular';

import { Optional } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage extends UnsubscribeOnDestroyAdapter implements OnInit {

  constructor(
              private router: Router,
              private authService: AuthService,
              private appInitService: AppInitService,
              public alertController: AlertController,
              private loadingCtrl: LoadingController,
              private platform: Platform,
              @Optional() private routerOutlet?: IonRouterOutlet
              ) {

                
    super();

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }
  //For ResQ
  //  email:string='mohanish.bhole@ril.com'
  //  password:string='Macbook@099999'


  // For Vecare
  // email:string='mumbaitechnician@vecare.in'
  // password:string='Macbook@2023'

  // For Indkal
  // email:string='IND1047@indkal'
  // password:string='Macbook@2023'

   email:string=''
  password:string=''

  submitted = false;

  passwordFieldType: string = 'password'; 

  ngOnInit() {
  } 
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = (this.passwordFieldType === 'password') ? 'text' : 'password'; 
  }

  async onSubmit()
  {     // Show loading before making the request
    debugger
    console.log("===",this.email ,this.password)
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loading.present();

    if(this.email == '')
    { 
      this.presentAlert('email')
      return
    }

    if(this.password =='')
    { 
      this.presentAlert('password')
      return
    }

 
    // check from API
    this.subs.sink = this.authService.login(this.email, this.password).subscribe((data: any) => { 
      console.log("DATA=====",data)
      if (data.isValid == true) {  
        console.log("WORKING") 
        localStorage.setItem(GLOBALVARIABLE.USERNAME, this.email);
        localStorage.setItem(GLOBALVARIABLE.TOKEN, data.token);
        localStorage.setItem(GLOBALVARIABLE.REFRESHTOKEN, data.refreshToken);
         this.getRequiredData(); 
        
      
       // this.router.navigate(['map']);
        loading.dismiss();



      }
      else { 
        this.presentAlert('inValid')
        this.submitted = true;
        loading.dismiss();
      //  this.submitted = false;
       // this.error = "User Name or Password is not correct!"
      }
      // if (res) {
      //   const token = this.authService.currentUserValue.token;
      //   if (token) {
      //     this.router.navigate(['/dashboard/main']);
      //   }
      // } else {
      //   this.error = 'Invalid Login';
      // }
    },
      (error) => {
        loading.dismiss();
      //  this.error = error;
      //  this.submitted = false;
      }
    );
  }

  
  async presentAlert(field) {
    if(field =='email')
    {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: '',
        message: 'Please Enter Username.',
        buttons: ['OK']
      });
      await alert.present();
    }

    if(field == 'password')
    {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: '',
        message: 'Please Enter Password.',
        buttons: ['OK']
      });
      await alert.present();
    }

    if(field == 'inValid')
    {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: '',
        message: 'InValid Username and Password.',
        buttons: ['OK']
      });
      await alert.present();
    }

    
  }

  navigateToMap(route:String):void{
    this.router.navigate([`/${route}`]);
  }


  getRequiredData = () => {
    let userName = localStorage.getItem(GLOBALVARIABLE.USERNAME);
    forkJoin({
      MenuDetail: this.authService.getMenu(userName),
      //ProfileDetail: this.authService.getProfileModuleList(),
      FieldDetails: this.authService.getFieldDetail(),
      GridDetails: this.authService.getGridDetail(),
      AllRouting: this.authService.getAllRouting(),
      Actions: this.authService.getModulections(),
      UserPermission: this.authService.getUserPermission(userName)
    }).subscribe((data: any) => {
      console.log("Menu Data");
      console.log(data.MenuDetail);
      data.MenuDetail[0].push({
        HeadingId: 1,
        HeadingLogo: "fas fa-tachometer-alt",
        HeadingName: "Repair Process\r\n",
        MenuGroupId: 1,
        MenuLevelId: 0,
        ModuleId: 1,
        ModuleLogo: "",
        ModuleName: "Repair Process",
        SubHeadingId: 0,
        SubHeadingLogo: "",
        SubHeadingName: "",
        Url: "/repair-process",
      });
      localStorage.setItem('MenuDetail', JSON.stringify(data.MenuDetail));
      //localStorage.setItem('ModuleEntityField', JSON.stringify(data.ProfileDetail));
      localStorage.setItem('FieldDetail', JSON.stringify(data.FieldDetails));
      localStorage.setItem('GridModuleDetail', JSON.stringify(data.GridDetails));
      localStorage.setItem('AllRouting', JSON.stringify(data.AllRouting));
      localStorage.setItem('ModuleAction', JSON.stringify(data.Actions));
      localStorage.setItem('UserPermission', JSON.stringify(data.UserPermission));
      localStorage.removeItem('selectedMenu');

      this.appInitService.init();
      this.router.navigate(['company']);
      // this.router.navigate(['map']);
      
    },
      error => {
     //   this.messageService.error(CommonMessage.ErrorMessge);
        this.submitted = false;
      });
  }


 
}
