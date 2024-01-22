import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { SchoolService } from '../../../services/school.service';
import { BranchData, SchoolData } from '../../../shared/interfaces/school';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-class',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './edit-class.component.html',
  styleUrl: './edit-class.component.scss'
})
export class EditClassComponent {

  classForm: FormGroup;
  isEditable: boolean = false;

  schoolList:any[];
  branchList:any[];


  constructor(
    public dialogRef: MatDialogRef<EditClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private classServ: SchoolService,
    private toastr: ToastrService,
    private commonServ: CommonService
  ) {
    this.classForm = new FormGroup({
      id: new FormControl(),
      branchId: new FormControl(0, [Validators.required, Validators.minLength(3)]),
      branchName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      schoolId: new FormControl(0, [Validators.required]),
      schoolName: new FormControl(0, [Validators.required]),
      name: new FormControl('', [Validators.required]),


    });
  }
  ngOnInit(): void {
    this.getSchool();
    if (this.data.classData != null) {
      this.getBranchBySchoolId(+this.data.classData.schoolId);
    }
  }


  ngAfterViewInit() {
    if (this.data.classData != null) {
      this.isEditable = true;
      
      this.classForm.setValue({
        id: this.data.classData.id,
        branchId: this.data.classData.branchId,
        branchName:this.data.classData.branchName,
        schoolId: this.data.classData.schoolId,
        schoolName: this.data.classData.schoolName,
        name: this.data.classData.name,
      });
      
    }
  }

  getSchool() {
    this.classServ.getSchool().subscribe((res: SchoolData[]) => {
      this.schoolList = res;
    });
  }
  getBranchBySchoolId(schoolId:number) {
    this.classServ.getBranchBySchoolId(schoolId).subscribe((res: BranchData[]) => {
      this.branchList = res;
    });
  }

  saveClass() {

    if (this.data.classData != null) {
      let id = this.data.classData.id;
      this.classServ.updateClass(id, this.classForm.value).subscribe((res: any) => {
        this.toastr.success("School updated successfully");
        this.commonServ.callRefreshData();
        this.dialogRef.close();

      });
    } else {
      if (this.classForm.valid) {
        this.classServ.saveClass(this.classForm.value).subscribe((res: any) => {
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

  changeClass(){
    this.getBranchBySchoolId(this.classForm.value.schoolId);

    let schoolName = this.filterSchoolById(this.classForm.value.schoolId)[0].name; // Get the school name
      
      // Updating the School Name
      this.classForm.patchValue({
        schoolName: schoolName
      });
  }

  changeBranch(){
    let branchName = this.filterBranchById(this.classForm.value.branchId)[0].name; // Get the branch name
      
      // Updating the Branch Name
      this.classForm.patchValue({
        branchName: branchName
      });
  }

  filterSchoolById(id) {
    return this.schoolList.filter(item => item.id == id)
  }

  filterBranchById(id) {
    return this.branchList.filter(item => item.id == id)
  }
}
