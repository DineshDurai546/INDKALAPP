import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../dashboard/filter.meta';
import { Observable, BehaviorSubject } from 'rxjs';
import { DropDownValue,DropdownDataService } from 'src/app/Services/dropdownService/dropdown-data.service';
import { Columns } from 'src/app/models/column.metadata';
import { PaginationMetaData } from 'src/app/models/pagination.metadata';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { DropDownType } from 'src/app/custom-components/request.metadata';
import { NavController } from '@ionic/angular';
import { CommonMessage, GLOBALVARIABLE } from 'src/app/config/global';
import * as glob from "../../config/global";


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
})
export class JobDetailPage implements OnInit {
  
  [x: string]: any;
  caseid = "";
  firstname = "";
  phonenumber = "";
  Emailid = "";
  Serialno = "";
  callType: any;
  JobStatustype: any='open';
  selectedSegment = 'open'; 
  JobStatusTitle: any;
  jobPagination: PaginationMetaData;
  JobList: any[];
  JobColumns: Columns[] = [];
  actionDetails: any[] = [];
  @Input() filters: Observable<Filter[]>;
  callForm: DropDownValue = DropDownValue.getBlankObject();
  detail: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  JobStatus: DropDownValue = DropDownValue.getBlankObject();
  JobDetail: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  gsxCode:string = ''
  hideSpinnerEvent: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  toolBarAction: any[] = [];
  breadCumbList: any[];
  JobFindData: any = [];
  jobListHideSpinnerEvent: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  
  constructor( private router: Router,
               private route: ActivatedRoute,
               private dynamicService: DynamicService,
               private dropdownDataService: DropdownDataService,
               private navCtrl: NavController) { }

  filterList: Filter[] = [];
  isModalOpen = false;

 

jobTypeValue:any
username:any;
selectTabs:any;
 
  ngOnInit() {  
    this.getJobDetail(this.caseid, this.firstname, this.phonenumber, this.Emailid, this.Serialno, this.callType, this.JobStatustype,this.gsxCode,1,10);
    this.username=localStorage.getItem(GLOBALVARIABLE.USERNAME);

    if (this.router.getCurrentNavigation().extras.state) {
      this.jobTypeValue = this.router.getCurrentNavigation().extras.state; 

      for (let filter of this.jobTypeValue) {
        if (     filter.title == "onsite" || filter.title == "OnSite-Service"  || filter.title == "Site-Inspection") {
          this.callType = filter.value 
        }
        else {
          this.JobStatustype = filter.value; 
        }
      }
      this.getJobDetail(this.caseid, this.firstname, this.phonenumber, this.Emailid, this.Serialno, this.callType, this.JobStatustype,this.gsxCode,1,10);
    }

    this.onJobType({ term: "", item: null });
    this.onJobStatus({ term: "", item: null })
  }

  

  OPENSTATUS: number = 0;
  CLOSESTATUS: number = 0;

  JobOpen:number =0;
  JobClose:number=0;

  ionViewDidEnter()
  {
    this.getJobDetail(this.caseid, this.firstname, this.phonenumber, this.Emailid, this.Serialno, this.callType, this.JobStatustype,this.gsxCode,1,10);
     
  }
  
  getJobDetail(caseid, firstname, phonenumber, Emailid, Serialno, callType, Jobstatus, gsxcode, pageno, pagesize) {
    let requestData = [];
    requestData.push({
        "Key": "APIType",
        "Value": "GetTechnicianJobDetails"
    });
    requestData.push({
        "Key": "CaseId",
        "Value": caseid
    });

    requestData.push({
        "Key": "TechCode",
        "Value": this.username
    });
    requestData.push({
        "Key": "SerialNo",
        "Value": Serialno
    });
    requestData.push({
        "Key": "FirstName",
        "Value": firstname
    });
    requestData.push({
        "Key": "MobileNo",
        "Value": phonenumber
    });
    requestData.push({
        "Key": "EmailId",
        "Value": this.Emailid
    });
    requestData.push({
        "Key": "GID",
        "Value": gsxcode
    });

    requestData.push({
        "Key": "JobStatus",
        "Value": Jobstatus
    });
    requestData.push({
        "Key": "JobType",
        "Value": ''
    });
    requestData.push({
        "Key": "CompanyCode",
        "Value": glob.getCompanyCode()
    });
    requestData.push({
        "Key": "PageNo",
        "Value": '1'
    });
    requestData.push({
        "Key": "PageSize",
        "Value": '10'
    });
    let strRequestData = JSON.stringify(requestData);
    let contentRequest = {
        "content": strRequestData
    };

    console.log("SENT===", contentRequest);
    debugger
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe({
        next: (Value) => {
            this.OPENSTATUS = 0;
            this.CLOSESTATUS = 0;
            try {
                let response = JSON.parse(Value.toString());
                console.log("GET JOB==", response)
                if (response.ReturnCode == '0') {
                    this.JobFindData = []
                    response['ExtraDataJSON'] = JSON.parse(response.ExtraData);
                    
                    let jobListData = response['ExtraDataJSON'] && response['ExtraDataJSON']['JobList'] && response['ExtraDataJSON']['JobList']['JobData'];

                    // Initialize JobFindData if it hasn't been initialized
                    if (!this.JobFindData) {
                      this.JobFindData = [];
                    }
                    
                    if (jobListData) {
                      if (Array.isArray(jobListData)) {
                        this.JobFindData = jobListData;
                      } else {
                        this.JobFindData.push(jobListData);
                      }
                    } else {
                      console.warn('jobListData is empty or undefined');
                    }
                    

              // Display only 5 records initially
              this.displayedJobs = this.JobFindData.slice(0, 5);

                    for (let job of this.displayedJobs) {
                        if (job.HandoverFlag === "0") {
                            this.OPENSTATUS++;
                            this.JobOpen = this.OPENSTATUS;
                        } else if (job.HandoverFlag === "1") {
                            this.CLOSESTATUS++;
                            this.JobClose = this.CLOSESTATUS;
                        }
                    }

                    this.JobDetail.next({ totalRecord: response['ExtraDataJSON']['Totalrecords'], Data: this.JobFindData });
                } else {
                    // Handle the case where ReturnCode is not '0'
                }
            } catch (ext) {
                console.log(ext);
                this.JobList = [];
                this.JobDetail.next({ totalRecord: this.JobList.length, Data: this.JobList });
            }
            this.setOpen(false);
        },
        error: err => {
            console.log(err);
            this.JobList = [];
            this.JobDetail.next({ totalRecord: this.JobList.length, Data: this.JobList });
        }
    });
}


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  // getStatusImage(status: string): string {
  //   switch (status) {
  //     case 'Open':
  //       return '/assets/icon/open.png';
  //     case 'Close':
  //       return '/assets/icon/close.png';
  //     case 'Done':
  //       return '/assets/icon/done.png';
  //     default:
  //       return '/assets/icon/default.png'; // You can provide a default image for other cases
  //   }
  // }

  onJobType($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.callForm, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.callForm = value;
        }
      },
      error: (err) => {
        this.callForm = DropDownValue.getBlankObject();
      }

    });
  }

  onJobStatus($event: { term: string; item: any[] }) {
    this.dropdownDataService.fetchDropDownData(DropDownType.JobStatus, $event.term, {
    }).subscribe({
      next: (value) => {
        if (value != null) {
          this.JobStatus = value;
        }
      },
      error: (err) => {
        this.JobStatus = DropDownValue.getBlankObject();
      }
    });
  }

  openTicket(event)
  { 
   this.navCtrl.navigateForward('repair-process', { state: event });
   // this.router.navigate(['repair-process'])
  }
  
  SearchCallLogin() {
    this.getJobDetail(this.caseid, this.firstname, this.phonenumber, this.Emailid, this.Serialno, this.callType, this.JobStatustype,this.gsxCode,1,10);
  }
 
  onSegmentChange(event: any) {
    const selectedValue = event.detail.value;

    if (selectedValue === 'open') {
      this.openFunction();
    } else if (selectedValue === 'close') {
      this.closeFunction();
    }  
  }

  openFunction() { 
    this.getJobDetail(this.caseid, this.firstname, this.phonenumber, this.Emailid, this.Serialno, this.callType, 'open',this.gsxCode,1,10);

  }

  closeFunction() { 
    this.getJobDetail(this.caseid, this.firstname, this.phonenumber, this.Emailid, this.Serialno, this.callType, 'close',this.gsxCode,1,10);

  }
 
  showAll: boolean = false;
  displayedJobs: any[] = [];

  toggleShowAll() {
    if (this.showAll) {
      this.displayedJobs = this.JobFindData;
    } else {
      this.displayedJobs = this.JobFindData.slice(0, 5);
    }

    this.updateJobCounters();
  }

  updateJobCounters() {
    this.OPENSTATUS = 0;
    this.CLOSESTATUS = 0;
    for (let job of this.displayedJobs) {
      if (job.HandoverFlag === "0") {
        this.OPENSTATUS++;
      } else if (job.HandoverFlag === "1") {
        this.CLOSESTATUS++;
      }
    }
    this.JobOpen = this.OPENSTATUS;
    this.JobClose = this.CLOSESTATUS;
  }

}
