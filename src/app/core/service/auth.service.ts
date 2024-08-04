import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Controller,GLOBALVARIABLE } from 'src/app/config/global';
import { ActivatedRoute } from '@angular/router';
import * as glob from "src/app/config/global";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {  
    debugger
    return this.apiService.getData(
      Controller.Register +
      'ValidateUserLogin(UserName=' + username + ',Password=' + password + ')'
    ).pipe(
      map((user) => {  
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        glob.setLogedInUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  refeshToken() {
    console.log("refeshToken called");
    return this.apiService.postData(
      Controller.Register + 'refresh-token',
      {
        "AccessToken": localStorage.getItem(GLOBALVARIABLE.TOKEN),
        "RefreshToken": localStorage.getItem(GLOBALVARIABLE.REFRESHTOKEN),
      }
    ).pipe(
      map((data) => {
        console.log('Refesh Tokrn data',data);
       return data;
      })
    );
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return of({ success: false });
  }

  register(param) {
    return this.apiService.postData(
      Controller.Register + 'AddEditAdminUser',
      param
    );
  }

  getCurrency() {
    const path = 'assets/data/currency.json';
    return this.apiService.getFileData(path);
  }

  getDateFormat() {
    const path = 'assets/data/datetime.json';
    return this.apiService.getFileData(path);
  }

  getTimeZone() {
    const path = 'assets/data/timezone.json';
    return this.apiService.getFileData(path);
  }

  checkAdminUserCreated() {
    return this.apiService.getData(
      Controller.Register + 'CheckAdminUserCreated()'
    );
  }

  getMenu(userName) {
    return this.apiService.getData(
      Controller.Menu + 'GetMenuDetail(userName=' + userName + ')'
    );
  }

  getProfileModuleList() {
    return this.apiService.getData(
      Controller.Menu + 'GetModuleEntityField()'
    );
  }

  getFieldDetail() {
    return this.apiService.getData(
      Controller.Dynamic + 'GetFieldDetails()'
    );
  }

  getGridDetail() {
    return this.apiService.getData(
      Controller.Dynamic + 'GetGridDetails()'
    );
  }

  getAllRouting() {
    return this.apiService.getData(
      Controller.Menu + 'GetAllRouting()'
    );
  }

  getModulections() {
    return this.apiService.getData(
      Controller.Dynamic + 'GetModuleActions()'
    );
  }

  getUserPermission(userName) {
    return this.apiService.getData(
      Controller.Menu + 'getUserPermission(userName=' + userName + ')'
    );
  }



}
