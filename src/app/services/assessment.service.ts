import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  baseUrl="http://localhost:3000/";

  constructor(private http:HttpClient) { }

  
  getAssessments(){
    return this.http.get(this.baseUrl+"assessments");
  }
  getAssessmentsByClassId(classId:number|string){
    return this.http.get(`${this.baseUrl}assessments?assignedClassId=${classId}`);
  }
  saveAssessment(assessmentsData:any){
    return this.http.post(this.baseUrl+"assessments", assessmentsData);
  }
  updateAssessment(id, assessmentsData:any){
    return this.http.put(this.baseUrl+"assessments"+'/'+id, assessmentsData);
  }
  deleteAssessment(id:number|string){
    return this.http.delete(this.baseUrl+"assessments"+"/"+id);
  }


  getQuestionMasterList(){
    return this.http.get(`${this.baseUrl}questionMasterList`)
  }
  getQuestionMasterListByAssessmentId(id:number|string){
    return this.http.get(`${this.baseUrl}questionMasterList?assessmentId=${id}`)
  }
  saveQuestionMasterList(questionMasterData:any){
    return this.http.post(this.baseUrl+"questionMasterList", questionMasterData);
  }
  updateQuestionMasterList(id:number,questionMasterData:any){
    return this.http.put(this.baseUrl+"questionMasterList"+'/'+id, questionMasterData);
  }
  deleteQuestionMasterList(id:number|string){
    return this.http.delete(this.baseUrl+"questionMasterList"+'/'+id);
  }

  saveStudentAnswer(studentAnswerData:any){
    return this.http.post(this.baseUrl+"studentAnswerMasterList", studentAnswerData);
  }
  getStudentAnswerByUserId(userId:number|string){
    return this.http.get(`${this.baseUrl}studentAnswerMasterList?userId=${userId}`)
  }



  getQuestionType(){
    return this.http.get(`${this.baseUrl}questionType`)
  }
}