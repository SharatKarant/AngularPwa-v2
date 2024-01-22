import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { AuthGuard } from './core/guard/auth.guard';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { RegistrationComponent } from './shared/components/registration/registration.component';
import { RoleGuard } from './core/guard/role.guard';
import { EventComponent } from './components/event/event.component';
import { UserComponent } from './components/user/user.component';
import { StudentStudentDashboardComponent } from './student/components/dashboard/dashboard.component';
import { ParentDashboardComponent } from './components/parent/dashboard/dashboard.component';
import { TeacherDashboardComponent } from './components/teacher/dashboard/dashboard.component';
import { SchoolComponent } from './components/school/school.component';
import { BranchComponent } from './components/branch/branch.component';
import { ClassComponent } from './components/class/class.component';
import { SubjectComponent } from './components/subject/subject.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { MyProfileComponent } from './components/user/my-profile/my-profile.component';

export const routes: Routes = [
    {path:'login', component:LoginComponent,title:"Login"},
    {path:'login1', component:LoginComponent,title:"Login"},
    {path:'registration', component:RegistrationComponent,title:"Registration"},
    
    {
        path:'dashboard', component:DashboardComponent,title:"Admin - Dashboard",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin"]
        }
    },
    
    {
        path:'teacher-dashboard', component:TeacherDashboardComponent,title:"Admin - Dashboard",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Teacher"]
        }
    },
    {
        path:'parent-dashboard', component:ParentDashboardComponent,title:"Admin - Dashboard",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Parent"]
        }
    },
    {
        path:'event', component:EventComponent,title:"Event",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin","Teacher"]
        }
    },
    {
        path:'users', component:UserComponent,title:"New Users",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin"]
        }
    },
    {
        path:'school', component:SchoolComponent,title:"School",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin"]
        }
    },
    {
        path:'branch', component:BranchComponent,title:"School",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin"]
        }
    },
    {
        path:'class', component:ClassComponent,title:"School",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin"]
        }
    },
    {
        path:'subject', component:SubjectComponent,title:"School",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin"]
        }
    },
    {
        path:'new-users', component:UserComponent,title:"New Users",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Admin"]
        }
    },
    {path:'assessments', component:AssignmentComponent,title:"Assessment",
    canActivate:[AuthGuard, RoleGuard],
    data:{
        expectedRole:["Admin"]
    }},

    {
        path:'studashboard', component:StudentStudentDashboardComponent,title:"Admin - Dashboard",
        canActivate:[AuthGuard, RoleGuard],
        data:{
            expectedRole:["Student"]
        }
    },
    // {path:'myassessments', component:AssignmentComponent,title:"Assessment",
    // canActivate:[AuthGuard, RoleGuard],
    // data:{
    //     expectedRole:["Student"]
    // }},
    // {path:'myevent', component:AssignmentComponent,title:"Assessment",
    // canActivate:[AuthGuard, RoleGuard],
    // data:{
    //     expectedRole:["Student"]
    // }},
    {path:'myprofile', component:MyProfileComponent,title:"Assessment",
    canActivate:[AuthGuard, RoleGuard],
    data:{
        expectedRole:["Student"]
    }},
    {path:'', component:LoginComponent, pathMatch:'full',  title:"Login"},
    {path:'**', component:ForbiddenComponent, title:"404 Error"}
];
