import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  baseUrl="http://localhost:3000/";

  constructor(private http:HttpClient) { }

  
  getSchool(){
    return this.http.get(this.baseUrl+"school");
  }
  saveSchool(schoolData:any){
    return this.http.post(this.baseUrl+"school", schoolData);
  }
  updateSchool(id, schoolData:any){
    return this.http.put(this.baseUrl+"school"+'/'+id, schoolData);
  }
  deleteSchool(id:number){
    return this.http.delete(this.baseUrl+"school"+"/"+id);
  }


//   Branch APIs 
  getBranch(){
    return this.http.get(this.baseUrl+"branch");
  }
  getBranchBySchoolId(schoolId:number){
    return this.http.get(this.baseUrl+"branch?schoolId="+schoolId);
  }
  saveBranch(branchData:any){
    return this.http.post(this.baseUrl+"branch", branchData);
  }
  updateBranch(id, branchData:any){
    return this.http.put(this.baseUrl+"branch"+'/'+id, branchData);
  }
  deleteBranch(id:number){
    return this.http.delete(this.baseUrl+"branch"+"/"+id);
  }

  //   Class APIs 
  getClass(){
    return this.http.get(this.baseUrl+"class");
  }
  saveClass(classData:any){
    return this.http.post(this.baseUrl+"class", classData);
  }
  updateClass(id, classData:any){
    return this.http.put(this.baseUrl+"class"+'/'+id, classData);
  }
  deleteClass(id:number){
    return this.http.delete(this.baseUrl+"class"+"/"+id);
  }

  //   Class APIs 
  getSubject(){
    return this.http.get(this.baseUrl+"subject");
  }
  saveSubject(subjectData:any){
    return this.http.post(this.baseUrl+"subject", subjectData);
  }
  updateSubject(id, subjectData:any){
    return this.http.put(this.baseUrl+"subject"+'/'+id, subjectData);
  }
  deleteSubject(id:number){
    return this.http.delete(this.baseUrl+"subject"+"/"+id);
  }
}
