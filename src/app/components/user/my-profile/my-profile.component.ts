import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [MatCardModule,MatButtonModule, CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit{
userData:any;
  constructor(private localServ:LocalStorageService){
    this.userData = this.localServ.getUserInfo('userInfo')[0];
  }
  ngOnInit(): void {
    
  }
}
