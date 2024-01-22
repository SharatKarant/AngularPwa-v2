import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { EditEventComponent, DialogData } from '../../event/edit-event/edit-event.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { SchoolService } from '../../../services/school.service';
import { BranchData, ClassData, SchoolData } from '../../../shared/interfaces/school';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle, MatDialogContent,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit, AfterViewInit {
  registrationForm: FormGroup;
  roleList: any[];
  isEditable: boolean = false

  constructor(
    public dialogRef: MatDialogRef<EditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private toastr: ToastrService,
    private commonServ: CommonService,
    private schoolSer:SchoolService
  ) {
    this.registrationForm = new FormGroup({
      id: new FormControl(),
      userName: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('',),
      lastName: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postalNo: new FormControl('', [Validators.required]),
      userId: new FormControl(1),
      schoolId: new FormControl(1),
      classId: new FormControl(1),
      roleId: new FormControl(0, [Validators.required]),
      branchId: new FormControl(1),
      role: new FormControl('',),
      fullName: new FormControl('',),
      address: new FormControl('',),
      isActive: new FormControl(true),
    })

  }


  ngOnInit(): void {
    this.getRoles();

  }
  ngAfterViewInit() {
    if (this.data.userData != null) {
      this.isEditable = true;
      // debugger;
      this.registrationForm.setValue({
        id: this.data.userData.id,
        userName: this.data.userData.userName,
        password: this.data.userData.password,
        firstName: this.data.userData.firstName,
        middleName: this.data.userData.middleName,
        lastName: this.data.userData.lastName,
        mobileNo: this.data.userData.mobileNo,
        email: this.data.userData.email,
        dateOfBirth: this.data.userData.dateOfBirth,
        city: this.data.userData.city,
        state: this.data.userData.state,
        postalNo: this.data.userData.postalNo,
        userId: this.data.userData.userId,
        schoolId: this.data.userData.schoolId,
        classId: this.data.userData.classId,
        roleId: this.data.userData.roleId,
        branchId: this.data.userData.branchId,
        role: this.data.userData.role,
        fullName: this.data.userData.fullName,
        address: this.data.userData.address,
        isActive: this.data.userData.isActive,
      })

    }
  }
  getRoles() {
    this.commonServ.getRolesList().subscribe((res: any) => {
      this.roleList = res;
    });
  }
  filterRoleById(id) {
    return this.roleList.filter(item => item.roleId == id)
  }
  saveUser() {
    if (this.data.userData != null ) {
      let userId = this.registrationForm.value.id;
      if (this.registrationForm.valid) {
        let role = this.filterRoleById(this.registrationForm.value.roleId)[0].role;
        this.registrationForm.patchValue({
          role: role
        });

        this.authService.updateUser(userId, this.registrationForm.value).subscribe((res: any) => {
          this.toastr.success("User Updated successfull");
          this.commonServ.callRefreshData();
          this.dialogRef.close();
        });
      } else {
        this.toastr.error("Please Enter valid data", "Invalid data");
      }
    } else {
      let role = this.filterRoleById(this.registrationForm.value.roleId)[0].role;
        this.registrationForm.patchValue({
          role: role
        });
      if (this.registrationForm.valid) {
        
        this.authService.doRegistration(this.registrationForm.value).subscribe((res: any) => {
          this.toastr.success("User Added successfull");
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
  getClass(){
    this.schoolSer.getSchool().subscribe((res:ClassData[])=>{
      this.classData = res;
    });
  }
  getSchool(){
    this.schoolSer.getSchool().subscribe((res:SchoolData[])=>{
      this.schoolData = res;
    });
  }
  getBrabch(){
    this.schoolSer.getSchool().subscribe((res:BranchData[])=>{
      this.branchData = res;
    });
  }
  schoolData:SchoolData[];
  classData:ClassData[];
  branchData:BranchData[];
}
