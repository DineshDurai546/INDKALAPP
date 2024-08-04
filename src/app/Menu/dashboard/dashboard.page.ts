import { Component, OnInit } from '@angular/core';
import { Filter } from './filter.meta';
import { BehaviorSubject } from 'rxjs';
import { DynamicService } from 'src/app/Services/dynamicService/dynamic.service';
import { NavigationExtras, Router } from '@angular/router';
import * as glob from "../../config/global";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private dynamicService: DynamicService,
              private router:Router,
              private navCtrl: NavController) { }

  jobHeaderData: any[] = [];
  isDashBoardCard: boolean = true;
  isGridCard: boolean = false;
  filterList: Filter[] = [];
  filtersEvent: BehaviorSubject<Filter[]> = new BehaviorSubject<Filter[]>(null);

  // 
  pageUrl:any;
  params:any;
  
  ngOnInit() {
    this.getJobDashboard();
  }


  getJobDashboard() {  
    let requestData =[];
    requestData.push({
      "Key":"APIType",
      "Value": 'GetJobDashboardForTechnician'
      //"GetJobDashboardForTechnician"
    });
    requestData.push({
      "Key":"CompanyCode",
      "Value": glob.getCompanyCode() 
    });
 

    let strRequestData = JSON.stringify(requestData);
    let contentRequest =
    {
      "content" : strRequestData
    };
    debugger
    this.dynamicService.getDynamicDetaildata(contentRequest).subscribe(
      {
        next : (Value) =>
        {
         
          let response = JSON.parse(Value.toString());
          console.log("Response dashboard:",response)
          if(response.ReturnCode =='0'){
            response['ExtraDataJSON'] = JSON.parse(response.ExtraData);
            let JobTypeDescription=[];
            if(response?.ExtraDataJSON?.Dashboard != null && !Array.isArray(response.ExtraDataJSON.Dashboard)) {
              response.ExtraDataJSON.Dashboard = [response.ExtraDataJSON.Dashboard];
            }
            for(let job of response.ExtraDataJSON.Dashboard){
              JobTypeDescription.push(job.JobTypeDescription);
            }
            var set = new Set(JobTypeDescription);
            JobTypeDescription=[...set];
            this.jobHeaderData = [];
            for(let job of JobTypeDescription) {
              let jobList = [];
              for(let jobItem of response.ExtraDataJSON.Dashboard){
                if(jobItem.JobTypeDescription == job){
                  jobList.push(jobItem);
                }
              }
              this.jobHeaderData.push( {
                "header": job,
                "list": jobList
              });
            }
          }
        },
        error : err =>
        {
          console.log(err);
        }
      }
    );
  }
  onCardSelected(job) {
    console.log("Dash ",this.jobHeaderData)
    this.isDashBoardCard = false;
    this.isGridCard = true;
    this.filterList = [];
    this.filterList.push(new Filter("JobType", job.JobTypeDescription, job.JobType));
    this.filterList.push(new Filter("JobStatus", job.JobStatusDesc, job.JobStatusCode));
    this.filtersEvent.next(this.filterList);  

      // Navigate with parameters
    //this.navigateWithParameters();
    this.pageUrl='Menu/job-detail';
    this.pushToNextScreenWithParams(this.pageUrl,this.filterList)
   // this.router.navigate(['Menu/job-detail'])

  }

  pushToNextScreenWithParams(pageUrl: any, params: any) { 
    this.navCtrl.navigateForward(pageUrl, { state: params });
  }

  navigateWithParameters() { 
    const navigationExtras: NavigationExtras = {
      state: {
        filterList: this.filterList
      }
    };

        // Navigate with parameters
        console.log('navigationExtras==',navigationExtras)
        this.router.navigate(['Menu/job-detail'], navigationExtras);
  }

  
  onScroll(event) {
    const scrollTop = event.detail.scrollTop;

    // You can add logic here to determine when to show/hide the condensed header
    // For example, you can check if scrollTop is greater than a certain value
    // and toggle the visibility of the condensed header accordingly.
  }
}
