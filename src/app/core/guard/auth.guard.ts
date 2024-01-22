import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService, private router:Router)
  {}
  canActivate(
    router:ActivatedRouteSnapshot,
    state:RouterStateSnapshot
  ):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    // debugger;
    if(this.authService.IsLogedin()){
      return true
    }else{
      this.router.navigate(["/login"])
      return false;
    }
  }
}
