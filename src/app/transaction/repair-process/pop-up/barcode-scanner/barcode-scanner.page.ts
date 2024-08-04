import { Component, OnInit, Renderer2 } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.page.html',
  styleUrls: ['./barcode-scanner.page.scss'],
})
export class BarcodeScannerPage implements OnInit {

  barcodeScanner:any;


  constructor(
    private modalController: ModalController, 
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.scanBarcode()
    this.initScanner();
  }

  async initScanner() {
    const options: BarcodeScannerOptions = {
      // Example options:
      prompt: 'Scan the barcode', // Display a message to the user
      orientation: 'portrait', // Set the orientation of the scanner
    };

    // There might be specific initialization for the Capacitor plugin
    // For example, on Android, it might request permissions
    // You can handle it here based on the documentation of the plugin
  }


  async scanBarcode() {
    this.renderer.addClass(document.body, 'hidden-body');

    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      // this.scanActive =false 
      // this.result=result.content
      console.log("RESULTS+++++   ",result.content); // log the raw scanned content
      // Once barcode scanning is done, show the body again
     this.renderer.removeClass(document.body, 'hidden-body');
    }
    
  }

  dismiss() {
    // Dismiss the modal
    this.modalController.dismiss();
  }
}
