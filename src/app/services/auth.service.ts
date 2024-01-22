import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
  
})
export class AuthService {
public _isLogedIn = new BehaviorSubject<boolean>(false);
public _role = new BehaviorSubject<any>(['']);
baseUrl="http://localhost:3000/user";

  constructor(private localService:LocalStorageService, private http:HttpClient) { }

  // Call this method for login
  doLogin(username:any,password:any){
    return this.http.get(this.baseUrl+ "?userName=" +username+"&password="+password);
    
  }

  doRegistration(userData:any){
    return this.http.post(this.baseUrl, userData);
  }
  updateUser(id, userData:any){
    return this.http.put(this.baseUrl+'/'+id, userData);
  }

  
  // Check for loging or not
  IsLogedin():boolean{
    let appToken = this.localService.getToken("appToken");
    
    if( appToken === null || appToken === ''){
      this._isLogedIn.next(false);
      return false;
    }else{
      this._isLogedIn.next(true);
      return true;
    }
  }

  // Do logout and clear all local storage data 
  doLogOut(){
    
    localStorage.clear();
    
  }
}
