import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  
  baseUrl="http://localhost:3000/";

  $refreshData = new BehaviorSubject<boolean>(false);
  
  constructor(private http:HttpClient) { }

  getRolesList(){
    return this.http.get(this.baseUrl+"roleList");
  }

  callRefreshData(){
    this.$refreshData.next(true);
  }

  
}
