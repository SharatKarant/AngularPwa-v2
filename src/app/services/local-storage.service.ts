import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // call this method for setting token pass two params key and value E.g ("myToken", "token value")
    setToken(key:string, value:string){
    localStorage.setItem(key,value)
  }

  // call this method for get any token pass a token key E.g ("myToken")
  getToken(key:string){
    return localStorage.getItem(key)
  }

  setUserInfo(userInfo, value){
    localStorage.setItem(userInfo, JSON.stringify(value))
  }

  // useringo param should be exactlly same "userInfo"
  getUserInfo(userInfo){
    return JSON.parse(localStorage.getItem(userInfo))
  }
  
  setLocalStorageData(key:string, value:string){
    localStorage.setItem(key,value)
  }
  getLocalStorageData(key:string){
    return localStorage.getItem(key)
  }
}
