import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

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
  constructor(public authSer:AuthService){
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

}
