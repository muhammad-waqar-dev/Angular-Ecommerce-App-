import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { User } from '@spartacus/core';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.scss']
})
export class HelpSupportComponent implements OnInit {
  popUpData: any;
  isMobile: boolean = false;
  selectedUser: any = {};
  
  private user$: Observable<User | undefined>

  iconsBaseURL: string = 'assets/images/help-support-dropdown';
  accountState: any = {};

  csEmail: any = new BehaviorSubject('');
  csPhone: any = new BehaviorSubject('');
  salesPersonNameVal: any = new BehaviorSubject('');
  isInternalStaff: any = new BehaviorSubject(false);

  constructor(
    private cmsService: CmsService, 
    private shareEvents: ShareEvents,
    private fiUserAccountDetailsService: FIUserAccountDetailsService,
    private accountDropDownStateService: AccountDropDownStateService,
  ) {
    this.user$ = this.fiUserAccountDetailsService.getUserAccount();

    this.shareEvents.isInternalStaffLoadedReceiveEvent().subscribe(res => {
      this.getDetailsInternalStaff();
    })
  }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.cmsService.getComponentData("FIHelpAndSupportPopupComponent").subscribe((data) => {
      this.popUpData = data;
    })

    this.getSelectedUser();

    if ((sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
      this.getDetailsInternalStaff();
    }
  }

  openContactCustomerServicePopup() {
    this.shareEvents.contactCustomerServicePopupSendEvent();
  }

  getSelectedUser() {
    if (!(sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
    this.user$.subscribe(res => {
      if (res) {
        res['orgUnit']['children'].forEach(c => {
          if (c.selected) {
            this.selectedUser = c;
          }
        });
      }
    })
  }
  }

  getDetailsInternalStaff = () => {
    if ((sessionStorage.getItem("fbCSRTradeAcc") && sessionStorage.getItem("internalUserState") == 'false')) {
      this.csEmail.next(sessionStorage.getItem("csEmail"));
      this.csPhone.next(sessionStorage.getItem("csPhone"));
      this.salesPersonNameVal.next(sessionStorage.getItem("salesPersonName"));
      this.isInternalStaff.next(true);

      this.selectedUser.csEmail = sessionStorage.getItem("csEmail");
      this.selectedUser.csPhone = sessionStorage.getItem("csPhone");
      }
    }

}
