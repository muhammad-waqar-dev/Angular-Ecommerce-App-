import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthRedirectStorageService, AuthService, UserService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { generalUrL } from '../config/GeneralURL.config';

@Injectable({
  providedIn: 'root',
})
export class AccessGuard implements CanActivate {
  userUid: string;
  isAdmin: boolean = false;
  isLoggedIn: Observable<boolean> = this.authService?.isUserLoggedIn();
  constructor(private router: Router, private userService: UserService,
    private authService: AuthService,
    private authRedirectStorageService: AuthRedirectStorageService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    const authToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
    if (Object.keys(authToken.token).length !== 0) {
      sessionStorage.setItem("internalUserState", "false");
      return true;
    }
    sessionStorage.setItem("internalUserState", "false");
    let url = generalUrL.interStaffURL;
    this.authRedirectStorageService.setRedirectUrl(url);
    const loginURL = generalUrL.loginURL
    this.router.navigate([loginURL]);
    return false;
  }
}
