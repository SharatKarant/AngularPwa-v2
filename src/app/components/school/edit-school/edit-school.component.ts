import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { SchoolService } from '../../../services/school.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-edit-school',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './edit-school.component.html',
  styleUrl: './edit-school.component.scss'
})
export class EditSchoolComponent implements AfterViewInit, OnInit {

  schoolForm: FormGroup;
  isEditable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditSchoolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolServ: SchoolService,
    private toastr: ToastrService,
    private commonServ: CommonService
  ) {
    this.schoolForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      logo: new FormControl(''),
      schoolCode: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
  }


  ngAfterViewInit() {
    if (this.data.schoolData != null) {
      this.isEditable = true;

      this.schoolForm.setValue({
        id: this.data.schoolData.id,
        name: this.data.schoolData.name,
        schoolCode: this.data.schoolData.schoolCode,
        logo: this.data.schoolData.logo,
      })

    }
  }

  saveSchool() {

    if (this.data.schoolData != null) {
      let id = this.data.schoolData.id;
      this.schoolServ.updateSchool(id, this.schoolForm.value).subscribe((res: any) => {
        this.toastr.success("School updated successfully");
        this.commonServ.callRefreshData();
        this.dialogRef.close();

      });
    } else {
      if (this.schoolForm.valid) {
        this.schoolServ.saveSchool(this.schoolForm.value).subscribe((res: any) => {
          this.toastr.success("School successfully added");
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
  fileChangeEvent(event: any): void {
    let file = event.target.files[0];

  }

}
