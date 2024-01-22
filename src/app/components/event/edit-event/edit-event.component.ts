import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';


import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}


@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule
  ],

  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss'
})
export class EditEventComponent implements OnInit, AfterViewInit {
  eventForm: FormGroup;
  isEditable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventServ: EventService,
    private toastr: ToastrService,
    private commonServ:CommonService
  ) {
    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      date: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('',),
      description: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {

    if (this.data.eventData != null ) {
      this.isEditable = true;

      this.eventForm.setValue({
        name: this.data.eventData.name,
        date: this.data.eventData.date,
        startTime: this.data.eventData.startTime,
        endTime: this.data.eventData.endTime,
        description: this.data.eventData.description,
      })

    }
  }

  saveEvent() {
    if (this.data.eventData != null ) {
      let id = this.data.eventData.id;
      this.eventServ.updateEvent(id, this.eventForm.value).subscribe((res: any) => {
        this.toastr.success("Event updated successfully");
        this.commonServ.callRefreshData();
        this.dialogRef.close();

      });
    } else {
      if (this.eventForm.valid) {
        this.eventServ.saveEvent(this.eventForm.value).subscribe((res: any) => {
          this.toastr.success("Event successfully added");
          this.commonServ.callRefreshData();
          this.dialogRef.close();
        });
      } else {
        this.toastr.error("Please Enter valid data", "Invalid data");
      }
    }

  }
  closeModal() {
    this.dialogRef.close();
  }
}
