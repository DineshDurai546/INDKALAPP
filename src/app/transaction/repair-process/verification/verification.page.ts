import { Component, Input, OnInit } from '@angular/core';
import { IonModal, CheckboxCustomEvent, ModalController } from '@ionic/angular'; 
import { CaseDetail } from '../repair-process.metadata';


@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  @Input() modal!: IonModal;
  @Input() repa : CaseDetail;
 
  ngOnInit() {
  }

}
