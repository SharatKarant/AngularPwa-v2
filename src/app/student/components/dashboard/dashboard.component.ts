import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { AssessmentService } from '../../../services/assessment.service';

import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import { QuizComponent } from '../../../components/assignment/quiz/quiz.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [MatCardModule,MatButtonModule, CommonModule,MatDividerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class StudentStudentDashboardComponent implements OnInit{
  userData:any;
  assessmentData:any;
  questionMasterListData:any;
  attemptedAssessment:any

  constructor(private localServ: LocalStorageService,private assessmentSer:AssessmentService,
    public dialog: MatDialog,private commonServ:CommonService){
    this.userData = this.localServ.getUserInfo('userInfo')[0];

    this.commonServ.$refreshData.subscribe((res:boolean)=>{
      if(res){
        this.getStudentAnswerByUserId(this.userData.userId);
      }
    });
  }
  ngOnInit(): void {
    this.getAssessments();
    this.getQuestionMasterList();
    this.getStudentAnswerByUserId(this.userData.userId);
  }
  getAssessments(){
    this.assessmentSer.getAssessmentsByClassId(this.userData.classId).subscribe((res:any)=>{
      console.log(res);
      this.assessmentData = res;
    });
  }

  enrollAssessment(data:any){
    this.dialog.open(QuizComponent, {
      data: {
        assessmentData: data,
      },
    });

  }
  getQuestionMasterList(){
    this.assessmentSer.getQuestionMasterList().subscribe((res:any)=>{
      this.questionMasterListData = res;
    })
  }
  filterQMLDByAssessmentId(assessmentId:string|number){
    return this.questionMasterListData.find(item=>item.assessmentId == assessmentId)

  }
  getStudentAnswerByUserId(userId:number|string){
    this.assessmentSer.getStudentAnswerByUserId(userId).subscribe((res:any)=>{
      this.attemptedAssessment = res;
    })
  }
  filterAttemptedAssessmentByAssessmentId(assessmentId:string|number){
    return this.attemptedAssessment.find(item=>item.assessmentId == assessmentId)

  }
  viewResult(assessment:any){
    
  }
}
