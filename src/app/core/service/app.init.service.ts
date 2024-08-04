import { Injectable } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
// import { MainLayoutComponent } from "e:/Nitc-CRM/src/app/layout/app-layout/main-layout/main-layout.component";
// import { Page404Component } from "src/app/authentication/page404/page404.component";
// import { AppRouter } from "src/app/config/comman.const";
// import { SubmenuComponent } from "src/app/custom-components/submenu/submenu.component";
// import { ProfileSettingComponent } from "src/app/custom-components/profile-setting/profile-setting.component";
// import { CrmResolverService } from "./crm-resolver.service";
// import { CallLoginDashboardComponent } from "src/app/custom-components/call-login-dashboard/call-login-dashboard.component";
// import { AssignTechnicianComponent } from "src/app/custom-components/assign-technician/assign-technician.component";
// import { CreateCustomerComponent } from "src/app/custom-components/create-customer/create-customer.component";
// import { UserFormComponent } from "src/app/custom-components/user-form/user-form.component";
// import { AddUserMasterComponent } from "src/app/master/user-master/add-user-master/add-user-master.component";
// import { UserMasterComponent } from "src/app/master/user-master/user-master.component";
// import { AddCompanyMaterialResourceMappingComponent } from "src/app/master/company-material-resource-mapping/add-company-material-resource-mapping/add-company-material-resource-mapping.component";
// import { CompanyMaterialResourceMapping } from "src/app/master/company-material-resource-mapping/company-material-resource-mapping.component";
// import { AddGstComponentComponent } from "src/app/master/gst-component/add-gst-component/add-gst-component.component";
// import { GstComponentComponent } from "src/app/master/gst-component/gst-component.component";
// import { AddGstGroupComponent } from "src/app/master/gst-group/add-gst-group/add-gst-group.component";
// import { GstGroupComponent } from "src/app/master/gst-group/gst-group.component";
// import { AddGstSetupComponent } from "src/app/master/gst-setup/add-gst-setup/add-gst-setup.component";
// import { GstSetupComponent } from "src/app/master/gst-setup/gst-setup.component";
// import { AddLocationMasterComponent } from "src/app/master/location-master/add-location-master/add-location-master.component";
// import { LocationMasterComponent } from "src/app/master/location-master/location-master.component";
// import { AddMaterialMasterComponent } from "src/app/master/material-master/add-material-master/add-material-master.component";
// import { MaterialMasterComponent } from "src/app/master/material-master/material-master.component";
// import { AddResourceMasterComponent } from "src/app/master/resource-master/add-resource-master/add-resource-master.component";
// import { ResourceMasterComponent } from "src/app/master/resource-master/resource-master.component";
// import { MasterContentComponent } from "src/app/master/master-content/master-content.component";
// import { CustomerMasterComponent } from "src/app/master/customer-master/customer-master.component";
// import { AddCustomerComponent } from "src/app/custom-components/create-customer/add-customer/add-customer.component";
// import { AddCustomerMasterComponent } from "src/app/master/customer-master/add-customer-master/add-customer-master.component";
// import { UserLocationMappingComponent } from "src/app/master/user-location-mapping/user-location-mapping.component";
// import { AddUserLocationMappingComponent } from "src/app/master/user-location-mapping/add-user-location-mapping/add-user-location-mapping.component"
//  import * as glob from "e:/Nitc-CRM/src/app/config/global";
import * as glob from "src/app/config/global";
// import { JobReportComponent } from "src/app/reports/job-report/job-report.component";
// import { TokenReportComponent } from "src/app/reports/token-report/token-report.component";
// import { CompanyMasterComponent } from "src/app/master/company-master/company-master.component";
// import { AddCompanyMasterComponent } from "src/app/master/company-master/add-company-master/add-company-master.component";
// import { JobroleMasterComponent } from "src/app/master/jobrole-master/jobrole-master.component";
// import { AddJobroleMasterComponent } from "src/app/master/jobrole-master/add-jobrole-master/add-jobrole-master.component";
// import { ProfileMasterComponent } from "src/app/master/profile-master/profile-master.component";
// import { AddProfileMasterComponent } from "src/app/master/profile-master/add-profile-master/add-profile-master.component";
// import { ProfileModuleMasterComponent } from "src/app/master/profile-module-master/profile-module-master.component";
// import { AddProfileModuleMasterComponent } from "src/app/master/profile-module-master/add-profile-module-master/add-profile-module-master.component";
// import { OrgRoleMasterComponent } from "src/app/master/org-role-master/org-role-master.component";
// import { AddOrgRoleMasterComponent } from "src/app/master/org-role-master/add-org-role-master/add-org-role-master.component";
// import { SalespersonMasterComponent } from "src/app/master/salesperson-master/salesperson-master.component";
// import { AddSalespersonMasterComponent } from "src/app/master/salesperson-master/add-salesperson-master/add-salesperson-master.component";
// import { PriceListDetailComponent } from "src/app/master/price-list-detail/price-list-detail.component";
// import { AddPriceListDetailComponent } from "src/app/master/price-list-detail/add-price-list-detail/add-price-list-detail.component";
// import { BusinessPlaceComponent } from "src/app/master/business-place/business-place.component";
// import { AddBusinessPlaceComponent } from "src/app/master/business-place/add-business-place/add-business-place.component";
// import { AddMasterContentComponent } from "src/app/master/master-content/add-master-content/add-master-content.component";
// import { AddMasterContentlistComponent } from "src/app/master/master-content/add-master-contentlist/add-master-contentlist.component";
// import { CreateJobsheetComponent } from "src/app/custom-components/create-jobsheet/create-jobsheet.component";
// import { RepairProcessComponent } from "src/app/transaction/repair-process/repair-process.component";
// // import { BulkReturnListComponent } from "src/app/inventory/bulk-return-list/bulk-return-list.component";
// // import { BulkReturnOrderComponent } from "src/app/inventory/bulk-return-order/bulk-return-order.component";
// import { ApproverDashboardComponent } from "src/app/custom-components/approver-dashboard/approver-dashboard.component";
// import { RepairPartsApprovalComponent } from "src/app/inventory/repair-parts-approval/repair-parts-approval.component";
// import { ConfirmShipmentToComponent } from "src/app/inventory/confirm-shipment-to/confirm-shipment-to.component";
// import { ConfirmShipmentToDashboardComponent } from "src/app/custom-components/confirm-shipment-to-dashboard/confirm-shipment-to-dashboard.component";
// import { WarrantyHeaderComponent } from "src/app/master/warranty-header/warranty-header.component";
// import { PendingAcknowledgeComponent } from "src/app/inventory/pending-acknowledge/pending-acknowledge.component";
// import { BulkReturnReceivedComponent } from "src/app/inventory/bulk-return-received/bulk-return-received.component";
// import { BulkReturnListComponent } from "src/app/inventory/bulk-return-list/bulk-return-list.component";
// import { BulkReturnOrderComponent } from "src/app/inventory/bulk-return-order/bulk-return-order.component";
// import { ReverseReportsComponent } from "src/app/reports/reverse-reports/reverse-reports.component";
// import { ManageTicketComponent } from "src/app/Ticket/manage-ticket/manage-ticket.component";
// import { DetailsTicketComponent } from "src/app/Ticket/details-ticket/details-ticket.component";
@Injectable({
  providedIn: 'root'
})

export class AppInitService {
  TYPE_MAP = new Map<string, any>();

  constructor(private Router: Router) {}

  userDetails: any[] = []
  setUp(){
    console.log("this.userDetails", this.userDetails)
  }
  

  init() {
    
    return new Promise<void>((resolve, reject) => {
      debugger
      let allRoutes = JSON.parse(localStorage.getItem("AllRouting"))
      let formDetail = JSON.parse(localStorage.getItem("FieldDetail"));

      let staticRoutes = this.Router.config;
      this.Router.config = [];

      if (allRoutes == null) {
        this.Router.resetConfig(staticRoutes);
        resolve();
      }
      else {
        const dynamicRoutes = allRoutes == undefined ? [] : allRoutes;
        let routes = staticRoutes;
        let childRoutes = [];
        var logedinuser = glob.getLogedInUser()
      
      // childRoutes.push({
      //   path: "dashboard", component: CallLoginDashboardComponent,
      //   data: { ScreenCode: "Dashbord", routeDetail: "", ModuleId: 0 },
      //   canActivate: [AuthGuard]
      // });


        // let customRoute = this.getCustomComponentRoutes();
        // customRoute.forEach(route => {
        //   childRoutes.push({
        //     path: route.path, component: route.component,
        //     data: route.data,
        //     canActivate: [AuthGuard],
        //     resolve: {
        //       ExtraApi: CrmResolverService
        //     }
        //   });
        // })

        routes = routes.filter(x => x.path != 'auth/:companycode');
        // routes.push({
        //   path: 'auth/:companycode', component: MainLayoutComponent,
        //   children: childRoutes,
        // });
        this.Router.resetConfig(routes);
        resolve();
      }
    });
  }

  initNotFound(companyCode) {
    return new Promise<void>((resolve, reject) => {
      let routes = this.Router.config;
      routes = routes.filter(x => x.path != '404/:companycode');
      routes = routes.filter(x => x.path != '**');
      // routes.push({
      //   path: '404/:companycode', component: MainLayoutComponent,
      //   children: [{ path: '404', component: Page404Component }],
      // });
      routes.push({ path: '**', redirectTo: `404/${companyCode}/404` });
      this.Router.resetConfig(routes);
      resolve();
    })
  }

  // getComponent(component) {
  //   switch (component) {
  //     default: {
  //       return Page404Component;
  //     }
  //   }
  // }


  // getCustomComponentRoutes() {
  //   let routes: Routes = [
  //     {
  //       path: 'UserManagement',
  //       component: UserFormComponent,
  //       data: { ScreenCode: 'UserManagement', routeDetail: '', ModuleId: 0 },
  //       canActivate: [AuthGuard],
  //     },
  //    {
  //       path: AppRouter.SystemAdministrator + '/' + AppRouter.UserManagement + '/add',
  //       component: UserFormComponent,
  //       data: { ScreenCode: 'UserManagement', routeDetail: '', ModuleId: 22 },
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: AppRouter.SystemAdministrator + '/' + AppRouter.ProfileSetting + '/add',
  //       component: ProfileSettingComponent,
  //       data: { ScreenCode: 'ProfileSetting', routeDetail: '', ModuleId: 42 },
  //       canActivate: [AuthGuard],
  //     },

  //     {
  //       path: AppRouter.SubMenu,
  //       component: SubmenuComponent,
  //       data: { ScreenCode: '', routeDetail: '', ModuleId: 0 },
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: AppRouter.SystemAdministrator + '/' + AppRouter.ProfileSetting + '/add',
  //       component: ProfileSettingComponent,
  //       data: { ScreenCode: 'ProfileSetting', routeDetail: '', ModuleId: 42 },
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: 'call-login-dashbaord',
  //       component: CallLoginDashboardComponent,
  //       data: { ScreenCode: 'call-login-dashbaord', routeDetail: '', ModuleId: 0 },
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: 'assign-technician',
  //       component: AssignTechnicianComponent,
  //       data: { ScreenCode: 'app-assign-technician', routeDetail: '', ModuleId: 0 },
  //       canActivate: [AuthGuard],
  //     },

  //     {
  //       path: 'customer-list',
  //       component: CreateCustomerComponent,
  //       data: { ScreenCode: 'customer-list', routeDetail: '', ModuleId: 0 },
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: 'user-master',
  //       component: UserMasterComponent,
  //       data: {ScreenCode: 'user-master', routeDetail:'', ModuleId:0}

  //     },
  //     {
  //       path: 'add-user-master',
  //       component: AddUserMasterComponent,
  //       data: {ScreenCode: 'add-user-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path : 'material',
  //       component : CompanyMaterialResourceMapping,
  //       data: {ScreenCode: 'material', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'material-master',
  //       component: MaterialMasterComponent,
  //       data: {ScreenCode: 'material-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-material-master',
  //       component: AddMaterialMasterComponent,
  //       data: {ScreenCode: 'add-material-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'resource-master',
  //       component: ResourceMasterComponent,
  //       data: {ScreenCode: 'resource-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-resource-master',
  //       component: AddResourceMasterComponent,
  //       data: {ScreenCode: 'add-resource-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'location-master',
  //       component: LocationMasterComponent,
  //       data: {ScreenCode: 'location-master', routeDetail:'', ModuleId:0}
        
  //     },  
  //     {
  //       path: 'add-location-master',
  //       component: AddLocationMasterComponent,
  //       data: {ScreenCode: 'add-location-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'gst-component',
  //       component: GstComponentComponent,
  //       data: {ScreenCode: 'gst-component', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-gst-component',
  //       component: AddGstComponentComponent,
  //       data: {ScreenCode: 'add-gst-component', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'gst-group',
  //       component: GstGroupComponent,
  //       data: {ScreenCode: 'gst-group', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-gst-group',
  //       component: AddGstGroupComponent,
  //       data: {ScreenCode: 'add-gst-group', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'gst-setup',
  //       component: GstSetupComponent,
  //       data: {ScreenCode: 'gst-setup', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-gst-setup',
  //       component: AddGstSetupComponent,
  //       data: {ScreenCode: 'add-gst-setup', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'company-mapping',
  //       component: CompanyMaterialResourceMapping,
  //       data: {ScreenCode: 'company-mapping', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-company-mapping',
  //       component: AddCompanyMaterialResourceMappingComponent,
  //       data: {ScreenCode: 'add-company-mapping', routeDetail:'', ModuleId:0}
  //     },

  //     {
  //       path: 'customer-master',
  //       component: CustomerMasterComponent,
  //       data: {ScreenCode: 'customer-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-customer-master',
  //       component: AddCustomerMasterComponent,
  //       data: {ScreenCode: 'add-customer-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'company-master',
  //       component: CompanyMasterComponent,
  //       data: {ScreenCode: 'company-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-company-master',
  //       component: AddCompanyMasterComponent,
  //       data: {ScreenCode: 'add-company-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'org-role-master',
  //       component: OrgRoleMasterComponent,
  //       data: {ScreenCode: 'org-role-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'add-org-role-master',
  //       component: AddOrgRoleMasterComponent,
  //       data: {ScreenCode: 'add-org-role-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'jobrole-master',
  //       component: JobroleMasterComponent,
  //       data: {ScreenCode: 'jobrole-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'add-jobrole-master',
  //       component: AddJobroleMasterComponent,
  //       data: {ScreenCode: 'add-jobrole-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'profile-setting',
  //       component: ProfileMasterComponent,
  //       data: {ScreenCode: 'profile-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'add-profile-master',
  //       component: AddProfileMasterComponent,
  //       data: {ScreenCode: 'add-profile-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'profile-module-master',
  //       component: ProfileModuleMasterComponent,
  //       data: {ScreenCode: 'profile-module-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'add-profile-module-master',
  //       component: AddProfileModuleMasterComponent,
  //       data: {ScreenCode: 'add-profile-module-master', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'salesperson-master',
  //       component: SalespersonMasterComponent,
  //       data: {ScreenCode: 'salesperson-master', routeDetail:'', ModuleId:0}
  //     },

  //     {
  //       path: 'add-salesperson-master',
  //       component: AddSalespersonMasterComponent,
  //       data: {ScreenCode: 'add-salesperson-master', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'price-list',
  //       component:  PriceListDetailComponent,
  //       data: {ScreenCode: 'price-list', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'add-price-list-detail',
  //       component: AddPriceListDetailComponent,
  //       data: {ScreenCode: 'sales-return-list', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'user-location-mapping',
  //       component: UserLocationMappingComponent,
  //       data: {ScreenCode: 'user-location-mapping', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'add-user-location-mapping',
  //       component: AddUserLocationMappingComponent,
  //       data: {ScreenCode: 'add-user-location-mapping', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'token-report',
  //       component: TokenReportComponent,
  //       data: {ScreenCode: 'token-report', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'token-report',
  //       component: TokenReportComponent,
  //       data: {ScreenCode: 'token-report', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'job-report',
  //       component: JobReportComponent,
  //       data: {ScreenCode: 'job-report', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'business-place',
  //       component: BusinessPlaceComponent,
  //       data: {ScreenCode: 'business-palce', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'add-business-place',
  //       component: AddBusinessPlaceComponent,
  //       data: {ScreenCode: 'add-business-place', routeDetail:'',ModuleId:0}
  //     },
  //     {
  //       path: 'master-content',
  //       component: MasterContentComponent,
  //       data: {ScreenCode: 'master-content', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-master-content',
  //       component: AddMasterContentComponent,
  //       data: {ScreenCode: 'add-master-content', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'add-master-content-list',
  //       component: AddMasterContentlistComponent,
  //       data: {ScreenCode: 'add-master-content-list', routeDetail:'', ModuleId:0}
  //     },

  //     {
  //       path: 'create-jobsheet',
  //       component: CreateJobsheetComponent,
  //       data: {ScreenCode: 'create-jobsheet', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'repair-process',
  //       component: RepairProcessComponent,
  //       data: { ScreenCode: 'repair-process', routeDetail: '', ModuleId: 0 },
  //       canActivate: [AuthGuard],
  //     },
  //     { 
  //       path: 'bulk-return-list', 
  //       component: BulkReturnListComponent, 
  //       data: { ScreenCode: 'bulk-return-list', routeDetail: '', ModuleId: 0 },
  //     },
  //     {
  //       path: 'bulk-return-order',
  //       component: BulkReturnOrderComponent,
  //       data: {ScreenCode: 'bulk-return-order', routeDetail:'', ModuleId:0}
  //     },
  //     {
  //       path: 'repair-process',
  //       component: RepairProcessComponent,
  //       data: { ScreenCode: 'repair-process', routeDetail: '', ModuleId: 0 },
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: 'approver-dashboard',
  //       component: ApproverDashboardComponent,
  //       data: {ScreenCode: 'approver-dashboard', routeDetail:'', ModuleId:170},
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: 'repair-parts-approval',
  //       component: RepairPartsApprovalComponent,
  //       data: {ScreenCode: 'repair-parts-approval', routeDetail:'', ModuleId:0},
  //     },
  //     {
  //       path: 'confirm-shipment-to',
  //       component: ConfirmShipmentToDashboardComponent,
  //       data: {ScreenCode: 'confirm-shipment-to', routeDetail:'', ModuleId:0},
  //     },
  //     {
  //       path: 'Warranty-header',
  //       component: WarrantyHeaderComponent,
  //       data: {ScreenCode: 'Warranty-header', routeDetail:'', ModuleId:0},
  //     },
  //     {
  //       path: 'pending-acknowledge',
  //       component: PendingAcknowledgeComponent,
  //       data: {ScreenCode: 'pending-acknowledge', routeDetail:'', ModuleId:0},
  //     },
  //     {
  //       path: 'bulk-return-received',
  //       component: BulkReturnReceivedComponent,
  //       data: {ScreenCode: 'bulk-return-received', routeDetail:'', ModuleId:0},
  //     },
  //     {
  //       path: 'reverse-reports',
  //       component: ReverseReportsComponent,
  //       data: {ScreenCode: 'bulk-return-received', routeDetail:'', ModuleId:0},
  //     },

  //     {
  //       path: 'manage-ticket',
  //       component: ManageTicketComponent,
  //       data: {ScreenCode: 'manage-ticket', routeDetail:'',ModuleId:0}
  //     },

  //     {
  //       path: 'details-ticket',
  //       component: DetailsTicketComponent,
  //       data: {ScreenCode: 'details-ticket', routeDetail:'',ModuleId:0}
  //     },


  //   ]
  //   return routes;
  // }
}

