import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { buttonLabels } from 'src/app/core/constants/general';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { AuthRedirectStorageService, AuthService } from '@spartacus/core';
// import { OrdersAPIService } from 'src/app/core/service/ordersService.service';
import { generalUrL } from 'src/app/core/config/GeneralURL.config';
// import { DashboardStateService } from 'src/app/shared/services/dashboardState.service';
import { DOCUMENT } from '@angular/common';
import { take } from 'rxjs/operators';
import { InternalStaffService } from 'src/app/shared/services/internal-staff.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';

import { CacheService } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-internal-staff',
  templateUrl: './internal-staff.component.html',
  styleUrls: ['./internal-staff.component.scss']
})
export class InternalStaffComponent implements OnInit {

  @Output() result = new EventEmitter<any>();
  @ViewChild('internalStaffContent', { static: true }) internalStaffContent: TemplateRef<any>;
  url: string;

  searchForm: UntypedFormGroup;
  buttonLabels = buttonLabels
  closeResult = '';
  submitted = false;
  model: any = {};
  showCloseButton$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  numpattern = /^[0-9]{6,8}$/;
  isValidNumber: boolean = false;

  userProfileDetails: any = {};
  isError: boolean = false;
  error: string = '';

  constructor(private modalService: NgbModal, private fb: UntypedFormBuilder, private router: Router,
    private http: HttpClient, private shareEvents: ShareEvents,
    // private ordersAPIService: OrdersAPIService,
    private authRedirectStorageService: AuthRedirectStorageService,
    private authService: AuthService,
    // private dashBoardStateService: DashboardStateService,
    private internalStaffService: InternalStaffService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    private accountDropDownStateService: AccountDropDownStateService,
    private cacheService: CacheService,
    @Inject(DOCUMENT) private _document: Document) {
    this.searchForm = this.fb.group({
      orderNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(this.numpattern)])

    });
  }

  ngOnInit(): void {
    sessionStorage.setItem("internalUser", "true");
    sessionStorage.setItem("internalUserState", "false");
    this.showCloseButton$.next(false);
    const logedUser = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
    this.cacheService.cartUpdated();
    //this.isLoggedIn.subscribe((data) => {
    if (((sessionStorage.getItem('customerIDValue') == undefined ||
      sessionStorage.getItem('customerIDValue') == null) &&
      (sessionStorage.getItem('orderNumber') == undefined || sessionStorage.getItem('orderNumber') == null)
      && logedUser.userId !== 'anonymous')) {
      this.modalService.dismissAll();
      this.showCloseButton$.next(false);
      let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
      if (sessionStorage.getItem('internalUserState') == 'false' && !window.location.href.includes('login') && !window.location.pathname.endsWith('login') &&
        auth0AccessToken?.userId == "current" && !sessionStorage.getItem("fbCSRTradeAcc")) {
        this.openVerticallyCentered('custom-backdrop', 'static');
      }
      this.searchForm.controls.orderNumber.reset();
      this.searchForm.markAllAsTouched();
    }
    this.shareEvents.internalStaffPopupReceivevent().subscribe(() => {
      this.submitted = false;
      this.modalService.dismissAll();

      this.openVerticallyCentered('fullScreen', true);
      this.searchForm.controls.orderNumber.reset();
      this.searchForm.markAllAsTouched();

      if (CommonUtils.isMobile) {
        this.shareEvents.closeSideMenuSendEvent();
      }
    })
    if (((sessionStorage.getItem('customerIDValue') !== undefined ||
      sessionStorage.getItem('customerIDValue') !== null) &&
      (sessionStorage.getItem('orderNumber') !== undefined || sessionStorage.getItem('orderNumber') !== null)
      && logedUser.userId !== 'anonymous' && localStorage.getItem('m3-auth0Token') !== null &&
      localStorage.getItem('m3-auth0Token') !== undefined) && sessionStorage.getItem("customerIDValue") !== null &&
      sessionStorage.getItem("customerIDValue") !== undefined) {
      this.router.navigate(['/my-account/orders'], { skipLocationChange: true });
      this.showCloseButton$.next(true);
    }

    // this.ordersAPIService.internalUserDetails().pipe(take(1)).subscribe((data) => {
    //   const dataAuth0Token = data.auth0Token;
    //   let isInternalStaff = data.roles.some(val => val === "fbCSRGroup");
    //   localStorage.setItem("m3-auth0Token", dataAuth0Token);
    //   localStorage.setItem("fbjwttoken", data.fbjwttoken);
    //   localStorage.setItem("email", data.uid);
    //   sessionStorage.setItem("internalUserName", data.name);
    //   if (isInternalStaff !== true) {
    //     this.shareEvents.clearStorage();
    //     this._document.defaultView.location.reload();
    //   }
    // });

    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.userProfileDetails = data;
      }
    });
  }

  openVerticallyCentered(BackDropclass, closePopup) {
    this.isValidNumber = false;
    if (closePopup === 'static') {
      this.showCloseButton$.next(false);
    }
    else {
      this.showCloseButton$.next(true);
    }
    this.modalService
      .open(this.internalStaffContent, {
        centered: true,
        windowClass: 'internalstaffModal',
        backdropClass: BackDropclass,
        size: 'sm',
        backdrop: closePopup,
        keyboard: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

        }
      );
  }

  onKeyup() {
    this.submitted = false;
    this.isValidNumber = false;

  }

  private getDismissReason(reason: any): string {
    this.isLoading$.next(true);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  submit() {
    this.submitted = true;
    if (!this.searchForm.valid) {
      return;
    }
    // this.modalService.dismissAll();
    // if (this.searchForm.controls.orderNumber.value.length == 10) {
    //   sessionStorage.setItem('orderNumber', this.searchForm.controls.orderNumber.value);
    //   sessionStorage.setItem('customerIDValue', '');
    //   this.shareEvents.callOrdersApiSendEvent({
    //     isInternalStaff: true,
    //     sharedOrdersNum: this.searchForm.controls.orderNumber.value.toString()
    //   })
    //   this.shareEvents.internalStaffSearchUpdateSendEvent();
    //   this.shareEvents.internalUpdateHeaderSendEvent();
    // }
    // if (this.searchForm.controls.orderNumber.value.length == 5) {
    //   sessionStorage.setItem('customerIDValue', this.searchForm.controls.orderNumber.value);
    //   this.shareEvents.defaultOrderApiSendEvent();
    //   this.shareEvents.internalStaffUpdateAccountSendEvent();
    //   this.shareEvents.resetSearchAndDashBoardStateSendEvent();
    //   this.dashBoardStateService.resetDashboardState();
    //   this.shareEvents.internalUpdateHeaderSendEvent();
    // }
    // this.router.navigate([generalUrL.Customer_SubbieURL], { skipLocationChange: true });

    let accountNumber = this.searchForm.value.orderNumber

    this.internalStaffService.searchInternalStaff(this.userProfileDetails.auth0Token, accountNumber).subscribe(res => {
      if (res == 'Error') {
        this.isError = true;
        this.isValidNumber = false;
        this.error = res;
      }
      if (res == null) {
        this.isError = true;
        this.isValidNumber = true;
        this.error = "Invalid Customer Account Number";
      }
      else {
        let initialLoad = true;
        if (sessionStorage.getItem('fbCSRTradeAcc')) {
          initialLoad = false;
        }
        else {
          initialLoad = true;
        }
        (<any>window).dataLayer = (<any>window).dataLayer || [];
        (<any>window).dataLayer.push({
          'event': 'SuccessfulLogin',
          'eventCategory': 'Logged in', //constant value
          'eventAction': 'Internal',
          'eventLabel': accountNumber//Account ID of the logged in user
        });

        sessionStorage.setItem('fbCSRToken', this.userProfileDetails.auth0Token);
        sessionStorage.setItem('fbCSRTradeAcc', accountNumber);
        sessionStorage.setItem('fbCSRTradeAccName', res.name);
        sessionStorage.setItem('csEmail', res.csEmail);
        sessionStorage.setItem('csPhone', res.csPhone);
        sessionStorage.setItem('salesPersonName', res.salesPerson.name);
        sessionStorage.setItem('validateResponse', JSON.stringify(res));

        this.accountDropDownStateService.setAccountState(res);

        // triggering a responce into shared event for internalStaff disabled input box
        this.shareEvents.setInternalUserNumber(res.name);
        // console.log("internalstaff load old data", this.userProfileDetails)
        localStorage.setItem("emailID", this.userProfileDetails.email)
        localStorage.setItem("phoneNum", this.userProfileDetails.phoneNumber);
        localStorage.setItem("jobTitle", this.userProfileDetails.jobTitle);
        localStorage.setItem("name", this.userProfileDetails.name)
        localStorage.setItem("firstname", this.userProfileDetails.firstName)
        localStorage.setItem("lastname", this.userProfileDetails.lastName)

        this.shareEvents.isInternalStaffLoadedSendEvent();
        if (initialLoad) {
          this.router.navigate(["/"]);
        } else {
          window.location.href = '/';
        }
        // setTimeout(() => {
          this.cacheService.setInternalStaff(true);
        // }, 5000)
        this.modalService.dismissAll();
      }
    });
  }

  closePopup() {
    this.isValidNumber = false;
    this.searchForm.reset();
    this.modalService.dismissAll();
  }

}
