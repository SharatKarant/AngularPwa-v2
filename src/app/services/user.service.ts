import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl="http://localhost:3000/user";

  constructor(private http:HttpClient) { }

  
  getUsers(){
    return this.http.get(this.baseUrl);
  }

  // Call this method for login
  getNewUsers(role:any,isActive:any){
    return this.http.get(this.baseUrl+ "?role=" +role+"&isActive="+isActive);
    
  }
  updateUser(id, userData:any){
    return this.http.put(this.baseUrl+'/'+id, userData);
  }
  deleteUser(id:number){
    return this.http.delete(this.baseUrl+"/"+id);
  }
}
