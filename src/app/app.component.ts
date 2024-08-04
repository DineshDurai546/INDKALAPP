import { Component, OnInit } from '@angular/core';
import { CommonMessage, GLOBALVARIABLE } from 'src/app/config/global';
import { AuthService } from './core/service/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  implements OnInit{
  public appPages = [
    //  {title:'Dashboard',  url: '/Menu/dashboard' , icon: 'grid'},
    { title: 'Job Details', url: '/Menu/job-detail', icon: 'clipboard' },
    { title: 'Attendance', url: '/Menu/attendance', icon: 'home' },

    // { title: 'Accessories Sales', url: '/Menu/accessories-sales', icon: 'ticket' },
    // { title: 'Chat', url: '/Menu/chat', icon: 'chatbubble'},
    { title: 'Profile', url: '/Menu/profile', icon: 'person' },
    // { title: 'Map', url: 'map', icon: 'map' }, 
    // { title: 'Logout', url: 'login', icon: 'exit' }, 

    // { title: 'Logout', url: '/Menu/logout', icon: 'exit' }, 


  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private authService:AuthService,
    private router: Router
  ) { 
  }

  username:string
  FirstName:string
  LastName:string
  

  ngOnInit() {
    // this.username=localStorage.getItem(GLOBALVARIABLE.USERNAME);
     this.authService.currentUser.subscribe(data =>
      {
        this.FirstName=data?.UserDetails?.FirstName
        this.LastName =data?.UserDetails?.LastName
        this.username=data?.UserDetails?.UserName
      })
  }

  logout()
  {
    localStorage.clear();    
     this.authService.logout().subscribe((res) => {
      console.log("====",res)
      if (!res.success) { 
        sessionStorage.clear();
        localStorage.clear();
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      } 
      else{ 
        this.router.navigate(['/login']);
      }
    });

    // this.router.navigate(['/login']);
  }
} 
// localStorage.getItem(GLOBALVARIABLE.USERNAME)

// <ion-icon name="grid-outline"></ion-icon>