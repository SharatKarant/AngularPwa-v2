import { Component, ViewChild } from '@angular/core';
import { BranchData, SchoolData } from '../../shared/interfaces/school';
import { EditBranchComponent } from './edit-branch/edit-branch.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { SchoolService } from '../../services/school.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-branch',
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
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss'
})
export class BranchComponent {
  displayedColumns: string[] = ['action', 'id', 'name', 'school', 'branchCode','address','city','state','contactNo','postalCode'];



  dataSource: MatTableDataSource<BranchData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  schoolList:SchoolData[];
  constructor(
    private schoolServ: SchoolService,
    public dialog: MatDialog,
    private toastr :ToastrService,
    private commonServ:CommonService
  ) { 
    this.commonServ.$refreshData.subscribe((res:boolean)=>{
      if(res){
        this.getBranch();
      }
    });
  }


  ngOnInit(): void {
    this.getBranch();
    this.getSchool();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getBranch() {
    this.schoolServ.getBranch().subscribe((res: BranchData[]) => {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  opentModal(modelName: string) {
    this.dialog.open(EditBranchComponent, {
      data: {
        branchData: null,
      },
    });
  }
  updateBranch(data:BranchData){
    this.dialog.open(EditBranchComponent, {
      data: {
        branchData: data,
      },
    });
  }
  deleteBranch(data:BranchData){
    this.schoolServ.deleteBranch(data.id).subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.toastr.success("Branch deleted successfully ");
        this.getBranch();
      }
      else{
        this.toastr.error("Please try again.", "Something went wrong!");
      }
     })
  }

  getSchool() {
    this.schoolServ.getSchool().subscribe((res: SchoolData[]) => {
      this.schoolList = res
    });
  }
  filterSchoolById(id) {
    return this.schoolList.filter(item => item.id == id)
  }
}