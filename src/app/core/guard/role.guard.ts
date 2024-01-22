import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn:'root'
})
export class RoleGuard implements CanActivate{


  constructor(private authSer:AuthService, private router:Router, private localServ:LocalStorageService,
    private toastr:ToastrService){}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      // debugger;
      if(!this.haveAccess(route)){
        this.toastr.error('You do not have access to this page', "Access denied")
        this.router.navigate(['/login'])
        return false;
      }else{
        return true;
      }
    
  }
  private haveAccess(route: ActivatedRouteSnapshot){
    // debugger;
    let userInfo =  this.localServ.getUserInfo("userInfo")[0]
    let roles = [userInfo.role];
    const expectedRole = route.data['expectedRole'];
    const matchRole = roles.findIndex(role => expectedRole.indexOf(role) != -1)
    return matchRole<0?false:true
  }
}
// export const roleGuard: CanActivateFn = (route, state) => {
//   return true;
// };
