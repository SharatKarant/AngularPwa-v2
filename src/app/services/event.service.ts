import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  baseUrl="http://localhost:3000/event"
  constructor(private http:HttpClient) { }

  getAllEvent(){
    return this.http.get(this.baseUrl);
  }
  getEventById(id:number){
    return this.http.get(this.baseUrl+"?id="+id);
  }
  saveEvent(eventData:any){
    return this.http.post(this.baseUrl, eventData);
  }
  updateEvent(id, eventData:any){

    return this.http.put(this.baseUrl+'/'+id, eventData);
  }
  
  deleteEvent(id:number){
    return this.http.delete(this.baseUrl+"/"+id);
  }
}
