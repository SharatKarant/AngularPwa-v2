import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Assessment, AssessmentData, QuestionMasterList } from '../../../shared/interfaces/assessment';
import { AssessmentService } from '../../../services/assessment.service';

import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-assignment-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule
  ],
  templateUrl: './assignment-details.component.html',
  styleUrl: './assignment-details.component.scss'
})
export class AssignmentDetailsComponent {
  assessmentData:AssessmentData;
  questionMasterData:QuestionMasterList;

  

constructor(
  
  private assessmentSer:AssessmentService,
  public dialogRef: MatDialogRef<AssignmentDetailsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: Assessment
  ){
  
}

ngAfterViewInit() {

  if (this.data.assessmentData != null && this.data.assessmentData != undefined) {

    this.assessmentData = this.data.assessmentData;
    this.assessmentSer.getQuestionMasterListByAssessmentId(this.assessmentData.id).subscribe((res:QuestionMasterList)=>{
      if(res)
      this.questionMasterData = res[0];
    console.log(this.questionMasterData);
    
    });
    
  }
}
closeModal() {
  this.dialogRef.close();
}
}
