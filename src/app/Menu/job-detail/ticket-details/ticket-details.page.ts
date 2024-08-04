import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; 

import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;


@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.page.html',
  styleUrls: ['./ticket-details.page.scss'],
})
export class TicketDetailsPage implements OnInit {

  constructor(private navCtrl: NavController, ) { }

  customerData = {
    firstname: 'Dinesh',
    lastname:'Durai',
    address:'Infinity Mall,Link Road,Mumbai,Malad (West),400064.',
    phone:'9136870550',
    email:'dineshdurai6@gmail.com' 
  };

  ticketDetails ={
    ticketNo: 'TK42342',
    issue:'Power button not working and not restart.',
    status:'In Progress',
    createdDate:'02/01/2024'
  }


  ngOnInit() {
    
  }

  Clickback()
  {
    this.navCtrl.back();
  }

  openDialer() {
    // Replace 'tel:' with the desired phone number
  //  Browser.open({ url: 'tel:123456789' });
  }

}
