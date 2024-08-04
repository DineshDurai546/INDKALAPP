import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.page.html',
  styleUrls: ['./tiles.page.scss'],
})
export class TilesPage implements OnInit {


  @Input() data: any;
  @Output() onCardSelected = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {

  }

  getColClass(index: number): string {
    let newIndex= index+1;
    if( newIndex <= 5) {
    }else{
      newIndex = newIndex/2;
    }
    return this.getColorClass(newIndex);
  }

  getColorClass(index: number): string {
    switch(index) {
      case 1:
        return "first_card";
      case 2:
        return "sec_card";
      case 3:
        return "third_card";
      case 4:
        return "fourth_card";
      case 5:
        return "five_card";
      default:
        return "first_card";
    }
  }

  onCardSelect(job){
    console.log(job);

    this.onCardSelected.emit(job);
  }

  iconMap = {
    // 'Repair Completed': '/assets/icons/completed.png',
    // 'Job Closed': '/assets/icons/delivery.png', 
    // 'Assigned To technician':'/assets/icons/assign.png', 
    // 'Repair In Process':'/assets/icons/cancel.png', 
    // 'Diagnosis':'/assets/icons/Diagnosis.png',
    // 'Ready For Pickup':'/assets/icons/pickup.png',
    // 'Registered':'/assets/icons/registered.png',
    // 'Estimation Prepare':'/assets/icons/prepare.png',
    // 'Declined - Rejected by Local Approver':'/assets/icons/approver.png',
    // 'Pending Local Authorization':'/assets/icons/verified.png',
    // 'Cancellation Request':'/assets/icons/cancel.png',
    // 'Request Replacement':'/assets/icons/replacement.png', 
    // 'Estimation Pending For Approval' : '/assets/icons/prepare.png'


    // 'Registered':'/assets/icons/registered.png',
    'Declined - Rejected by Local Approver':'/assets/icons/approver.png',
    'Pending Local Authorization':'/assets/icons/Awaiating-For-Parts.png',
    // 'Cancellation Request':'/assets/icons/cancel.png',

    'Assigned To technician':'/assets/icons/Assigned-To-technician.png', 
    'Repair In Process':'/assets/icons/Repair-In-Process.png',  
    'Waiting For Approval':'/assets/icons/wating-for-approval.png', 
    'Cancellation Request':'/assets/icons/CancelRequest.png', 
    'Released For Repair':'/assets/icons/Released.png', 
    'Registered':'/assets/icons/Registerd.png',
    'PV Accepted':'/assets/icons/PV-accepted.png',
    'PV Rejected':'/assets/icons/PV-Rejected.png',
    'Diagnosis':'/assets/icons/Diagnosis.png',
    'Job Closed': '/assets/icons/job-close.png', 
    'Ready For Pickup':'/assets/icons/Ready-For-Pickup.png',
    'Estimation Prepare':'/assets/icons/estimation-prepared.png',
    'Repair Completed': '/assets/icons/Repair-Completed.png',
    // 'Request Replacement':'/assets/icons/replace.png', 
    'Estimation Pending For Approval' : '/assets/icons/estimation-pending-for-approval.png'
 
  };

  getIconPath(jobStatusDesc: string): string {
    // Use the mapping to get the appropriate icon path
    return this.iconMap[jobStatusDesc] || '/assets/icons/default.png'; // Use a default icon path if not found
  }

  getBackgroundColor(index: number): string {
    const colors = ['rgb(247, 189, 119)', 'rgb(255, 204, 0)', 'rgb(182, 147, 7)', 'rgb(247, 148, 29)', 'rgb(254, 242, 0)'];

    // Use the modulo operator to cycle through colors if there are more than 6 items
    return colors[index % colors.length];
}

}
