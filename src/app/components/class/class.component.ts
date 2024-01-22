import { Component, ViewChild } from '@angular/core';
import { ClassData } from '../../shared/interfaces/school';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { SchoolService } from '../../services/school.service';
import { EditClassComponent } from './edit-class/edit-class.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-class',
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
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss'
})
export class ClassComponent {
  displayedColumns: string[] = ['action', 'id', 'name', 'schoolName', 'branchName'];;

  dataSource: MatTableDataSource<ClassData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private classServ: SchoolService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private commonServ: CommonService
  ) {
    this.commonServ.$refreshData.subscribe((res: boolean) => {
      if (res) {
        this.getClass();
      }
    });
  }


  ngOnInit(): void {
    this.getClass();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getClass() {
    this.classServ.getClass().subscribe((res: ClassData[]) => {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  opentModal(modelName: string) {
    this.dialog.open(EditClassComponent, {
      data: {
        classData: null,
      },
    });
  }


  updateClass(data: ClassData) {
    this.dialog.open(EditClassComponent, {
      data: {
        classData: data,
      },
    });
  }


  deleteClass(data: ClassData) {
    this.classServ.deleteClass(data.id).subscribe((res: any) => {
      if (res) {
        this.toastr.success("Class deleted successfully ");
        this.getClass();
      }
      else {
        this.toastr.error("Please try again.", "Something went wrong!");
      }
    })
  }
}