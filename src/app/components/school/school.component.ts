import { Component, ViewChild } from '@angular/core';
import { EditSchoolComponent } from './edit-school/edit-school.component';
import { SchoolData } from '../../shared/interfaces/school';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SchoolService } from '../../services/school.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './school.component.html',
  styleUrl: './school.component.scss'
})
export class SchoolComponent {
  displayedColumns: string[] = ['action', 'id', 'name', 'logo', 'schoolCode'];;

  dataSource: MatTableDataSource<SchoolData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private schoolServ: SchoolService,
    public dialog: MatDialog,
    private toastr :ToastrService,
    private commonServ:CommonService
  ) { 
    this.commonServ.$refreshData.subscribe((res:boolean)=>{
      if(res){
        this.getSchool();
      }
    });
  }


  ngOnInit(): void {
    this.getSchool();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSchool() {
    this.schoolServ.getSchool().subscribe((res: SchoolData[]) => {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  opentModal(modelName: string) {
    this.dialog.open(EditSchoolComponent, {
      data: {
        schoolData: null,
      },
    });
  }
  updateSchool(data:SchoolData){
    this.dialog.open(EditSchoolComponent, {
      data: {
        schoolData: data,
      },
    });
  }
  deleteSchool(data:SchoolData){
    this.schoolServ.deleteSchool(data.id).subscribe((res:any)=>{
      if(res){
        this.toastr.success("School deleted successfully ");
        this.getSchool();
      }
      else{
        this.toastr.error("Please try again.", "Something went wrong!");
      }
     })
  }
}
