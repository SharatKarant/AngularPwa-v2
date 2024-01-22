import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentData } from '../../shared/interfaces/assessment';
import { AssignmentDetailsComponent } from './assignment-details/assignment-details.component';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.scss'
})
export class AssignmentComponent  implements OnInit{
  displayedColumns: string[] = ['action','id', 'name', 'assignedClassId', 'starDate', 'endDate', 'description'];
  
  dataSource: MatTableDataSource<AssessmentData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  classList:any;
  assessmentLastIndexId:number;

  questionMasterList:any;
  
  constructor(
    private assessmentSer: AssessmentService,
    public dialog: MatDialog,
    private toastr:ToastrService,
    private commonServ: CommonService,
    private schoolSer:SchoolService
  ) {
    this.commonServ.$refreshData.subscribe((res:boolean)=>{
      if(res){
        this.getAsseessment();
      }
    });
   }

  
  ngOnInit(): void {
    this.getClass();
    this.getQuestionMasterList();
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getClass(){
    this.schoolSer.getClass().subscribe((res:any)=>{
      this.classList = res;
      this.getAsseessment();
    })
  }
  getQuestionMasterList(){
    this.assessmentSer.getQuestionMasterList().subscribe((res: AssessmentData[]) => {
      this.questionMasterList = res;
    })
  }
  getAsseessment() {
    this.assessmentSer.getAssessments().subscribe((res: AssessmentData[]) => {

      let resLenght = res.length;
      if(resLenght>0){
        
        this.assessmentLastIndexId = +res[resLenght-1].id;
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }else{
        this.assessmentLastIndexId = 0;
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
     
    });
  }
  opentModal(modelName: string) {
    this.dialog.open(EditAssignmentComponent, {
      data: {
        assessmentsData: null,
        lastId:this.assessmentLastIndexId
      },
    });
  }

  updateAssessment(data:any){
    this.dialog.open(EditAssignmentComponent, {
      data: {
        assessmentsData: data,
        lastId:this.assessmentLastIndexId
      },
    });
  }



  deleteAssessment(data:any){
    // let QMLId = this.findQuestionData(data.id).id;
    // debugger
   this.assessmentSer.deleteAssessment(data.id).subscribe((res:any)=>{
    if(res){
      this.assessmentSer.deleteQuestionMasterList(this.findQuestionData(data.id).id).subscribe(res=>{
        if(res){
          this.toastr.success("Assessment successfully Deleted");
          this.getAsseessment();
        }else{
          this.toastr.error("Please try again.", "Something went wrong!");
        }
      })
    }
    else{
      this.toastr.error("Please try again.", "Something went wrong!");
    }
   })
  }


  viewDetails(data:any){
    this.dialog.open(AssignmentDetailsComponent, {
      data: {
        assessmentData: data,
      },
    });
  }
  getClassName(classId:number):string{
   const classdata:any =  this.classList.find(item=> item.id === classId)
    return classdata.name
  }

  findQuestionData(assessmentId){
    return this.questionMasterList.find(item=> item.assessmentId === assessmentId)
  }
  
}
