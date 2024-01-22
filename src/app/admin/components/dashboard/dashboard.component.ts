import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { EventService } from '../../../services/event.service';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { EditEventComponent } from '../../../components/event/edit-event/edit-event.component';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../shared/interfaces/user';
import { EventData } from '../../../shared/interfaces/event';
import { RouterModule } from '@angular/router';
import { SchoolService } from '../../../services/school.service';
import { SchoolData } from '../../../shared/interfaces/school';
import { AssessmentService } from '../../../services/assessment.service';
import { AssessmentData } from '../../../shared/interfaces/assessment';


@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'

})
export class DashboardComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'date', 'startTime', 'endTime', 'description'];
  
  


  dataSource: MatTableDataSource<EventData>;
  userDataSource: MatTableDataSource<UserData>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  newUsers:any[];
  schoolLest:any[];
  eventList:any[];
  assessmentList:any[];
  constructor(
    private eventSer: EventService,
    public dialog: MatDialog,
    private userServ:UserService,
    private schoolServ:SchoolService,
    private assessmentServ:AssessmentService
  ) { }


  ngOnInit(): void {
    this.getEvent();
    this.getNewUser();
    this.getSchool();
    this.getAssessments();
  }

  ngAfterViewInit() {
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  getEvent() {
    this.eventSer.getAllEvent().subscribe((res: EventData[]) => {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.eventList = res;
    });
  }
  getNewUser(){
    let username = '';
    let IsActive = false;
    this.userServ.getNewUsers(username,IsActive).subscribe((res:UserData[])=>{
      this.newUsers = res;
    });
  }
  getSchool(){
    this.schoolServ.getSchool().subscribe((res:SchoolData[])=>{
      this.schoolLest = res;
    });
  }

  getAssessments(){
    this.assessmentServ.getAssessments().subscribe((res:AssessmentData[])=>{
      this.assessmentList = res;
    });
  }

  opentModal(modelName: string) {
    this.dialog.open(EditEventComponent, {
      data: {
        id: 0,
      },
    });
  }

  sortData(){
    console.log(this.dataSource);
    // debugger;
  }
}
