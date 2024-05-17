import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { BehaviorSubject } from 'rxjs';
import { UserAccountSelectionChangeService } from 'src/app/core/service/userAccountSelectionChange.service';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/core/service/permissions.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-accountdropdown',
  templateUrl: './accountdropdown.component.html',
  styleUrls: ['./accountdropdown.component.scss']
})
export class AccountdropdownComponent implements OnInit {

  isMobile: boolean = false;
  openMenu: boolean = false;
  openMenubg: boolean = false;
  isOpen: boolean = false;
  private subscription = new Subscription();
  userFirstName: string;
  branchList: any = {};
  businessData = [];
  selectedName: string = '';
  uidSelected: string = "";
  @Output() valueChange = new EventEmitter();
  isLoading$ = new BehaviorSubject<boolean>(false);
  selcetedAccount: any;
  modalRef: any;
  accountIdSelected: number;
  isInternalStaff: boolean = true;

  constructor(private shareEvents: ShareEvents,
    private accountDropDownStateService: AccountDropDownStateService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    private userAccountSelectionChangeService: UserAccountSelectionChangeService,
    private router: Router,
    private permissionUtil: PermissionService,
    private modalService: NgbModal,) {

    this.accountDropDownStateService.isDataAvailable = false;
    if (sessionStorage.getItem("internalUserState") == 'false') {
      this.isInternalStaff = false;
    }
    this.userProfileDetailsService?.getUserAccount()?.subscribe((data) => {
      if (data != undefined) {
        this.accountDropDownStateService.setAccountState(data);
        this.initializeDropdownData(data);
      }
    });

  }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.getScreenSize()
  }

  getScreenSize(): void {
    const browserZoomLevel = window.devicePixelRatio;
    document.querySelector('body').classList.add('appScaleLevel');
  }

  onDropdownClick(): void {
    this.isOpen = !this.isOpen;
  }

  accountSelect(): void {
    this.isOpen = !this.isOpen;
  }

  menuClick(): void {
    this.openMenu = !this.openMenu;
    this.openMenubg = !this.openMenubg;
  }

  mobileCloseMenu(): void {
    this.shareEvents.contactCustomerServicePopupMobileSendEvent();
  }


  initializeDropdownData(data: any): void {
    this.isLoading$.next(true);

    this.branchList = data.orgUnit;
    if (this.branchList.branch) {
      this.businessData.push({
        code: this.branchList.uid,
        name: this.branchList.name,
        checked: this.branchList.selected
      });
    }

    if (!sessionStorage.getItem("internalUserState") && !sessionStorage.getItem("loginSuccessful")) {
      // console.log("vale",data.orgUnit.children.find(x => x.selected === true).uid);
      (<any>window).dataLayer = (<any>window).dataLayer || [];
      (<any>window).dataLayer.push({
        'event': 'SuccessfulLogin',
        'eventCategory': 'Logged in', //constant value
        'eventAction': 'External',
        'eventLabel': data.orgUnit.children.find(x => x.selected === true).uid//Account ID of the logged in user 
      });
    }
    sessionStorage.setItem("loginSuccessful", 'true');

    if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
      this.branchList?.children?.map((child: any) => {
        this.businessData.push({
          code: child.uid,
          name: child.name,
          checked: child.selected
        }
        )
      });

      this.businessData.map(account => {
        if (account.checked == true) {
          localStorage.removeItem('orgData');
          this.permissionUtil.setUserPermissions(data?.orgUnit?.children?.find((x: any) => x?.selected === true).permissions);
          this.permissionUtil.setOrgData(data.orgUnit?.children?.find((x: any) => x?.selected === true)?.permissions)
          this.accountDropDownStateService.setSelectedAccountState(account.code);
          this.changeValuesAndEmit(account.code, account.name);
        }
      });
      this.userFirstName = data.firstName;
      this.isLoading$.next(false);
    }
  }

  changeValuesAndEmit(uid: any, name: any): void {
    this.selectedName = name;
    this.uidSelected = uid;
    this.valueChanged();
  }

  valueChanged(): void {
    this.valueChange.emit(this.uidSelected);
  }

  changeBusiness(i: any, content: any): void {
    this.accountIdSelected = i;
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  switchAccount($event: any): void {
    if ($event) {
      let i = this.accountIdSelected;
      this.modalService.dismissAll();
      this.subscription.add(this.userAccountSelectionChangeService?.getChangedAccountDetails(this.businessData[i]?.code).subscribe((response) => {
        if (response === "Success") {
          this.accountDropDownStateService?.setSelectedAccountState(this.businessData[i].code);
          window.location.href = '/'
        } else {
          // Handle Case for Failed Call
        }
      }));
    }
    else {
      this.modalService.dismissAll();
    }
  }

}
