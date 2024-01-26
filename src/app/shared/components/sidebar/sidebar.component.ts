import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule, 
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  userInfo:any=[];
  @Output() IsCollapse = new EventEmitter<boolean>;
  constructor(private localServ:LocalStorageService, private authServ:AuthService, private router:Router, private swPush: SwPush){}
  ngOnInit(): void {
    this.userInfo =  this.localServ.getUserInfo("userInfo")[0]
  }

  doLogout(){
    this.authServ.doLogOut();
    // localStorage.clear();
    this.authServ._isLogedIn.next(false);
    this.router.navigate(["/login"]);
    
  }

 

  

  enableNotification() {
    if (!this.swPush.isEnabled) {
      console.log("Notification is not enabled.");
      return;
    }
  
    this.swPush.requestSubscription({
      serverPublicKey: 'BAvKRd4pyXGh1sefKUCSNhk_Dq50bBPxGARCkiVD--ZF9cpk3fZvMSfVKJGE_MCe7QxBUG6mPizmx7gjkAxFg_Q'
    })
    .then(subscription => {
      // Send the subscription to your backend
      this.authServ.sendSubscriptionToServer(subscription)
        .subscribe(
          response => {
            console.log('Subscription sent to server:', response);
            // Optionally handle the response from the server
          },
          error => {
            console.error('Error sending subscription to server:', error);
            // Handle errors
          }
        );
    })
    .catch(error => {
      console.error('Error while subscribing', error);
    });
  }
  

  onChange(){
    this.IsCollapse.emit(true);
  }
}
