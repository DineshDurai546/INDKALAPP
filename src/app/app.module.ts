import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; 
import { TilesPageModule } from './Menu/dashboard/tiles/tiles.module';
import { DashboardPageModule } from './Menu/dashboard/dashboard.module';
import { JwtInterceptorService } from './core/service/jwtinterceptor';
import { JobDetailPageModule } from './Menu/job-detail/job-detail.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CancellationViewPageModule } from './transaction/repair-process/cancellation-view/cancellation-view.module';
 
import { CompanyDetailPageModule } from './login/company-detail/company-detail.module';
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx' 
 import { VideoCapturePlus, VideoCapturePlusOptions, MediaFile } from '@ionic-native/video-capture-plus/ngx';

//import { BarcodeScanner } from '@capacitor/core';
 

@NgModule({
  declarations: [AppComponent],
  imports:  [
            BrowserModule, IonicModule.forRoot(),
            AppRoutingModule,
            HttpClientModule,
            TilesPageModule,
            DashboardPageModule,
            JobDetailPageModule,
            CompanyDetailPageModule,
            NgSelectModule,
            CancellationViewPageModule,
            // VideoCapturePlus,
           ],


  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
              { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },BarcodeScanner,
              NativeGeocoder,Geolocation, 
            ],
  bootstrap: [AppComponent],


})
 

export class AppModule {}
