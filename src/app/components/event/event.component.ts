import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EventService } from '../../services/event.service';
import { EventData } from '../../shared/interfaces/event';
import { EditEventComponent } from './edit-event/edit-event.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    MatFormFieldModule,
     MatInputModule, 
     MatTableModule, 
     MatSortModule, 
     MatPaginatorModule,
     MatIconModule
    ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit{
  displayedColumns: string[] = ['action','id', 'name', 'date', 'startTime', 'endTime', 'description'];
  
  dataSource: MatTableDataSource<EventData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private eventSer: EventService,
    public dialog: MatDialog,
    private toastr:ToastrService,
    private commonServ: CommonService
  ) {
    this.commonServ.$refreshData.subscribe((res:boolean)=>{
      if(res){
        this.getEvent();
      }
    });
   }

  
  ngOnInit(): void {
    this.getEvent();
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
    });
  }
  opentModal(modelName: string) {
    this.dialog.open(EditEventComponent, {
      data: {
        eventData: null,
      },
    });
  }

  updateEvent(data:any){
    this.dialog.open(EditEventComponent, {
      data: {
        eventData: data,
      },
    });
  }
  deleteEvent(data:any){
   this.eventSer.deleteEvent(data.id).subscribe((res:any)=>{
    console.log(res);
    if(res){
      this.toastr.success("Event successfully Deleted");
      this.getEvent();
    }
    else{
      this.toastr.error("Please try again.", "Something went wrong!");
    }
   })
  }
}
