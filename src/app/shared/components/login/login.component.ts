import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private authService: AuthService, private router: Router, private localServ: LocalStorageService, private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {

  }
  onSubmit() {
    // debugger;
    if (this.loginForm.valid) {

      let username = this.loginForm.value.username;
      let password = this.loginForm.value.password;
      this.authService.doLogin(username, password).subscribe((res: any) => {
        if (res.length>0) {

          if (res[0].role === '') {
            this.toastr.error("role is not set for you please connect with admin", "Login failed");
          } else {
            this.localServ.setToken("appToken", 'bdhfgdsfbSDNJFnjaldnYREWNDNlNFVDNVJDNJ')
            this.localServ.setUserInfo("userInfo", res)
            this.authService._role.next([res[0].role]);
            let role = res[0].role;
            this.authService._isLogedIn.next(true);
            if (role === "Admin") {
              this.router.navigate(["/dashboard"]);
            }
            if (role === "Student") {
              this.router.navigate(["/studashboard"]);
            }
            if (role === "Teacher") {
              this.router.navigate(["/teacher-dashboard"]);
            }
            if (role === "Parent") {
              this.router.navigate(["/parent-dashboard"]);
            }
          }

        } else {
          this.toastr.error("Data did not found in our data base please register first!", "Login failed");
        }

      });
    }else{
      this.toastr.error("Please enter a valid data", "Form Validation failed");
    }
  }
}
