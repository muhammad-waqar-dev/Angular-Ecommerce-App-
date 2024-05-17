import { Component, OnInit, Renderer2 } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { LogoutService } from 'src/app/core/service/logout.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { User } from '@spartacus/user/account/root';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-topaccount',
  templateUrl: './topaccount.component.html',
  styleUrls: ['./topaccount.component.scss']
})
export class TopaccountComponent implements OnInit {
  logoutURL = environment.auth0Domain + "/logout";
  urlSafe: SafeResourceUrl
  isMobile: boolean = false;
  modalRef: any;
  user$: Observable<User | undefined>;
  iframeRef: any;
  constructor(private oAuthService: OAuthService,
    private logoutService: LogoutService,
    private auth: AuthService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService, private modalService: NgbModal,
    public sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.user$ = this.fiUserAccountDetailsService.getUserAccount();
    //this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.logoutURL);
  }

  logout(content) {
    if(sessionStorage.getItem('internalUserState') == 'false') {
      this.logoutService.logoutRevoke().subscribe(() => {  
        this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
        sessionStorage.clear();
        localStorage.clear();
        sessionStorage.setItem("internalUserState", "false")
      })
    }
    else {
      this.logoutService.logoutRevoke().subscribe(() => {  
      this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
        sessionStorage.clear();
        localStorage.clear();
      })
    }
  }

  openFiltersPopup(content) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg', backdropClass: 'logout-popup' });
  }

}
