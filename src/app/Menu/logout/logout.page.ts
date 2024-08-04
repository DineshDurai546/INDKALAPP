import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage {

  constructor(private router: Router,
              private authService: AuthService,
              private location: Location
    ) {
      this.logout();
   }

   logout() { 
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
  
  }
 

}
