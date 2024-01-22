import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';

// import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { SchoolService } from '../../../services/school.service';
import { AssessmentService } from '../../../services/assessment.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

// export interface DialogData {
//   animal: 'panda' | 'unicorn' | 'lion';
// }

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    CommonModule,
    MatRadioModule,
    MatCheckboxModule
  ],
 
  templateUrl: './edit-assignment.component.html',
  styleUrl: './edit-assignment.component.scss'
})
export class EditAssignmentComponent implements OnInit, AfterViewInit {
  assessmentForm: FormGroup;
  isEditable: boolean = false;
  classList:any;
  TypeList:any;
  optionsText :any = ['A','B','C','D','E','F'];
  lastId:number=0;
  typeCode:string="MCQ";
  questionMasterListData:any;



  constructor(
    public dialogRef: MatDialogRef<EditAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assessmentSer: AssessmentService,
    private toastr: ToastrService,
    private commonServ:CommonService,
    private schoolSer:SchoolService) {
    this.assessmentForm = new FormGroup({
     
      'name': new FormControl('', [Validators.required, Validators.minLength(5)]),
      'starDate': new FormControl('', [Validators.required]),
      'endDate': new FormControl('', [Validators.required]),
      'assignedClassId': new FormControl(0,[Validators.required,Validators.min(1)]),
      'description': new FormControl('', [Validators.required]),
      
      
      'questionMasterList': new FormGroup({
        'assessmentId':new FormControl('0', [Validators.required]),
        "totalScore":new FormControl(0, [Validators.required]),
        "passingScore":new FormControl(0, [Validators.required]),
        'totalScoreObtained':new FormControl(0, [Validators.required]),
        'numberOfQuestion':new FormControl(0, [Validators.required, Validators.min(1)]),
        
        
        'questionsList':new FormArray([
          new FormGroup({
            'question': new FormControl('', [Validators.required]),
            'description': new FormControl(''),
            'point': new FormControl(0, [Validators.required, Validators.min(1)]),
            'type': new FormControl('MCQ', [Validators.required, Validators.minLength(3)]),
            
             'options':new FormArray([
              new FormGroup(
                {
                  'correctAnswer': new FormControl(''),
                  text:new FormControl(''),
                  isCorrect:new FormControl(false)
                }
              ),
              new FormGroup(
                {
                  'correctAnswer': new FormControl(''),
                  text:new FormControl(''),
                  isCorrect:new FormControl(false)
                }
              ),
              new FormGroup(
                {
                  'correctAnswer': new FormControl(''),
                  text:new FormControl(''),
                  isCorrect:new FormControl(false)
                }
              ),
              new FormGroup(
                {
                  'correctAnswer': new FormControl(''),
                  text:new FormControl(''),
                  isCorrect:new FormControl(false)
                }
              )
             ])
           
          })
        ])
      })
    });
  }
  ngOnInit(): void {
    this.getClass();
    this.getQuestionType();
    
    
  }
  ngAfterViewInit() {
    this.lastId = this.data.lastId;
    if (this.data.assessmentsData != null ) {
      this.isEditable = true;
     
      this.assessmentSer.getQuestionMasterListByAssessmentId(this.data.assessmentsData.id).subscribe((res:any)=>{
        if(res){
          this.questionMasterListData = res[0]
          const { id, ...questionData } = Object.assign({}, res[0]);
          
          
      this.assessmentForm.patchValue({
        name: this.data.assessmentsData.name,
        starDate: this.data.assessmentsData.starDate,
        endDate: this.data.assessmentsData.endDate,
        assignedClassId: this.data.assessmentsData.assignedClassId,
        description: this.data.assessmentsData.description,
        questionMasterList:questionData
        
      })

      for(let qindex=1; qindex < questionData.questionsList.length; qindex++ ){
        const qlcontrol = this.assessmentForm.get('questionMasterList').get('questionsList');
        (qlcontrol as FormArray).push( new FormGroup({
          'question': new FormControl('', [Validators.required]),
          'description': new FormControl(''),
          'point': new FormControl(0, [Validators.required, Validators.min(1)]),
          'type': new FormControl('MCQ', [Validators.required, Validators.minLength(3)]),

          'options': new FormArray([
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            ),
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            ),
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            ),
            new FormGroup(
              {
                'correctAnswer': new FormControl(''),
                text: new FormControl(''),
                isCorrect: new FormControl(false)
              }
            )
          ])

        }));
        debugger;
      const QNLdata = (<FormArray>this.assessmentForm.controls['questionMasterList']);
      QNLdata.controls['questionsList'].controls[qindex].patchValue(questionData.questionsList[qindex]);
      }
        }
        
      });
     


    }
  }

  addQuestions(){
    const qmlcontrol = (<FormArray>this.assessmentForm.controls['questionMasterList']);
    const qlcontrol = <FormArray>qmlcontrol.controls['questionsList'];

    qlcontrol.push(
      new FormGroup({
        'question': new FormControl('', [Validators.required]),
        'description': new FormControl(''),
        'point': new FormControl(0, [Validators.required, Validators.min(1)]),
        'type': new FormControl('MCQ', [Validators.required, Validators.minLength(3)]),
        
         'options':new FormArray([
          new FormGroup(
            {
              'correctAnswer': new FormControl(''),
              text:new FormControl(''),
              isCorrect:new FormControl(false)
            }
          ),
          new FormGroup(
            {
              'correctAnswer': new FormControl(''),
              text:new FormControl(''),
              isCorrect:new FormControl(false)
            }
          ),
          new FormGroup(
            {
              'correctAnswer': new FormControl(''),
              text:new FormControl(''),
              isCorrect:new FormControl(false)
            }
          ),
          new FormGroup(
            {
              'correctAnswer': new FormControl(''),
              text:new FormControl(''),
              isCorrect:new FormControl(false)
            }
          )
         ])
       
      })
    )
  
  }
  addInitialOption(){
    const qmlcontrol = (<FormArray>this.assessmentForm.controls['questionMasterList']);
    const qlcontrol = <FormArray>qmlcontrol.controls['questionsList'];
    const qlfgcontrol = <FormArray>qlcontrol.controls[0]; //.controls.options
    const optioncontrol = <FormArray>qlfgcontrol.controls['options']; //.controls.options

    for(let i= 0; i>4; i++ ){
      optioncontrol.push(
        new FormGroup(
          {
            test:new FormControl(''),
            isCorrect:new FormControl(false)
          }
        )
      )
    }
  }
  getOptionControls(index:number):any{
    const qmlcontrol = (<FormArray>this.assessmentForm.controls['questionMasterList']);
    const qlcontrol = <FormArray>qmlcontrol.controls['questionsList'];
    const qlfgcontrol = <FormArray>qlcontrol.controls[index]; //.controls.options
    const optioncontrol = <FormArray>qlfgcontrol.controls['options']; //.controls.options
    
    return optioncontrol['controls'];
  }

  getClass(){
    this.schoolSer.getClass().subscribe((res:any)=>{
      this.classList = res;
      // this.getAsseessment();
    })
  }
  saveAssessment() {
    if (this.data.assessmentsData != null ) {
      let id = this.data.assessmentsData.id;

      const saveAssessmentData =  this.getAssessmentData();
      const saveQuestionData =   this.getQuestionMasterListData();

      this.assessmentSer.updateAssessment(id, saveAssessmentData).subscribe((res: any) => {
        if(res){
          saveQuestionData.assessmentId = res.id;
          this.assessmentSer.updateQuestionMasterList(this.questionMasterListData.id, saveQuestionData).subscribe((res: any) => {
            this.toastr.success("Data updated successfully");
            this.commonServ.callRefreshData();
            this.dialogRef.close();
          });
        }
        

      });
    } else {
     const saveAssessmentData =  this.getAssessmentData();
     const saveQuestionData =   this.getQuestionMasterListData();
      if (this.assessmentForm.valid) {
        
        this.assessmentSer.saveAssessment(saveAssessmentData).subscribe((res: any) => {
          if(res){
            saveQuestionData.assessmentId = res.id;
            this.assessmentSer.saveQuestionMasterList(saveQuestionData).subscribe((res: any) => {
              this.toastr.success("Assessment successfully added");
              this.commonServ.callRefreshData();
              this.dialogRef.close();
            });
          }
          
          
        });
        
      } else {
        // this.getQuestionMasterListData();
        this.toastr.error("Please Enter valid data", "Invalid data");
      }
    }

  }
  closeModal() {
    this.dialogRef.close();
  }
  getQuestionType(){
    this.assessmentSer.getQuestionType().subscribe((res:any)=>{
      this.TypeList = res;
    })
  }
  getAssessmentData(){
    let formdata = this.assessmentForm.value;
    const saveFormData = {
      name:formdata.name,
      starDate:formdata.starDate,
      endDate:formdata.endDate,
      assignedClassId:formdata.assignedClassId,
      description:formdata.description
    }
    return saveFormData;
  }
  getQuestionMasterListData(){
    const qmlcontrol = (<FormArray>this.assessmentForm.controls['questionMasterList']);
    const qlcontrol = <FormArray>qmlcontrol.controls['questionsList'];
    let totalscore=0;

    for(let i=0; i<qlcontrol.length;i++){
      const qlfgcontrol = <FormArray>qlcontrol.controls[i];
      totalscore = totalscore + +qlfgcontrol.controls['point'].value;
    }
    
    this.assessmentForm.controls['questionMasterList'].patchValue({
      numberOfQuestion:qlcontrol.length,
      totalScore:totalscore,
      passingScore:totalscore*(60/100),
      
    })

    return this.assessmentForm.get('questionMasterList').value;
  }


  changeMC(lenght:number, qListindex, optionindex:number){

    const qmlcontrol = (<FormArray>this.assessmentForm.controls['questionMasterList']);
    const qlcontrol = <FormArray>qmlcontrol.controls['questionsList'];
    const qlfgcontrol = <FormArray>qlcontrol.controls[qListindex]; //.controls.options
    const optioncontrol = <FormArray>qlfgcontrol.controls['options']; //.controls.options
    
    
    for(let i=0; i<lenght;i++){
      if(i!=optionindex){
        optioncontrol.controls[i].patchValue({correctAnswer:''});
      }else{
        optioncontrol.controls[optionindex].patchValue({correctAnswer:this.optionsText[optionindex]});
      }
    }
  }


  changetypeCode(code:any, qListindex:number){
    const qmlcontrol = (<FormArray>this.assessmentForm.controls['questionMasterList']);
    const qlcontrol = <FormArray>qmlcontrol.controls['questionsList'];
    const qlfgcontrol = <FormArray>qlcontrol.controls[qListindex]; //.controls.options
    const optioncontrol = <FormArray>qlfgcontrol.controls['options']; //.controls.options
    
    // optioncontrol.reset();
    optioncontrol.patchValue([
      new FormGroup(
        {
          'correctAnswer': new FormControl(''),
          text:new FormControl(''),
          isCorrect:new FormControl(false)
        }
      ),
      new FormGroup(
        {
          'correctAnswer': new FormControl(''),
          text:new FormControl(''),
          isCorrect:new FormControl(false)
        }
      ),
      new FormGroup(
        {
          'correctAnswer': new FormControl(''),
          text:new FormControl(''),
          isCorrect:new FormControl(false)
        }
      ),
      new FormGroup(
        {
          'correctAnswer': new FormControl(''),
          text:new FormControl(''),
          isCorrect:new FormControl(false)
        }
      )
     ])

    this.typeCode = code.target.value.slice(-3);
    
  }
}
