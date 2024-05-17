import { Inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@spartacus/core';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Injectable({
  providedIn: 'root',
})
export class orderStepGaurd implements CanActivate {
  userUid: string;
  isAdmin: boolean = false;
  private subscription = new Subscription();
  accessTokenVal: any;
  constructor(private router: Router, private auth: AuthService,
    @Inject(DOCUMENT) private doc: Document, private activatedRoute: ActivatedRoute,
    private shareEvents: ShareEvents,) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if (this.shareEvents.checkDeliveryData.length > 0) {
      return true
    }
    else {
        this.router.navigate(['/'])
    }

  }
}
