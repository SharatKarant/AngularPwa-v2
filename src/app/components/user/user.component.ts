import { Component, OnInit, ViewChild } from '@angular/core';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserData } from '../../shared/interfaces/user';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['action', 'id', 'firstName', 'middleName', 'lastName', 'role', 'mobileNo', 'email', 'branchId', 'userName', 'isActive'];;
  // displayedColumns: string[] = ['id', 'name', 'date', 'startTime', 'endTime', 'description'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userSer: UserService,
    public dialog: MatDialog,
    private toastr :ToastrService,
    private commonServ: CommonService
  ) {
    this.commonServ.$refreshData.subscribe((res:boolean)=>{
      if(res){
        this.getUsers();
      }
    });
   }


  ngOnInit(): void {
    this.getUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUsers() {
    this.userSer.getUsers().subscribe((res: UserData[]) => {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  opentModal(modelName: string) {
    this.dialog.open(EditUserComponent, {
      data: {
        userData: null,
      },
    });
  }

  deleteUser(data: any) {
    this.userSer.deleteUser(data.id).subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.toastr.success("User successfully Deleted");
        this.getUsers();
      }
      else{
        this.toastr.error("Please try again.", "Something went wrong!");
      }
     })
  }
  updateUser(data: any) {
    this.dialog.open(EditUserComponent, {
      data: {
        userData: data,
      },
    });
  }
}
