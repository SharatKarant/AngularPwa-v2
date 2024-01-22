import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { SchoolService } from '../../../services/school.service';
import { SchoolData } from '../../../shared/interfaces/school';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-branch',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './edit-branch.component.html',
  styleUrl: './edit-branch.component.scss'
})
export class EditBranchComponent {

  branchForm: FormGroup;
  isEditable: boolean = false;
  schoolList: any = [];

  constructor(
    public dialogRef: MatDialogRef<EditBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolServ: SchoolService,
    private toastr: ToastrService,
    private commonServ: CommonService
  ) {
    this.branchForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      schoolName: new FormControl('', [Validators.required]),
      schoolId: new FormControl(0, [Validators.required]),
      city: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.getSchool();
  }

  getSchool() {
    this.schoolServ.getSchool().subscribe((res: SchoolData) => {
      this.schoolList = res
    });
  }
  filterSchoolById(id) {
    return this.schoolList.filter(item => item.id == id)
  }

  ngAfterViewInit() {
    if (this.data.branchData != null) {
      this.isEditable = true;

      this.branchForm.setValue({
        id: this.data.branchData.id,
        name: this.data.branchData.name,
        schoolName: this.data.branchData.schoolName,
        schoolId: this.data.branchData.schoolId,
        city: this.data.branchData.city,
        address: this.data.branchData.address,
        state: this.data.branchData.state,
        postalCode: this.data.branchData.postalCode,
        contactNo: this.data.branchData.contactNo,
        email: this.data.branchData.email,
        branchCode: this.data.branchData.branchCode,
      })

    }
  }

  saveBranch() {

    if (this.data.branchData != null) {
      let id = this.data.branchData.id;
      let schoolName = this.filterSchoolById(this.branchForm.value.schoolId)[0].name; // Get the school name
      
      // Updating the School Name
      this.branchForm.patchValue({
        schoolName: schoolName
      });
      if (this.branchForm.valid) {
        this.schoolServ.updateBranch(id, this.branchForm.value).subscribe((res: any) => {
          this.toastr.success("Branch updated successfully");
          this.commonServ.callRefreshData();
          this.dialogRef.close();

        });
      }
    } else {
      let schoolName = this.filterSchoolById(this.branchForm.value.schoolId)[0].name;
      this.branchForm.patchValue({
        schoolName: schoolName
      });

      if (this.branchForm.valid) {


        this.schoolServ.saveBranch(this.branchForm.value).subscribe((res: any) => {
          this.toastr.success("Branch successfully added");
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
