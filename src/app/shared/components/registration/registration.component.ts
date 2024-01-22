import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
  registrationForm:FormGroup;


  constructor(private authService:AuthService, private LocalServ:LocalStorageService, private toastr:ToastrService, private router:Router){
    this.registrationForm = new FormGroup({
      userName:new FormControl('',[Validators.required, Validators.minLength(6)]),
      password:new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', ),
      lastName: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postalNo: new FormControl('', [Validators.required]),
      userId: new FormControl(1 ),
      schoolId: new FormControl(1 ),
      classId: new FormControl(1),
      roleId: new FormControl(0 ),
      branchId: new FormControl(1 ),
      role: new FormControl(''),
      fullName: new FormControl(''),
      address: new FormControl(''),
      isActive: new FormControl(false),


    })
  }
  
  
  ngOnInit(): void {
    
  }

  submitRegistration(){
    if(this.registrationForm.valid){
      this.authService.doRegistration(this.registrationForm.value).subscribe((res:any)=>{
        this.toastr.success("Registration successfull");
        this.router.navigate(["/login"])
      });
    }else{
      this.toastr.error("Please Enter valid data", "Invalid data");
    }
  }

}
