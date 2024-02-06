import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { IndexDBService } from './services/index-db.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent
  ],
  providers:[

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit{
  title="LPA-v1";
  Islogedin:boolean;
  isExpend:boolean=false;
  isCollapsed:boolean=false;
  constructor(public authSer:AuthService, private http:HttpClient, private indexedDBService: IndexDBService){
   this.authSer._isLogedIn.subscribe((res:boolean)=>{
      this.Islogedin = res;   
    });
  }
  ngAfterViewInit() {
    // this.authSer._isLogedIn.subscribe((res:boolean)=>{
    //   this.Islogedin = res;
    // });
  }
  ngOnInit(): void {
    
  }

  collapseSideBar(){
    // debugger;
    this.isCollapsed = false;
    this.isExpend = !this.isExpend?true:false;
    // console.log(this.isExpend);
    
  }
  changeIsCollapse(isTrue){
    this.isCollapsed = isTrue;
    this.isExpend = false;
    console.log(this.isCollapsed);
  }

  postSync() {
    let obj = {
      "userInfo":localStorage.getItem("userInfo"),
      "token": localStorage.getItem('appToken'),
      "timing":  new Date().toISOString(),
    };
    this.http.post('http://localhost:4000/post-data', obj).subscribe(
      res => {
        console.log("Successfully synced data to server", res);
      },
      err => {
        if (err.status == 504 || err.status == 500) {
          this.indexedDBService
          .addUser(obj)
          .then(()=>this.backgroundSync('myFirstBackgroundSync'))
          .catch(console.log);
          // this.backgroundSync(obj);
        }
      }
    );
  }
  
//   backgroundSync(obj: any) {
//     console.log(obj);
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.controller.postMessage({
//         type: 'GET_LOCAL_STORAGE_DATA',
//         data: obj, 
//       });
//     }
//     navigator.serviceWorker.ready
//     .then((registration: ServiceWorkerRegistration) => {
//       return registration.sync.register('myFirstBackgroundSync');
//     })
//     .then(() => {
//       console.log('Background sync registered successfully');
//     })
//     .catch(error => {
//       console.error('Error registering background sync:', error);
//     });
//   }

backgroundSync(tagName: string) {
  navigator.serviceWorker.ready
  .then((registration: ServiceWorkerRegistration) => {
    return registration.sync.register(tagName);
  })
  .then(() => {
    console.log('Background sync registered successfully');
  })
  .catch(error => {
    console.error('Error registering background sync:', error);
  });
}

}

