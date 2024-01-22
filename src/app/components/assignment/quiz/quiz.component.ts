import { AfterViewInit, Component, Inject } from '@angular/core';
import { Assessment, AssessmentData, QuestionMasterList } from '../../../shared/interfaces/assessment';
import { AssessmentService } from '../../../services/assessment.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements AfterViewInit {
  assessmentData: AssessmentData;
  questionMasterData: QuestionMasterList;
  answerForm: FormGroup;

  optionsText: any = ['A', 'B', 'C', 'D', 'E', 'F'];
  userData:any;

  constructor(

    private assessmentSer: AssessmentService,
    public dialogRef: MatDialogRef<QuizComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Assessment,
    private toastr: ToastrService,
    private _fb:FormBuilder,
    private commonServ:CommonService ,
    private localServ:LocalStorageService
    ) {

    this.userData = this.localServ.getUserInfo('userInfo')[0];

    this.answerForm = new FormGroup({
      'userId': new FormControl('0', [Validators.required]),
      'assessmentId': new FormControl('0', [Validators.required]),
      "totalScore": new FormControl(0, [Validators.required]),
      "passingScore": new FormControl(0, [Validators.required]),
      'totalScoreObtained': new FormControl(0, [Validators.required]),
      'numberOfQuestion': new FormControl(0, [Validators.required, Validators.min(1)]),


      'questionsList': new FormArray([
        
        new FormGroup({
          'question': new FormControl('', [Validators.required]),
          'description': new FormControl(''),
          'point': new FormControl(0, [Validators.required, Validators.min(1)]),
          'type': new FormControl('MCQ', [Validators.required, Validators.minLength(3)]),

          'options': new FormArray([
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                'studentAnswer': new FormControl(''),
                'studentIsCorrect': new FormControl(false),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            ),
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                'studentAnswer': new FormControl(''),
                'studentIsCorrect': new FormControl(false),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            ),
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                'studentAnswer': new FormControl(''),
                'studentIsCorrect': new FormControl(false),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            ),
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                'studentAnswer': new FormControl(''),
                'studentIsCorrect': new FormControl(false),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            )
          ])

        })
      
      ])
    })

  }

  ngAfterViewInit() {
    if (this.data.assessmentData != null && this.data.assessmentData != undefined) {

      this.assessmentData = this.data.assessmentData;
      this.assessmentSer.getQuestionMasterListByAssessmentId(this.assessmentData.id).subscribe((res: QuestionMasterList) => {
        if (res)

          this.questionMasterData = res[0];
        const { id, ...questionData } = Object.assign({}, res[0]);
        

        for (let i = 0; i < questionData.questionsList.length; i++) {
          for (let j = 0; j < questionData.questionsList[i].options.length; j++) {
            questionData.questionsList[i].options[j].studentAnswer = '';
            questionData.questionsList[i].options[j].studentIsCorrect = false;
          }
        }
        this.answerForm.patchValue({
          userId:this.userData.userId,
          assessmentId: questionData.assessmentId,
          numberOfQuestion: questionData.numberOfQuestion,
          passingScore: questionData.passingScore,
          totalScore: questionData.totalScore,
          totalScoreObtained: questionData.totalScoreObtained,
          questionsList:questionData.questionsList
        });
        
        
          for(let qindex=1; qindex < questionData.questionsList.length; qindex++ ){
            const qlcontrol = this.answerForm.get('questionsList');
            (qlcontrol as FormArray).push( new FormGroup({
              'question': new FormControl('', [Validators.required]),
              'description': new FormControl(''),
              'point': new FormControl(0, [Validators.required, Validators.min(1)]),
              'type': new FormControl('MCQ', [Validators.required, Validators.minLength(3)]),
    
              'options': new FormArray([
                new FormGroup(
                  {
                    'correctAnswer': new FormControl(''),
                    'studentAnswer': new FormControl(''),
                    'studentIsCorrect': new FormControl(false),
                    text: new FormControl(''),
                    isCorrect: new FormControl(false)
                  }
                ),
                new FormGroup(
                  {
                    'correctAnswer': new FormControl(''),
                    'studentAnswer': new FormControl(''),
                    'studentIsCorrect': new FormControl(false),
                    text: new FormControl(''),
                    isCorrect: new FormControl(false)
                  }
                ),
                new FormGroup(
                  {
                    'correctAnswer': new FormControl(''),
                    'studentAnswer': new FormControl(''),
                    'studentIsCorrect': new FormControl(false),
                    text: new FormControl(''),
                    isCorrect: new FormControl(false)
                  }
                ),
                new FormGroup(
                  {
                    'correctAnswer': new FormControl(''),
                    'studentAnswer': new FormControl(''),
                    'studentIsCorrect': new FormControl(false),
                    text: new FormControl(''),
                    isCorrect: new FormControl(false)
                  }
                )
              ])
    
            }));
            
          
          (<FormArray>this.answerForm.controls['questionsList']).controls[qindex].patchValue(questionData.questionsList[qindex])
          }
        

        console.log(this.answerForm);
        
        // this.answerForm = questionData;

      });

    }
  }
  closeModal() {
    this.dialogRef.close();
  }
  saveAnswer() {
    if (this.answerForm.valid) {
      
      this.assessmentSer.saveStudentAnswer(this.getFinalFormData()).subscribe(res=>{
        if(res){
          this.toastr.success("Assessment successfully added");
          this.commonServ.callRefreshData();
          this.dialogRef.close();
        }else{
          this.toastr.error("Something went wrong please try again", "Internal Error");
        }
      });
      
    } else {
      this.toastr.error("Please Enter valid data", "Invalid data");
    }
  }

  getOptionControls(index: number): any {
    const qlcontrol = (<FormArray>this.answerForm.controls['questionsList']);
    const qlfgcontrol = <FormArray>qlcontrol.controls[index]; //.controls.options
    const optioncontrol = <FormArray>qlfgcontrol.controls['options']; //.controls.options

    return optioncontrol['controls'];
  }
  getQuestionsList() {
    const qlcontrol = (<FormArray>this.answerForm.controls['questionsList'])

    return qlcontrol['controls'];
  }

  changeMC(lenght: number, qListindex, optionindex: number) {

    const qlcontrol = (<FormArray>this.answerForm.controls['questionsList']);
    const qlfgcontrol = <FormArray>qlcontrol.controls[qListindex]; //.controls.options
    const optioncontrol = <FormArray>qlfgcontrol.controls['options']; //.controls.options


    for (let i = 0; i < lenght; i++) {
      if (i != optionindex) {
        optioncontrol.controls[i].patchValue({ studentAnswer: '' });
      } else {
        optioncontrol.controls[optionindex].patchValue({ studentAnswer: this.optionsText[optionindex] });
      }
    }
  }
  getFinalFormData() {
    let formdata = this.answerForm.value;
    for (let i = 0; i < formdata.questionsList.length; i++) {
      if(formdata.questionsList[i].type === "MCQ"){
        for (let j = 0; j < formdata.questionsList[i].options.length; j++) {
          if ((formdata.questionsList[i].options[j].correctAnswer != '') && (formdata.questionsList[i].options[j].studentAnswer == formdata.questionsList[i].options[j].correctAnswer)) {
            formdata.totalScoreObtained = (+formdata.totalScoreObtained + +formdata.questionsList[i].point)
          }
        }
      }
      if(formdata.questionsList[i].type === "MAQ"){
        let studentIsCorrectArr=[];
        let isCorrectArr = [];
        for (let j = 0; j < formdata.questionsList[i].options.length; j++) {
          studentIsCorrectArr.push(formdata.questionsList[i].options[j].studentIsCorrect)
          isCorrectArr.push(formdata.questionsList[i].options[j].isCorrect)
          
        }
        if (studentIsCorrectArr.toString() === isCorrectArr.toString()) {
          formdata.totalScoreObtained = (+formdata.totalScoreObtained + +formdata.questionsList[i].point)
        }
      }
      
    }

    return formdata;
  }
}
